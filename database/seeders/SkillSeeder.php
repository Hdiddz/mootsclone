<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            ['name' => 'React', 'category' => 'dev'],
            ['name' => 'Laravel', 'category' => 'dev'],
            ['name' => 'TypeScript', 'category' => 'dev'],
            ['name' => 'Python', 'category' => 'dev'],
            ['name' => 'Node.js', 'category' => 'dev'],
            ['name' => 'Flutter', 'category' => 'dev'],
            ['name' => 'IoT', 'category' => 'dev'],
            ['name' => 'Machine Learning', 'category' => 'dev'],
            ['name' => 'Java', 'category' => 'dev'],
            ['name' => 'Go', 'category' => 'dev'],
            ['name' => 'PHP', 'category' => 'dev'],
            ['name' => 'Vue.js', 'category' => 'dev'],
            ['name' => 'Next.js', 'category' => 'dev'],
            ['name' => 'Figma', 'category' => 'design'],
            ['name' => 'UI/UX Design', 'category' => 'design'],
            ['name' => 'Prototyping', 'category' => 'design'],
            ['name' => 'User Research', 'category' => 'design'],
            ['name' => 'Graphic Design', 'category' => 'design'],
            ['name' => 'Motion Design', 'category' => 'design'],
            ['name' => 'Business Strategy', 'category' => 'biz'],
            ['name' => 'Marketing', 'category' => 'biz'],
            ['name' => 'Project Management', 'category' => 'biz'],
            ['name' => 'Pitching', 'category' => 'biz'],
            ['name' => 'Data Analysis', 'category' => 'biz'],
            ['name' => 'Content Writing', 'category' => 'other'],
            ['name' => 'Video Editing', 'category' => 'other'],
            ['name' => 'Photography', 'category' => 'other'],
            ['name' => 'Public Speaking', 'category' => 'other'],
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate(['name' => $skill['name']], $skill);
        }
    }
}
