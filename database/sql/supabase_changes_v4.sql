-- ============================================================================
-- Moots — Schema additions round 4
-- Run this whole script ONCE in the Supabase SQL Editor (idempotent).
-- Adds notifications.actor_id so a "wants to match with you" notification knows
-- WHO sent it, letting the recipient open that person's profile to approve.
-- ============================================================================

alter table public.notifications
  add column if not exists actor_id uuid references public.profiles(id) on delete cascade;

-- Recreate the mutual-match trigger so the match_request notification records
-- the requester (new.swiper_id) as actor_id. Only the target (new.swiped_id)
-- receives it.
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

      insert into public.notifications (user_id, type, title, body, read, actor_id)
      values
        (new.swiper_id, 'match', 'New Match!', 'You matched with ' || coalesce(swiped_name, 'someone') || '!', false, new.swiped_id),
        (new.swiped_id, 'match', 'New Match!', 'You matched with ' || coalesce(swiper_name, 'someone') || '!', false, new.swiper_id);
    else
      insert into public.notifications (user_id, type, title, body, read, actor_id)
      select
        new.swiped_id,
        'match_request',
        'Someone wants to match with you',
        coalesce(swiper_name, 'Someone') || ' wants to match with you. Open their profile to approve.',
        false,
        new.swiper_id
      where not exists (
        select 1 from public.notifications
        where user_id = new.swiped_id
          and type = 'match_request'
          and read = false
          and actor_id = new.swiper_id
      );
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Recreate the manual request RPC to record actor_id too.
create or replace function public.create_match_request(requester_id uuid, target_id uuid)
returns void as $$
declare
  requester_name text;
begin
  if auth.uid() <> requester_id then
    raise exception 'Only the requester can create this request';
  end if;

  select name into requester_name from public.profiles where id = requester_id;

  insert into public.notifications (user_id, type, title, body, read, actor_id)
  select
    target_id,
    'match_request',
    'Someone wants to match with you',
    coalesce(requester_name, 'Someone') || ' wants to match with you. Open their profile to approve.',
    false,
    requester_id
  where not exists (
    select 1 from public.notifications
    where user_id = target_id
      and type = 'match_request'
      and read = false
      and actor_id = requester_id
  );
end;
$$ language plpgsql security definer;

-- Done.
