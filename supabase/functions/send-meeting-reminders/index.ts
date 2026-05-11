// Cron-driven reminders. Runs every ~15 min via pg_cron.
// - meeting_bookings: 24h reminder (reminded_at) and 1h reminder (reminded_1h_at)
// - keynote_bookings: 24h reminder (reminded_at) for events with event_date set

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND = "https://connector-gateway.lovable.dev/resend/emails";
const FROM_EMAIL = "Gonzalo Acuña <onboarding@resend.dev>";
const TIMEZONE = "America/Mexico_City";

const fmtCDMX = (d: Date) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full", timeStyle: "short", timeZone: TIMEZONE,
  }).format(d);

async function sendEmail(to: string, subject: string, html: string) {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!lovableKey || !resendKey) return { skipped: true };
  const res = await fetch(RESEND, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error("[reminders] email error", res.status, t.slice(0, 200));
    return { error: t };
  }
  return { ok: true };
}

function meetingHtml(b: any, when: string, leadLabel: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#fff;padding:32px;color:#111;">
      <div style="max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:14px;padding:32px;">
        <p style="color:#9a7e2e;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 8px;">Recordatorio · ${leadLabel}</p>
        <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 8px;">Hola ${b.full_name?.split(" ")[0] ?? ""}.</h1>
        <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 14px;">
          Tu reunión con Gonzalo es <strong>${leadLabel.toLowerCase()}</strong>. Te dejamos los detalles para que la tengas a mano.
        </p>
        <div style="margin:18px 0;padding:18px;background:#faf6ec;border:1px solid #e9dcb8;border-radius:12px;">
          <p style="margin:0;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#9a7e2e;">📅 Cuándo</p>
          <p style="margin:6px 0 0;font-size:16px;color:#08090F;font-weight:600;">${when}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#666;">America/Mexico_City</p>
        </div>
        ${b.meet_link ? `<p style="margin:20px 0;"><a href="${b.meet_link}" style="background:#08090F;color:#C9A84C;padding:12px 18px;border-radius:8px;text-decoration:none;font-size:14px;">Unirse por Google Meet</a></p>` : ""}
        ${b.topic ? `<p style="font-size:14px;color:#444;"><strong>Tema:</strong> ${b.topic}</p>` : ""}
      </div>
    </div>`;
}

function keynoteHtml(b: any, when: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#fff;padding:32px;color:#111;">
      <div style="max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:14px;padding:32px;">
        <p style="color:#9a7e2e;font-size:11px;letter-spacing:.3em;text-transform:uppercase;margin:0 0 8px;">Recordatorio · 24h</p>
        <h1 style="font-family:Georgia,serif;font-size:26px;margin:0 0 8px;">Hola ${b.full_name?.split(" ")[0] ?? ""}.</h1>
        <p style="font-size:15px;color:#444;line-height:1.7;margin:0 0 14px;">
          Tu evento <strong>${b.event_name ?? "con Gonzalo"}</strong> es mañana. Si necesitas ajustar algo, responde a este correo.
        </p>
        <div style="margin:18px 0;padding:18px;background:#faf6ec;border:1px solid #e9dcb8;border-radius:12px;">
          <p style="margin:0;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#9a7e2e;">📅 Fecha</p>
          <p style="margin:6px 0 0;font-size:16px;color:#08090F;font-weight:600;">${when}</p>
          ${b.event_city ? `<p style="margin:4px 0 0;font-size:13px;color:#666;">${b.event_city}</p>` : ""}
        </div>
      </div>
    </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const now = Date.now();
  const in23h = new Date(now + 23 * 3600 * 1000).toISOString();
  const in25h = new Date(now + 25 * 3600 * 1000).toISOString();
  const in45m = new Date(now + 45 * 60 * 1000).toISOString();
  const in75m = new Date(now + 75 * 60 * 1000).toISOString();

  let m24 = 0, m1 = 0, k24 = 0;

  // 24h meeting reminders
  const { data: meetings24 } = await supabase
    .from("meeting_bookings")
    .select("*")
    .gte("start_time", in23h)
    .lte("start_time", in25h)
    .eq("status", "confirmed")
    .is("reminded_at", null);
  for (const b of meetings24 ?? []) {
    const r = await sendEmail(b.email, "Recordatorio: tu reunión con Gonzalo es en 24h",
      meetingHtml(b, fmtCDMX(new Date(b.start_time)), "En 24 horas"));
    if (!(r as any).error) {
      await supabase.from("meeting_bookings").update({ reminded_at: new Date().toISOString() }).eq("id", b.id);
      m24++;
    }
  }

  // 1h meeting reminders
  const { data: meetings1 } = await supabase
    .from("meeting_bookings")
    .select("*")
    .gte("start_time", in45m)
    .lte("start_time", in75m)
    .eq("status", "confirmed")
    .is("reminded_1h_at", null);
  for (const b of meetings1 ?? []) {
    const r = await sendEmail(b.email, "Tu reunión con Gonzalo empieza en 1 hora",
      meetingHtml(b, fmtCDMX(new Date(b.start_time)), "En 1 hora"));
    if (!(r as any).error) {
      await supabase.from("meeting_bookings").update({ reminded_1h_at: new Date().toISOString() }).eq("id", b.id);
      m1++;
    }
  }

  // 24h keynote reminders (event_date = tomorrow)
  const tomorrow = new Date(now + 24 * 3600 * 1000).toISOString().slice(0, 10);
  const { data: keynotes24 } = await supabase
    .from("keynote_bookings")
    .select("*")
    .eq("event_date", tomorrow)
    .neq("status", "cancelled")
    .is("reminded_at", null);
  for (const b of keynotes24 ?? []) {
    const when = new Intl.DateTimeFormat("es-MX", { dateStyle: "full", timeZone: TIMEZONE })
      .format(new Date(b.event_date + "T12:00:00Z"));
    const r = await sendEmail(b.email, "Recordatorio: tu evento con Gonzalo es mañana", keynoteHtml(b, when));
    if (!(r as any).error) {
      await supabase.from("keynote_bookings").update({ reminded_at: new Date().toISOString() }).eq("id", b.id);
      k24++;
    }
  }

  const summary = { meetings_24h: m24, meetings_1h: m1, keynotes_24h: k24 };
  console.log("[reminders] sent", summary);
  return new Response(JSON.stringify({ ok: true, ...summary }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});