-- ============================================================================
-- Supabase Seeding Script: Mock Candidates
-- Run this in the Supabase SQL Editor.
-- This script will insert the 5 dummy candidates from mockData.ts into 
-- auth.users and public.profiles so they act as real database users.
-- ============================================================================

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Insert into auth.users (This will trigger the handle_new_user trigger and create profile rows)
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, is_sso_user, is_anonymous
) VALUES 
('11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'naya@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Naya Prameswari"}', false, false, false),
('22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'rafi@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Rafi Mahendra"}', false, false, false),
('33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'alya@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Alya Putri"}', false, false, false),
('44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'dimas@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Dimas Wicaksono"}', false, false, false),
('55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'satria@demo.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "Satria Nugraha"}', false, false, false)
ON CONFLICT (id) DO NOTHING;

-- 2. Update the public.profiles with the rich data from mockData.ts
UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'S1 Desain Komunikasi Visual',
  role = 'UI/UX Designer',
  main_skill = 'Figma',
  skills = '[{"name":"Figma","category":"Design","level":"Project-ready"},{"name":"Wireframing","category":"Design","level":"Advanced"},{"name":"Prototyping","category":"Design","level":"Advanced"},{"name":"User Interview","category":"Research","level":"Advanced"}]'::jsonb,
  profile_summary = 'Designs research-backed mobile and web flows for student product teams.',
  experience_summary = 'Led wireframes, prototypes, and usability testing for a campus marketplace concept.',
  experiences = '[{"id":"naya-exp-1","title":"UI/UX Lead","period":"2026","description":"Mapped user flows, produced high-fidelity Figma prototypes, and ran quick usability tests.","organization":"Campus Marketplace Prototype","relatedSkills":["Figma","User Interview","Prototyping"]}]'::jsonb,
  looking_for = '["Frontend Developer", "Business Strategist"]'::jsonb,
  availability = 'available',
  availability_detail = 'Available on weeknights and Saturday morning.',
  collaboration_goals = '["Competition team", "Startup prototype"]'::jsonb,
  portfolio_links = '[{"url":"https://figma.com/","label":"Figma"}]'::jsonb,
  preferred_role = 'Design lead and user testing owner',
  suggested_message = 'Your React skills fit my product flow. Want to plan a quick prototype sprint?',
  avatar_url = '/foto-1.jpg',
  avatar_position = '48% 35%',
  status_label = 'Ready this week',
  accent = '#ec4899',
  online = true,
  mutual_interest = true
WHERE id = '11111111-1111-1111-1111-111111111111';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'S1 Rekayasa Perangkat Lunak',
  role = 'Backend Developer',
  main_skill = 'Laravel',
  skills = '[{"name":"Laravel","category":"Development","level":"Advanced"},{"name":"REST API","category":"Development","level":"Advanced"},{"name":"MySQL","category":"Development","level":"Advanced"},{"name":"Docker","category":"Development","level":"Intermediate"}]'::jsonb,
  profile_summary = 'Builds APIs, auth flows, and deployment-ready backend services for student prototypes.',
  experience_summary = 'Implemented REST APIs and database schemas for organization event systems.',
  experiences = '[{"id":"rafi-exp-1","title":"Backend Developer","period":"2025","description":"Designed database schema and built REST APIs for a student event registration system.","organization":"Event Registration System","relatedSkills":["Laravel","MySQL","REST API"]}]'::jsonb,
  looking_for = '["Frontend Developer", "UI/UX Designer", "Mobile Developer"]'::jsonb,
  availability = 'busy',
  availability_detail = 'Only available for remote collaboration. Full schedule until finals.',
  collaboration_goals = '["Project team", "Startup prototype"]'::jsonb,
  portfolio_links = '[{"url":"https://github.com/","label":"GitHub"}]'::jsonb,
  preferred_role = 'Backend architecture and API integration',
  suggested_message = 'I saw you need a backend developer. I am experienced in Laravel and can help build your APIs.',
  avatar_url = '/foto-2.jpg',
  avatar_position = 'center 30%',
  status_label = 'Finals week',
  accent = '#3b82f6',
  online = false,
  mutual_interest = false
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'S1 Ilmu Komunikasi',
  role = 'Content Creator',
  main_skill = 'Social Media Strategy',
  skills = '[{"name":"Social Media Strategy","category":"Business","level":"Advanced"},{"name":"Copywriting","category":"Content","level":"Project-ready"},{"name":"Video Editing","category":"Content","level":"Intermediate"}]'::jsonb,
  profile_summary = 'Crafts engaging narratives and digital content for campus campaigns and startups.',
  experience_summary = 'Managed social media accounts for student faculty events with 200% engagement growth.',
  experiences = '[{"id":"alya-exp-1","title":"Social Media Manager","period":"2025","description":"Developed content calendars, wrote copy, and managed posting schedules for a faculty event.","organization":"Faculty Festival","relatedSkills":["Social Media Strategy","Copywriting"]}]'::jsonb,
  looking_for = '["Video Editor", "Graphic Designer", "Project Manager"]'::jsonb,
  availability = 'available',
  availability_detail = 'Flexible hours, prefer morning meetings.',
  collaboration_goals = '["Campaign", "Event promotion", "Startup prototype"]'::jsonb,
  portfolio_links = '[{"url":"https://instagram.com/","label":"Instagram"}]'::jsonb,
  preferred_role = 'Content planning and campaign management',
  suggested_message = 'Hi! I love your visual style. Interested in teaming up for the upcoming marketing competition?',
  avatar_url = '/foto-3.jpg',
  avatar_position = 'center 25%',
  status_label = 'Looking for team',
  accent = '#10b981',
  online = true,
  mutual_interest = true
WHERE id = '33333333-3333-3333-3333-333333333333';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'S1 MBTI',
  role = 'Business Analyst',
  main_skill = 'Market Research',
  skills = '[{"name":"Market Research","category":"Business","level":"Advanced"},{"name":"Financial Modeling","category":"Data","level":"Intermediate"},{"name":"Pitch Deck Writing","category":"Communication","level":"Project-ready"}]'::jsonb,
  profile_summary = 'Analyzes market trends and builds viable business models for tech innovations.',
  experience_summary = 'Created business plans and financial projections for a smart-farming IoT startup pitch.',
  experiences = '[{"id":"dimas-exp-1","title":"Business Strategist","period":"2026","description":"Conducted market analysis and drafted the business model canvas for an IoT agriculture pitch.","organization":"Smart Farming Startup Pitch","relatedSkills":["Market Research","Pitch Deck Writing"]}]'::jsonb,
  looking_for = '["IoT Builder", "Hardware Engineer", "Frontend Developer"]'::jsonb,
  availability = 'available',
  availability_detail = 'Free on weekends.',
  collaboration_goals = '["Startup prototype", "Business plan competition"]'::jsonb,
  portfolio_links = '[{"url":"https://linkedin.com/","label":"LinkedIn"}]'::jsonb,
  preferred_role = 'Business strategy and pitching',
  suggested_message = 'I have a strong business case for an IoT idea. Looking for a hardware engineer to build the prototype!',
  avatar_url = '/foto-4.jpg',
  avatar_position = 'center 20%',
  status_label = 'Pitching phase',
  accent = '#f59e0b',
  online = false,
  mutual_interest = false
WHERE id = '44444444-4444-4444-4444-444444444444';

UPDATE public.profiles SET
  campus = 'Telkom University',
  program = 'S1 Teknik Komputer',
  role = 'IoT Builder',
  main_skill = 'Embedded Systems',
  skills = '[{"name":"Embedded Systems","category":"Hardware/IoT","level":"Advanced"},{"name":"Arduino","category":"Hardware/IoT","level":"Advanced"},{"name":"C/C++","category":"Development","level":"Intermediate"},{"name":"Sensor Integration","category":"Hardware/IoT","level":"Project-ready"}]'::jsonb,
  profile_summary = 'Designs and programs microcontrollers for smart environment solutions.',
  experience_summary = 'Prototyped a smart waste management sensor using Arduino and ESP32.',
  experiences = '[{"id":"satria-exp-1","title":"Hardware Engineer","period":"2025","description":"Built a prototype for an automated waste bin with ultrasonic sensors and WiFi connectivity.","organization":"Campus Eco Project","relatedSkills":["Embedded Systems","Arduino","Sensor Integration"]}]'::jsonb,
  looking_for = '["Backend Developer", "Mobile Developer", "Business Strategist"]'::jsonb,
  availability = 'busy',
  availability_detail = 'Busy with lab sessions until 5 PM weekdays.',
  collaboration_goals = '["Innovation program", "Project team"]'::jsonb,
  portfolio_links = '[{"url":"https://github.com/","label":"GitHub"}]'::jsonb,
  preferred_role = 'Hardware design and firmware development',
  suggested_message = 'Your backend skills would be perfect to handle the data from my IoT sensors. Let us chat!',
  avatar_url = '/foto-5.jpg',
  avatar_position = 'center 25%',
  status_label = 'Lab focus',
  accent = '#8b5cf6',
  online = true,
  mutual_interest = true
WHERE id = '55555555-5555-5555-5555-555555555555';
