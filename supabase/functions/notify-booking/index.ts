// Fan-out notifications to Slack and Telegram for booking events.
// Called server-to-server from submit-booking / agenda-book and from the admin UI.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SLACK_GATEWAY = "https://connector-gateway.lovable.dev/slack/api";

interface Payload {
  type: "keynote" | "meeting" | "status_change";
  action?: "created" | "updated" | "cancelled";
  booking: Record<string, any>;
  change?: { field: string; from: any; to: any; actor?: string };
}

const fmtCDMX = (d: Date | string | null | undefined) => {
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat("es-MX", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/Mexico_City",
    }).format(typeof d === "string" ? new Date(d) : d);
  } catch { return String(d); }
};

function summarize(p: Payload): { title: string; lines: string[] } {
  const b = p.booking || {};
  const lines: string[] = [];
  let title = "";

  if (p.type === "status_change") {
    title = `🔄 Booking actualizado · ${b.full_name ?? b.email ?? b.id}`;
    if (p.change) {
      lines.push(`*${p.change.field}*: ${p.change.from ?? "—"} → ${p.change.to ?? "—"}`);
      if (p.change.actor) lines.push(`Por: ${p.change.actor}`);
    }
  } else if (p.type === "meeting") {
    title = `📅 Nueva reunión 1:1 · ${b.full_name}`;
    if (b.start_time) lines.push(`*Cuándo:* ${fmtCDMX(b.start_time)}`);
    if (b.topic) lines.push(`*Tema:* ${b.topic}`);
    if (b.meet_link) lines.push(`*Meet:* ${b.meet_link}`);
  } else {
    title = `🎤 Nueva solicitud keynote · ${b.full_name}`;
    if (b.booking_type) lines.push(`*Tipo:* ${b.booking_type}`);
    if (b.organization) lines.push(`*Org:* ${b.organization}`);
    if (b.event_name) lines.push(`*Evento:* ${b.event_name}`);
    if (b.event_date) lines.push(`*Fecha:* ${b.event_date}`);
    if (b.event_city) lines.push(`*Ciudad:* ${b.event_city}`);
    if (b.audience_size) lines.push(`*Audiencia:* ${b.audience_size}`);
    if (b.budget_range) lines.push(`*Presupuesto:* ${b.budget_range}`);
    if (b.topic_interest) lines.push(`*Tema:* ${b.topic_interest}`);
  }
  if (b.email) lines.push(`*Email:* ${b.email}`);
  if (b.phone) lines.push(`*Tel:* ${b.phone}`);
  return { title, lines };
}

async function sendSlack(title: string, lines: string[]) {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const slackKey = Deno.env.get("SLACK_API_KEY");
  const channel = Deno.env.get("SLACK_NOTIFY_CHANNEL_ID");
  if (!lovableKey || !slackKey || !channel) {
    console.log("[notify-booking] slack skipped (missing env)");
    return { skipped: true };
  }
  const text = `*${title}*\n${lines.join("\n")}`;
  const res = await fetch(`${SLACK_GATEWAY}/chat.postMessage`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": slackKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel,
      text,
      blocks: [
        { type: "header", text: { type: "plain_text", text: title.slice(0, 150) } },
        { type: "section", text: { type: "mrkdwn", text: lines.join("\n") || "—" } },
        { type: "context", elements: [{ type: "mrkdwn", text: "<https://gonzaloacuna.com/admin/bookings|Abrir admin>" }] },
      ],
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || (json && json.ok === false)) {
    console.error("[notify-booking] slack error", json);
    return { error: json };
  }
  return { ok: true };
}

async function sendTelegram(title: string, lines: string[]) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) {
    console.log("[notify-booking] telegram skipped (missing env)");
    return { skipped: true };
  }
  const md = `*${title.replace(/[*_`\[\]]/g, "")}*\n` +
    lines.map((l) => l.replace(/[_`\[\]]/g, "")).join("\n") +
    `\n\n[Abrir admin](https://gonzaloacuna.com/admin/bookings)`;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: md,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.ok === false) {
    console.error("[notify-booking] telegram error", json);
    return { error: json };
  }
  return { ok: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }
  try {
    const payload = (await req.json()) as Payload;
    if (!payload?.type || !payload?.booking) {
      return new Response(JSON.stringify({ error: "missing fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { title, lines } = summarize(payload);
    const [slack, telegram] = await Promise.allSettled([
      sendSlack(title, lines),
      sendTelegram(title, lines),
    ]);
    return new Response(JSON.stringify({
      ok: true,
      slack: slack.status === "fulfilled" ? slack.value : { error: String(slack.reason) },
      telegram: telegram.status === "fulfilled" ? telegram.value : { error: String(telegram.reason) },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("[notify-booking] unhandled", e);
    return new Response(JSON.stringify({ error: (e as any)?.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});