## Plan: Premium UX, SEO, recordatorios, webhooks, rate-limiting y captcha

Antes de tocar código necesito confirmar 3 decisiones porque definen alcance y secretos requeridos.

---

### 1. Auditoría de UX y "wow factor" parallax/premium

Reviso todas las secciones del home y páginas clave (`HeroSection`, `RisingLeaderSection`, `AchievementsOverview`, `StickyScrollSection`, `SpeakerReel`, `VentureStack`, `ThemesGrid`, `MilestonesSection`, `MasonryGrid`, `PodcastsSection`, `CTASection`, `Agenda`, `Booking`, `Benefits`).

Aplico mejoras concretas:
- **Hero**: parallax real con `useScroll` sobre el video loop, capa de partículas/aurora suave, fade-in escalonado del título con `clip-path`, mouse-follow gradient sutil.
- **AchievementsOverview**: contador animado al entrar en viewport + tilt 3D suave en cards.
- **StickyScrollSection**: ya tiene parallax, añado `mix-blend-mode` en el badge de capítulo y micro-glitch en el cambio de estado.
- **SpeakerReel / MasonryGrid**: hover con `scale + brightness`, parallax del thumbnail dentro de su contenedor.
- **MilestonesSection**: línea de tiempo con `scaleY` controlado por scroll progress.
- **VentureStack**: `cards stack` con z-rotation al scroll.
- **CTASection**: gradient animado + magnetic button.
- **Cursor**: ya existe `CustomCursor`, refuerzo magnetismo en CTAs.
- **Globales**: `prefers-reduced-motion` respetado, `will-change` puntual, lazy-load consistente, transiciones de página con `framer-motion`.

---

### 2. SEO — JSON-LD Person + Event

- Mantengo `personJsonLd` actual (ya está en `SEO.tsx`).
- Nuevo: `eventJsonLd(booking)` builder en `SEO.tsx` que genera schema `Event` con `name`, `startDate`, `location`, `performer: Person(Gonzalo)`, `eventStatus`, `eventAttendanceMode`.
- En `Speaking.tsx` y `Booking.tsx` pinto JSON-LD `Event` agregando los próximos eventos confirmados (lista hardcoded de keynotes pasadas/próximas en `src/lib/events.ts`).
- En página individual de evento (si la creas en el futuro), se inyecta el evento específico.
- En `/agenda` añado JSON-LD `Service` (asesoría 1:1) además del Person.

---

### 3. Recordatorio 24h antes — cron + Resend

- Nueva edge function `send-meeting-reminders` que:
  - Lee `meeting_bookings` y `keynote_bookings` con `start_time/event_date` entre `now+23h` y `now+25h`, `status` activo y `reminded_at IS NULL`.
  - Envía email vía Resend (mismo template visual que confirmación, asunto "Recordatorio: tu reunión con Gonzalo en 24h"), con link de Meet / detalles del evento + 2 PDFs CETI.
  - Marca `reminded_at = now()` para no duplicar.
- **Migración**: añado columna `reminded_at TIMESTAMPTZ` a ambas tablas + `pg_cron` + `pg_net` enabled + job cada 15 min vía `supabase--insert` (no migración, contiene anon key).

---

### 4. Webhook Slack/Telegram — nuevos bookings y cambios de estado

Decisión 1 abajo define cuál implemento. Recomiendo **Slack** vía conector ya disponible.

- Nueva edge function `notify-booking` (POST: `{type, booking, change?}`).
- Llamada desde:
  - `submit-booking` y `agenda-book` al crear (server-side, no requiere auth).
  - Cliente en `AdminBookings.tsx` al cambiar status / meet_link / cancelar.
- Mensaje formateado con bloques Slack (nombre, email, tema, fecha, status badge) + link a `/admin/bookings`.
- Si elige Telegram, uso `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (pediré secrets).

---

### 5. Rate limiting + anti-spam en edge functions

- Nueva tabla `request_log` (`ip`, `function_name`, `created_at`) con índice por (ip, function_name, created_at).
- Helper `checkRateLimit(supabase, ip, fn, max=5, windowSec=60)` en cada edge function (`submit-booking`, `agenda-book`).
- Detección anti-duplicado: hash `(email + start_time | event_date)` en últimos 10 min → 409.
- Honeypot field `website` en formularios; si viene relleno → 200 silencioso (sin enviar).

---

### 6. Captcha invisible (Cloudflare Turnstile)

- Recomiendo **Turnstile** (gratis, sin fricción, no requiere cuenta de pago).
- Frontend: widget invisible en `Agenda.tsx` y `BookingSelector.tsx` que genera token al submit.
- Edge functions validan token contra `https://challenges.cloudflare.com/turnstile/v0/siteverify` con `TURNSTILE_SECRET_KEY`.
- Si falla → 403.
- `VITE_TURNSTILE_SITE_KEY` (publishable) en código, secret en Supabase secrets.

---

### Detalles técnicos

```
Nuevos archivos:
- supabase/functions/send-meeting-reminders/index.ts
- supabase/functions/notify-booking/index.ts
- supabase/functions/_shared/rate-limit.ts
- supabase/functions/_shared/turnstile.ts
- src/lib/events.ts
- src/components/TurnstileWidget.tsx

Editados:
- supabase/functions/submit-booking/index.ts (+rate-limit, +turnstile, +notify, +honeypot)
- supabase/functions/agenda-book/index.ts (idem + reminded_at default null)
- src/pages/Agenda.tsx, src/components/BookingSelector.tsx (Turnstile + honeypot)
- src/pages/AdminBookings.tsx (call notify-booking on status change)
- src/components/SEO.tsx (eventJsonLd + serviceJsonLd helpers)
- src/pages/Speaking.tsx, Booking.tsx, Agenda.tsx (inject event JSON-LD)
- HeroSection, AchievementsOverview, MilestonesSection, VentureStack, CTASection, MasonryGrid (parallax/wow upgrades)

Migración:
- ALTER meeting_bookings/keynote_bookings ADD reminded_at TIMESTAMPTZ
- CREATE TABLE request_log + RLS (deny-all)
- ENABLE pg_cron, pg_net
Insert (no migración):
- cron.schedule del recordatorio cada 15 min
```

---

### Decisiones que necesito de ti

1. **Webhook**: ¿Slack (recomendado, ya tienes el conector) o Telegram (necesitaré `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`)?
2. **Captcha**: ¿confirmas Cloudflare Turnstile? (Necesitaré `TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY` desde https://dash.cloudflare.com/?to=/:account/turnstile, gratis).
3. **Recordatorio**: ¿también enviamos un segundo recordatorio 1h antes para meetings 1:1, o solo 24h?

Confirma y arranco con todo.