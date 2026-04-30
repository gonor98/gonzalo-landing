
DROP POLICY IF EXISTS "anon can submit bookings" ON public.keynote_bookings;

CREATE POLICY "anon can submit valid bookings"
  ON public.keynote_bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(full_name) BETWEEN 2 AND 120
    AND char_length(email) BETWEEN 5 AND 200
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (message IS NULL OR char_length(message) <= 5000)
  );
