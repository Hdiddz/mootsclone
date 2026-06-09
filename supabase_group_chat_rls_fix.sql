-- ============================================================
-- LANGKAH 1: Bersihkan semua policy lama agar tidak bentrok
-- ============================================================
DROP POLICY IF EXISTS "Users can read their groups" ON chat_groups;
DROP POLICY IF EXISTS "Users can create groups" ON chat_groups;
DROP POLICY IF EXISTS "Users can read chat groups they are in" ON chat_groups;
DROP POLICY IF EXISTS "Users can insert chat groups" ON chat_groups;
DROP POLICY IF EXISTS "Group creators can insert chat groups" ON chat_groups;

DROP POLICY IF EXISTS "Users can read members of their groups" ON chat_group_members;
DROP POLICY IF EXISTS "Creators can insert members" ON chat_group_members;
DROP POLICY IF EXISTS "Users can read all members of their groups" ON chat_group_members;
DROP POLICY IF EXISTS "Users can read their own group memberships" ON chat_group_members;
DROP POLICY IF EXISTS "Users can insert members" ON chat_group_members;

DROP FUNCTION IF EXISTS get_my_group_ids();

-- ============================================================
-- LANGKAH 2: Aktifkan RLS pada kedua tabel
-- ============================================================
ALTER TABLE chat_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_group_members ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- LANGKAH 3: Buat FUNCTION untuk membaca group_ids user
-- (SECURITY DEFINER = bisa bypass RLS, jadi tidak infinite recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION get_my_group_ids()
RETURNS TABLE(group_id uuid)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cgm.group_id
  FROM chat_group_members cgm
  WHERE cgm.user_id = auth.uid();
$$;

-- ============================================================
-- LANGKAH 4: Buat FUNCTION untuk membuat grup beserta seluruh member
-- Ini penting agar semua member bisa di-insert tanpa masalah RLS
-- (SECURITY DEFINER = langsung insert ke DB tanpa cek RLS)
-- ============================================================
CREATE OR REPLACE FUNCTION create_group_with_members(
  p_title TEXT,
  p_created_by UUID,
  p_member_ids UUID[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_group_id UUID;
  v_member_id UUID;
BEGIN
  -- Insert grup baru
  INSERT INTO chat_groups (title, created_by)
  VALUES (p_title, p_created_by)
  RETURNING id INTO v_group_id;

  -- Insert semua member (termasuk pembuat)
  FOREACH v_member_id IN ARRAY p_member_ids
  LOOP
    INSERT INTO chat_group_members (group_id, user_id, role)
    VALUES (
      v_group_id,
      v_member_id,
      CASE WHEN v_member_id = p_created_by THEN 'admin' ELSE 'member' END
    )
    ON CONFLICT DO NOTHING;
  END LOOP;

  RETURN v_group_id;
END;
$$;

-- ============================================================
-- LANGKAH 5: RLS Policy untuk tabel CHAT_GROUPS
-- ============================================================

-- Bisa baca grup jika user adalah anggotanya
CREATE POLICY "Members can read their groups"
ON chat_groups FOR SELECT
USING (id IN (SELECT group_id FROM get_my_group_ids()));

-- Bisa bikin grup (INSERT akan dihandle lewat function, tapi ini tetap perlu)
CREATE POLICY "Users can create groups"
ON chat_groups FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- ============================================================
-- LANGKAH 6: RLS Policy untuk tabel CHAT_GROUP_MEMBERS
-- ============================================================

-- Bisa baca SEMUA member dari grup yang user ikuti
CREATE POLICY "Members can read group membership"
ON chat_group_members FOR SELECT
USING (group_id IN (SELECT group_id FROM get_my_group_ids()));

-- INSERT ditangani oleh SECURITY DEFINER function, bukan langsung
-- Tapi untuk keamanan, izinkan admin grup untuk INSERT langsung juga
CREATE POLICY "Admins can insert members"
ON chat_group_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM chat_group_members existing
    WHERE existing.group_id = chat_group_members.group_id
      AND existing.user_id = auth.uid()
      AND existing.role = 'admin'
  )
  OR
  EXISTS (
    SELECT 1 FROM chat_groups cg
    WHERE cg.id = chat_group_members.group_id
      AND cg.created_by = auth.uid()
  )
);

-- ============================================================
-- LANGKAH 7: Juga pastikan group_messages bisa dibaca oleh member
-- ============================================================
DROP POLICY IF EXISTS "Members can read group messages" ON group_messages;
DROP POLICY IF EXISTS "Members can insert group messages" ON group_messages;

ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read group messages"
ON group_messages FOR SELECT
USING (group_id IN (SELECT group_id FROM get_my_group_ids()));

CREATE POLICY "Members can send group messages"
ON group_messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND group_id IN (SELECT group_id FROM get_my_group_ids())
);
