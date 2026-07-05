-- ============================================================================
-- Moots - Schema additions round 5
-- Run this whole script once in the Supabase SQL Editor (idempotent).
-- Resolves incoming match requests on the server so approve/reject never relies
-- on client-side deletes succeeding under RLS.
-- ============================================================================

create or replace function public.respond_to_match_request(
  target uuid,
  approved boolean
)
returns void
language plpgsql
security definer
as $$
declare
  requester uuid := target;
  responder uuid := auth.uid();
  user_a uuid;
  user_b uuid;
begin
  if responder is null or requester is null or responder = requester then
    raise exception 'Invalid match response';
  end if;

  user_a := least(responder, requester);
  user_b := greatest(responder, requester);

  if approved then
    insert into public.swipes (swiper_id, swiped_id, action)
    values (responder, requester, 'interest')
    on conflict (swiper_id, swiped_id)
    do update set action = excluded.action;

    update public.matches
      set status = 'accepted'
      where user_a_id = user_a
        and user_b_id = user_b
        and status = 'pending';
  else
    insert into public.swipes (swiper_id, swiped_id, action)
    values (responder, requester, 'pass')
    on conflict (swiper_id, swiped_id)
    do update set action = excluded.action;

    delete from public.matches
      where user_a_id = user_a
        and user_b_id = user_b
        and status = 'pending';
  end if;

  delete from public.notifications
    where user_id = responder
      and type = 'match_request'
      and actor_id = requester;
end;
$$;
