
-- Booking type enum
DO $$ BEGIN
  CREATE TYPE public.booking_type AS ENUM ('bureau', 'organizer', 'enterprise');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Bookings table (publicly insertable contact form, no PII reads from client)
CREATE TABLE IF NOT EXISTS public.keynote_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_type public.booking_type NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  organization text,
  role text,
  phone text,
  event_name text,
  event_date date,
  event_city text,
  audience_size text,
  budget_range text,
  topic_interest text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.keynote_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous public to insert booking requests (form submission)
CREATE POLICY "anon can submit bookings"
  ON public.keynote_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies => effectively private. Service role (edge fn) bypasses RLS.

CREATE INDEX IF NOT EXISTS keynote_bookings_created_at_idx ON public.keynote_bookings (created_at DESC);
