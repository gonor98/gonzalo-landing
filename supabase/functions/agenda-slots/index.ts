import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
const CALENDAR_ID = "primary";
const TIMEZONE = "America/Mexico_City";
const SLOT_MINUTES = 30;
// Working hours in TZ-local time (24h)
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 18;

interface FreeBusyResp {
  calendars: Record<string, { busy: { start: string; end: string }[] }>;
}

function dayBoundsUTC(dateISO: string) {
  // dateISO is YYYY-MM-DD assumed in TIMEZONE; we use a UTC offset of -06:00 (CST) approx.
  // For precision we use Intl with formatToParts.
  const [y, m, d] = dateISO.split("-").map(Number);
  // Build the local-midnight in target tz by trying offsets; simplest: assume -06:00.
  // Mexico City no longer uses DST since 2022, fixed -06:00.
  const start = new Date(Date.UTC(y, m - 1, d, WORK_START_HOUR + 6, 0, 0));
  const end = new Date(Date.UTC(y, m - 1, d, WORK_END_HOUR + 6, 0, 0));
  return { start, end };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { date } = await req.json();
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return new Response(JSON.stringify({ error: "Invalid date" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const gKey = Deno.env.get("GOOGLE_CALENDAR_API_KEY");
    if (!lovableKey || !gKey) {
      return new Response(JSON.stringify({ error: "Calendar not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { start, end } = dayBoundsUTC(date);
    const fbRes = await fetch(`${GATEWAY}/freeBusy`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: CALENDAR_ID }],
      }),
    });
    if (!fbRes.ok) {
      const t = await fbRes.text();
      return new Response(JSON.stringify({ error: `freeBusy ${fbRes.status}: ${t}` }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const fb = (await fbRes.json()) as FreeBusyResp;
    const busy = fb.calendars?.[CALENDAR_ID]?.busy ?? [];

    // Pull DB-level reservations as additional guard
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: dbBookings } = await supabase
      .from("meeting_bookings")
      .select("start_time,end_time")
      .gte("start_time", start.toISOString())
      .lte("end_time", end.toISOString());
    const allBusy = [
      ...busy.map(b => ({ s: new Date(b.start).getTime(), e: new Date(b.end).getTime() })),
      ...(dbBookings ?? []).map(b => ({ s: new Date(b.start_time).getTime(), e: new Date(b.end_time).getTime() })),
    ];

    const slots: { start: string; end: string; available: boolean }[] = [];
    const now = Date.now();
    for (let t = start.getTime(); t + SLOT_MINUTES * 60_000 <= end.getTime(); t += SLOT_MINUTES * 60_000) {
      const e = t + SLOT_MINUTES * 60_000;
      const overlaps = allBusy.some(b => t < b.e && e > b.s);
      slots.push({
        start: new Date(t).toISOString(),
        end: new Date(e).toISOString(),
        available: !overlaps && t > now,
      });
    }
    return new Response(JSON.stringify({ slots, timezone: TIMEZONE }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});