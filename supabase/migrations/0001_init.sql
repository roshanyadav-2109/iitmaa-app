-- 0001_init.sql — base schema for the IITMAA Sangam backend.
--
-- The Vijayawada repo never had this file: its migrations start at 0002 and
-- `supabase/migrations/.gitkeep` said "0001_init.sql is provided by the
-- project owner separately". The base tables only ever existed inside the
-- live shared project (fncnndrexzmqqengbkvi), so a fresh Supabase project
-- could not be built from that repo at all.
--
-- This file closes that gap. It was reconstructed from the live PanIIT
-- project's catalog on 2026-09-21 and applied to the IITMAA project
-- (zrftldroguntsahfqugu). Structure only — no rows were copied from the
-- PanIIT/Bangalore data.
--
-- Two deliberate departures from the source:
--   * `event_id` column defaults point at the Sangam event
--     (5a9a0000-0000-4000-8000-000000000003) rather than the Bangalore UUID,
--     so a forgotten filter writes Sangam rows instead of another summit's.
--   * The pg_cron session-reminder job is NOT reproduced: it called the
--     Vijayawada Vercel deployment with its own bearer token. Recreate it
--     against the Sangam deployment when one exists.

-- ============ 1. extensions ============
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema public;
create extension if not exists pg_stat_statements with schema extensions;
create extension if not exists pgcrypto with schema extensions;
-- ============ 1. extensions ============
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema public;
create extension if not exists pg_stat_statements with schema extensions;
create extension if not exists pgcrypto with schema extensions;
create extension if not exists supabase_vault with schema vault;
create extension if not exists "uuid-ossp" with schema extensions;

-- ============ 2. tables ============
create table if not exists public.announcements (
  id uuid default gen_random_uuid() not null,
  title text not null,
  body text not null,
  priority text default 'normal'::text,
  audience text default 'all'::text,
  created_by uuid,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.attendee_allowlist (
  email text not null,
  full_name text,
  role text,
  iit_campus text,
  graduation_year integer,
  branch text,
  company text,
  designation text,
  interests text[],
  added_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.availability_blocks (
  id uuid default gen_random_uuid() not null,
  user_id uuid,
  start_at timestamp with time zone not null,
  end_at timestamp with time zone not null,
  reason text,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.availability_slots (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  slot_start timestamp with time zone not null,
  slot_end timestamp with time zone not null,
  status text default 'available'::text not null,
  meeting_id uuid,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.connections (
  user_a uuid not null,
  user_b uuid not null,
  source text,
  note text,
  created_at timestamp with time zone default now()
);
create table if not exists public.conversations (
  id uuid default gen_random_uuid() not null,
  participant_a uuid not null,
  participant_b uuid not null,
  last_message_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);
create table if not exists public.event_participants (
  event_id uuid not null,
  profile_id uuid not null,
  role text,
  joined_at timestamp with time zone default now() not null
);
create table if not exists public.events (
  id uuid not null,
  slug text not null,
  name text not null,
  city text not null,
  starts_on date not null,
  day_start_local time without time zone default '08:00:00'::time without time zone not null,
  day_end_local time without time zone default '21:00:00'::time without time zone not null,
  timezone text default 'Asia/Kolkata'::text not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default now() not null
);
create table if not exists public.exhibitor_team_members (
  id uuid default gen_random_uuid() not null,
  exhibitor_id uuid not null,
  profile_id uuid,
  full_name text not null,
  designation text,
  photo_url text,
  email text,
  linkedin_url text,
  display_order integer default 0,
  created_at timestamp with time zone default now()
);
create table if not exists public.exhibitors (
  id uuid default gen_random_uuid() not null,
  name text not null,
  tagline text,
  about text,
  logo_url text,
  cover_url text,
  website text,
  booth_number text,
  booth_venue_id uuid,
  location_floor text,
  category text,
  social_links jsonb default '{}'::jsonb,
  display_order integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.key_participants (
  id uuid default gen_random_uuid() not null,
  full_name text not null,
  designation text,
  company text,
  photo_url text,
  profile_id uuid,
  display_order integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.meetings (
  id uuid default gen_random_uuid() not null,
  requester_id uuid not null,
  invitee_id uuid not null,
  proposed_slots jsonb not null,
  accepted_slot jsonb,
  status text default 'pending'::text not null,
  message text,
  location text default 'Investor Lounge'::text,
  invitee_message text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  proposed_outside_availability boolean default false not null,
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.messages (
  id uuid default gen_random_uuid() not null,
  conversation_id uuid,
  sender_id uuid,
  body text not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone default now()
);
create table if not exists public.partner_types (
  id uuid default gen_random_uuid() not null,
  name text not null,
  description text,
  display_order integer default 0,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.partners (
  id uuid default gen_random_uuid() not null,
  partner_type_id uuid,
  name text not null,
  logo_url text,
  website text,
  display_order integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.point_events (
  id uuid default gen_random_uuid() not null,
  user_id uuid,
  event_type text not null,
  points integer not null,
  reference_id uuid,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.poll_options (
  id uuid default gen_random_uuid() not null,
  post_id uuid not null,
  label text not null,
  "position" integer default 0 not null,
  vote_count integer default 0 not null
);
create table if not exists public.poll_votes (
  post_id uuid not null,
  user_id uuid not null,
  option_id uuid not null,
  created_at timestamp with time zone default now() not null
);
create table if not exists public.post_comments (
  id uuid default gen_random_uuid() not null,
  post_id uuid not null,
  user_id uuid not null,
  body text not null,
  created_at timestamp with time zone default now() not null
);
create table if not exists public.post_likes (
  post_id uuid not null,
  user_id uuid not null,
  created_at timestamp with time zone default now() not null
);
create table if not exists public.posts (
  id uuid default gen_random_uuid() not null,
  event_id uuid not null,
  author_id uuid not null,
  body text not null,
  kind text default 'text'::text not null,
  like_count integer default 0 not null,
  comment_count integer default 0 not null,
  vote_count integer default 0 not null,
  is_pinned boolean default false not null,
  created_at timestamp with time zone default now() not null,
  media_url text,
  media_type text
);
create table if not exists public.profiles (
  id uuid not null,
  full_name text not null,
  headline text,
  bio text,
  photo_url text,
  role text default 'attendee'::text not null,
  company text,
  designation text,
  iit_campus text,
  graduation_year integer,
  branch text,
  linkedin_url text,
  twitter_url text,
  city text,
  country text default 'India'::text,
  interests text[] default '{}'::text[],
  asks text[] default '{}'::text[],
  offers text[] default '{}'::text[],
  available_for_meetings boolean default true,
  visibility text default 'all'::text,
  office_hours_enabled boolean default false,
  points integer default 0,
  badges text[] default '{}'::text[],
  qr_token text default encode(gen_random_bytes(8), 'hex'::text),
  push_subscription jsonb,
  onboarded boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  email text,
  social_links jsonb default '{}'::jsonb
);
create table if not exists public.push_log (
  user_id uuid not null,
  kind text not null,
  ref_id uuid not null,
  sent_at timestamp with time zone default now() not null
);
create table if not exists public.question_replies (
  id uuid default gen_random_uuid() not null,
  question_id uuid not null,
  user_id uuid not null,
  body text not null,
  is_official boolean default false,
  upvotes integer default 0,
  created_at timestamp with time zone default now()
);
create table if not exists public.question_upvotes (
  question_id uuid not null,
  user_id uuid not null,
  created_at timestamp with time zone default now()
);
create table if not exists public.reply_upvotes (
  reply_id uuid not null,
  user_id uuid not null,
  created_at timestamp with time zone default now()
);
create table if not exists public.session_bookmarks (
  user_id uuid not null,
  session_id uuid not null,
  notify_before_min integer default 10,
  created_at timestamp with time zone default now()
);
create table if not exists public.session_checkins (
  id uuid default gen_random_uuid() not null,
  user_id uuid,
  session_id uuid,
  checked_in_at timestamp with time zone default now()
);
create table if not exists public.session_questions (
  id uuid default gen_random_uuid() not null,
  session_id uuid,
  user_id uuid,
  question text not null,
  upvotes integer default 0,
  is_answered boolean default false,
  created_at timestamp with time zone default now(),
  is_anonymous boolean default false,
  is_pinned boolean default false,
  answered_by uuid,
  answered_at timestamp with time zone,
  status text default 'open'::text
);
create table if not exists public.session_speakers (
  session_id uuid not null,
  speaker_id uuid not null,
  role text default 'speaker'::text
);
create table if not exists public.sessions (
  id uuid default gen_random_uuid() not null,
  title text not null,
  description text,
  track text,
  start_at timestamp with time zone not null,
  end_at timestamp with time zone not null,
  venue_id uuid,
  session_type text,
  capacity integer,
  current_checkins integer default 0,
  is_featured boolean default false,
  livestream_url text,
  created_at timestamp with time zone default now(),
  interests text[],
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.sponsor_visits (
  user_id uuid not null,
  sponsor_id uuid not null,
  visited_at timestamp with time zone default now()
);
create table if not exists public.sponsors (
  id uuid default gen_random_uuid() not null,
  name text not null,
  tier text,
  logo_url text,
  description text,
  website text,
  booth_venue_id uuid,
  booth_number text,
  booth_qr_token text default encode(gen_random_bytes(8), 'hex'::text),
  contact_email text,
  offer_title text,
  offer_description text,
  offer_redeem_code text,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);
create table if not exists public.venues (
  id uuid default gen_random_uuid() not null,
  name text not null,
  floor text,
  capacity integer,
  description text,
  map_x integer,
  map_y integer,
  map_floor integer default 0,
  created_at timestamp with time zone default now(),
  event_id uuid default '5a9a0000-0000-4000-8000-000000000003'::uuid not null
);

-- ============ 3. functions ============
CREATE OR REPLACE FUNCTION public.accept_meeting(p_meeting_id uuid, p_slot jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_invitee uuid;
  v_slot_start timestamptz;
  v_slot_end timestamptz;
  v_conflict_count int;
begin
  v_slot_start := (p_slot->>'start')::timestamptz;
  v_slot_end := (p_slot->>'end')::timestamptz;

  -- Lock the invitee's accepted meetings for the slot window
  select invitee_id into v_invitee from public.meetings where id = p_meeting_id;

  if v_invitee is null then
    return jsonb_build_object('success', false, 'reason', 'meeting_not_found');
  end if;

  -- Check for hard conflicts (another accepted meeting in the same window)
  select count(*) into v_conflict_count
  from public.meetings
  where invitee_id = v_invitee
    and status = 'accepted'
    and id != p_meeting_id
    and (accepted_slot->>'start')::timestamptz < v_slot_end
    and (accepted_slot->>'end')::timestamptz > v_slot_start
  for update;

  if v_conflict_count > 0 then
    return jsonb_build_object('success', false, 'reason', 'slot_conflict');
  end if;

  -- All clear — accept this meeting
  update public.meetings
  set status = 'accepted',
      accepted_slot = p_slot
  where id = p_meeting_id;

  return jsonb_build_object('success', true);
end;
$function$
;
CREATE OR REPLACE FUNCTION public.bump_conversation_last_message()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update public.conversations
     set last_message_at = new.created_at
   where id = new.conversation_id
     and (last_message_at is null or last_message_at < new.created_at);
  return new;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.bump_poll_votes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if tg_op = 'INSERT' then
    update public.poll_options set vote_count = vote_count + 1 where id = new.option_id;
    update public.posts set vote_count = vote_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.poll_options set vote_count = greatest(vote_count - 1, 0) where id = old.option_id;
    update public.posts set vote_count = greatest(vote_count - 1, 0) where id = old.post_id;
  elsif tg_op = 'UPDATE' and new.option_id is distinct from old.option_id then
    update public.poll_options set vote_count = greatest(vote_count - 1, 0) where id = old.option_id;
    update public.poll_options set vote_count = vote_count + 1 where id = new.option_id;
  end if;
  return coalesce(new, old);
end;
$function$
;
CREATE OR REPLACE FUNCTION public.bump_post_comments()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if tg_op = 'INSERT' then
    update public.posts set comment_count = comment_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  end if;
  return coalesce(new, old);
end;
$function$
;
CREATE OR REPLACE FUNCTION public.bump_post_likes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if tg_op = 'INSERT' then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
  end if;
  return coalesce(new, old);
end;
$function$
;
CREATE OR REPLACE FUNCTION public.bump_question_upvotes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if (tg_op = 'INSERT') then
    update public.session_questions set upvotes = upvotes + 1 where id = new.question_id;
  elsif (tg_op = 'DELETE') then
    update public.session_questions set upvotes = greatest(upvotes - 1, 0) where id = old.question_id;
  end if;
  return coalesce(new, old);
end;
$function$
;
CREATE OR REPLACE FUNCTION public.bump_reply_upvotes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if (tg_op = 'INSERT') then
    update public.question_replies set upvotes = upvotes + 1 where id = new.reply_id;
  elsif (tg_op = 'DELETE') then
    update public.question_replies set upvotes = greatest(upvotes - 1, 0) where id = old.reply_id;
  end if;
  return coalesce(new, old);
end; $function$
;
CREATE OR REPLACE FUNCTION public.bump_session_checkins()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update public.sessions
  set current_checkins = current_checkins + 1
  where id = new.session_id;
  return new;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.flag_official_reply()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_session_id uuid;
  v_is_speaker boolean;
  v_is_organizer boolean;
begin
  select session_id into v_session_id from public.session_questions where id = new.question_id;
  select exists (
    select 1 from public.session_speakers
    where session_id = v_session_id and speaker_id = new.user_id
  ) into v_is_speaker;
  select exists (
    select 1 from public.profiles
    where id = new.user_id and role in ('organizer','admin')
  ) into v_is_organizer;
  new.is_official = (v_is_speaker or v_is_organizer);
  return new;
end; $function$
;
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'New Attendee'))
  on conflict (id) do nothing;
  return new;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.is_organizer()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('organizer','admin')
  );
$function$
;
CREATE OR REPLACE FUNCTION public.suggest_alternative_slots(p_user_a uuid, p_user_b uuid, p_duration_min integer DEFAULT 15, p_event_id uuid DEFAULT '5a9a0000-0000-4000-8000-000000000003'::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_summit_start timestamptz;
  v_summit_end timestamptz;
  v_now timestamptz := now();
  v_slot_start timestamptz;
  v_slot_end timestamptz;
  v_conflict int;
  v_results jsonb := '[]'::jsonb;
  v_score int;
  v_candidates jsonb := '[]'::jsonb;
begin
  select (e.starts_on + e.day_start_local) at time zone e.timezone,
         (e.starts_on + e.day_end_local)   at time zone e.timezone
    into v_summit_start, v_summit_end
  from public.events e
  where e.id = p_event_id;

  if v_summit_start is null then
    return '[]'::jsonb;
  end if;

  v_slot_start := greatest(v_summit_start, v_now + interval '10 minutes');
  -- Round up to next 15-min boundary
  v_slot_start := date_trunc('hour', v_slot_start)
                  + (extract(minute from v_slot_start)::int / 15 + 1) * interval '15 minutes';

  while v_slot_start + (p_duration_min || ' minutes')::interval <= v_summit_end loop
    v_slot_end := v_slot_start + (p_duration_min || ' minutes')::interval;

    -- Hard conflict check: any accepted meeting for either user, this event
    select count(*) into v_conflict
    from public.meetings
    where status = 'accepted'
      and event_id = p_event_id
      and (requester_id in (p_user_a, p_user_b) or invitee_id in (p_user_a, p_user_b))
      and (accepted_slot->>'start')::timestamptz < v_slot_end
      and (accepted_slot->>'end')::timestamptz > v_slot_start;

    if v_conflict = 0 then
      -- Score: -5 if either has a bookmarked session in this slot
      v_score := 10;
      if exists (
        select 1 from public.session_bookmarks sb
        join public.sessions s on s.id = sb.session_id
        where sb.user_id in (p_user_a, p_user_b)
          and s.event_id = p_event_id
          and s.start_at < v_slot_end
          and s.end_at > v_slot_start
      ) then
        v_score := v_score - 5;
      end if;

      v_candidates := v_candidates || jsonb_build_object(
        'start', v_slot_start,
        'end', v_slot_end,
        'score', v_score
      );
    end if;

    v_slot_start := v_slot_start + interval '15 minutes';
  end loop;

  select jsonb_agg(c order by (c->>'score')::int desc)
  into v_results
  from (
    select c from jsonb_array_elements(v_candidates) c
    order by (c->>'score')::int desc
    limit 3
  ) sub;

  return coalesce(v_results, '[]'::jsonb);
end;
$function$
;
CREATE OR REPLACE FUNCTION public.sync_profile_points()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  update public.profiles
  set points = (
    select coalesce(sum(points), 0)
    from public.point_events
    where user_id = new.user_id
  )
  where id = new.user_id;
  return new;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.touch_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

-- ============ 4. constraints ============
alter table public.announcements add constraint announcements_pkey PRIMARY KEY (id);
alter table public.attendee_allowlist add constraint attendee_allowlist_pkey PRIMARY KEY (event_id, email);
alter table public.availability_blocks add constraint availability_blocks_pkey PRIMARY KEY (id);
alter table public.availability_slots add constraint availability_slots_pkey PRIMARY KEY (id);
alter table public.connections add constraint connections_pkey PRIMARY KEY (user_a, user_b);
alter table public.conversations add constraint conversations_pkey PRIMARY KEY (id);
alter table public.event_participants add constraint event_participants_pkey PRIMARY KEY (event_id, profile_id);
alter table public.events add constraint events_pkey PRIMARY KEY (id);
alter table public.exhibitor_team_members add constraint exhibitor_team_members_pkey PRIMARY KEY (id);
alter table public.exhibitors add constraint exhibitors_pkey PRIMARY KEY (id);
alter table public.key_participants add constraint key_participants_pkey PRIMARY KEY (id);
alter table public.meetings add constraint meetings_pkey PRIMARY KEY (id);
alter table public.messages add constraint messages_pkey PRIMARY KEY (id);
alter table public.partner_types add constraint partner_types_pkey PRIMARY KEY (id);
alter table public.partners add constraint partners_pkey PRIMARY KEY (id);
alter table public.point_events add constraint point_events_pkey PRIMARY KEY (id);
alter table public.poll_options add constraint poll_options_pkey PRIMARY KEY (id);
alter table public.poll_votes add constraint poll_votes_pkey PRIMARY KEY (post_id, user_id);
alter table public.post_comments add constraint post_comments_pkey PRIMARY KEY (id);
alter table public.post_likes add constraint post_likes_pkey PRIMARY KEY (post_id, user_id);
alter table public.posts add constraint posts_pkey PRIMARY KEY (id);
alter table public.profiles add constraint profiles_pkey PRIMARY KEY (id);
alter table public.push_log add constraint push_log_pkey PRIMARY KEY (user_id, kind, ref_id);
alter table public.question_replies add constraint question_replies_pkey PRIMARY KEY (id);
alter table public.question_upvotes add constraint question_upvotes_pkey PRIMARY KEY (question_id, user_id);
alter table public.reply_upvotes add constraint reply_upvotes_pkey PRIMARY KEY (reply_id, user_id);
alter table public.session_bookmarks add constraint session_bookmarks_pkey PRIMARY KEY (user_id, session_id);
alter table public.session_checkins add constraint session_checkins_pkey PRIMARY KEY (id);
alter table public.session_questions add constraint session_questions_pkey PRIMARY KEY (id);
alter table public.session_speakers add constraint session_speakers_pkey PRIMARY KEY (session_id, speaker_id);
alter table public.sessions add constraint sessions_pkey PRIMARY KEY (id);
alter table public.sponsor_visits add constraint sponsor_visits_pkey PRIMARY KEY (user_id, sponsor_id);
alter table public.sponsors add constraint sponsors_pkey PRIMARY KEY (id);
alter table public.venues add constraint venues_pkey PRIMARY KEY (id);
alter table public.conversations add constraint conversations_participant_a_participant_b_key UNIQUE (participant_a, participant_b);
alter table public.events add constraint events_slug_key UNIQUE (slug);
alter table public.partner_types add constraint partner_types_event_name_key UNIQUE (event_id, name);
alter table public.partner_types add constraint partner_types_id_event_key UNIQUE (id, event_id);
alter table public.profiles add constraint profiles_qr_token_key UNIQUE (qr_token);
alter table public.session_checkins add constraint session_checkins_user_id_session_id_key UNIQUE (user_id, session_id);
alter table public.sponsors add constraint sponsors_booth_qr_token_key UNIQUE (booth_qr_token);
alter table public.venues add constraint venues_id_event_key UNIQUE (id, event_id);
alter table public.announcements add constraint announcements_audience_check CHECK ((audience = ANY (ARRAY['all'::text, 'vcs'::text, 'founders'::text, 'speakers'::text, 'organizers'::text])));
alter table public.announcements add constraint announcements_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text])));
alter table public.availability_blocks add constraint availability_blocks_check CHECK ((end_at > start_at));
alter table public.availability_slots add constraint availability_slots_status_check CHECK ((status = ANY (ARRAY['available'::text, 'booked'::text, 'blocked'::text])));
alter table public.connections add constraint connections_check CHECK ((user_a < user_b));
alter table public.connections add constraint connections_source_check CHECK ((source = ANY (ARRAY['meeting'::text, 'qr_scan'::text, 'manual'::text])));
alter table public.conversations add constraint conversations_check CHECK ((participant_a < participant_b));
alter table public.meetings add constraint meetings_check CHECK ((requester_id <> invitee_id));
alter table public.meetings add constraint meetings_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'declined'::text, 'cancelled'::text, 'completed'::text, 'rescheduled'::text])));
alter table public.poll_options add constraint poll_options_label_check CHECK (((length(btrim(label)) >= 1) AND (length(btrim(label)) <= 120)));
alter table public.post_comments add constraint post_comments_body_check CHECK (((length(btrim(body)) >= 1) AND (length(btrim(body)) <= 1000)));
alter table public.posts add constraint posts_body_check CHECK (((length(btrim(body)) >= 1) AND (length(btrim(body)) <= 2000)));
alter table public.posts add constraint posts_kind_check CHECK ((kind = ANY (ARRAY['text'::text, 'poll'::text])));
alter table public.posts add constraint posts_media_type_check CHECK ((((media_url IS NULL) AND (media_type IS NULL)) OR ((media_url IS NOT NULL) AND (media_type = ANY (ARRAY['image'::text, 'video'::text])))));
alter table public.posts add constraint posts_media_url_host_check CHECK (((media_url IS NULL) OR (media_url ~~ 'https://res.cloudinary.com/%'::text)));
alter table public.profiles add constraint profiles_graduation_year_check CHECK (((graduation_year >= 1960) AND (graduation_year <= 2030)));
alter table public.profiles add constraint profiles_role_check CHECK ((role = ANY (ARRAY['attendee'::text, 'founder'::text, 'vc'::text, 'speaker'::text, 'government'::text, 'press'::text, 'organizer'::text, 'admin'::text, 'volunteer'::text])));
alter table public.profiles add constraint profiles_visibility_check CHECK ((visibility = ANY (ARRAY['all'::text, 'alumni_only'::text, 'hidden'::text])));
alter table public.question_replies add constraint question_replies_body_check CHECK (((length(body) >= 1) AND (length(body) <= 1000)));
alter table public.session_questions add constraint session_questions_status_check CHECK ((status = ANY (ARRAY['open'::text, 'answered'::text, 'dismissed'::text, 'duplicate'::text])));
alter table public.session_speakers add constraint session_speakers_role_check CHECK ((role = ANY (ARRAY['speaker'::text, 'moderator'::text, 'panelist'::text, 'host'::text])));
alter table public.sessions add constraint sessions_check CHECK ((end_at > start_at));
alter table public.sessions add constraint sessions_session_type_check CHECK ((session_type = ANY (ARRAY['keynote'::text, 'panel'::text, 'workshop'::text, 'networking'::text, 'meal'::text, 'break'::text, 'exhibit'::text])));
alter table public.sponsors add constraint sponsors_tier_check CHECK ((tier = ANY (ARRAY['title'::text, 'platinum'::text, 'gold'::text, 'silver'::text, 'partner'::text])));
alter table public.announcements add constraint announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;
alter table public.announcements add constraint announcements_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.attendee_allowlist add constraint attendee_allowlist_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.availability_blocks add constraint availability_blocks_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.availability_blocks add constraint availability_blocks_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.availability_slots add constraint availability_slots_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.availability_slots add constraint availability_slots_meeting_id_fkey FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE SET NULL;
alter table public.availability_slots add constraint availability_slots_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.connections add constraint connections_user_a_fkey FOREIGN KEY (user_a) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.connections add constraint connections_user_b_fkey FOREIGN KEY (user_b) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.conversations add constraint conversations_participant_a_fkey FOREIGN KEY (participant_a) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.conversations add constraint conversations_participant_b_fkey FOREIGN KEY (participant_b) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.event_participants add constraint event_participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;
alter table public.event_participants add constraint event_participants_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.exhibitor_team_members add constraint exhibitor_team_members_exhibitor_id_fkey FOREIGN KEY (exhibitor_id) REFERENCES exhibitors(id) ON DELETE CASCADE;
alter table public.exhibitor_team_members add constraint exhibitor_team_members_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL;
alter table public.exhibitors add constraint exhibitors_booth_venue_id_fkey FOREIGN KEY (booth_venue_id, event_id) REFERENCES venues(id, event_id) ON DELETE SET NULL (booth_venue_id);
alter table public.exhibitors add constraint exhibitors_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.key_participants add constraint key_participants_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.key_participants add constraint key_participants_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL;
alter table public.meetings add constraint meetings_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.meetings add constraint meetings_invitee_id_fkey FOREIGN KEY (invitee_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.meetings add constraint meetings_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.messages add constraint messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;
alter table public.messages add constraint messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.partner_types add constraint partner_types_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.partners add constraint partners_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.partners add constraint partners_partner_type_id_fkey FOREIGN KEY (partner_type_id, event_id) REFERENCES partner_types(id, event_id) ON DELETE SET NULL (partner_type_id);
alter table public.point_events add constraint point_events_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.point_events add constraint point_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.poll_options add constraint poll_options_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
alter table public.poll_votes add constraint poll_votes_option_id_fkey FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE;
alter table public.poll_votes add constraint poll_votes_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
alter table public.poll_votes add constraint poll_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.post_comments add constraint post_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
alter table public.post_comments add constraint post_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.post_likes add constraint post_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
alter table public.post_likes add constraint post_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.posts add constraint posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.posts add constraint posts_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.profiles add constraint profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.push_log add constraint push_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.question_replies add constraint question_replies_question_id_fkey FOREIGN KEY (question_id) REFERENCES session_questions(id) ON DELETE CASCADE;
alter table public.question_replies add constraint question_replies_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.question_upvotes add constraint question_upvotes_question_id_fkey FOREIGN KEY (question_id) REFERENCES session_questions(id) ON DELETE CASCADE;
alter table public.question_upvotes add constraint question_upvotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.reply_upvotes add constraint reply_upvotes_reply_id_fkey FOREIGN KEY (reply_id) REFERENCES question_replies(id) ON DELETE CASCADE;
alter table public.reply_upvotes add constraint reply_upvotes_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.session_bookmarks add constraint session_bookmarks_session_id_fkey FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;
alter table public.session_bookmarks add constraint session_bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.session_checkins add constraint session_checkins_session_id_fkey FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;
alter table public.session_checkins add constraint session_checkins_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.session_questions add constraint session_questions_answered_by_fkey FOREIGN KEY (answered_by) REFERENCES profiles(id) ON DELETE SET NULL;
alter table public.session_questions add constraint session_questions_session_id_fkey FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;
alter table public.session_questions add constraint session_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.session_speakers add constraint session_speakers_session_id_fkey FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE;
alter table public.session_speakers add constraint session_speakers_speaker_id_fkey FOREIGN KEY (speaker_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.sessions add constraint sessions_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.sessions add constraint sessions_venue_id_fkey FOREIGN KEY (venue_id, event_id) REFERENCES venues(id, event_id) ON DELETE SET NULL (venue_id);
alter table public.sponsor_visits add constraint sponsor_visits_sponsor_id_fkey FOREIGN KEY (sponsor_id) REFERENCES sponsors(id) ON DELETE CASCADE;
alter table public.sponsor_visits add constraint sponsor_visits_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
alter table public.sponsors add constraint sponsors_booth_venue_id_fkey FOREIGN KEY (booth_venue_id, event_id) REFERENCES venues(id, event_id) ON DELETE SET NULL (booth_venue_id);
alter table public.sponsors add constraint sponsors_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;
alter table public.venues add constraint venues_event_id_fkey FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE RESTRICT;

-- ============ 5. indexes ============
CREATE INDEX idx_announcements_created_at ON public.announcements USING btree (created_at DESC);
CREATE INDEX idx_announcements_event_id ON public.announcements USING btree (event_id);
CREATE INDEX attendee_allowlist_lower_email ON public.attendee_allowlist USING btree (lower(email));
CREATE UNIQUE INDEX idx_allowlist_event_lower_email ON public.attendee_allowlist USING btree (event_id, lower(email));
CREATE INDEX idx_attendee_allowlist_event_id ON public.attendee_allowlist USING btree (event_id);
CREATE INDEX idx_availability_blocks_event_id ON public.availability_blocks USING btree (event_id);
CREATE INDEX idx_availability_blocks_user ON public.availability_blocks USING btree (user_id, start_at);
CREATE UNIQUE INDEX availability_slots_event_user_slot_uidx ON public.availability_slots USING btree (event_id, user_id, slot_start);
CREATE INDEX idx_availability_event_user_start ON public.availability_slots USING btree (event_id, user_id, slot_start);
CREATE INDEX idx_availability_slots_event_id ON public.availability_slots USING btree (event_id);
CREATE INDEX idx_availability_user_start ON public.availability_slots USING btree (user_id, slot_start);
CREATE INDEX idx_event_participants_profile ON public.event_participants USING btree (profile_id);
CREATE INDEX idx_exhibitor_team_exhibitor ON public.exhibitor_team_members USING btree (exhibitor_id, display_order);
CREATE INDEX idx_exhibitors_event_id ON public.exhibitors USING btree (event_id);
CREATE INDEX idx_exhibitors_published_order ON public.exhibitors USING btree (is_published, display_order, name);
CREATE INDEX idx_key_participants_event_id ON public.key_participants USING btree (event_id);
CREATE INDEX idx_key_participants_published_order ON public.key_participants USING btree (is_published, display_order);
CREATE INDEX idx_meetings_event_id ON public.meetings USING btree (event_id);
CREATE INDEX idx_meetings_invitee_status ON public.meetings USING btree (invitee_id, status);
CREATE INDEX idx_meetings_requester_status ON public.meetings USING btree (requester_id, status);
CREATE INDEX idx_messages_conversation ON public.messages USING btree (conversation_id, created_at);
CREATE INDEX idx_partner_types_event_id ON public.partner_types USING btree (event_id);
CREATE INDEX idx_partners_event_id ON public.partners USING btree (event_id);
CREATE INDEX idx_partners_type_order ON public.partners USING btree (partner_type_id, display_order);
CREATE INDEX idx_point_events_event_id ON public.point_events USING btree (event_id);
CREATE INDEX idx_point_events_user ON public.point_events USING btree (user_id, created_at DESC);
CREATE INDEX idx_poll_options_post ON public.poll_options USING btree (post_id, "position");
CREATE INDEX idx_poll_votes_option ON public.poll_votes USING btree (option_id);
CREATE INDEX idx_post_comments_post ON public.post_comments USING btree (post_id, created_at);
CREATE INDEX idx_posts_author ON public.posts USING btree (author_id);
CREATE INDEX idx_posts_event_created ON public.posts USING btree (event_id, is_pinned DESC, created_at DESC);
CREATE INDEX idx_profiles_iit_campus ON public.profiles USING btree (iit_campus);
CREATE INDEX idx_profiles_qr_token ON public.profiles USING btree (qr_token);
CREATE INDEX idx_profiles_role ON public.profiles USING btree (role);
CREATE UNIQUE INDEX profiles_email_unique ON public.profiles USING btree (lower(email)) WHERE (email IS NOT NULL);
CREATE INDEX push_log_sent_at_idx ON public.push_log USING btree (sent_at DESC);
CREATE INDEX idx_question_replies_question ON public.question_replies USING btree (question_id, created_at);
CREATE INDEX idx_session_checkins_session ON public.session_checkins USING btree (session_id);
CREATE INDEX idx_session_questions_session ON public.session_questions USING btree (session_id, upvotes DESC);
CREATE INDEX idx_sessions_event_id ON public.sessions USING btree (event_id);
CREATE INDEX idx_sessions_interests_gin ON public.sessions USING gin (interests);
CREATE INDEX idx_sessions_start_at ON public.sessions USING btree (start_at);
CREATE INDEX idx_sessions_track ON public.sessions USING btree (track);
CREATE INDEX idx_sponsors_event_id ON public.sponsors USING btree (event_id);
CREATE INDEX idx_venues_event_id ON public.venues USING btree (event_id);

-- ============ 6. triggers ============
CREATE TRIGGER meetings_touch_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER messages_bump_conversation AFTER INSERT ON public.messages FOR EACH ROW EXECUTE FUNCTION bump_conversation_last_message();
CREATE TRIGGER point_events_sync_profile AFTER INSERT ON public.point_events FOR EACH ROW EXECUTE FUNCTION sync_profile_points();
CREATE TRIGGER trg_poll_votes AFTER INSERT OR DELETE OR UPDATE ON public.poll_votes FOR EACH ROW EXECUTE FUNCTION bump_poll_votes();
CREATE TRIGGER trg_post_comments AFTER INSERT OR DELETE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION bump_post_comments();
CREATE TRIGGER trg_post_likes AFTER INSERT OR DELETE ON public.post_likes FOR EACH ROW EXECUTE FUNCTION bump_post_likes();
CREATE TRIGGER profiles_touch_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER replies_flag_official BEFORE INSERT ON public.question_replies FOR EACH ROW EXECUTE FUNCTION flag_official_reply();
CREATE TRIGGER question_upvotes_bump_counter AFTER INSERT OR DELETE ON public.question_upvotes FOR EACH ROW EXECUTE FUNCTION bump_question_upvotes();
CREATE TRIGGER reply_upvotes_bump_counter AFTER INSERT OR DELETE ON public.reply_upvotes FOR EACH ROW EXECUTE FUNCTION bump_reply_upvotes();
CREATE TRIGGER session_checkins_bump_counter AFTER INSERT ON public.session_checkins FOR EACH ROW EXECUTE FUNCTION bump_session_checkins();
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============ 7. row level security ============
alter table public.announcements enable row level security;
alter table public.attendee_allowlist enable row level security;
alter table public.availability_blocks enable row level security;
alter table public.availability_slots enable row level security;
alter table public.connections enable row level security;
alter table public.conversations enable row level security;
alter table public.event_participants enable row level security;
alter table public.events enable row level security;
alter table public.exhibitor_team_members enable row level security;
alter table public.exhibitors enable row level security;
alter table public.key_participants enable row level security;
alter table public.meetings enable row level security;
alter table public.messages enable row level security;
alter table public.partner_types enable row level security;
alter table public.partners enable row level security;
alter table public.point_events enable row level security;
alter table public.poll_options enable row level security;
alter table public.poll_votes enable row level security;
alter table public.post_comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.posts enable row level security;
alter table public.profiles enable row level security;
alter table public.push_log enable row level security;
alter table public.question_replies enable row level security;
alter table public.question_upvotes enable row level security;
alter table public.reply_upvotes enable row level security;
alter table public.session_bookmarks enable row level security;
alter table public.session_checkins enable row level security;
alter table public.session_questions enable row level security;
alter table public.session_speakers enable row level security;
alter table public.sessions enable row level security;
alter table public.sponsor_visits enable row level security;
alter table public.sponsors enable row level security;
alter table public.venues enable row level security;

-- ============ 8. policies ============
create policy announcements_organizer_write on public.announcements as permissive for all to authenticated using (is_organizer()) with check (is_organizer());
create policy announcements_select_all on public.announcements as permissive for select to authenticated using (true);
create policy announcements_select_public on public.announcements as permissive for select to anon using (true);
create policy allowlist_modify_org on public.attendee_allowlist as permissive for all to authenticated using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['organizer'::text, 'admin'::text])))))) with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['organizer'::text, 'admin'::text]))))));
create policy allowlist_select_org on public.attendee_allowlist as permissive for select to authenticated using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['organizer'::text, 'admin'::text]))))));
create policy availability_own on public.availability_blocks as permissive for all to authenticated using ((user_id = auth.uid())) with check ((user_id = auth.uid()));
create policy availability_delete_own on public.availability_slots as permissive for delete to authenticated using ((user_id = auth.uid()));
create policy availability_insert_own on public.availability_slots as permissive for insert to authenticated with check ((user_id = auth.uid()));
create policy availability_read_all on public.availability_slots as permissive for select to authenticated using (true);
create policy availability_update_own on public.availability_slots as permissive for update to authenticated using ((user_id = auth.uid()));
create policy connections_insert_party on public.connections as permissive for insert to authenticated with check (((user_a = auth.uid()) OR (user_b = auth.uid())));
create policy connections_select_party on public.connections as permissive for select to authenticated using (((user_a = auth.uid()) OR (user_b = auth.uid())));
create policy conversations_insert_party on public.conversations as permissive for insert to authenticated with check (((participant_a = auth.uid()) OR (participant_b = auth.uid())));
create policy conversations_select_party on public.conversations as permissive for select to authenticated using (((participant_a = auth.uid()) OR (participant_b = auth.uid())));
create policy event_participants_insert_self on public.event_participants as permissive for insert to public with check (((profile_id = auth.uid()) OR is_organizer()));
create policy event_participants_organizer_write on public.event_participants as permissive for all to public using (is_organizer()) with check (is_organizer());
create policy event_participants_select_all on public.event_participants as permissive for select to public using (true);
create policy events_organizer_write on public.events as permissive for all to public using (is_organizer()) with check (is_organizer());
create policy events_select_all on public.events as permissive for select to public using (true);
create policy exhibitor_team_read on public.exhibitor_team_members as permissive for select to authenticated using (true);
create policy exhibitor_team_select_public on public.exhibitor_team_members as permissive for select to anon using (true);
create policy exhibitors_read on public.exhibitors as permissive for select to authenticated using ((is_published = true));
create policy exhibitors_select_public on public.exhibitors as permissive for select to anon using ((is_published = true));
create policy key_participants_read on public.key_participants as permissive for select to authenticated using ((is_published = true));
create policy key_participants_select_public on public.key_participants as permissive for select to anon using ((is_published = true));
create policy meetings_insert_as_requester on public.meetings as permissive for insert to authenticated with check ((requester_id = auth.uid()));
create policy meetings_select_party on public.meetings as permissive for select to authenticated using (((requester_id = auth.uid()) OR (invitee_id = auth.uid()) OR is_organizer()));
create policy meetings_update_party on public.meetings as permissive for update to authenticated using (((requester_id = auth.uid()) OR (invitee_id = auth.uid()))) with check (((requester_id = auth.uid()) OR (invitee_id = auth.uid())));
create policy messages_insert_party on public.messages as permissive for insert to authenticated with check (((sender_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((c.participant_a = auth.uid()) OR (c.participant_b = auth.uid())))))));
create policy messages_select_party on public.messages as permissive for select to authenticated using ((EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((c.participant_a = auth.uid()) OR (c.participant_b = auth.uid()))))));
create policy messages_update_mark_read on public.messages as permissive for update to authenticated using (((EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((c.participant_a = auth.uid()) OR (c.participant_b = auth.uid()))))) AND (sender_id <> auth.uid()))) with check (((EXISTS ( SELECT 1
   FROM conversations c
  WHERE ((c.id = messages.conversation_id) AND ((c.participant_a = auth.uid()) OR (c.participant_b = auth.uid()))))) AND (sender_id <> auth.uid())));
create policy partner_types_read on public.partner_types as permissive for select to authenticated using (true);
create policy partner_types_select_public on public.partner_types as permissive for select to anon using (true);
create policy partners_read on public.partners as permissive for select to authenticated using ((is_published = true));
create policy partners_select_public on public.partners as permissive for select to anon using ((is_published = true));
create policy point_events_select_own on public.point_events as permissive for select to authenticated using (((user_id = auth.uid()) OR is_organizer()));
create policy poll_options_select_all on public.poll_options as permissive for select to public using (true);
create policy poll_options_write_owner on public.poll_options as permissive for all to public using ((EXISTS ( SELECT 1
   FROM posts p
  WHERE ((p.id = poll_options.post_id) AND ((p.author_id = auth.uid()) OR is_organizer()))))) with check ((EXISTS ( SELECT 1
   FROM posts p
  WHERE ((p.id = poll_options.post_id) AND ((p.author_id = auth.uid()) OR is_organizer())))));
create policy poll_votes_own on public.poll_votes as permissive for all to public using ((user_id = auth.uid())) with check ((user_id = auth.uid()));
create policy poll_votes_select_all on public.poll_votes as permissive for select to public using (true);
create policy post_comments_delete_own on public.post_comments as permissive for delete to public using (((user_id = auth.uid()) OR is_organizer()));
create policy post_comments_insert_self on public.post_comments as permissive for insert to public with check ((user_id = auth.uid()));
create policy post_comments_select_all on public.post_comments as permissive for select to public using (true);
create policy post_likes_own on public.post_likes as permissive for all to public using ((user_id = auth.uid())) with check ((user_id = auth.uid()));
create policy post_likes_select_all on public.post_likes as permissive for select to public using (true);
create policy posts_delete_own on public.posts as permissive for delete to public using (((author_id = auth.uid()) OR is_organizer()));
create policy posts_insert_self on public.posts as permissive for insert to public with check ((author_id = auth.uid()));
create policy posts_select_all on public.posts as permissive for select to public using (true);
create policy posts_update_own on public.posts as permissive for update to public using (((author_id = auth.uid()) OR is_organizer())) with check (((author_id = auth.uid()) OR is_organizer()));
create policy profiles_admin_all on public.profiles as permissive for all to authenticated using (is_organizer());
create policy profiles_insert_self on public.profiles as permissive for insert to authenticated with check ((id = auth.uid()));
create policy profiles_select_public on public.profiles as permissive for select to anon using ((visibility <> 'hidden'::text));
create policy profiles_select_visible on public.profiles as permissive for select to authenticated using (((visibility <> 'hidden'::text) OR (id = auth.uid()) OR is_organizer()));
create policy profiles_update_own on public.profiles as permissive for update to authenticated using ((id = auth.uid())) with check ((id = auth.uid()));
create policy replies_delete_self_or_organizer on public.question_replies as permissive for delete to authenticated using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['organizer'::text, 'admin'::text])))))));
create policy replies_insert_self on public.question_replies as permissive for insert to authenticated with check ((user_id = auth.uid()));
create policy replies_select_all on public.question_replies as permissive for select to authenticated using (true);
create policy replies_update_self_or_organizer on public.question_replies as permissive for update to authenticated using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['organizer'::text, 'admin'::text])))))));
create policy upvotes_own on public.question_upvotes as permissive for all to authenticated using ((user_id = auth.uid())) with check ((user_id = auth.uid()));
create policy upvotes_select_all on public.question_upvotes as permissive for select to authenticated using (true);
create policy reply_upvotes_own on public.reply_upvotes as permissive for all to authenticated using ((user_id = auth.uid())) with check ((user_id = auth.uid()));
create policy reply_upvotes_select_all on public.reply_upvotes as permissive for select to authenticated using (true);
create policy bookmarks_own on public.session_bookmarks as permissive for all to authenticated using ((user_id = auth.uid())) with check ((user_id = auth.uid()));
create policy checkins_insert_own on public.session_checkins as permissive for insert to authenticated with check ((user_id = auth.uid()));
create policy checkins_select_own on public.session_checkins as permissive for select to authenticated using (((user_id = auth.uid()) OR is_organizer()));
create policy questions_insert_own on public.session_questions as permissive for insert to authenticated with check ((user_id = auth.uid()));
create policy questions_select_all on public.session_questions as permissive for select to authenticated using (true);
create policy questions_update_organizer on public.session_questions as permissive for update to authenticated using (is_organizer());
create policy session_speakers_organizer_write on public.session_speakers as permissive for all to authenticated using (is_organizer()) with check (is_organizer());
create policy session_speakers_select_all on public.session_speakers as permissive for select to authenticated using (true);
create policy session_speakers_select_public on public.session_speakers as permissive for select to anon using (true);
create policy sessions_organizer_write on public.sessions as permissive for all to authenticated using (is_organizer()) with check (is_organizer());
create policy sessions_select_all on public.sessions as permissive for select to authenticated using (true);
create policy sessions_select_public on public.sessions as permissive for select to anon using (true);
create policy sponsor_visits_insert_own on public.sponsor_visits as permissive for insert to authenticated with check ((user_id = auth.uid()));
create policy sponsor_visits_select_own on public.sponsor_visits as permissive for select to authenticated using (((user_id = auth.uid()) OR is_organizer()));
create policy sponsors_organizer_write on public.sponsors as permissive for all to authenticated using (is_organizer()) with check (is_organizer());
create policy sponsors_select_all on public.sponsors as permissive for select to authenticated using (true);
create policy sponsors_select_public on public.sponsors as permissive for select to anon using (true);
create policy venues_organizer_write on public.venues as permissive for all to authenticated using (is_organizer()) with check (is_organizer());
create policy venues_select_all on public.venues as permissive for select to authenticated using (true);
create policy venues_select_public on public.venues as permissive for select to anon using (true);

-- ============ 9. storage buckets ============
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('LOGOS','LOGOS',true,null,null),
  ('profile image','profile image',false,null,null),
  ('profile-photos','profile-photos',true,3145728,array['image/jpeg','image/png','image/webp','image/avif']),
  ('speakers','speakers',true,5242880,array['image/png','image/jpeg','image/webp']),
  ('Video Files','Video Files',false,null,null)
on conflict (id) do nothing;

-- ============ 10. storage policies ============
create policy "LOGOS bucket public list" on storage.buckets as permissive for select to anon, authenticated using (((id = 'LOGOS'::text) AND (public = true)));
create policy "profile-photos bucket public list" on storage.buckets as permissive for select to anon, authenticated using (((id = 'profile-photos'::text) AND (public = true)));
create policy "LOGOS bucket public read" on storage.objects as permissive for select to anon, authenticated using ((bucket_id = 'LOGOS'::text));
create policy "profile photos owner delete" on storage.objects as permissive for delete to authenticated using (((bucket_id = 'profile-photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
create policy "profile photos owner update" on storage.objects as permissive for update to authenticated using (((bucket_id = 'profile-photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text))) with check (((bucket_id = 'profile-photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
create policy "profile photos owner write" on storage.objects as permissive for insert to authenticated with check (((bucket_id = 'profile-photos'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));
create policy "profile photos public read" on storage.objects as permissive for select to anon, authenticated using ((bucket_id = 'profile-photos'::text));

-- ============ 11. event identity ============
-- Placeholder identity for the Sangam edition. Name / city / date are
-- provisional and must be confirmed before launch: starts_on drives the whole
-- meeting-availability grid (lib/slots.ts).
insert into public.events (id, slug, name, city, starts_on, day_start_local, day_end_local, timezone, is_active)
values ('5a9a0000-0000-4000-8000-000000000003', 'sangam', 'IITMAA Sangam', 'TBD',
        '2026-12-01', '08:00:00', '21:00:00', 'Asia/Kolkata', true)
on conflict (id) do nothing;
