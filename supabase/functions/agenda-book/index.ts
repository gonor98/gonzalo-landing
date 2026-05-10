import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GCAL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
const RESEND = "https://connector-gateway.lovable.dev/resend/emails";
const CALENDAR_ID = "primary";
const TIMEZONE = "America/Mexico_City";
const ADMIN_EMAIL = "Gonzalo@propmatchapp.com";
const FROM_EMAIL = "Gonzalo Acuña <onboarding@resend.dev>";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CETI_PDFS = [
  { filename: "conferencia-ceti-gonzalo.pdf", url: "https://fgrmmpznaserhmydsccr.supabase.co/storage/v1/object/public/benefits-assets/attachments/conferencia-ceti-gonzalo.pdf" },
  { filename: "bonus-guia-estudiante-ceti.pdf", url: "https://fgrmmpznaserhmydsccr.supabase.co/storage/v1/object/public/benefits-assets/attachments/bonus-guia-estudiante-ceti.pdf" },
];
async function fetchPdfAttachments() {
  const out: { filename: string; content: string; content_type: string }[] = [];
  for (const a of CETI_PDFS) {
    try {
      const r = await fetch(a.url);
      if (!r.ok) continue;
      const buf = new Uint8Array(await r.arrayBuffer());
      let bin = ""; for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
      out.push({ filename: a.filename, content: btoa(bin), content_type: "application/pdf" });
    } catch {}
  }
  return out;
}

function buildICS(opts: {
  uid: string; title: string; description: string;
  start: Date; end: Date; meet?: string; organizer: string; attendee: string;
}) {
  const dt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gonzalo Acuna//Agenda//ES",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(opts.start)}`,
    `DTEND:${dt(opts.end)}`,
    `SUMMARY:${opts.title}`,
    `DESCRIPTION:${opts.description.replace(/\n/g, "\\n")}`,
    opts.meet ? `LOCATION:${opts.meet}` : "",
    `ORGANIZER:mailto:${opts.organizer}`,
    `ATTENDEE;RSVP=TRUE:mailto:${opts.attendee}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json();
    const {
      full_name, email, start, end, topic, message,
      organization, role, phone,
    } = body ?? {};
    if (!full_name || !email || !start || !end) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!EMAIL_RE.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const startDt = new Date(start), endDt = new Date(end);
    if (!(endDt > startDt)) {
      return new Response(JSON.stringify({ error: "Invalid range" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovableKey = Deno.env.get("LOVABLE_API_KEY")!;
    const gKey = Deno.env.get("GOOGLE_CALENDAR_API_KEY")!;
    const resendKey = Deno.env.get("RESEND_API_KEY")!;

    // 1. Re-check availability via freeBusy
    const fbRes = await fetch(`${GCAL}/freeBusy`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin: startDt.toISOString(), timeMax: endDt.toISOString(),
        items: [{ id: CALENDAR_ID }],
      }),
    });
    const fb = await fbRes.json();
    const busy = fb?.calendars?.[CALENDAR_ID]?.busy ?? [];
    if (busy.length > 0) {
      return new Response(JSON.stringify({ error: "slot_taken" }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Create Google Calendar event with Meet
    const requestId = crypto.randomUUID();
    const evRes = await fetch(
      `${GCAL}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?conferenceDataVersion=1&sendUpdates=all`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": gKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: `Reunión con ${full_name}${topic ? ` · ${topic}` : ""}`,
          description: message || "Reunión agendada desde gonzaloacuna.com/agenda",
          start: { dateTime: startDt.toISOString(), timeZone: TIMEZONE },
          end: { dateTime: endDt.toISOString(), timeZone: TIMEZONE },
          attendees: [{ email }, { email: ADMIN_EMAIL }],
          conferenceData: {
            createRequest: { requestId, conferenceSolutionKey: { type: "hangoutsMeet" } },
          },
          reminders: { useDefault: true },
        }),
      },
    );
    if (!evRes.ok) {
      const t = await evRes.text();
      return new Response(JSON.stringify({ error: `calendar ${evRes.status}: ${t}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const ev = await evRes.json();
    const meetLink: string | undefined =
      ev.hangoutLink || ev.conferenceData?.entryPoints?.find((p: any) => p.entryPointType === "video")?.uri;

    // 3. Persist booking
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    await supabase.from("meeting_bookings").insert({
      full_name, email, topic: topic ?? null, message: message ?? null,
      start_time: startDt.toISOString(), end_time: endDt.toISOString(),
      duration_minutes: Math.round((endDt.getTime() - startDt.getTime()) / 60000),
      meet_link: meetLink ?? null, google_event_id: ev.id ?? null, status: "confirmed",
    });

    // Mirror into keynote_bookings so admin sees a unified inbox.
    try {
      await supabase.from("keynote_bookings").insert({
        booking_type: "organizer",
        full_name, email,
        organization: organization ?? null,
        role: role ?? null,
        phone: phone ?? null,
        topic_interest: topic ?? null,
        event_date: startDt.toISOString().slice(0, 10),
        message: `[Reunión agendada ${startDt.toISOString()}] ${message ?? ""}${meetLink ? `\nMeet: ${meetLink}` : ""}`,
        status: "meeting",
      });
    } catch (e) { console.error("mirror insert error", e); }

    // 4. Send emails (with .ics)
    const ics = buildICS({
      uid: ev.id || requestId,
      title: `Reunión con Gonzalo Acuña`,
      description: `${topic ? topic + "\n" : ""}${message ?? ""}\n\nGoogle Meet: ${meetLink ?? "(ver invitación)"}`,
      start: startDt, end: endDt, meet: meetLink,
      organizer: ADMIN_EMAIL, attendee: email,
    });
    const icsB64 = btoa(unescape(encodeURIComponent(ics)));
    const fmt = new Intl.DateTimeFormat("es-MX", {
      dateStyle: "full", timeStyle: "short", timeZone: TIMEZONE,
    }).format(startDt);

    const userHtml = `
      <div style="font-family:Inter,Arial,sans-serif;background:#fff;padding:32px;color:#111;">
        <div style="max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:14px;padding:32px;">
          <p style="color:#9a7e2e;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 8px;">Reunión confirmada</p>
          <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 6px;">Listo, ${full_name}.</h1>
          <p style="font-size:13px;color:#888;margin:0 0 16px;">Reunión agendada en zona horaria CDMX.</p>
          <div style="margin:18px 0;padding:18px;background:#faf6ec;border:1px solid #e9dcb8;border-radius:12px;">
            <p style="margin:0;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#9a7e2e;">📅 Cuándo</p>
            <p style="margin:6px 0 0;font-size:16px;color:#08090F;font-weight:600;">${fmt}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#666;">America/Mexico_City</p>
          </div>
          ${[organization, role, phone, topic].some(Boolean) ? `
          <table style="width:100%;border-collapse:collapse;font-size:13px;color:#444;margin:8px 0 16px;">
            ${organization ? `<tr><td style="padding:4px 0;color:#888;">Organización</td><td>${organization}</td></tr>` : ""}
            ${role ? `<tr><td style="padding:4px 0;color:#888;">Rol</td><td>${role}</td></tr>` : ""}
            ${phone ? `<tr><td style="padding:4px 0;color:#888;">Teléfono</td><td>${phone}</td></tr>` : ""}
            ${topic ? `<tr><td style="padding:4px 0;color:#888;">Tema</td><td>${topic}</td></tr>` : ""}
          </table>` : ""}
          ${meetLink ? `<p style="margin:20px 0;"><a href="${meetLink}" style="background:#08090F;color:#C9A84C;padding:12px 18px;border-radius:8px;text-decoration:none;font-size:14px;">Unirse por Google Meet</a></p>` : ""}
          <div style="margin:24px 0;padding:18px;background:#faf6ec;border:1px solid #e9dcb8;border-radius:12px;">
            <p style="margin:0 0 6px;color:#9a7e2e;font-size:11px;letter-spacing:.28em;text-transform:uppercase;">📄 Tus regalos del CETI</p>
            <p style="margin:0 0 12px;font-size:13px;color:#444;">También están adjuntos a este correo.</p>
            <a href="https://fgrmmpznaserhmydsccr.supabase.co/storage/v1/object/public/benefits-assets/attachments/conferencia-ceti-gonzalo.pdf" style="display:inline-block;margin:4px 6px 4px 0;padding:10px 16px;background:#08090F;color:#C9A84C;border-radius:8px;font-size:13px;text-decoration:none;">⬇ Conferencia "95 Rechazos"</a>
            <a href="https://fgrmmpznaserhmydsccr.supabase.co/storage/v1/object/public/benefits-assets/attachments/bonus-guia-estudiante-ceti.pdf" style="display:inline-block;margin:4px 6px 4px 0;padding:10px 16px;background:#08090F;color:#C9A84C;border-radius:8px;font-size:13px;text-decoration:none;">⬇ Guía estudiante CETI</a>
          </div>
          <p style="font-size:12px;color:#999;margin-top:18px;">Adjuntamos también un archivo .ics para añadir la reunión a tu calendario.</p>
        </div>
      </div>`;
    const adminHtml = `
      <div style="font-family:Inter,Arial,sans-serif;background:#08090F;padding:24px;color:#fff;">
        <div style="max-width:560px;margin:0 auto;background:#0d0e16;border:1px solid rgba(201,168,76,0.25);border-radius:14px;padding:28px;">
          <p style="color:#C9A84C;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 8px;">Nueva reunión agendada</p>
          <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 12px;">${full_name} · ${email}</h1>
          <p style="color:#ccc;">${fmt}</p>
          ${topic ? `<p style="color:#ccc;"><strong>Tema:</strong> ${topic}</p>` : ""}
          ${message ? `<p style="color:#ccc;">${message}</p>` : ""}
          ${meetLink ? `<p><a href="${meetLink}" style="color:#C9A84C;">${meetLink}</a></p>` : ""}
        </div>
      </div>`;

    const pdfAttachments = await fetchPdfAttachments();
    const userAttachments = [
      { filename: "reunion.ics", content: icsB64, content_type: "text/calendar" },
      ...pdfAttachments,
    ];
    const adminAttachments = [
      { filename: "reunion.ics", content: icsB64, content_type: "text/calendar" },
    ];

    const sendEmail = (to: string, subject: string, html: string, attachments: any[]) =>
      fetch(RESEND, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": resendKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL, to: [to], subject, html,
          attachments,
        }),
      }).catch(err => console.error("email error", err));

    await Promise.all([
      sendEmail(email, "Tu reunión con Gonzalo Acuña está confirmada", userHtml, userAttachments),
      sendEmail(ADMIN_EMAIL, `Nueva reunión: ${full_name} (${fmt})`, adminHtml, adminAttachments),
    ]);

    return new Response(JSON.stringify({ ok: true, meetLink, eventId: ev.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});