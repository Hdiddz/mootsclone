<?php

namespace Database\Seeders;

use App\Models\AppNotification;
use App\Models\Message;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Skill;
use App\Models\User;
use App\Models\UserMatch;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('hadidpassword');

        $hadid = User::updateOrCreate(
            ['email' => 'student@telkomuniversity.ac.id'],
            ['name' => 'Hadid Arkan', 'password' => $password]
        );

        $this->profile($hadid, [
            'role' => 'Frontend Developer',
            'main_skill' => 'React',
            'bio' => 'Frontend-focused student building clean web prototypes for campus innovation and competitions.',
            'experience_summary' => 'Built responsive dashboards, landing pages, and prototype flows using React and Laravel-ready UI patterns.',
            'looking_for' => ['UI/UX Designer', 'Backend Developer', 'Pitch Deck Writer'],
            'availability' => 'available',
            'program' => 'S1 Informatika',
            'portfolio_links' => [
                ['label' => 'GitHub', 'url' => 'https://github.com/'],
                ['label' => 'Portfolio', 'url' => 'https://example.com/'],
            ],
            'is_verified' => true,
        ], ['React' => 'project-ready', 'TypeScript' => 'advanced', 'Laravel' => 'intermediate', 'Figma' => 'intermediate']);

        $demoUsers = [
            [
                'name' => 'Naya Prameswari',
                'email' => 'naya.prameswari@telkomuniversity.ac.id',
                'profile' => [
                    'role' => 'UI/UX Designer',
                    'main_skill' => 'Figma',
                    'bio' => 'Designs research-backed mobile and web flows for student product teams.',
                    'experience_summary' => 'Led wireframes, prototypes, and usability testing for a campus marketplace concept.',
                    'looking_for' => ['Frontend Developer', 'Business Strategist'],
                    'availability' => 'available',
                    'program' => 'S1 Desain Komunikasi Visual',
                    'is_verified' => true,
                ],
                'skills' => ['Figma' => 'project-ready', 'UI/UX Design' => 'advanced', 'User Research' => 'advanced', 'Prototyping' => 'advanced'],
            ],
            [
                'name' => 'Rafi Mahendra',
                'email' => 'rafi.mahendra@telkomuniversity.ac.id',
                'profile' => [
                    'role' => 'Backend Developer',
                    'main_skill' => 'Laravel',
                    'bio' => 'Builds APIs, auth flows, and deployment-ready backend services for student prototypes.',
                    'experience_summary' => 'Implemented REST APIs and database schemas for organization event systems.',
                    'looking_for' => ['Frontend Developer', 'UI/UX Designer'],
                    'availability' => 'limited',
                    'program' => 'S1 Rekayasa Perangkat Lunak',
                    'is_verified' => true,
                ],
                'skills' => ['Laravel' => 'advanced', 'PHP' => 'advanced', 'Node.js' => 'intermediate', 'Project Management' => 'intermediate'],
            ],
            [
                'name' => 'Alya Putri',
                'email' => 'alya.putri@telkomuniversity.ac.id',
                'profile' => [
                    'role' => 'Business Strategist',
                    'main_skill' => 'Business Strategy',
                    'bio' => 'Turns prototype ideas into clear validation plans, pitch decks, and competition stories.',
                    'experience_summary' => 'Prepared market research and pitch materials for a top campus innovation finalist.',
                    'looking_for' => ['Frontend Developer', 'UI/UX Designer'],
                    'availability' => 'available',
                    'program' => 'S1 Manajemen Bisnis Telekomunikasi Informatika',
                    'is_verified' => false,
                ],
                'skills' => ['Business Strategy' => 'project-ready', 'Pitching' => 'advanced', 'Marketing' => 'intermediate', 'Data Analysis' => 'intermediate'],
            ],
            [
                'name' => 'Dimas Wicaksono',
                'email' => 'dimas.wicaksono@telkomuniversity.ac.id',
                'profile' => [
                    'role' => 'Data Analyst',
                    'main_skill' => 'Python',
                    'bio' => 'Creates data dashboards and simple machine learning baselines for product validation.',
                    'experience_summary' => 'Built survey analytics and dashboard prototypes for research and competition teams.',
                    'looking_for' => ['Frontend Developer', 'Business Strategist'],
                    'availability' => 'busy',
                    'program' => 'S1 Data Sains',
                    'is_verified' => false,
                ],
                'skills' => ['Python' => 'advanced', 'Data Analysis' => 'advanced', 'Machine Learning' => 'intermediate', 'Public Speaking' => 'intermediate'],
            ],
        ];

        foreach ($demoUsers as $demoUser) {
            $user = User::updateOrCreate(
                ['email' => $demoUser['email']],
                ['name' => $demoUser['name'], 'password' => $password]
            );
            $this->profile($user, $demoUser['profile'], $demoUser['skills']);
        }

        $naya = User::where('email', 'naya.prameswari@telkomuniversity.ac.id')->first();
        $rafi = User::where('email', 'rafi.mahendra@telkomuniversity.ac.id')->first();

        if ($naya) {
            $match = UserMatch::firstOrCreate(
                ['user_a_id' => min($hadid->id, $naya->id), 'user_b_id' => max($hadid->id, $naya->id)],
                ['match_summary' => ['React and Figma cover prototype delivery.', 'Both profiles mention startup prototype collaboration.']]
            );

            Message::firstOrCreate([
                'match_id' => $match->id,
                'sender_id' => $naya->id,
                'text' => 'Hi Hadid, your React prototype work looks relevant. Want to discuss a competition team?',
            ]);
        }

        if ($rafi) {
            AppNotification::firstOrCreate([
                'user_id' => $hadid->id,
                'type' => 'message',
                'title' => 'Rafi can help with backend',
            ], [
                'body' => 'Rafi is available for API and database integration this weekend.',
                'data' => ['user_id' => $rafi->id],
            ]);
        }

        Project::firstOrCreate([
            'creator_id' => $hadid->id,
            'title' => 'Campus Skill Match Demo',
        ], [
            'summary' => 'A lightweight prototype for matching students by skills, role, availability, and project goals.',
            'status' => 'open',
            'deadline' => now()->addWeeks(3)->toDateString(),
            'needed_roles' => ['UI/UX Designer', 'Backend Developer', 'Business Strategist'],
            'skills_needed' => ['Figma', 'Laravel', 'Pitching'],
        ]);
    }

    private function profile(User $user, array $attributes, array $skills): void
    {
        $profile = Profile::updateOrCreate(
            ['user_id' => $user->id],
            array_merge([
                'campus' => 'Telkom University',
                'faculty' => null,
                'portfolio_links' => [],
                'language' => 'en',
            ], $attributes)
        );

        $sync = collect($skills)->mapWithKeys(function (string $level, string $name) {
            $skill = Skill::firstOrCreate(['name' => $name], ['category' => 'other']);
            return [$skill->id => ['level' => $level]];
        })->all();

        $profile->skills()->sync($sync);
    }
}
