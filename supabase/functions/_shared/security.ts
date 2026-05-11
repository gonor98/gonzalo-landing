// Shared security helpers for public booking endpoints.
// - Rate limiting (per IP, per function)
// - Duplicate detection (per fingerprint, short window)
// - Honeypot helper

import { createClient, type SupabaseClient } from "jsr:@supabase/supabase-js@2";

export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "0.0.0.0";
}

export function isHoneypotTripped(body: Record<string, any>): boolean {
  const v = (body?.website ?? body?.hp_website ?? "").toString().trim();
  return v.length > 0;
}

/**
 * Returns { allowed, reason }. Records the attempt in `request_log`.
 * - Limit: `max` requests per `windowSec` per (ip, function_name).
 * - If `fingerprint` is provided, also blocks identical attempts in the last 10 minutes.
 */
export async function checkRateLimit(opts: {
  supabase: SupabaseClient;
  ip: string;
  functionName: string;
  fingerprint?: string;
  max?: number;
  windowSec?: number;
  dedupeWindowSec?: number;
}): Promise<{ allowed: boolean; reason?: "rate_limit" | "duplicate" }> {
  const max = opts.max ?? 5;
  const windowSec = opts.windowSec ?? 60;
  const dedupeWindowSec = opts.dedupeWindowSec ?? 600;
  const since = new Date(Date.now() - windowSec * 1000).toISOString();

  // Rate limit by IP + function
  const { count: ipCount } = await opts.supabase
    .from("request_log")
    .select("id", { head: true, count: "exact" })
    .eq("function_name", opts.functionName)
    .eq("ip", opts.ip)
    .gte("created_at", since);
  if ((ipCount ?? 0) >= max) return { allowed: false, reason: "rate_limit" };

  // Duplicate detection by fingerprint
  if (opts.fingerprint) {
    const dedupeSince = new Date(Date.now() - dedupeWindowSec * 1000).toISOString();
    const { count: dupCount } = await opts.supabase
      .from("request_log")
      .select("id", { head: true, count: "exact" })
      .eq("function_name", opts.functionName)
      .eq("fingerprint", opts.fingerprint)
      .gte("created_at", dedupeSince);
    if ((dupCount ?? 0) > 0) return { allowed: false, reason: "duplicate" };
  }

  // Record this attempt (best-effort)
  try {
    await opts.supabase.from("request_log").insert({
      ip: opts.ip,
      function_name: opts.functionName,
      fingerprint: opts.fingerprint ?? null,
    });
  } catch (_) { /* ignore */ }

  return { allowed: true };
}

export function makeServiceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

/**
 * Fire-and-forget notify-booking call from server functions.
 * Never throws — failures are logged.
 */
export async function notifyBooking(payload: {
  type: "keynote" | "meeting" | "status_change";
  action?: "created" | "updated" | "cancelled";
  booking: Record<string, any>;
  change?: { field: string; from: any; to: any; actor?: string };
}) {
  try {
    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/notify-booking`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("[notifyBooking] failed", (e as any)?.message);
  }
}