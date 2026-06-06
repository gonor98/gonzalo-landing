import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

const Schema = z.object({ token: z.string().trim().min(16).max(128) })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const url = new URL(req.url)
    const tokenParam = url.searchParams.get('token')
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const parsed = Schema.safeParse({ token: tokenParam ?? body.token })
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'invalid_token' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data: lead, error: fetchErr } = await supabase
      .from('newsletter_leads')
      .select('id,email,confirmed_at')
      .eq('confirmation_token', parsed.data.token)
      .maybeSingle()
    if (fetchErr) throw fetchErr
    if (!lead) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (lead.confirmed_at) {
      return new Response(JSON.stringify({ ok: true, status: 'already_confirmed', email: lead.email }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const { error: updErr } = await supabase
      .from('newsletter_leads')
      .update({ confirmed_at: new Date().toISOString(), unsubscribed_at: null })
      .eq('id', lead.id)
    if (updErr) throw updErr

    await supabase.from('analytics_events').insert({
      event: 'newsletter_event',
      path: '/newsletter/confirm',
      properties: { action: 'confirmed', email_domain: lead.email.split('@')[1] ?? null },
    })

    return new Response(JSON.stringify({ ok: true, status: 'confirmed', email: lead.email }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message ?? 'failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})