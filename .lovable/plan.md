## Plan: Mejoras de emails, admin, Benefits y scrollytelling

Voy a abordar 6 bloques. Antes de implementar, te confirmo el alcance porque es grande y algunos puntos tienen decisiones de producto.

---

### 1. Emails de confirmación mejorados
**Archivos:** `supabase/functions/agenda-book/index.ts`, `supabase/functions/submit-booking/index.ts`

- Header con nombre completo del cliente (no solo el primer nombre).
- Fecha y hora formateadas explícitamente en zona **America/Mexico_City** ("Lunes 12 de mayo, 2026 · 10:00 a.m. (CDMX)").
- Bloque destacado "📄 Tus regalos" con 2 botones que apunten a las URLs públicas de los PDFs en `benefits-assets`, además del adjunto.
- Resumen del booking (organización, rol, teléfono, tema) cuando estén disponibles.
- Para `submit-booking`: misma estructura visual, sin .ics, con los 2 PDFs como descarga directa + adjuntos.

---

### 2. Audit log en `/admin/bookings`
**Migración nueva:** tabla `booking_audit_log` (`id`, `booking_id`, `booking_table`, `actor_user_id`, `action`, `field`, `old_value`, `new_value`, `note`, `created_at`) con RLS solo admin.
**UI:** En `AdminBookings.tsx` añadir:
- Botón "Historial" por fila → drawer con timeline.
- Acciones que escriben al log: cambio de status, cancelación, edición de meet_link.
- Si cambia `meet_link` o `status`, se inserta una fila de auditoría desde el cliente (admin autenticado, `auth.uid()` como actor).

---

### 3. Validador pre-publish para Benefits
**Nuevo:** `src/lib/benefitsValidator.ts` + integración en `BenefitsAdminSection.tsx`.
- Reglas: `title`, `description`, `badge` no vacíos; `pdfUrl`/`videoUrl`/`thumbnailUrl` accesibles (HEAD fetch con timeout); `landingPath`/`downloadsPath` existen en el router; `externalUrl` válida.
- Severidad: `error` (bloquea publish) vs `warning`.
- Modal "Revisión pre-publicación" con lista de hallazgos por benefit + botón "Publicar de todas formas" solo si no hay errores.

---

### 4. Panel OG batch — reintentar fallas y ver progreso
**Nuevo:** `src/components/OGBatchPanel.tsx` (dentro de Benefits admin).
- Estado en `localStorage` (`og_batch_runs_v1`): por cada intento `{id, startedAt, items: [{benefitId, status, attempts, error}]}`.
- Tabla con progreso (% completado, fallidos, exitosos), botón "Reintentar fallas" que reejecuta solo los `failed`.
- Vista de detalle por ID con timeline de intentos.
*Nota:* la generación OG actual es client-side; mantenemos esa arquitectura.

---

### 5. Historial de versiones de Benefits
**Nuevo:** `src/lib/benefitsHistory.ts` + panel en `BenefitsAdminSection.tsx`.
- Cada `writeBenefitsBundle` snapshot a `localStorage` `benefits_history_v1` con `{id, timestamp, actor (admin email/local), diff resumido, bundle completo}`.
- UI: lista cronológica con "Ver diff" y "Restaurar a esta versión".
- Límite a 50 versiones (FIFO).

---

### 6. Fix de scrollytelling y parallax del hero
**Archivos:** `src/components/HeroSection.tsx`, `src/components/HeroLoopVideo.tsx`, `src/components/StickyScrollSection.tsx`.
- Auditar el hero: revisar transforms con `useScroll`/`useTransform`, sustituir cualquier `scroll-snap` que rompa el sticky, usar `will-change: transform` y `translate3d`.
- StickyScrollSection: validar que el `200vh` spacer no genere salto en mobile (390px viewport actual), añadir `prefers-reduced-motion`.
- Cross-fade más limpio con `easing` cubic-bezier y `mix-blend-mode` cuando aplique.

---

### 7. Análisis · Mejoras adicionales recomendadas
Después de revisar el código, sugiero (NO implemento sin tu OK):

1. **Rate limiting en edge functions**: hoy `agenda-book` y `submit-booking` aceptan POST anónimo sin throttle → vulnerables a spam. Añadir tabla `request_log` por IP + límite 5/min.
2. **Captcha invisible** (hCaptcha o Turnstile) en formularios públicos.
3. **Webhook Slack/Telegram** para notificar nuevos bookings en tiempo real al admin.
4. **Auto-confirmación con buffer**: bloquear slots ±15 min alrededor de eventos existentes.
5. **Recordatorio 24h antes** de la reunión (cron + Resend).
6. **Página `/agenda` en mobile**: el viewport actual es 390px — revisar el selector de fecha y slots.
7. **SEO**: faltan `canonical` y JSON-LD `Person` + `Event` en varias páginas.
8. **Telemetría**: hoy `track.ts` existe pero no captura conversión booking. Añadir eventos.

---

### Preguntas antes de empezar

1. **Audit log**: ¿está bien que el actor sea el admin autenticado (auth.uid)? ¿O quieres que también registre acciones del sistema (edge functions)?
2. **Historial Benefits**: ¿guardamos en localStorage (rápido, por dispositivo) o en una tabla Supabase (compartido entre admins)?
3. **Mejoras adicionales (sección 7)**: ¿cuáles quieres que incluya en esta misma vuelta? Recomiendo al menos 1, 4 y 6.
4. **Fix scrollytelling**: ¿hay un comportamiento específico que se rompe (salto, jitter, video que no carga) o lo dejo a mi criterio basado en el código actual?

Confirma y arranco.
