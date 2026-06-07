-- Supabase Database Schema for Moots
-- Copy and paste this script into the Supabase SQL Editor to initialize all tables, RLS policies, triggers, and functions.

-- Drop existing tables from Laravel migration to avoid uuid vs bigint type conflicts
drop table if exists public.ai_conversations cascade;
drop table if exists public.notifications cascade;
drop table if exists public.messages cascade;
drop table if exists public.matches cascade;
drop table if exists public.swipes cascade;
drop table if exists public.profile_skills cascade;
drop table if exists public.skills cascade;
drop table if exists public.profiles cascade;

-- Enable uuid-ossp extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  campus text,
  program text,
  role text,
  main_skill text,
  skills jsonb default '[]'::jsonb,
  profile_summary text,
  experience_summary text,
  experiences jsonb default '[]'::jsonb,
  looking_for jsonb default '[]'::jsonb,
  availability text default 'available',
  availability_detail text,
  collaboration_goals jsonb default '[]'::jsonb,
  portfolio_links jsonb default '[]'::jsonb,
  preferred_role text,
  suggested_message text,
  accent text default 'accent-indigo',
  avatar_url text,
  avatar_position text,
  status_label text,
  online boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Allow public read access to profiles" 
  on public.profiles for select 
  using (true);

create policy "Allow users to update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Allow users to insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- Trigger to create profile when auth.users is created
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, accent)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'accent-indigo'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger if exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. SWIPES TABLE
create table public.swipes (
  id bigint generated always as identity primary key,
  swiper_id uuid references public.profiles(id) on delete cascade not null,
  swiped_id uuid references public.profiles(id) on delete cascade not null,
  action text not null check (action in ('pass', 'interest', 'save')),
  created_at timestamptz default now() not null,
  constraint unique_swipe unique (swiper_id, swiped_id)
);

-- Enable RLS on swipes
alter table public.swipes enable row level security;

-- Policies for swipes
create policy "Allow users to view their own swipes" 
  on public.swipes for select 
  using (auth.uid() = swiper_id);

create policy "Allow users to insert their own swipes" 
  on public.swipes for insert 
  with check (auth.uid() = swiper_id);

create policy "Allow users to update their own swipes" 
  on public.swipes for update 
  using (auth.uid() = swiper_id);

create policy "Allow users to delete their own swipes" 
  on public.swipes for delete 
  using (auth.uid() = swiper_id);


-- 3. MATCHES TABLE
create table public.matches (
  id uuid default gen_random_uuid() primary key,
  user_a_id uuid references public.profiles(id) on delete cascade not null,
  user_b_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  constraint unique_match_pair unique (user_a_id, user_b_id),
  constraint user_a_less_than_user_b check (user_a_id < user_b_id)
);

-- Enable RLS on matches
alter table public.matches enable row level security;

-- Policies for matches
create policy "Allow users to select matches they are part of" 
  on public.matches for select 
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);

create policy "Allow users to delete matches they are part of" 
  on public.matches for delete 
  using (auth.uid() = user_a_id or auth.uid() = user_b_id);


-- 4. MESSAGES TABLE
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  match_id uuid references public.matches(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS on messages
alter table public.messages enable row level security;

-- Policies for messages
create policy "Allow users to select messages in their matches" 
  on public.messages for select 
  using (
    exists (
      select 1 from public.matches m
      where m.id = match_id 
        and (m.user_a_id = auth.uid() or m.user_b_id = auth.uid())
    )
  );

create policy "Allow users to insert messages in their matches" 
  on public.messages for insert 
  with check (
    auth.uid() = sender_id 
    and exists (
      select 1 from public.matches m
      where m.id = match_id 
        and (m.user_a_id = auth.uid() or m.user_b_id = auth.uid())
    )
  );


-- 5. NOTIFICATIONS TABLE
create table public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  body text not null,
  read boolean default false not null,
  created_at timestamptz default now() not null
);

-- Enable RLS on notifications
alter table public.notifications enable row level security;

-- Policies for notifications
create policy "Allow users to select their own notifications" 
  on public.notifications for select 
  using (auth.uid() = user_id);

create policy "Allow users to update their own notifications" 
  on public.notifications for update 
  using (auth.uid() = user_id);

create policy "Allow users to delete their own notifications" 
  on public.notifications for delete 
  using (auth.uid() = user_id);


-- 6. AI CONVERSATIONS TABLE
create table public.ai_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  message text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS on ai_conversations
alter table public.ai_conversations enable row level security;

-- Policies for ai_conversations
create policy "Allow users to select their own ai_conversations" 
  on public.ai_conversations for select 
  using (auth.uid() = user_id);

create policy "Allow users to insert their own ai_conversations" 
  on public.ai_conversations for insert 
  with check (auth.uid() = user_id);

create policy "Allow users to delete their own ai_conversations" 
  on public.ai_conversations for delete 
  using (auth.uid() = user_id);


-- 7. MUTUAL MATCH TRIGGER FUNCTION
create or replace function public.check_mutual_match()
returns trigger as $$
declare
  is_mutual boolean;
  user_a uuid;
  user_b uuid;
  match_id uuid;
  swiper_name text;
  swiped_name text;
begin
  if new.action = 'interest' then
    -- Check if the other user has also swiped interest on this user
    select exists (
      select 1 from public.swipes
      where swiper_id = new.swiped_id
        and swiped_id = new.swiper_id
        and action = 'interest'
    ) into is_mutual;

    if is_mutual then
      user_a := least(new.swiper_id, new.swiped_id);
      user_b := greatest(new.swiper_id, new.swiped_id);
      
      -- Insert match if not exists
      insert into public.matches (user_a_id, user_b_id)
      values (user_a, user_b)
      on conflict (user_a_id, user_b_id) do nothing
      returning id into match_id;

      -- If we didn't return a match_id due to conflict/nothing, query it
      if match_id is null then
        select id into match_id from public.matches 
        where user_a_id = user_a and user_b_id = user_b;
      end if;

      -- Get names for notifications
      select name into swiper_name from public.profiles where id = new.swiper_id;
      select name into swiped_name from public.profiles where id = new.swiped_id;

      -- Create notifications for both users
      insert into public.notifications (user_id, type, title, body, read)
      values 
        (new.swiper_id, 'match', 'New Match!', 'You matched with ' || coalesce(swiped_name, 'someone') || '!', false),
        (new.swiped_id, 'match', 'New Match!', 'You matched with ' || coalesce(swiper_name, 'someone') || '!', false);
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger if exists
drop trigger if exists on_swipe_created on public.swipes;
create trigger on_swipe_created
  after insert or update on public.swipes
  for each row execute function public.check_mutual_match();


-- 8. REALTIME SETUP
-- Add the tables to the supabase_realtime publication
alter publication supabase_realtime add table public.matches;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.ai_conversations;


-- 9. SIMULATE MUTUAL MATCH RPC
create or replace function public.simulate_mutual_match(user_id uuid, candidate_id uuid)
returns void as $$
begin
  insert into public.swipes (swiper_id, swiped_id, action)
  values (candidate_id, user_id, 'interest')
  on conflict (swiper_id, swiped_id) do update set action = 'interest';
end;
$$ language plpgsql security definer;

