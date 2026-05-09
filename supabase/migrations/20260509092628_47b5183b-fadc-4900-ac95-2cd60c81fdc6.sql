CREATE POLICY "Admins can view keynote bookings"
ON public.keynote_bookings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update keynote bookings"
ON public.keynote_bookings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete keynote bookings"
ON public.keynote_bookings FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));