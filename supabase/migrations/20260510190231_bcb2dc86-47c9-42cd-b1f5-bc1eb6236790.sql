
CREATE TABLE IF NOT EXISTS public.booking_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL,
  booking_table text NOT NULL CHECK (booking_table IN ('meeting_bookings','keynote_bookings')),
  actor_user_id uuid,
  actor_label text,
  action text NOT NULL,
  field text,
  old_value text,
  new_value text,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_audit_booking ON public.booking_audit_log (booking_id, created_at DESC);

ALTER TABLE public.booking_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON public.booking_audit_log FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert audit log"
  ON public.booking_audit_log FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update audit log"
  ON public.booking_audit_log FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete audit log"
  ON public.booking_audit_log FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update keynote_bookings status as well
DROP POLICY IF EXISTS "Admins can update keynote bookings rows" ON public.keynote_bookings;
CREATE POLICY "Admins can update keynote bookings rows"
  ON public.keynote_bookings FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
