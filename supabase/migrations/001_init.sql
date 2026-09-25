-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. site_content
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. site_content_history
CREATE TABLE IF NOT EXISTS public.site_content_history (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. admin_profile
CREATE TABLE IF NOT EXISTS public.admin_profile (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure username is unique case-insensitively
CREATE UNIQUE INDEX IF NOT EXISTS admin_profile_username_idx ON public.admin_profile (lower(username));

-- Enforce exactly one admin row in the database
CREATE UNIQUE INDEX IF NOT EXISTS admin_profile_single_row_idx ON public.admin_profile ((true));

-- 4. auth_attempts
CREATE TABLE IF NOT EXISTS public.auth_attempts (
  key TEXT PRIMARY KEY,
  count INT NOT NULL DEFAULT 0,
  window_started_at TIMESTAMPTZ,
  locked_until TIMESTAMPTZ
);

-- Enable Row Level Security (RLS) on all tables
-- With no public policies, anon/authenticated users cannot read or write directly.
-- Server-only access via SUPABASE_SECRET_KEY (service_role) bypasses RLS safely.
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_attempts ENABLE ROW LEVEL SECURITY;

-- Configure Supabase Storage bucket 'site-images'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  5242880,
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/avif'];

-- Policy: Allow public read access to uploaded site images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access site-images'
  ) THEN
    CREATE POLICY "Public Access site-images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'site-images');
  END IF;
END $$;
