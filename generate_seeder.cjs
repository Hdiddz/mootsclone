const fs = require('fs');

const roles = ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Product Manager', 'Data Analyst', 'IoT Builder', 'Content Creator', 'Business Strategist'];
const skillsMap = {
  'Frontend Developer': ['React', 'Vue', 'TypeScript', 'Tailwind', 'Next.js'],
  'Backend Developer': ['Laravel', 'Node.js', 'PostgreSQL', 'Go', 'Docker'],
  'UI/UX Designer': ['Figma', 'Wireframing', 'Prototyping', 'User Research'],
  'Product Manager': ['Agile', 'Scrum', 'Product Strategy', 'Jira'],
  'Data Analyst': ['Python', 'SQL', 'Tableau', 'Machine Learning'],
  'IoT Builder': ['Arduino', 'C++', 'Raspberry Pi', 'Embedded Systems'],
  'Content Creator': ['Copywriting', 'Video Editing', 'Social Media Strategy'],
  'Business Strategist': ['Market Research', 'Pitch Deck', 'Financial Modeling']
};
const names = ['Budi', 'Siti', 'Andi', 'Rina', 'Eko', 'Dewi', 'Hendra', 'Maya', 'Reza', 'Putri', 'Aditya', 'Nisa', 'Fajar', 'Dian', 'Bayu', 'Ayu', 'Rizky', 'Lestari', 'Surya', 'Melati'];
const faculties = [
  'Fakultas Rekayasa Industri',
  'Fakultas Ilmu Terapan',
  'Fakultas Teknik Elektro',
  'Fakultas Informatika',
  'Fakultas Ekonomi Bisnis',
  'Fakultas Industri Kreatif',
  'Fakultas Komunikasi Sosial'
];
const campuses = ['Telkom University'];

let sqlUsers = 'INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, is_sso_user, is_anonymous) VALUES\n';
let sqlProfiles = '';
let userValues = [];

for(let i = 1; i <= 50; i++) {
  const id = crypto.randomUUID();
  const name = names[Math.floor(Math.random() * names.length)] + ' ' + names[Math.floor(Math.random() * names.length)];
  const email = 'user' + i + '@demo.com';
  const role = roles[Math.floor(Math.random() * roles.length)];
  const mainSkill = skillsMap[role][0];
  const avatar = 'https://i.pravatar.cc/300?u=' + id;
  const campus = campuses[Math.floor(Math.random() * campuses.length)];
  const faculty = faculties[Math.floor(Math.random() * faculties.length)];
  
  userValues.push(`('${id}', 'authenticated', 'authenticated', '${email}', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider": "email", "providers": ["email"]}', '{"name": "${name}"}', false, false, false)`);
  
  sqlProfiles += `
UPDATE public.profiles SET
  campus = '${campus}',
  program = '${faculty}',
  role = '${role}',
  main_skill = '${mainSkill}',
  skills = '[{"name":"${mainSkill}","category":"Development","level":"Advanced"}]'::jsonb,
  profile_summary = 'Passionate ${role} ready to build cool startups.',
  experience_summary = 'Worked on several campus projects and assignments.',
  looking_for = '[]'::jsonb,
  availability = 'available',
  collaboration_goals = '["Startup prototype"]'::jsonb,
  portfolio_links = '[]'::jsonb,
  preferred_role = 'Lead ${role}',
  avatar_url = '${avatar}',
  online = true,
  mutual_interest = true
WHERE id = '${id}';
`;
}

fs.writeFileSync('seed_massive.sql', sqlUsers + userValues.join(',\n') + '\nON CONFLICT (id) DO NOTHING;\n' + sqlProfiles);
console.log('Done generating seed_massive.sql');
