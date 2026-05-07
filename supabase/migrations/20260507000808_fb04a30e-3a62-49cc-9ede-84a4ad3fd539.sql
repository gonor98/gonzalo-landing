-- Create public bucket for Benefits assets (PDFs, videos, thumbnails)
INSERT INTO storage.buckets (id, name, public)
VALUES ('benefits-assets', 'benefits-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policy
CREATE POLICY "Public read benefits-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'benefits-assets');

-- Authenticated admins can upload (any authenticated user with 'admin' role)
CREATE POLICY "Admins can upload benefits-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'benefits-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can update benefits-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'benefits-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete benefits-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'benefits-assets'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);