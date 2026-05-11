import { createClient } from "jsr:@supabase/supabase-js@2";
import { checkRateLimit, getClientIp, isHoneypotTripped, notifyBooking } from "../_shared/security.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface BookingPayload {
  booking_type: "bureau" | "organizer" | "enterprise";
  full_name: string;
  email: string;
  organization?: string;
  role?: string;
  phone?: string;
  event_name?: string;
  event_date?: string;
  event_city?: string;
  audience_size?: string;
  budget_range?: string;
  topic_interest?: string;
  message?: string;
}

// Booking inbox (admin notification destination)
const NOTIFY_TO = "gonzalo@propmatchapp.com";
// Lovable Emails sandbox sender (no domain verification needed in dev).
const FROM_EMAIL = "Gonzalo Acuña Nava <onboarding@resend.dev>";
const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend/emails";

// CETI material attached to every confirmation email.
const CETI_PDFS = [
  {
    filename: "conferencia-ceti-gonzalo.pdf",
    url: "https://fgrmmpznaserhmydsccr.supabase.co/storage/v1/object/public/benefits-assets/attachments/conferencia-ceti-gonzalo.pdf",
  },
  {
    filename: "bonus-guia-estudiante-ceti.pdf",
    url: "https://fgrmmpznaserhmydsccr.supabase.co/storage/v1/object/public/benefits-assets/attachments/bonus-guia-estudiante-ceti.pdf",
  },
];

async function fetchAttachments() {
  const out: { filename: string; content: string }[] = [];
  for (const a of CETI_PDFS) {
    try {
      const r = await fetch(a.url);
      if (!r.ok) continue;
      const buf = new Uint8Array(await r.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
      out.push({ filename: a.filename, content: btoa(bin) });
    } catch (e) {
      logEvent("attachment.fetch.error", { filename: a.filename });
    }
  }
  return out;
}

// PII-safe logger: never log full names, emails, or message bodies.
const logEvent = (event: string, meta: Record<string, unknown> = {}) => {
  try {
    console.log(`[submit-booking] ${event}`, JSON.stringify(meta));
  } catch {
    console.log(`[submit-booking] ${event}`);
  }
};

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );

const labelFor = (t: string) =>
  t === "bureau" ? "Speaker Bureau" : t === "organizer" ? "Event Organizer" : "Enterprise / Brand";

const PDF_LINKS = {
  conferencia: "https://fgrmmpznaserhmydsccr.supabase.co/storage/v1/object/public/benefits-assets/attachments/conferencia-ceti-gonzalo.pdf",
  guia: "https://fgrmmpznaserhmydsccr.supabase.co/storage/v1/object/public/benefits-assets/attachments/bonus-guia-estudiante-ceti.pdf",
};

const fmtCDMX = (d: Date) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(d);

const giftsBlock = `
  <div style="margin:24px 0;padding:20px;background:#faf6ec;border:1px solid #e9dcb8;border-radius:12px;">
    <p style="margin:0 0 6px;color:#9a7e2e;font-size:11px;letter-spacing:.28em;text-transform:uppercase;">📄 Tus regalos del CETI</p>
    <p style="margin:0 0 14px;font-size:13px;color:#444;">También adjuntamos los PDFs a este correo.</p>
    <a href="${PDF_LINKS.conferencia}" style="display:inline-block;margin:4px 6px 4px 0;padding:10px 16px;background:#08090F;color:#C9A84C;border-radius:8px;font-size:13px;text-decoration:none;">⬇ Conferencia "95 Rechazos"</a>
    <a href="${PDF_LINKS.guia}" style="display:inline-block;margin:4px 6px 4px 0;padding:10px 16px;background:#08090F;color:#C9A84C;border-radius:8px;font-size:13px;text-decoration:none;">⬇ Guía estudiante CETI</a>
  </div>`;

const buildAdminHtml = (b: BookingPayload) => `
  <div style="font-family:Inter,Helvetica,Arial,sans-serif;background:#08090F;padding:32px;color:#fff;">
    <div style="max-width:560px;margin:0 auto;background:#0d0e16;border:1px solid rgba(201,168,76,0.25);border-radius:14px;padding:32px;">
      <p style="color:#C9A84C;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 8px;">Nueva solicitud · ${labelFor(b.booking_type)}</p>
      <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 18px;color:#fff;">${escape(b.full_name)}</h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#cfcfcf;">
        <tr><td style="padding:6px 0;color:#888;">Email</td><td>${escape(b.email)}</td></tr>
        ${b.organization ? `<tr><td style="padding:6px 0;color:#888;">Organización</td><td>${escape(b.organization)}</td></tr>` : ""}
        ${b.role ? `<tr><td style="padding:6px 0;color:#888;">Rol</td><td>${escape(b.role)}</td></tr>` : ""}
        ${b.phone ? `<tr><td style="padding:6px 0;color:#888;">Teléfono</td><td>${escape(b.phone)}</td></tr>` : ""}
        ${b.event_name ? `<tr><td style="padding:6px 0;color:#888;">Evento</td><td>${escape(b.event_name)}</td></tr>` : ""}
        ${b.event_date ? `<tr><td style="padding:6px 0;color:#888;">Fecha</td><td>${escape(b.event_date)}</td></tr>` : ""}
        ${b.event_city ? `<tr><td style="padding:6px 0;color:#888;">Ciudad</td><td>${escape(b.event_city)}</td></tr>` : ""}
        ${b.audience_size ? `<tr><td style="padding:6px 0;color:#888;">Audiencia</td><td>${escape(b.audience_size)}</td></tr>` : ""}
        ${b.budget_range ? `<tr><td style="padding:6px 0;color:#888;">Presupuesto</td><td>${escape(b.budget_range)}</td></tr>` : ""}
        ${b.topic_interest ? `<tr><td style="padding:6px 0;color:#888;">Tema</td><td>${escape(b.topic_interest)}</td></tr>` : ""}
      </table>
      ${b.message ? `<div style="margin-top:18px;padding:16px;background:#08090F;border-left:2px solid #C9A84C;border-radius:6px;color:#ddd;font-size:14px;line-height:1.6;">${escape(b.message)}</div>` : ""}
    </div>
  </div>`;

const buildUserHtml = (b: BookingPayload) => `
  <div style="font-family:Inter,Helvetica,Arial,sans-serif;background:#ffffff;padding:32px;color:#111;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:14px;padding:36px;">
      <p style="color:#9a7e2e;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 8px;">Solicitud recibida</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;margin:0 0 6px;color:#08090F;">Gracias, ${escape(b.full_name)}.</h1>
      <p style="font-size:13px;color:#888;margin:0 0 18px;">Recibido el ${fmtCDMX(new Date())} (CDMX)</p>
      <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 16px;">
        Recibimos tu solicitud para reservar a Gonzalo como ${labelFor(b.booking_type)}. Una persona del equipo te contactará en menos de <strong>48 horas hábiles</strong> con disponibilidad para Q2–Q4 2026.
      </p>
      ${giftsBlock}
      <div style="border-top:1px solid #eee;padding-top:18px;font-size:12px;color:#888;">
        Gonzalo Acuña Nava · CEO PropMatch · Guadalajara, México<br/>
        Si esto fue un error, simplemente ignora este correo.
      </div>
    </div>
  </div>`;

async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string;
  attachments?: { filename: string; content: string }[];
}) {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY"); // optional override

  if (!lovableKey && !resendKey) {
    logEvent("email.skipped.no_key");
    return { skipped: true };
  }

  // Prefer Lovable Emails gateway (no domain config in dev).
  const useGateway = !!lovableKey;
  const url = useGateway ? RESEND_GATEWAY : "https://api.resend.com/emails";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (useGateway) {
    headers["Authorization"] = `Bearer ${lovableKey}`;
    if (resendKey) headers["X-Connection-Api-Key"] = resendKey;
  } else {
    headers["Authorization"] = `Bearer ${resendKey}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      reply_to: opts.reply_to,
      attachments: opts.attachments,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    logEvent("email.error", { status: res.status, via: useGateway ? "gateway" : "resend", body: text.slice(0, 200) });
    return { error: text };
  }
  logEvent("email.sent", { via: useGateway ? "gateway" : "resend" });
  return { ok: true };
}

const reject = (status: number, error: string, field?: string) =>
  new Response(JSON.stringify(field ? { error, field } : { error }), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    let body: BookingPayload;
    try {
      body = (await req.json()) as BookingPayload;
    } catch {
      logEvent("validation.failed", { field: "body", reason: "invalid_json" });
      return reject(400, "Cuerpo de petición inválido.", "body");
    }

    // Honeypot: silently accept and drop
    if (isHoneypotTripped(body as any)) {
      logEvent("honeypot.tripped");
      return new Response(JSON.stringify({ ok: true }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const allowed = ["bureau", "organizer", "enterprise"];
    if (!body || !allowed.includes(body.booking_type)) {
      logEvent("validation.failed", { field: "booking_type" });
      return reject(400, "Tipo de booking inválido.", "booking_type");
    }

    const name = (body.full_name ?? "").trim();
    if (!name || name.length < 2 || name.length > 120) {
      logEvent("validation.failed", { field: "full_name", length: name.length });
      return reject(400, "Escribe tu nombre completo (entre 2 y 120 caracteres).", "full_name");
    }

    const email = (body.email ?? "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      logEvent("validation.failed", { field: "email", length: email.length });
      return reject(400, "Email inválido. Revisa el formato (ej. nombre@empresa.com).", "email");
    }

    if (body.message && body.message.length > 5000) {
      logEvent("validation.failed", { field: "message", length: body.message.length });
      return reject(400, "El mensaje supera el máximo permitido (5000 caracteres).", "message");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Rate limit + duplicate detection
    const ip = getClientIp(req);
    const fingerprint = `keynote:${email.toLowerCase()}:${body.booking_type}:${(body.event_date ?? "")}`;
    const rl = await checkRateLimit({
      supabase, ip, functionName: "submit-booking", fingerprint, max: 5, windowSec: 60,
    });
    if (!rl.allowed) {
      logEvent("rate_limit.blocked", { reason: rl.reason });
      const msg = rl.reason === "duplicate"
        ? "Ya recibimos esta solicitud. Te contactaremos en breve."
        : "Demasiadas solicitudes. Espera unos minutos e intenta de nuevo.";
      return reject(rl.reason === "duplicate" ? 409 : 429, msg);
    }

    const { data, error } = await supabase
      .from("keynote_bookings")
      .insert({
        booking_type: body.booking_type,
        full_name: name,
        email: email.toLowerCase(),
        organization: body.organization?.trim() || null,
        role: body.role?.trim() || null,
        phone: body.phone?.trim() || null,
        event_name: body.event_name?.trim() || null,
        event_date: body.event_date || null,
        event_city: body.event_city?.trim() || null,
        audience_size: body.audience_size?.trim() || null,
        budget_range: body.budget_range?.trim() || null,
        topic_interest: body.topic_interest?.trim() || null,
        message: body.message?.trim() || null,
      })
      .select("id")
      .single();

    if (error) {
      logEvent("db.insert.error", { code: (error as any).code, message: error.message });
      return reject(500, "No pudimos guardar tu solicitud. Intenta de nuevo en unos segundos.");
    }
    logEvent("db.insert.ok", { id: data.id, type: body.booking_type });

    // Slack/Telegram notify (fire-and-forget)
    notifyBooking({
      type: "keynote",
      action: "created",
      booking: { id: data.id, full_name: name, email: email.toLowerCase(), ...body },
    });

    // Fire-and-forget emails (never fail the request if email errors)
    const normalized: BookingPayload = { ...body, full_name: name, email: email.toLowerCase() };
    const attachments = await fetchAttachments();
    const emailResults = await Promise.allSettled([
      sendEmail({
        to: NOTIFY_TO,
        subject: `[Booking · ${labelFor(body.booking_type)}] ${name}`,
        html: buildAdminHtml(normalized),
        reply_to: email,
      }),
      sendEmail({
        to: email,
        subject: "Recibimos tu solicitud — Gonzalo Acuña Nava",
        html: buildUserHtml(normalized),
        attachments,
      }),
    ]);
    const emailOk = emailResults.every(
      (r) => r.status === "fulfilled" && !(r.value as any)?.error && !(r.value as any)?.skipped,
    );
    logEvent("email.batch", { ok: emailOk });

    return new Response(JSON.stringify({ id: data.id, ok: true, emailOk }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    logEvent("unhandled.error", { message: (e as any)?.message });
    return reject(500, "Error inesperado del servidor. Intenta de nuevo.");
  }
});
