-- accept_meeting could never run.
--
-- The conflict check was `select count(*) ... for update`, which Postgres
-- rejects outright: "FOR UPDATE is not allowed with aggregate functions".
-- The function therefore raised on every call, and the API route treated any
-- raise as "RPC unavailable" and fell through to its in-app fallback. The
-- race-safe path advertised in that route has never once executed.
--
-- Two things change. The lock is taken on rows rather than on an aggregate:
-- an advisory lock keyed on the invitee, which is what actually serialises
-- the case that matters -- two different meetings being accepted into the
-- same window for the same person -- plus a row lock on the meeting being
-- accepted, for two people racing on the same one. And the status is checked
-- under that lock, so a meeting already resolved is reported rather than
-- silently overwritten.

create or replace function public.accept_meeting(p_meeting_id uuid, p_slot jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invitee uuid;
  v_status text;
  v_slot_start timestamptz;
  v_slot_end timestamptz;
  v_conflicts int;
begin
  v_slot_start := (p_slot->>'start')::timestamptz;
  v_slot_end   := (p_slot->>'end')::timestamptz;

  if v_slot_start is null or v_slot_end is null or v_slot_start >= v_slot_end then
    return jsonb_build_object('success', false, 'reason', 'invalid_slot');
  end if;

  select invitee_id, status into v_invitee, v_status
  from public.meetings
  where id = p_meeting_id
  for update;

  if v_invitee is null then
    return jsonb_build_object('success', false, 'reason', 'meeting_not_found');
  end if;

  -- Held to the end of the transaction. Anyone else accepting a meeting for
  -- this same invitee waits here, so the conflict count below cannot be read
  -- while another session is between its own count and its own update.
  perform pg_advisory_xact_lock(hashtextextended(v_invitee::text, 0));

  if v_status <> 'pending' then
    return jsonb_build_object('success', false, 'reason', 'already_resolved');
  end if;

  select count(*) into v_conflicts
  from public.meetings
  where invitee_id = v_invitee
    and status = 'accepted'
    and id <> p_meeting_id
    and (accepted_slot->>'start')::timestamptz < v_slot_end
    and (accepted_slot->>'end')::timestamptz   > v_slot_start;

  if v_conflicts > 0 then
    return jsonb_build_object('success', false, 'reason', 'slot_conflict');
  end if;

  update public.meetings
     set status = 'accepted',
         accepted_slot = p_slot
   where id = p_meeting_id
     and status = 'pending';

  if not found then
    return jsonb_build_object('success', false, 'reason', 'race');
  end if;

  return jsonb_build_object('success', true);
end;
$$;
