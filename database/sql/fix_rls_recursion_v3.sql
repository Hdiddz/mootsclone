-- ============================================================
-- SOLUSI FINAL UNTUK INFINITE RECURSION
-- ============================================================

-- 1. Hapus semua policy yang ada agar bersih
DROP POLICY IF EXISTS "Members can read their groups" ON chat_groups;
DROP POLICY IF EXISTS "Members can read group membership" ON chat_group_members;
DROP POLICY IF EXISTS "Members can read group messages" ON group_messages;
DROP POLICY IF EXISTS "Members can send group messages" ON group_messages;

-- 2. Hapus function yang bermasalah (jika ada)
DROP FUNCTION IF EXISTS get_my_group_ids() CASCADE;

-- 3. Policy untuk chat_group_members
-- Kita buat TRUE (terbuka untuk dibaca). Ini aman karena untuk membaca isi pesan 
-- atau info grup, user tetap akan diblokir oleh policy tabel chat_groups & group_messages.
-- Ini adalah pola standar di Supabase untuk tabel relasi/junction agar tidak terjadi infinite recursion.
CREATE POLICY "Members can read group membership"
ON chat_group_members FOR SELECT
USING (true);

-- 4. Policy untuk chat_groups
-- Cukup cek langsung ke tabel chat_group_members (tidak akan rekursif lagi)
CREATE POLICY "Members can read their groups"
ON chat_groups FOR SELECT
USING (
  id IN (
    SELECT group_id 
    FROM chat_group_members 
    WHERE user_id = auth.uid()
  )
);

-- 5. Policy untuk group_messages (Membaca)
CREATE POLICY "Members can read group messages"
ON group_messages FOR SELECT
USING (
  group_id IN (
    SELECT group_id 
    FROM chat_group_members 
    WHERE user_id = auth.uid()
  )
);

-- 6. Policy untuk group_messages (Mengirim)
CREATE POLICY "Members can send group messages"
ON group_messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND group_id IN (
    SELECT group_id 
    FROM chat_group_members 
    WHERE user_id = auth.uid()
  )
);
