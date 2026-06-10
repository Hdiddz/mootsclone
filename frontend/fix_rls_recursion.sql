-- ============================================================
-- LANGKAH 1: Hapus function lama yang menggunakan LANGUAGE sql
-- (Karena LANGUAGE sql bisa di-inline oleh Postgres dan menyebabkan recursion)
-- ============================================================
DROP FUNCTION IF EXISTS get_my_group_ids();

-- ============================================================
-- LANGKAH 2: Buat ulang dengan LANGUAGE plpgsql
-- (plpgsql tidak akan pernah di-inline, sehingga SECURITY DEFINER akan tetap aktif)
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
