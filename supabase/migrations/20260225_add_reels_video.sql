-- Migration to add video_url to social_reels and setup storage bucket

-- Add video_url to table
ALTER TABLE public.social_reels ADD COLUMN IF NOT EXISTS video_url text;

-- Insert bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reels', 'reels', true)
ON CONFLICT (id) DO NOTHING;

-- Setup RLS policies for the bucket
DO $$
BEGIN
    -- Select policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for Reels'
    ) THEN
        CREATE POLICY "Public Access for Reels" ON storage.objects FOR SELECT TO public USING (bucket_id = 'reels');
    END IF;

    -- Insert policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin Upload Reels'
    ) THEN
        CREATE POLICY "Admin Upload Reels" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'reels' AND (SELECT auth.jwt()->>'role') = 'ADMIN');
    END IF;

    -- Update policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin Update Reels'
    ) THEN
        CREATE POLICY "Admin Update Reels" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'reels' AND (SELECT auth.jwt()->>'role') = 'ADMIN');
    END IF;

    -- Delete policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin Delete Reels'
    ) THEN
        CREATE POLICY "Admin Delete Reels" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'reels' AND (SELECT auth.jwt()->>'role') = 'ADMIN');
    END IF;
END
$$;
