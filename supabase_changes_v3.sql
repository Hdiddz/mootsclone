-- ============================================================================
-- Moots — Schema additions round 3
-- Run this whole script ONCE in the Supabase SQL Editor (idempotent).
-- Adds "pending" (follow-requested) matches so a user can start chatting
-- before the other person follows back, while the match shows as requested.
-- ============================================================================

-- 1. Status on matches: existing rows stay 'accepted'; new follow requests are
--    'pending' until the other person follows back.
alter table public.matches
  add column if not exists status text not null default 'accepted';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'matches_status_check'
  ) then
    alter table public.matches
      add constraint matches_status_check check (status in ('pending', 'accepted'));
  end if;
end $$;

-- 2. RPC: create (or fetch) a pending match between the caller and a target.
--    SECURITY DEFINER because clients cannot INSERT into matches directly.
create or replace function public.create_pending_match(target uuid)
returns uuid as $$
declare
  requester uuid := auth.uid();
  a uuid;
  b uuid;
  mid uuid;
begin
  if requester is null or requester = target then
    raise exception 'Invalid match request';
  end if;

  a := least(requester, target);
  b := greatest(requester, target);

  insert into public.matches (user_a_id, user_b_id, status)
  values (a, b, 'pending')
  on conflict (user_a_id, user_b_id) do nothing;

  select id into mid from public.matches where user_a_id = a and user_b_id = b;
  return mid;
end;
$$ language plpgsql security definer;

-- 3. When a mutual match forms, promote the (possibly pending) match to accepted.
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
    select exists (
      select 1 from public.swipes
      where swiper_id = new.swiped_id
        and swiped_id = new.swiper_id
        and action = 'interest'
    ) into is_mutual;

    select name into swiper_name from public.profiles where id = new.swiper_id;
    select name into swiped_name from public.profiles where id = new.swiped_id;

    if is_mutual then
      user_a := least(new.swiper_id, new.swiped_id);
      user_b := greatest(new.swiper_id, new.swiped_id);

      insert into public.matches (user_a_id, user_b_id, status)
      values (user_a, user_b, 'accepted')
      on conflict (user_a_id, user_b_id) do update set status = 'accepted'
      returning id into match_id;

      if match_id is null then
        select id into match_id from public.matches
        where user_a_id = user_a and user_b_id = user_b;
      end if;

      insert into public.notifications (user_id, type, title, body, read)
      values
        (new.swiper_id, 'match', 'New Match!', 'You matched with ' || coalesce(swiped_name, 'someone') || '!', false),
        (new.swiped_id, 'match', 'New Match!', 'You matched with ' || coalesce(swiper_name, 'someone') || '!', false);
    else
      insert into public.notifications (user_id, type, title, body, read)
      select
        new.swiped_id,
        'match_request',
        'Someone wants to match with you',
        coalesce(swiper_name, 'Someone') || ' wants to match with you. Approve to open a chat.',
        false
      where not exists (
        select 1 from public.notifications
        where user_id = new.swiped_id
          and type = 'match_request'
          and read = false
          and body ilike '%' || coalesce(swiper_name, '') || '%'
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Done.
