import { createClient } from "jsr:@supabase/supabase-js@2";

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

const NOTIFY_TO = "gonzalo@propmatchapp.com";
const FROM_EMAIL = "Gonzalo Acuña Nava <onboarding@resend.dev>";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );

const labelFor = (t: string) =>
  t === "bureau" ? "Speaker Bureau" : t === "organizer" ? "Event Organizer" : "Enterprise / Brand";

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
      <h1 style="font-family:Georgia,serif;font-size:28px;margin:0 0 18px;color:#08090F;">Gracias, ${escape(b.full_name.split(" ")[0])}.</h1>
      <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 16px;">
        Recibimos tu solicitud para reservar a Gonzalo como ${labelFor(b.booking_type)}. Una persona del equipo te contactará en menos de <strong>48 horas hábiles</strong> con disponibilidad para Q2–Q4 2026.
      </p>
      <p style="font-size:15px;line-height:1.7;color:#444;margin:0 0 24px;">
        Mientras tanto, puedes explorar el catálogo completo de keynotes y casos de estudio en gonzaloacuna.com.
      </p>
      <div style="border-top:1px solid #eee;padding-top:18px;font-size:12px;color:#888;">
        Gonzalo Acuña Nava · CEO PropMatch · Guadalajara, México<br/>
        Si esto fue un error, simplemente ignora este correo.
      </div>
    </div>
  </div>`;

async function sendEmail(opts: { to: string | string[]; subject: string; html: string; reply_to?: string }) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — email skipped:", opts.subject);
    return { skipped: true };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
      reply_to: opts.reply_to,
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("Resend error", res.status, text);
    return { error: text };
  }
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = (await req.json()) as BookingPayload;

    // Basic validation
    const allowed = ["bureau", "organizer", "enterprise"];
    if (!body || !allowed.includes(body.booking_type)) {
      return new Response(JSON.stringify({ error: "Invalid booking_type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const name = (body.full_name ?? "").trim();
    if (!name || name.length < 2 || name.length > 120) {
      return new Response(JSON.stringify({ error: "Escribe tu nombre completo (mínimo 2 caracteres)." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) || body.email.length > 200) {
      return new Response(JSON.stringify({ error: "Email inválido. Revisa el formato (ej. nombre@empresa.com)." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("keynote_bookings")
      .insert({
        booking_type: body.booking_type,
        full_name: body.full_name.trim(),
        email: body.email.trim().toLowerCase(),
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

    if (error) throw error;

    // Fire-and-forget emails (don't fail the request if email errors)
    await Promise.allSettled([
      sendEmail({
        to: NOTIFY_TO,
        subject: `[Booking · ${labelFor(body.booking_type)}] ${body.full_name}`,
        html: buildAdminHtml(body),
        reply_to: body.email,
      }),
      sendEmail({
        to: body.email,
        subject: "Recibimos tu solicitud — Gonzalo Acuña Nava",
        html: buildUserHtml(body),
      }),
    ]);

    return new Response(JSON.stringify({ id: data.id, ok: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("submit-booking error", e);
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
