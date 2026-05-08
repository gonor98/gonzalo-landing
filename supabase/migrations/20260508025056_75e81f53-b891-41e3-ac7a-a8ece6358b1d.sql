
CREATE TABLE public.meeting_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  topic text,
  message text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 30,
  meet_link text,
  google_event_id text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.meeting_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can create meeting bookings"
ON public.meeting_bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(full_name) BETWEEN 2 AND 120
  AND char_length(email) BETWEEN 5 AND 200
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (message IS NULL OR char_length(message) <= 5000)
  AND end_time > start_time
);

CREATE POLICY "Admins can view meeting bookings"
ON public.meeting_bookings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update meeting bookings"
ON public.meeting_bookings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete meeting bookings"
ON public.meeting_bookings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_meeting_bookings_start ON public.meeting_bookings(start_time);
