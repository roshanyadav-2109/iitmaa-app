import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { rethrowIfRedirect } from "@/lib/redirect";
import { SignInForm } from "./sign-in-form";
import { MottoRotator } from "./motto-rotator";
import { VideoBackdrop } from "./video-backdrop";
import {
  EVENT_ATTENDEE_COUNT,
  EVENT_DATE_STAT,
  EVENT_SHORT_NAME,
  EVENT_SUBTAGLINE,
  EVENT_TAGLINE,
  EVENT_VENUE_STAT,
} from "@/lib/event-config";
import { BrandLockup } from "@/components/features/brand-lockup";

export const dynamic = "force-dynamic";

/**
 * Sign in.
 *
 * Two surfaces: a maroon field carrying the identity, and a paper sheet
 * carrying the one control. On a phone the sheet rises over the field; at
 * `lg` they sit side by side.
 *
 * The maroon field carries a muted film behind a scrim. The maroon itself
 * stays as the panel's background colour rather than being replaced by the
 * video, so the screen is already right before a frame has loaded, and stays
 * right if the embed is blocked outright.
 *
 * The headline is the institute's own motto, cycling through English,
 * Sanskrit and Tamil, rather than a caption over the button. The structure
 * around it is drawn in crest gold hairlines rather than boxes, so the field
 * stays a field.
 *
 * The mark sits directly on the maroon now, using the knockout tone. It used
 * to be parked inside a white plate, because the supplied artwork is ink on
 * solid white and disappears otherwise — a card floating on a card.
 */
export default async function SignInPage() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/home");
  } catch (err) {
    rethrowIfRedirect(err);
  }

  return (
    <main className="flex min-h-[100svh] flex-col lg:grid lg:min-h-screen lg:grid-cols-[1.08fr_1fr] lg:items-stretch">
      {/* ---------------------------------------------------------- FIELD */}
      <section className="relative isolate flex h-[62svh] shrink-0 flex-col justify-center overflow-hidden bg-brand-800 px-6 pb-[13svh] pt-10 lg:h-auto lg:px-12 lg:pb-14 lg:pt-14 xl:px-16">
        {/* The crest gold, as the top edge of the whole screen. */}
        <div className="absolute inset-x-0 top-0 z-10 h-[3px] bg-gold-400" aria-hidden />

        <VideoBackdrop />

        {/* The scrim. Two layers doing different jobs: a flat tint that holds
            contrast wherever the film happens to be bright, and a bottom-
            weighted gradient under the stub row, which sits over the busiest
            part of the frame. Without the first, legibility depends on which
            second of the video you happen to be looking at. */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-brand-950/55"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-brand-950/85 via-transparent to-brand-950/40"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-sm lg:mx-0 lg:max-w-lg">
          <BrandLockup tone="light" className="h-12 lg:h-14" />

          <div className="mt-7 h-px w-12 bg-gold-400/45 lg:mt-9" aria-hidden />

          <div className="mt-6 lg:mt-8">
            <MottoRotator className="text-white" />
          </div>

          {/* The romanisation, which doubles as the attribution: it says what
              the rotating line above is without spending another headline on
              saying so. */}
          <p className="mt-1 text-[12.5px] font-medium tracking-wide text-gold-300/80">
            Siddhirbhavati Karmaja &middot; the motto of IIT Madras
          </p>

          <p className="mt-5 max-w-[42ch] text-[13.5px] leading-relaxed text-white/70 lg:text-[15px]">
            <span className="font-semibold text-white">{EVENT_TAGLINE}</span> —{" "}
            {EVENT_SUBTAGLINE}. One day with the IIT Madras alumni community.
          </p>

          {/* The particulars, set as a stub rather than three boxes. */}
          <dl className="mt-8 flex flex-wrap items-start gap-x-7 gap-y-4 border-t border-white/10 pt-5 lg:mt-10 lg:gap-x-10">
            <Stat label="Date" value={EVENT_DATE_STAT.value} hint={EVENT_DATE_STAT.hint} />
            <Stat label="Venue" value={EVENT_VENUE_STAT.value} hint={EVENT_VENUE_STAT.hint} />
            <Stat label="Expected" value={EVENT_ATTENDEE_COUNT} hint="delegates" />
          </dl>
        </div>
      </section>

      {/* ---------------------------------------------------------- SHEET */}
      <section className="relative z-10 -mt-[13svh] flex min-h-0 flex-1 flex-col lg:mt-0 lg:bg-paper">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col rounded-t-[20px] bg-paper px-6 pb-8 pt-8 shadow-[0_-24px_60px_-28px_rgba(38,7,11,0.45)] sm:px-9 lg:my-auto lg:max-w-sm lg:flex-none lg:rounded-none lg:px-10 lg:py-0 lg:shadow-none">
          {/* The seam where the sheet meets the field, drawn rather than left
              to the shadow alone. Only on the phone — at `lg` the two panels
              meet edge to edge and there is no seam to mark. */}
          <div
            className="mx-auto -mt-3 mb-7 h-1 w-10 rounded-full bg-brand-950/15 lg:hidden"
            aria-hidden
          />

          <div className="flex flex-col">
            <p className="eyebrow text-iit-600">{EVENT_SHORT_NAME}</p>
            <h2 className="mt-2 font-display text-[22px] font-semibold leading-tight text-brand-950">
              Sign in
            </h2>
            <p className="mt-2 text-[14px] leading-6 text-brand-900/80">
              Use the email address you registered with.
            </p>

            <div className="mt-7">
              <SignInForm />
            </div>

            <p className="mt-7 border-t border-rule pt-5 text-[12.5px] leading-relaxed text-brand-900/55">
              Your badge, the programme and everyone you meet live behind this
              one step. Nothing is shared with other delegates until you choose
              to connect.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

/** One particular from the stub row: label over value over qualifier. */
function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <dt className="eyebrow text-gold-400/80">{label}</dt>
      <dd className="mt-1.5 font-display text-[15px] font-semibold leading-none tracking-tight text-white lg:text-[17px]">
        {value}
      </dd>
      <dd className="mt-1 text-[11.5px] font-medium leading-none text-white/55">
        {hint}
      </dd>
    </div>
  );
}
