
-- Newsletter leads (double opt-in)
CREATE TABLE public.newsletter_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  source_path TEXT,
  language TEXT DEFAULT 'es-MX',
  confirmation_token TEXT NOT NULL UNIQUE,
  confirmation_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_newsletter_leads_confirmed_at ON public.newsletter_leads(confirmed_at);
CREATE INDEX idx_newsletter_leads_token ON public.newsletter_leads(confirmation_token);

GRANT INSERT ON public.newsletter_leads TO anon, authenticated;
GRANT SELECT, UPDATE ON public.newsletter_leads TO authenticated;
GRANT ALL ON public.newsletter_leads TO service_role;

ALTER TABLE public.newsletter_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can sign up; no select for anon (token confirmation runs through edge function with service role)
CREATE POLICY "anyone can subscribe"
  ON public.newsletter_leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins can read leads"
  ON public.newsletter_leads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins can update leads"
  ON public.newsletter_leads FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Analytics events (lightweight conversion telemetry)
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT NOT NULL,
  path TEXT,
  session_id TEXT,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_analytics_events_event_created ON public.analytics_events(event, created_at DESC);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_path ON public.analytics_events(path);

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can log events"
  ON public.analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins can read events"
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_newsletter_leads_updated
  BEFORE UPDATE ON public.newsletter_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
