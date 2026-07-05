-- ============================================================
-- SQL Script: Recreate projects & project_members with UUIDs
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- Drop old tables to clear the bigint data types
DROP TABLE IF EXISTS public.project_members CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;

-- Recreate projects table with creator_id as UUID referencing profiles
CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  status text DEFAULT 'open',
  deadline date,
  needed_roles jsonb,
  skills_needed jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Recreate project_members table with user_id as UUID referencing profiles
CREATE TABLE public.project_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(project_id, user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- RLS Policies for projects
-- ------------------------------------------------------------
CREATE POLICY "Anyone can read projects" 
ON public.projects FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Users can create projects" 
ON public.projects FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update projects" 
ON public.projects FOR UPDATE 
TO authenticated 
USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete projects" 
ON public.projects FOR DELETE 
TO authenticated 
USING (auth.uid() = creator_id);

-- ------------------------------------------------------------
-- RLS Policies for project_members
-- ------------------------------------------------------------
CREATE POLICY "Anyone can read project members" 
ON public.project_members FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Users can join projects" 
ON public.project_members FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members or creators can delete membership" 
ON public.project_members FOR DELETE 
TO authenticated 
USING (
  auth.uid() = user_id
  OR auth.uid() = (SELECT creator_id FROM public.projects WHERE id = project_id)
);

-- Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
