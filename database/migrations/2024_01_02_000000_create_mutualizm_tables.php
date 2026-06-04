<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('avatar_url')->nullable();
            $table->string('cover_url')->nullable();
            $table->string('role')->nullable();
            $table->string('main_skill')->nullable();
            $table->text('bio')->nullable();
            $table->text('experience_summary')->nullable();
            $table->json('looking_for')->nullable();
            $table->string('availability')->default('available');
            $table->string('campus')->default('Telkom University');
            $table->string('faculty')->nullable();
            $table->string('program')->nullable();
            $table->json('portfolio_links')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->string('language')->default('en');
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('category')->default('other');
            $table->timestamps();
        });

        Schema::create('profile_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->string('level')->default('intermediate');
            $table->unique(['profile_id', 'skill_id']);
        });

        Schema::create('swipes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('swiper_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('swiped_id')->constrained('users')->cascadeOnDelete();
            $table->enum('action', ['pass', 'interest', 'save']);
            $table->timestamps();
            $table->unique(['swiper_id', 'swiped_id']);
        });

        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_a_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('user_b_id')->constrained('users')->cascadeOnDelete();
            $table->json('match_summary')->nullable();
            $table->timestamps();
            $table->unique(['user_a_id', 'user_b_id']);
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->text('text');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->index(['match_id', 'created_at']);
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('creator_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('summary')->nullable();
            $table->string('status')->default('open');
            $table->date('deadline')->nullable();
            $table->json('needed_roles')->nullable();
            $table->json('skills_needed')->nullable();
            $table->timestamps();
        });

        Schema::create('project_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role')->nullable();
            $table->timestamps();
            $table->unique(['project_id', 'user_id']);
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('title');
            $table->text('body')->nullable();
            $table->json('data')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('project_members');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('matches');
        Schema::dropIfExists('swipes');
        Schema::dropIfExists('profile_skills');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('profiles');
    }
};
