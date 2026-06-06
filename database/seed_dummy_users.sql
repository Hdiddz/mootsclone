-- SQL Script to Seed Dummy Users in Supabase
-- Copy and paste this script into your Supabase SQL Editor and click Run.

-- Ensure pgcrypto extension is active for crypt functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. SEED ANDI WIJAYA (TECHNICAL / DEVELOPER)
DO $$
DECLARE
  user_id_1 uuid := 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'andi.wijaya@telkomuniversity.ac.id') THEN
    -- Insert into auth.users
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
    VALUES (
      user_id_1,
      'andi.wijaya@telkomuniversity.ac.id',
      crypt('Password123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Andi Wijaya"}'::jsonb,
      'authenticated',
      'authenticated',
      now(),
      now()
    );

    -- Wait a moment for trigger, then update profiles
    UPDATE public.profiles
    SET
      campus = 'Telkom University',
      program = 'S1 Teknik Informatika',
      role = 'Technical',
      main_skill = 'React',
      skills = '[
        {"name": "React", "category": "Technical", "level": "Project-ready"},
        {"name": "TypeScript", "category": "Technical", "level": "Advanced"},
        {"name": "Node.js", "category": "Technical", "level": "Intermediate"},
        {"name": "Git", "category": "Technical", "level": "Advanced"}
      ]'::jsonb,
      profile_summary = 'Halo! Saya Andi, mahasiswa Teknik Informatika yang fokus pada pengembangan aplikasi web. Saya senang membangun antarmuka pengguna yang interaktif, responsif, dan estetik.',
      experience_summary = 'Berpengalaman dalam membangun aplikasi web portofolio, e-commerce sederhana menggunakan React, dan kolaborasi tugas kelompok kuliah.',
      experiences = '[
        {
          "id": "exp-andi-1",
          "title": "Frontend Developer",
          "organization": "Project Matkul Pengembangan Web",
          "period": "2025 - Sekarang",
          "description": "Mengembangkan antarmuka aplikasi pencarian buku menggunakan React dan mengintegrasikannya dengan REST API.",
          "relatedSkills": ["React", "TypeScript"]
        }
      ]'::jsonb,
      collaboration_goals = '["Competition team", "Startup prototype", "Campus assignment"]'::jsonb,
      portfolio_links = '[{"label": "GitHub", "url": "https://github.com"}]'::jsonb,
      accent = '#ffc629',
      avatar_url = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      availability = 'available'
    WHERE id = user_id_1;
    
    RAISE NOTICE 'Andi Wijaya created successfully.';
  ELSE
    RAISE NOTICE 'Andi Wijaya already exists.';
  END IF;
END $$;

-- 2. SEED BUDI SANTOSO (BUSINESS / STRATEGIST)
DO $$
DECLARE
  user_id_2 uuid := 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'budi.santoso@telkomuniversity.ac.id') THEN
    -- Insert into auth.users
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
    VALUES (
      user_id_2,
      'budi.santoso@telkomuniversity.ac.id',
      crypt('Password123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Budi Santoso"}'::jsonb,
      'authenticated',
      'authenticated',
      now(),
      now()
    );

    -- Wait a moment for trigger, then update profiles
    UPDATE public.profiles
    SET
      campus = 'Telkom University',
      program = 'S1 Manajemen Bisnis',
      role = 'Business',
      main_skill = 'Pitching',
      skills = '[
        {"name": "Pitching", "category": "Business", "level": "Project-ready"},
        {"name": "Business Strategy", "category": "Business", "level": "Advanced"},
        {"name": "Market Research", "category": "Business", "level": "Intermediate"},
        {"name": "Public Speaking", "category": "Business", "level": "Project-ready"}
      ]'::jsonb,
      profile_summary = 'Hai! Saya Budi dari Manajemen Bisnis. Saya sangat antusias dengan dunia startup dan produk digital. Keahlian utama saya adalah menyusun strategi bisnis, melakukan analisis pasar, dan mempresentasikan ide (pitching) kepada audiens.',
      experience_summary = 'Juara 2 kompetisi Business Plan tingkat nasional dan aktif dalam organisasi mahasiswa di bidang kewirausahaan.',
      experiences = '[
        {
          "id": "exp-budi-1",
          "title": "Business Planner",
          "organization": "Kompetisi Business Plan Nasional",
          "period": "2025",
          "description": "Menyusun proyeksi finansial dan model bisnis kanvas untuk proposal ide startup teknologi sampah.",
          "relatedSkills": ["Business Strategy", "Market Research"]
        }
      ]'::jsonb,
      collaboration_goals = '["Startup prototype", "Freelance project", "Competition team"]'::jsonb,
      portfolio_links = '[{"label": "LinkedIn", "url": "https://linkedin.com"}]'::jsonb,
      accent = '#ffe48a',
      avatar_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      availability = 'available'
    WHERE id = user_id_2;

    RAISE NOTICE 'Budi Santoso created successfully.';
  ELSE
    RAISE NOTICE 'Budi Santoso already exists.';
  END IF;
END $$;

-- 3. SEED CITRA LESTARI (DESIGN / UI/UX)
DO $$
DECLARE
  user_id_3 uuid := 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'citra.lestari@telkomuniversity.ac.id') THEN
    -- Insert into auth.users
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
    VALUES (
      user_id_3,
      'citra.lestari@telkomuniversity.ac.id',
      crypt('Password123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"name":"Citra Lestari"}'::jsonb,
      'authenticated',
      'authenticated',
      now(),
      now()
    );

    -- Wait a moment for trigger, then update profiles
    UPDATE public.profiles
    SET
      campus = 'Telkom University',
      program = 'S1 Desain Komunikasi Visual',
      role = 'Design',
      main_skill = 'Figma',
      skills = '[
        {"name": "Figma", "category": "Design", "level": "Project-ready"},
        {"name": "UI Design", "category": "Design", "level": "Project-ready"},
        {"name": "Brand Identity", "category": "Design", "level": "Intermediate"},
        {"name": "Wireframing", "category": "Design", "level": "Advanced"}
      ]'::jsonb,
      profile_summary = 'Halo! Saya Citra, mahasiswi DKV yang menyukai dunia UI/UX design. Saya fokus membuat desain antarmuka yang bersih, intuitif, dan memudahkan pengguna dalam menyelesaikan masalah mereka.',
      experience_summary = 'Mengerjakan beberapa proyek freelance desain UI mobile app dan mendesain identitas brand untuk UMKM lokal.',
      experiences = '[
        {
          "id": "exp-citra-1",
          "title": "Freelance UI/UX Designer",
          "organization": "Mandiri Creative",
          "period": "2025",
          "description": "Mendesain user flow, wireframe, dan high-fidelity mockups untuk aplikasi reservasi restoran berbasis mobile.",
          "relatedSkills": ["Figma", "UI Design"]
        }
      ]'::jsonb,
      collaboration_goals = '["Competition team", "Startup prototype", "Organization event"]'::jsonb,
      portfolio_links = '[{"label": "Dribbble", "url": "https://dribbble.com"}]'::jsonb,
      accent = '#fff3c4',
      avatar_url = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      availability = 'available'
    WHERE id = user_id_3;

    RAISE NOTICE 'Citra Lestari created successfully.';
  ELSE
    RAISE NOTICE 'Citra Lestari already exists.';
  END IF;
END $$;
