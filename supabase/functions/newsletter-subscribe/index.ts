import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

const SITE = Deno.env.get('SITE_URL') ?? 'https://gonzaloacuna.com'

const BodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  full_name: z.string().trim().max(120).optional(),
  source_path: z.string().trim().max(200).optional(),
  language: z.string().trim().max(10).optional(),
})

function token() {
  const a = new Uint8Array(24)
  crypto.getRandomValues(a)
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('')
}

async function hashIp(ip: string | null) {
  if (!ip) return null
  const data = new TextEncoder().encode(ip + (Deno.env.get('SUPABASE_JWKS') ?? ''))
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('').slice(0, 32)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const parsed = BodySchema.safeParse(await req.json())
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const { email, full_name, source_path, language } = parsed.data
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
    const ua = req.headers.get('user-agent') ?? null
    const ipHash = await hashIp(ip)

    // Upsert: if email exists, refresh token unless already confirmed
    const { data: existing } = await supabase
      .from('newsletter_leads')
      .select('id,email,confirmed_at,unsubscribed_at')
      .eq('email', email)
      .maybeSingle()

    let confirmToken = token()
    if (existing) {
      if (existing.confirmed_at && !existing.unsubscribed_at) {
        return new Response(JSON.stringify({ ok: true, status: 'already_confirmed' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      await supabase
        .from('newsletter_leads')
        .update({
          confirmation_token: confirmToken,
          confirmation_sent_at: new Date().toISOString(),
          unsubscribed_at: null,
          source_path: source_path ?? null,
          full_name: full_name ?? null,
          language: language ?? 'es-MX',
          user_agent: ua,
          ip_hash: ipHash,
        })
        .eq('id', existing.id)
    } else {
      const { error } = await supabase.from('newsletter_leads').insert({
        email,
        full_name: full_name ?? null,
        source_path: source_path ?? null,
        language: language ?? 'es-MX',
        confirmation_token: confirmToken,
        confirmation_sent_at: new Date().toISOString(),
        user_agent: ua,
        ip_hash: ipHash,
      })
      if (error) throw error
    }

    const confirmUrl = `${SITE}/newsletter/confirm?token=${confirmToken}`

    // Try transactional email if available; otherwise queue silently.
    let emailed = false
    try {
      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'newsletter-confirm',
          recipientEmail: email,
          idempotencyKey: `newsletter-confirm-${confirmToken}`,
          templateData: { name: full_name ?? '', confirmUrl },
        },
      })
      emailed = !error
    } catch (_) { emailed = false }

    return new Response(
      JSON.stringify({ ok: true, status: 'pending_confirmation', emailed, confirmUrl: emailed ? undefined : confirmUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message ?? 'failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})