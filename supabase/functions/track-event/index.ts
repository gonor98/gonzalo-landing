import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

const Schema = z.object({
  event: z.string().trim().min(1).max(80),
  path: z.string().trim().max(300).optional(),
  session_id: z.string().trim().max(80).optional(),
  referrer: z.string().trim().max(500).optional(),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const parsed = Schema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    await supabase.from('analytics_events').insert({
      event: parsed.data.event,
      path: parsed.data.path ?? null,
      session_id: parsed.data.session_id ?? null,
      referrer: parsed.data.referrer ?? null,
      properties: parsed.data.properties ?? {},
      user_agent: req.headers.get('user-agent') ?? null,
    })
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message ?? 'failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})