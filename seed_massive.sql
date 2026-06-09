INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, is_sso_user, is_anonymous) VALUES
('1c752464-455a-46a4-9565-2379bed772b2', 'authenticated', 'authenticated', 'user1@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Maya Fajar"}', false, false, false),
('5394a69a-b519-4d74-99cf-4d48e4363002', 'authenticated', 'authenticated', 'user2@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Maya Eko"}', false, false, false),
('8dde1cef-62ae-4639-b579-86cad6d3b80a', 'authenticated', 'authenticated', 'user3@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Reza Siti"}', false, false, false),
('d6d940fd-30d6-4c47-94ed-28c3166950ed', 'authenticated', 'authenticated', 'user4@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Fajar Dewi"}', false, false, false),
('bedb3641-4739-463b-ba23-2cfe2b8a23bd', 'authenticated', 'authenticated', 'user5@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Rizky Siti"}', false, false, false),
('c151ac53-e7ad-4a74-97ea-5a906c644b7f', 'authenticated', 'authenticated', 'user6@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Nisa Eko"}', false, false, false),
('5d04bb1d-4cb6-4fa8-a1cd-bc641917a79c', 'authenticated', 'authenticated', 'user7@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Lestari Maya"}', false, false, false),
('6c081d1f-5666-4b5e-a98d-53a188be9a44', 'authenticated', 'authenticated', 'user8@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Ayu Bayu"}', false, false, false),
('e3d7cd7f-1003-4aed-8fd4-c4c9089826e6', 'authenticated', 'authenticated', 'user9@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Siti Hendra"}', false, false, false),
('397c082a-5faa-4d08-ba34-3de0b509d86c', 'authenticated', 'authenticated', 'user10@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Dewi Putri"}', false, false, false),
('092251e6-4e91-41bc-adff-79f47f10da3e', 'authenticated', 'authenticated', 'user11@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Dian Eko"}', false, false, false),
('2803af73-e53d-49b3-a7e6-a697f41ce3fc', 'authenticated', 'authenticated', 'user12@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Putri Rina"}', false, false, false),
('4b1fe008-1f0e-43e6-a6ee-026116cf9ac4', 'authenticated', 'authenticated', 'user13@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Siti Putri"}', false, false, false),
('c71cb40d-8793-48e6-95b3-9b354ed27a3b', 'authenticated', 'authenticated', 'user14@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Ayu Melati"}', false, false, false),
('89e1fb70-2f4d-4db4-bcde-d64613dc7cdc', 'authenticated', 'authenticated', 'user15@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Hendra Bayu"}', false, false, false),
('b4ef90b9-6328-4bfe-8841-764a5823b9ca', 'authenticated', 'authenticated', 'user16@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Fajar Dian"}', false, false, false),
('6f264af8-7420-4f23-bec5-4e176703d92c', 'authenticated', 'authenticated', 'user17@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Reza Reza"}', false, false, false),
('3f6df1a0-f138-4bda-afa4-6409f0d21d1e', 'authenticated', 'authenticated', 'user18@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Aditya Dian"}', false, false, false),
('1afa896f-eb90-41bf-a4d9-3a1b760c643a', 'authenticated', 'authenticated', 'user19@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Hendra Siti"}', false, false, false),
('04a5af40-2829-4baa-b0b2-32c2007f4e0a', 'authenticated', 'authenticated', 'user20@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Andi Bayu"}', false, false, false),
('21aa77da-cacb-4487-aad9-19b3f83cf5bd', 'authenticated', 'authenticated', 'user21@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Reza Eko"}', false, false, false),
('c3c6ee41-2ecb-44de-b9c3-7da50fd0327b', 'authenticated', 'authenticated', 'user22@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Rizky Dian"}', false, false, false),
('dd6b881d-d152-43cb-ac6a-7a4f56f17648', 'authenticated', 'authenticated', 'user23@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Andi Melati"}', false, false, false),
('95a62a3f-7327-4d50-a8ef-1e407c00ca25', 'authenticated', 'authenticated', 'user24@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Dian Surya"}', false, false, false),
('0ef06bfe-f136-42e3-bcc1-c1b807b00444', 'authenticated', 'authenticated', 'user25@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Lestari Nisa"}', false, false, false),
('89e3a062-24e4-4dd6-a8e9-31cb6f583519', 'authenticated', 'authenticated', 'user26@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Siti Surya"}', false, false, false),
('817f836f-7224-4973-aafc-ed967c256b9b', 'authenticated', 'authenticated', 'user27@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Dewi Aditya"}', false, false, false),
('9fbb7155-7ddf-4016-b2cc-9e225876d2b3', 'authenticated', 'authenticated', 'user28@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Dewi Dian"}', false, false, false),
('536530a0-8d39-4481-891f-b923544bcbe4', 'authenticated', 'authenticated', 'user29@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Melati Siti"}', false, false, false),
('436aac78-6df1-499c-aee7-70a5b058dbb6', 'authenticated', 'authenticated', 'user30@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Dian Maya"}', false, false, false),
('511d263f-a906-4263-902a-4582ab6bd279', 'authenticated', 'authenticated', 'user31@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Maya Budi"}', false, false, false),
('cd5b0384-6a98-4415-8ac9-d906075b89c2', 'authenticated', 'authenticated', 'user32@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Eko Aditya"}', false, false, false),
('c89a8620-ed2d-4b7a-b887-ed14602563e2', 'authenticated', 'authenticated', 'user33@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Lestari Reza"}', false, false, false),
('b7c6e6b4-d298-4e75-b776-70cbda8ba631', 'authenticated', 'authenticated', 'user34@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Rizky Maya"}', false, false, false),
('1d6e7ca9-290e-403e-90dc-c3c0ccaac859', 'authenticated', 'authenticated', 'user35@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Nisa Putri"}', false, false, false),
('a2a3c0fc-43c2-4a32-bf60-16a1eea34614', 'authenticated', 'authenticated', 'user36@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Andi Dian"}', false, false, false),
('d21acf8a-13d8-48e6-8af3-70e4dc407980', 'authenticated', 'authenticated', 'user37@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Bayu Lestari"}', false, false, false),
('e4081ba0-66fc-4320-90a3-35be529dafca', 'authenticated', 'authenticated', 'user38@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Bayu Rina"}', false, false, false),
('85980100-6e02-4b79-a3aa-bebb4a2f2834', 'authenticated', 'authenticated', 'user39@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Budi Maya"}', false, false, false),
('1879b158-87f2-44cc-b5ea-87acd201077f', 'authenticated', 'authenticated', 'user40@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Ayu Dewi"}', false, false, false),
('22cc201e-9d56-4d73-9622-426704f75b09', 'authenticated', 'authenticated', 'user41@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Bayu Melati"}', false, false, false),
('e4695cb3-b78b-441a-9263-66344efc9635', 'authenticated', 'authenticated', 'user42@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Maya Nisa"}', false, false, false),
('cfb86594-7fb8-42f4-93b3-c8b4130c3c3e', 'authenticated', 'authenticated', 'user43@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Budi Bayu"}', false, false, false),
('903d49ab-9dbb-4347-9b34-3c3b5dc69029', 'authenticated', 'authenticated', 'user44@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Lestari Rina"}', false, false, false),
('722a972a-782f-4bf5-9ad7-6479d0f54412', 'authenticated', 'authenticated', 'user45@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Aditya Surya"}', false, false, false),
('2bf6ec9a-8513-432b-a90b-e39c2878f6e1', 'authenticated', 'authenticated', 'user46@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Hendra Andi"}', false, false, false),
('ff23c59f-bcb2-44f4-9dd2-c560d86a9cc9', 'authenticated', 'authenticated', 'user47@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Surya Budi"}', false, false, false),
('974d89b5-a2d8-4fe4-8f45-a45de4fbc348', 'authenticated', 'authenticated', 'user48@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Rina Melati"}', false, false, false),
('613ae022-9dd4-46fe-af36-1b0f236cbcf5', 'authenticated', 'authenticated', 'user49@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Lestari Hendra"}', false, false, false),
('1a6c37c6-5bea-4570-99bb-637db319322b', 'authenticated', 'authenticated', 'user50@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Putri Rizky"}', false, false, false)
ON CONFLICT (id) DO NOTHING;

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Informatika',
  role = 'Product Manager',
  main_skill = 'Agile',
  skills = '[{"name":"Agile","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Product Manager ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Product Manager',
  avatar_url = 'https://i.pravatar.cc/300?u=1c752464-455a-46a4-9565-2379bed772b2',
  online = true,
  mutual_interest = true
WHERE id = '1c752464-455a-46a4-9565-2379bed772b2';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ilmu Terapan',
  role = 'UI/UX Designer',
  main_skill = 'Figma',
  skills = '[{"name":"Figma","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate UI/UX Designer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead UI/UX Designer',
  avatar_url = 'https://i.pravatar.cc/300?u=5394a69a-b519-4d74-99cf-4d48e4363002',
  online = true,
  mutual_interest = true
WHERE id = '5394a69a-b519-4d74-99cf-4d48e4363002';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ilmu Terapan',
  role = 'IoT Builder',
  main_skill = 'Arduino',
  skills = '[{"name":"Arduino","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate IoT Builder ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead IoT Builder',
  avatar_url = 'https://i.pravatar.cc/300?u=8dde1cef-62ae-4639-b579-86cad6d3b80a',
  online = true,
  mutual_interest = true
WHERE id = '8dde1cef-62ae-4639-b579-86cad6d3b80a';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ilmu Terapan',
  role = 'Product Manager',
  main_skill = 'Agile',
  skills = '[{"name":"Agile","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Product Manager ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Product Manager',
  avatar_url = 'https://i.pravatar.cc/300?u=d6d940fd-30d6-4c47-94ed-28c3166950ed',
  online = true,
  mutual_interest = true
WHERE id = 'd6d940fd-30d6-4c47-94ed-28c3166950ed';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ilmu Terapan',
  role = 'IoT Builder',
  main_skill = 'Arduino',
  skills = '[{"name":"Arduino","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate IoT Builder ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead IoT Builder',
  avatar_url = 'https://i.pravatar.cc/300?u=bedb3641-4739-463b-ba23-2cfe2b8a23bd',
  online = true,
  mutual_interest = true
WHERE id = 'bedb3641-4739-463b-ba23-2cfe2b8a23bd';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Informatika',
  role = 'Frontend Developer',
  main_skill = 'React',
  skills = '[{"name":"React","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Frontend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Frontend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=c151ac53-e7ad-4a74-97ea-5a906c644b7f',
  online = true,
  mutual_interest = true
WHERE id = 'c151ac53-e7ad-4a74-97ea-5a906c644b7f';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Rekayasa Industri',
  role = 'Business Strategist',
  main_skill = 'Market Research',
  skills = '[{"name":"Market Research","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Business Strategist ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Business Strategist',
  avatar_url = 'https://i.pravatar.cc/300?u=5d04bb1d-4cb6-4fa8-a1cd-bc641917a79c',
  online = true,
  mutual_interest = true
WHERE id = '5d04bb1d-4cb6-4fa8-a1cd-bc641917a79c';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Komunikasi Sosial',
  role = 'Product Manager',
  main_skill = 'Agile',
  skills = '[{"name":"Agile","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Product Manager ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Product Manager',
  avatar_url = 'https://i.pravatar.cc/300?u=6c081d1f-5666-4b5e-a98d-53a188be9a44',
  online = true,
  mutual_interest = true
WHERE id = '6c081d1f-5666-4b5e-a98d-53a188be9a44';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Industri Kreatif',
  role = 'Content Creator',
  main_skill = 'Copywriting',
  skills = '[{"name":"Copywriting","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Content Creator ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Content Creator',
  avatar_url = 'https://i.pravatar.cc/300?u=e3d7cd7f-1003-4aed-8fd4-c4c9089826e6',
  online = true,
  mutual_interest = true
WHERE id = 'e3d7cd7f-1003-4aed-8fd4-c4c9089826e6';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Teknik Elektro',
  role = 'IoT Builder',
  main_skill = 'Arduino',
  skills = '[{"name":"Arduino","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate IoT Builder ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead IoT Builder',
  avatar_url = 'https://i.pravatar.cc/300?u=397c082a-5faa-4d08-ba34-3de0b509d86c',
  online = true,
  mutual_interest = true
WHERE id = '397c082a-5faa-4d08-ba34-3de0b509d86c';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ilmu Terapan',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Backend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Backend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=092251e6-4e91-41bc-adff-79f47f10da3e',
  online = true,
  mutual_interest = true
WHERE id = '092251e6-4e91-41bc-adff-79f47f10da3e';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Informatika',
  role = 'Business Strategist',
  main_skill = 'Market Research',
  skills = '[{"name":"Market Research","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Business Strategist ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Business Strategist',
  avatar_url = 'https://i.pravatar.cc/300?u=2803af73-e53d-49b3-a7e6-a697f41ce3fc',
  online = true,
  mutual_interest = true
WHERE id = '2803af73-e53d-49b3-a7e6-a697f41ce3fc';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Industri Kreatif',
  role = 'IoT Builder',
  main_skill = 'Arduino',
  skills = '[{"name":"Arduino","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate IoT Builder ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead IoT Builder',
  avatar_url = 'https://i.pravatar.cc/300?u=4b1fe008-1f0e-43e6-a6ee-026116cf9ac4',
  online = true,
  mutual_interest = true
WHERE id = '4b1fe008-1f0e-43e6-a6ee-026116cf9ac4';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Rekayasa Industri',
  role = 'Product Manager',
  main_skill = 'Agile',
  skills = '[{"name":"Agile","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Product Manager ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Product Manager',
  avatar_url = 'https://i.pravatar.cc/300?u=c71cb40d-8793-48e6-95b3-9b354ed27a3b',
  online = true,
  mutual_interest = true
WHERE id = 'c71cb40d-8793-48e6-95b3-9b354ed27a3b';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Industri Kreatif',
  role = 'Data Analyst',
  main_skill = 'Python',
  skills = '[{"name":"Python","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Data Analyst ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Data Analyst',
  avatar_url = 'https://i.pravatar.cc/300?u=89e1fb70-2f4d-4db4-bcde-d64613dc7cdc',
  online = true,
  mutual_interest = true
WHERE id = '89e1fb70-2f4d-4db4-bcde-d64613dc7cdc';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Komunikasi Sosial',
  role = 'Product Manager',
  main_skill = 'Agile',
  skills = '[{"name":"Agile","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Product Manager ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Product Manager',
  avatar_url = 'https://i.pravatar.cc/300?u=b4ef90b9-6328-4bfe-8841-764a5823b9ca',
  online = true,
  mutual_interest = true
WHERE id = 'b4ef90b9-6328-4bfe-8841-764a5823b9ca';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Komunikasi Sosial',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Backend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Backend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=6f264af8-7420-4f23-bec5-4e176703d92c',
  online = true,
  mutual_interest = true
WHERE id = '6f264af8-7420-4f23-bec5-4e176703d92c';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Komunikasi Sosial',
  role = 'Data Analyst',
  main_skill = 'Python',
  skills = '[{"name":"Python","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Data Analyst ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Data Analyst',
  avatar_url = 'https://i.pravatar.cc/300?u=3f6df1a0-f138-4bda-afa4-6409f0d21d1e',
  online = true,
  mutual_interest = true
WHERE id = '3f6df1a0-f138-4bda-afa4-6409f0d21d1e';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Teknik Elektro',
  role = 'IoT Builder',
  main_skill = 'Arduino',
  skills = '[{"name":"Arduino","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate IoT Builder ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead IoT Builder',
  avatar_url = 'https://i.pravatar.cc/300?u=1afa896f-eb90-41bf-a4d9-3a1b760c643a',
  online = true,
  mutual_interest = true
WHERE id = '1afa896f-eb90-41bf-a4d9-3a1b760c643a';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Teknik Elektro',
  role = 'Frontend Developer',
  main_skill = 'React',
  skills = '[{"name":"React","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Frontend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Frontend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=04a5af40-2829-4baa-b0b2-32c2007f4e0a',
  online = true,
  mutual_interest = true
WHERE id = '04a5af40-2829-4baa-b0b2-32c2007f4e0a';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ilmu Terapan',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Backend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Backend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=21aa77da-cacb-4487-aad9-19b3f83cf5bd',
  online = true,
  mutual_interest = true
WHERE id = '21aa77da-cacb-4487-aad9-19b3f83cf5bd';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Komunikasi Sosial',
  role = 'Content Creator',
  main_skill = 'Copywriting',
  skills = '[{"name":"Copywriting","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Content Creator ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Content Creator',
  avatar_url = 'https://i.pravatar.cc/300?u=c3c6ee41-2ecb-44de-b9c3-7da50fd0327b',
  online = true,
  mutual_interest = true
WHERE id = 'c3c6ee41-2ecb-44de-b9c3-7da50fd0327b';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Informatika',
  role = 'UI/UX Designer',
  main_skill = 'Figma',
  skills = '[{"name":"Figma","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate UI/UX Designer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead UI/UX Designer',
  avatar_url = 'https://i.pravatar.cc/300?u=dd6b881d-d152-43cb-ac6a-7a4f56f17648',
  online = true,
  mutual_interest = true
WHERE id = 'dd6b881d-d152-43cb-ac6a-7a4f56f17648';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Komunikasi Sosial',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Backend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Backend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=95a62a3f-7327-4d50-a8ef-1e407c00ca25',
  online = true,
  mutual_interest = true
WHERE id = '95a62a3f-7327-4d50-a8ef-1e407c00ca25';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ilmu Terapan',
  role = 'Content Creator',
  main_skill = 'Copywriting',
  skills = '[{"name":"Copywriting","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Content Creator ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Content Creator',
  avatar_url = 'https://i.pravatar.cc/300?u=0ef06bfe-f136-42e3-bcc1-c1b807b00444',
  online = true,
  mutual_interest = true
WHERE id = '0ef06bfe-f136-42e3-bcc1-c1b807b00444';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Informatika',
  role = 'Data Analyst',
  main_skill = 'Python',
  skills = '[{"name":"Python","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Data Analyst ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Data Analyst',
  avatar_url = 'https://i.pravatar.cc/300?u=89e3a062-24e4-4dd6-a8e9-31cb6f583519',
  online = true,
  mutual_interest = true
WHERE id = '89e3a062-24e4-4dd6-a8e9-31cb6f583519';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Teknik Elektro',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Backend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Backend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=817f836f-7224-4973-aafc-ed967c256b9b',
  online = true,
  mutual_interest = true
WHERE id = '817f836f-7224-4973-aafc-ed967c256b9b';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Komunikasi Sosial',
  role = 'UI/UX Designer',
  main_skill = 'Figma',
  skills = '[{"name":"Figma","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate UI/UX Designer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead UI/UX Designer',
  avatar_url = 'https://i.pravatar.cc/300?u=9fbb7155-7ddf-4016-b2cc-9e225876d2b3',
  online = true,
  mutual_interest = true
WHERE id = '9fbb7155-7ddf-4016-b2cc-9e225876d2b3';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Industri Kreatif',
  role = 'Business Strategist',
  main_skill = 'Market Research',
  skills = '[{"name":"Market Research","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Business Strategist ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Business Strategist',
  avatar_url = 'https://i.pravatar.cc/300?u=536530a0-8d39-4481-891f-b923544bcbe4',
  online = true,
  mutual_interest = true
WHERE id = '536530a0-8d39-4481-891f-b923544bcbe4';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Rekayasa Industri',
  role = 'Data Analyst',
  main_skill = 'Python',
  skills = '[{"name":"Python","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Data Analyst ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Data Analyst',
  avatar_url = 'https://i.pravatar.cc/300?u=436aac78-6df1-499c-aee7-70a5b058dbb6',
  online = true,
  mutual_interest = true
WHERE id = '436aac78-6df1-499c-aee7-70a5b058dbb6';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Teknik Elektro',
  role = 'Product Manager',
  main_skill = 'Agile',
  skills = '[{"name":"Agile","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Product Manager ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Product Manager',
  avatar_url = 'https://i.pravatar.cc/300?u=511d263f-a906-4263-902a-4582ab6bd279',
  online = true,
  mutual_interest = true
WHERE id = '511d263f-a906-4263-902a-4582ab6bd279';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Rekayasa Industri',
  role = 'Frontend Developer',
  main_skill = 'React',
  skills = '[{"name":"React","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Frontend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Frontend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=cd5b0384-6a98-4415-8ac9-d906075b89c2',
  online = true,
  mutual_interest = true
WHERE id = 'cd5b0384-6a98-4415-8ac9-d906075b89c2';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Informatika',
  role = 'Business Strategist',
  main_skill = 'Market Research',
  skills = '[{"name":"Market Research","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Business Strategist ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Business Strategist',
  avatar_url = 'https://i.pravatar.cc/300?u=c89a8620-ed2d-4b7a-b887-ed14602563e2',
  online = true,
  mutual_interest = true
WHERE id = 'c89a8620-ed2d-4b7a-b887-ed14602563e2';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ekonomi Bisnis',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Backend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Backend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=b7c6e6b4-d298-4e75-b776-70cbda8ba631',
  online = true,
  mutual_interest = true
WHERE id = 'b7c6e6b4-d298-4e75-b776-70cbda8ba631';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Rekayasa Industri',
  role = 'Frontend Developer',
  main_skill = 'React',
  skills = '[{"name":"React","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Frontend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Frontend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=1d6e7ca9-290e-403e-90dc-c3c0ccaac859',
  online = true,
  mutual_interest = true
WHERE id = '1d6e7ca9-290e-403e-90dc-c3c0ccaac859';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ekonomi Bisnis',
  role = 'Data Analyst',
  main_skill = 'Python',
  skills = '[{"name":"Python","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Data Analyst ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Data Analyst',
  avatar_url = 'https://i.pravatar.cc/300?u=a2a3c0fc-43c2-4a32-bf60-16a1eea34614',
  online = true,
  mutual_interest = true
WHERE id = 'a2a3c0fc-43c2-4a32-bf60-16a1eea34614';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ekonomi Bisnis',
  role = 'Product Manager',
  main_skill = 'Agile',
  skills = '[{"name":"Agile","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Product Manager ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Product Manager',
  avatar_url = 'https://i.pravatar.cc/300?u=d21acf8a-13d8-48e6-8af3-70e4dc407980',
  online = true,
  mutual_interest = true
WHERE id = 'd21acf8a-13d8-48e6-8af3-70e4dc407980';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Rekayasa Industri',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Backend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Backend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=e4081ba0-66fc-4320-90a3-35be529dafca',
  online = true,
  mutual_interest = true
WHERE id = 'e4081ba0-66fc-4320-90a3-35be529dafca';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ilmu Terapan',
  role = 'IoT Builder',
  main_skill = 'Arduino',
  skills = '[{"name":"Arduino","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate IoT Builder ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead IoT Builder',
  avatar_url = 'https://i.pravatar.cc/300?u=85980100-6e02-4b79-a3aa-bebb4a2f2834',
  online = true,
  mutual_interest = true
WHERE id = '85980100-6e02-4b79-a3aa-bebb4a2f2834';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Teknik Elektro',
  role = 'IoT Builder',
  main_skill = 'Arduino',
  skills = '[{"name":"Arduino","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate IoT Builder ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead IoT Builder',
  avatar_url = 'https://i.pravatar.cc/300?u=1879b158-87f2-44cc-b5ea-87acd201077f',
  online = true,
  mutual_interest = true
WHERE id = '1879b158-87f2-44cc-b5ea-87acd201077f';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Industri Kreatif',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Backend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Backend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=22cc201e-9d56-4d73-9622-426704f75b09',
  online = true,
  mutual_interest = true
WHERE id = '22cc201e-9d56-4d73-9622-426704f75b09';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Teknik Elektro',
  role = 'Business Strategist',
  main_skill = 'Market Research',
  skills = '[{"name":"Market Research","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Business Strategist ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Business Strategist',
  avatar_url = 'https://i.pravatar.cc/300?u=e4695cb3-b78b-441a-9263-66344efc9635',
  online = true,
  mutual_interest = true
WHERE id = 'e4695cb3-b78b-441a-9263-66344efc9635';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Informatika',
  role = 'Product Manager',
  main_skill = 'Agile',
  skills = '[{"name":"Agile","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Product Manager ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Product Manager',
  avatar_url = 'https://i.pravatar.cc/300?u=cfb86594-7fb8-42f4-93b3-c8b4130c3c3e',
  online = true,
  mutual_interest = true
WHERE id = 'cfb86594-7fb8-42f4-93b3-c8b4130c3c3e';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Komunikasi Sosial',
  role = 'IoT Builder',
  main_skill = 'Arduino',
  skills = '[{"name":"Arduino","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate IoT Builder ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead IoT Builder',
  avatar_url = 'https://i.pravatar.cc/300?u=903d49ab-9dbb-4347-9b34-3c3b5dc69029',
  online = true,
  mutual_interest = true
WHERE id = '903d49ab-9dbb-4347-9b34-3c3b5dc69029';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Teknik Elektro',
  role = 'Business Strategist',
  main_skill = 'Market Research',
  skills = '[{"name":"Market Research","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Business Strategist ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Business Strategist',
  avatar_url = 'https://i.pravatar.cc/300?u=722a972a-782f-4bf5-9ad7-6479d0f54412',
  online = true,
  mutual_interest = true
WHERE id = '722a972a-782f-4bf5-9ad7-6479d0f54412';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Industri Kreatif',
  role = 'IoT Builder',
  main_skill = 'Arduino',
  skills = '[{"name":"Arduino","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate IoT Builder ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead IoT Builder',
  avatar_url = 'https://i.pravatar.cc/300?u=2bf6ec9a-8513-432b-a90b-e39c2878f6e1',
  online = true,
  mutual_interest = true
WHERE id = '2bf6ec9a-8513-432b-a90b-e39c2878f6e1';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Komunikasi Sosial',
  role = 'UI/UX Designer',
  main_skill = 'Figma',
  skills = '[{"name":"Figma","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate UI/UX Designer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead UI/UX Designer',
  avatar_url = 'https://i.pravatar.cc/300?u=ff23c59f-bcb2-44f4-9dd2-c560d86a9cc9',
  online = true,
  mutual_interest = true
WHERE id = 'ff23c59f-bcb2-44f4-9dd2-c560d86a9cc9';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ekonomi Bisnis',
  role = 'Product Manager',
  main_skill = 'Agile',
  skills = '[{"name":"Agile","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Product Manager ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Product Manager',
  avatar_url = 'https://i.pravatar.cc/300?u=974d89b5-a2d8-4fe4-8f45-a45de4fbc348',
  online = true,
  mutual_interest = true
WHERE id = '974d89b5-a2d8-4fe4-8f45-a45de4fbc348';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Ilmu Terapan',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Backend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Backend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=613ae022-9dd4-46fe-af36-1b0f236cbcf5',
  online = true,
  mutual_interest = true
WHERE id = '613ae022-9dd4-46fe-af36-1b0f236cbcf5';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'Fakultas Informatika',
  role = 'Frontend Developer',
  main_skill = 'React',
  skills = '[{"name":"React","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate Frontend Developer ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead Frontend Developer',
  avatar_url = 'https://i.pravatar.cc/300?u=1a6c37c6-5bea-4570-99bb-637db319322b',
  online = true,
  mutual_interest = true
WHERE id = '1a6c37c6-5bea-4570-99bb-637db319322b';
