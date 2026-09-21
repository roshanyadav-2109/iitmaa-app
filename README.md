# IITMAA Sangam — Event PWA

Mobile-first event app for **IITMAA Sangam**.

> Everything edition-specific lives in
> [`lib/event-config.ts`](lib/event-config.ts) — name, theme, date, venue,
> delegate count. Most of that file is deliberately empty: the content arrays
> render nothing until this event's own material goes in.
>
> **`EVENT_DATE_ISO` is not cosmetic**: `lib/slots.ts` builds the whole
> meeting-availability grid from it.

## Before launch

| Item | Status |
| --- | --- |
| Own Supabase project, schema applied | ✅ `zrftldroguntsahfqugu`, verified against the source schema |
| `0001_init.sql` committed | ✅ the complete schema lives in this repo |
| Event name, tagline, venue, date | ⚠️ **placeholders** — set in `lib/event-config.ts` |
| `events` row identity | ⚠️ placeholder: city `TBD`, `starts_on` 2026-12-01 |
| Google OAuth client + redirect URI | ⚠️ none set — register one for this app's domain |
| App icons + splash | ⚠️ placeholder mark — replace `public/logo/sangam-mark.svg`, then `npm run generate-icons` |
| Android TWA keystore | ⚠️ package is `org.iitmaa.sangam.twa`; still needs its own keystore |
| pg_cron session-reminder job | ⚠️ not carried over — recreate against the Sangam deployment |

### Backend

Sangam runs on its own Supabase project (`zrftldroguntsahfqugu`). Nothing is
shared with any other event.

Every table that belongs to an event carries `event_id NOT NULL`, defaulting
to the Sangam event. RLS on the content tables is `USING (true)`, so scoping
is enforced in the **app layer**: every query filters on `EVENT_ID` and every
insert sets it. Keep doing both — it costs nothing and would make a second
edition cheap.

| Edition | slug | `event_id` |
| --- | --- | --- |
| IITMAA Sangam | `sangam` | `5a9a0000-0000-4000-8000-000000000003` |

## Quick start

```bash
git clone https://github.com/roshanyadav-2109/iitmaa-app.git
cd iitmaa-app
npm install --legacy-peer-deps

# Set env vars (see "Environment variables" below)
cp .env.local.example .env.local
# fill values in

# Migrations are already applied to the Sangam project. For a NEW project,
# apply 0001_init.sql first, then the rest in order.
psql "$SUPABASE_DB_URL" -f supabase/migrations/0001_init.sql

npm run dev   # http://localhost:3000
```

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=https://zrftldroguntsahfqugu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=            # create a new client for the Sangam domain
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/auth/google/callback
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:tech@iitmaa.org
```

The service-role key is **server-only** and never reaches the client bundle. It's used by `lib/supabase/server.ts → createServiceRoleClient()` solely inside server actions and route handlers.

For direct app-domain Google sign-in, configure the OAuth client in Google Cloud Console with:

- Authorized JavaScript origin: `https://<sangam-domain>`
- Authorized redirect URI: `https://<sangam-domain>/auth/google/callback`

There is deliberately no default client id in the code: one bound to another
domain fails in a way that looks like a code bug.

The Google redirect stays on the app domain. Supabase Auth is only used after the app receives the Google ID token, so the existing Supabase Google provider can keep storing the provider login configuration.

## Migrations

| File | What it does | Run when |
| --- | --- | --- |
| `supabase/migrations/0001_init.sql` | The complete schema — 34 tables, constraints, indexes, functions, triggers, RLS policies, storage buckets, and the Sangam `events` row. | Applied to `zrftldroguntsahfqugu` |
| `supabase/migrations/0002_email_unique.sql` | Partial unique index on `lower(email)` so the sign-in lookup deterministically resolves one profile. | **Run before testing sign-in.** Paste into Supabase SQL editor or `psql` against the DB URL. |

## Bulk-importing the attendee registration CSV

The Supabase `profiles` table expects one row per registered attendee, with `email` populated (used for sign-in). Use the Supabase SQL editor's CSV import tool or `psql \copy`:

```sql
-- via psql
\copy public.profiles (id, email, full_name, role, iit_campus, graduation_year, branch, company, designation, interests)
  from 'attendees.csv' csv header;
```

After importing, run migration `0002_email_unique.sql` if it hasn't been run yet — it will fail loudly if there are duplicate emails, which is what you want.

## Auth: app-domain Google sign-in

Current sign-in uses a custom-domain Google ID-token flow:

1. User opens the app → lands on `/` (the sign-in page).
2. User clicks **Continue with Google** → app redirects to Google from `/auth/google/start`.
3. Google redirects back to `https://<sangam-domain>/auth/google/callback`.
4. The app posts the Google ID token to `/api/auth/google/id-token`.
5. The API creates the existing Supabase SSR session, syncs the profile row by `auth.uid()`, and redirects to onboarding or `/home`.

Supabase still stores the session and powers RLS, but it is not used as the OAuth redirect callback.

See `DECISIONS.md` for the design choice.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run `next lint` |
| `npm run generate-icons` | Regenerate `public/icons/*.png` |
| `npm run sync-sponsors -- --dry-run` | Preview sponsor rows from the `logos` storage bucket folders |

## File structure (Phase 1)

```
app/
  page.tsx                     ← sign-in page (the entry point — NOT a marketing landing)
  sign-in-form.tsx             ← client form (email + Continue)
  actions/
    sign-in.ts                 ← server action: lookup → generateLink → verifyOtp
    update-profile.ts          ← server action: update profile row
  (authed)/
    layout.tsx                 ← auth gate + TopBar/BottomNav chrome
    agenda/page.tsx            ← seeded sessions, time + venue + track
    network/page.tsx           ← Phase 2 placeholder
    meetings/page.tsx          ← Phase 3 placeholder
    map/page.tsx               ← venue list grouped by floor
    sponsors/page.tsx          ← seeded sponsors grouped by tier
    me/page.tsx                ← read-only profile
    me/edit/page.tsx           ← editable form
  api/auth/signout/route.ts
  layout.tsx                   ← Inter font, SW registration
  globals.css                  ← PAN IIT design tokens
components/
  ui/                          ← shadcn primitives
  features/
    top-bar.tsx                ← 56px, brand-800 lockup + bell
    bottom-nav.tsx             ← 64px, 5 tabs
    empty-state.tsx
lib/
  supabase/{client,server,middleware,types}.ts
  utils.ts, constants.ts, date.ts, redirect.ts
public/
  manifest.json, sw.js, icons/
scripts/
  generate-icons.js
supabase/
  migrations/0001_init.sql       ← owner-provided
  migrations/0002_email_unique.sql
middleware.ts                  ← refreshes session, gates (authed)
vercel.json                    ← install/build/region/headers
```

## Design tokens

- **Brand navy** `#1B1464` — primary. Used for headings (`text-brand-900`), primary buttons (`bg-brand-800`), nav active states.
- **IIT red** `#DD002B` — accent. Used sparingly: error states, destructive actions, urgent announcement banners.
- **Slate** for all neutrals.
- **Inter** font only. No serif anywhere.

Tighter radius (`--radius: 0.5rem`) for an institutional feel.

## Deploying to Vercel

1. Connect the GitHub repo at vercel.com/new.
2. Add env vars (Production scope) — at minimum `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. `vercel.json` pins install command, build region (`bom1`), and security headers.
4. Deploy. Hard-refresh after first build to clear any stale service worker from earlier deployments.

See `DECISIONS.md` for engineering judgement calls per phase.
