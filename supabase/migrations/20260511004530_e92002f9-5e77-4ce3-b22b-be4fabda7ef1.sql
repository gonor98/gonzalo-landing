
-- Reminder tracking
ALTER TABLE public.meeting_bookings
  ADD COLUMN IF NOT EXISTS reminded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminded_1h_at TIMESTAMPTZ;

ALTER TABLE public.keynote_bookings
  ADD COLUMN IF NOT EXISTS reminded_at TIMESTAMPTZ;

-- Request log for rate limiting + dup detection
CREATE TABLE IF NOT EXISTS public.request_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  function_name TEXT NOT NULL,
  fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_request_log_lookup
  ON public.request_log (function_name, ip, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_request_log_fingerprint
  ON public.request_log (function_name, fingerprint, created_at DESC);

ALTER TABLE public.request_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read request log"
  ON public.request_log FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Extensions for cron
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
