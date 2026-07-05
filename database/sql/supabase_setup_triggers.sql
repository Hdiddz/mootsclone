-- ============================================================================
-- Moots — Auth Triggers
-- Run this ONCE in the Supabase SQL Editor.
--
-- This creates the `handle_new_user` trigger that automatically inserts a row
-- into public.profiles whenever a new user signs up (email OR Google OAuth).
-- Without this trigger, Google sign-in users will have no profile row and
-- the app will loop trying to load their profile.
-- ============================================================================

-- Function: auto-create a profiles row when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url, created_at, updated_at)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      null
    ),
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop old trigger if exists, then re-create
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Done. Every new sign-up (email or Google OAuth) will now automatically
-- have a row in public.profiles.
