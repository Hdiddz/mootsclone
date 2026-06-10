-- ============================================================
-- SQL Script: Final RLS Fix for Group Chats
-- Run this in the Supabase SQL Editor.
-- ============================================================

-- 1. Dynamically drop ALL existing policies on the group chat tables to ensure a clean slate
DO $$
DECLARE
    pol record;
BEGIN
    -- Drop all policies on chat_group_members
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'chat_group_members' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY %I ON public.chat_group_members', pol.policyname);
    END LOOP;

    -- Drop all policies on chat_groups
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'chat_groups' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY %I ON public.chat_groups', pol.policyname);
    END LOOP;

    -- Drop all policies on group_messages
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'group_messages' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY %I ON public.group_messages', pol.policyname);
    END LOOP;
END $$;

-- 2. Drop old functions
DROP FUNCTION IF EXISTS public.get_my_group_ids() CASCADE;
DROP FUNCTION IF EXISTS public.check_group_membership(uuid, uuid) CASCADE;

-- 3. Create PL/pgSQL SECURITY DEFINER function to check membership.
-- PL/pgSQL functions are NOT inlined by the PostgreSQL optimizer, meaning they
-- will execute as the postgres owner role and bypass RLS, avoiding infinite recursion.
CREATE OR REPLACE FUNCTION public.check_group_membership(p_group_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.chat_group_members 
    WHERE group_id = p_group_id AND user_id = p_user_id
  );
END;
$$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.chat_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- RLS Policies for chat_group_members
-- ------------------------------------------------------------

-- Members can view memberships of groups they belong to
CREATE POLICY "Members can read group membership"
ON public.chat_group_members FOR SELECT
TO authenticated
USING ( (SELECT public.check_group_membership(group_id, auth.uid())) );

-- Creators of groups or members adding themselves can insert
CREATE POLICY "Users can insert members"
ON public.chat_group_members FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.chat_groups
    WHERE id = group_id AND created_by = auth.uid()
  )
);

-- ------------------------------------------------------------
-- RLS Policies for chat_groups
-- ------------------------------------------------------------

-- Members can read group details
CREATE POLICY "Members can read their groups"
ON public.chat_groups FOR SELECT
TO authenticated
USING ( (SELECT public.check_group_membership(id, auth.uid())) );

-- Anyone authenticated can create a group
CREATE POLICY "Users can create groups"
ON public.chat_groups FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- ------------------------------------------------------------
-- RLS Policies for group_messages
-- ------------------------------------------------------------

-- Members can read group messages
CREATE POLICY "Members can read group messages"
ON public.group_messages FOR SELECT
TO authenticated
USING ( (SELECT public.check_group_membership(group_id, auth.uid())) );

-- Members can send messages in groups they belong to
CREATE POLICY "Members can send group messages"
ON public.group_messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND (SELECT public.check_group_membership(group_id, auth.uid()))
);

-- Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';
