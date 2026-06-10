-- ============================================================
-- LANGKAH 1: Hapus kebijakan (policies) yang bergantung pada function lama
-- ============================================================
DROP POLICY IF EXISTS "Members can read their groups" ON chat_groups;
DROP POLICY IF EXISTS "Members can read group membership" ON chat_group_members;
DROP POLICY IF EXISTS "Members can read group messages" ON group_messages;
DROP POLICY IF EXISTS "Members can send group messages" ON group_messages;

-- ============================================================
-- LANGKAH 2: Hapus function lama dengan aman
-- ============================================================
DROP FUNCTION IF EXISTS get_my_group_ids() CASCADE;

-- ============================================================
-- LANGKAH 3: Buat ulang function dengan LANGUAGE plpgsql
-- (plpgsql tidak akan di-inline, sehingga mengatasi infinite recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION get_my_group_ids()
RETURNS TABLE(group_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT cgm.group_id
  FROM chat_group_members cgm
  WHERE cgm.user_id = auth.uid();
END;
$$;

-- ============================================================
-- LANGKAH 4: Buat ulang kebijakan (policies) yang tadi dihapus
-- ============================================================

-- RLS Policy untuk CHAT_GROUPS
CREATE POLICY "Members can read their groups"
ON chat_groups FOR SELECT
USING (id IN (SELECT * FROM get_my_group_ids()));

-- RLS Policy untuk CHAT_GROUP_MEMBERS
CREATE POLICY "Members can read group membership"
ON chat_group_members FOR SELECT
USING (group_id IN (SELECT * FROM get_my_group_ids()));

-- RLS Policy untuk GROUP_MESSAGES
CREATE POLICY "Members can read group messages"
ON group_messages FOR SELECT
USING (group_id IN (SELECT * FROM get_my_group_ids()));

CREATE POLICY "Members can send group messages"
ON group_messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND group_id IN (SELECT * FROM get_my_group_ids())
);
