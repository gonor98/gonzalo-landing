## Plan: Bookings + Emails + Scrollytelling + Benefits admin

Voy a dividir el trabajo en bloques claros para que puedas aprobarlo de una vez.

### 1. Formularios Keynote → email de confirmación con PDF CETI
- En `submit-booking` (edge function existente que guarda en `keynote_bookings`): agregar envío de email vía Resend a:
  - El cliente: confirmación + PDF adjunto (`public/conferencia-ceti-gonzalo.pdf` subido a storage `benefits-assets` para link público).
  - A `Gonzalo@propmatchapp.com`: notificación con todos los datos del lead.
- Adjuntar PDF como `attachments` en Resend (base64 del archivo en storage).
- Confirmación visual al usuario: toast "Te enviamos un correo con la información".

### 2. Flujo unificado Keynote → Agenda (Calendly-like)
- En `BookingSelector` agregar un cuarto CTA: "Agendar videollamada conmigo" que lleva a `/agenda`.
- En `/agenda`: mantener el selector estilo Calendly ya creado, pero **antes de confirmar el slot**, pedir el formulario completo (mismos campos que keynote: nombre, email, organización, rol, teléfono, tema). El edge function `agenda-book` ya inserta en `meeting_bookings` y crea el evento Google Meet — ampliar para que también guarde en `keynote_bookings` con `booking_type='meeting'` para tener todo en un solo lugar de admin.
- Email de confirmación al cliente con: link de Meet + .ics + PDF de CETI adjunto. Email a Gonzalo con los datos.

### 3. Página `/admin/bookings`
- Nueva ruta protegida con `useAdminAuth` (ya existe).
- Lista combinada de `meeting_bookings` + `keynote_bookings` con tabs: Keynotes / Reuniones.
- Filtros: estado (`new/confirmed/cancelled`), rango de fechas, búsqueda por nombre/email.
- Acciones: marcar como contactado, cancelar, copiar link de Meet, ver detalles en drawer.
- Link a la página desde el footer admin.

### 4. Sección 4 — Sticky Scrollytelling (refinamiento)
El componente `StickyScrollSection` ya existe con la lógica básica. Voy a pulirlo:
- Transiciones más cinemáticas entre los 3 estados (fade + slight scale + cross-fade de imágenes).
- Parallax suave en la imagen derecha (translateY según progreso).
- Indicador de progreso vertical más visible (gold bar animada).
- Mejor sync móvil con `IntersectionObserver` ya implementado.
- Asegurar que los 3 estados (Forbes / PropMatch $195M / Keynote escenarios) calzan con las thresholds 1/3 y 2/3.

### 5. Benefits — notas de versión + panel OG batch + retry
- En `BenefitsAdminSection`: agregar un panel "Historial de cambios" que registra cada save en `localStorage` (`benefits_history_v1`) con timestamp, autor (admin email), diff resumido. UI tipo timeline con botón "Restaurar versión".
- Panel OG batch: lista los items con thumbnail, status (✓ ok / ✗ falló / ⏳ pendiente), botón "Reintentar fallas" que vuelve a generar OG solo de las marcadas como fallidas.
- Validación pre-publish: bloquear botón "Publicar" si algún benefit tipo `event` no tiene `pdfUrl`, `videoUrl` y `thumbnailUrl`. Mostrar lista de faltantes.

### Archivos afectados
**Nuevos:**
- `src/pages/AdminBookings.tsx`
- `supabase/functions/_shared/transactional-email-templates/keynote-confirmation.tsx` (si se usa Lovable Email) — o se queda con Resend puro
- `src/components/agenda/AgendaBookingForm.tsx` (formulario completo embebido en /agenda)

**Editados:**
- `supabase/functions/submit-booking/index.ts` — agregar envío de email con PDF
- `supabase/functions/agenda-book/index.ts` — agregar PDF al email + insert en keynote_bookings
- `src/pages/Agenda.tsx` — pedir formulario completo antes de confirmar
- `src/components/BookingSelector.tsx` — agregar CTA a /agenda
- `src/components/StickyScrollSection.tsx` — pulir transiciones + parallax
- `src/components/BenefitsAdminSection.tsx` — historial + OG panel + validación
- `src/App.tsx` — ruta /admin/bookings

### Migración DB
- Subir PDF `conferencia-ceti-gonzalo.pdf` y `bonus-guia-estudiante-ceti.pdf` a bucket `benefits-assets` para tener URL pública estable que el edge function adjunte.
- Agregar columna `booking_type` opcional o usar la tabla actual. (No hace falta migración si reusamos `keynote_bookings.booking_type`).

### Preguntas / decisiones implícitas
- Uso **Resend** (ya conectado) para todos los emails — no activo Lovable Emails para no duplicar. Si prefieres Lovable Emails dímelo y lo cambio.
- El PDF que adjunto es `conferencia-ceti-gonzalo.pdf`. Si quieres ambos (slides + guía), los adjunto los dos.
- `/admin/bookings` requiere login admin (ya hay `useAdminAuth`) — necesitas tener un user con rol `admin` en `user_roles`.

¿Apruebo y procedo con los 5 bloques en orden, o prefieres priorizar alguno?