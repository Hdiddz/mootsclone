-- ============================================================================
-- Moots — Schema additions for changes1.md (v2)
-- Run this whole script ONCE in the Supabase SQL Editor.
-- It is idempotent (safe to re-run): it uses IF NOT EXISTS / OR REPLACE and
-- drops policies/triggers before recreating them.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- #6  GROUP CHAT: notify members when they are added to a group
-- ----------------------------------------------------------------------------
create or replace function public.notify_group_member()
returns trigger as $$
declare
  g_title text;
  creator_id uuid;
  creator_name text;
begin
  select title, created_by into g_title, creator_id
  from public.chat_groups where id = new.group_id;

  -- Don't notify the creator about their own membership row.
  if new.user_id = creator_id then
    return new;
  end if;

  select name into creator_name from public.profiles where id = creator_id;

  insert into public.notifications (user_id, type, title, body, read)
  values (
    new.user_id,
    'group_added',
    'Added to a group',
    coalesce(creator_name, 'Someone') || ' added you to the group "' ||
      coalesce(g_title, 'New group') || '". Open it from the chat bubble.',
    false
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_group_member_added on public.chat_group_members;
create trigger on_group_member_added
  after insert on public.chat_group_members
  for each row execute function public.notify_group_member();


-- ----------------------------------------------------------------------------
-- #16 GROUP ADMIN: role column on members + leave/delete handled by RLS
-- ----------------------------------------------------------------------------
alter table public.chat_group_members
  add column if not exists role text not null default 'member'
  check (role in ('member', 'admin'));

-- Allow members to leave a group (delete their own membership) and creators to
-- remove members.
drop policy if exists "Allow members to leave or be removed" on public.chat_group_members;
create policy "Allow members to leave or be removed"
  on public.chat_group_members for delete
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.chat_groups g
      where g.id = chat_group_members.group_id
        and g.created_by = auth.uid()
    )
  );

-- Allow updating member role (creator only).
drop policy if exists "Allow creator to update member role" on public.chat_group_members;
create policy "Allow creator to update member role"
  on public.chat_group_members for update
  using (
    exists (
      select 1 from public.chat_groups g
      where g.id = chat_group_members.group_id
        and g.created_by = auth.uid()
    )
  );

-- Allow the group creator (owner) to delete the whole group.
drop policy if exists "Allow creator to delete group" on public.chat_groups;
create policy "Allow creator to delete group"
  on public.chat_groups for delete
  using (auth.uid() = created_by);


-- ----------------------------------------------------------------------------
-- #16 PER-USER CHAT CLEAR: each user can clear their own view of a conversation
-- without affecting the other participant. We store a "cleared up to" cutoff.
-- ----------------------------------------------------------------------------
create table if not exists public.chat_clears (
  user_id uuid references public.profiles(id) on delete cascade not null,
  -- conversation key: either a match id or a group id (stored as text)
  conversation_id text not null,
  cleared_at timestamptz default now() not null,
  primary key (user_id, conversation_id)
);

alter table public.chat_clears enable row level security;

drop policy if exists "Users manage their own chat clears" on public.chat_clears;
create policy "Users manage their own chat clears"
  on public.chat_clears for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ----------------------------------------------------------------------------
-- #18 REPORTS
-- ----------------------------------------------------------------------------
create table if not exists public.user_reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  reported_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  details text,
  created_at timestamptz default now() not null
);

alter table public.user_reports enable row level security;

drop policy if exists "Users can create reports" on public.user_reports;
create policy "Users can create reports"
  on public.user_reports for insert
  with check (auth.uid() = reporter_id);

drop policy if exists "Users can view their own reports" on public.user_reports;
create policy "Users can view their own reports"
  on public.user_reports for select
  using (auth.uid() = reporter_id);


-- ----------------------------------------------------------------------------
-- #18 BLOCKED USERS
-- ----------------------------------------------------------------------------
create table if not exists public.blocked_users (
  blocker_id uuid references public.profiles(id) on delete cascade not null,
  blocked_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (blocker_id, blocked_id)
);

alter table public.blocked_users enable row level security;

drop policy if exists "Users manage their own blocks" on public.blocked_users;
create policy "Users manage their own blocks"
  on public.blocked_users for all
  using (auth.uid() = blocker_id)
  with check (auth.uid() = blocker_id);


-- ----------------------------------------------------------------------------
-- #9  PROFILE ACTIVITY POSTS (LinkedIn-style feed) + likes + comments
-- ----------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  caption text,
  image_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.posts enable row level security;

drop policy if exists "Posts are publicly readable" on public.posts;
create policy "Posts are publicly readable"
  on public.posts for select using (true);

drop policy if exists "Users manage their own posts" on public.posts;
create policy "Users manage their own posts"
  on public.posts for all
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create table if not exists public.post_likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;

drop policy if exists "Likes are publicly readable" on public.post_likes;
create policy "Likes are publicly readable"
  on public.post_likes for select using (true);

drop policy if exists "Users manage their own likes" on public.post_likes;
create policy "Users manage their own likes"
  on public.post_likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamptz default now() not null
);

alter table public.post_comments enable row level security;

drop policy if exists "Comments are publicly readable" on public.post_comments;
create policy "Comments are publicly readable"
  on public.post_comments for select using (true);

drop policy if exists "Users manage their own comments" on public.post_comments;
create policy "Users manage their own comments"
  on public.post_comments for all
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);


-- ----------------------------------------------------------------------------
-- #9  PROFILE CONTENT: about + education columns (experiences/portfolio/skills
-- already exist on profiles as jsonb).
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists about text,
  add column if not exists education jsonb default '[]'::jsonb;


-- ----------------------------------------------------------------------------
-- REALTIME: publish the new tables
-- ----------------------------------------------------------------------------
do $$
begin
  begin alter publication supabase_realtime add table public.posts; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.post_likes; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.post_comments; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.blocked_users; exception when duplicate_object then null; end;
end $$;


-- ----------------------------------------------------------------------------
-- STORAGE: bucket for activity post images (public read).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read post images" on storage.objects;
create policy "Public read post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "Users upload their own post images" on storage.objects;
create policy "Users upload their own post images"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

drop policy if exists "Users delete their own post images" on storage.objects;
create policy "Users delete their own post images"
  on storage.objects for delete
  using (bucket_id = 'post-images' and owner = auth.uid());

-- Done.
