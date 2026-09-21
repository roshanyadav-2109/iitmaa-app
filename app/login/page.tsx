import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { rethrowIfRedirect } from "@/lib/redirect";
import { SignInForm } from "./sign-in-form";
import { VideoBackdrop } from "./video-backdrop";
import { BrandLockup } from "@/components/features/brand-lockup";

export const dynamic = "force-dynamic";

/**
 * Sign in.
 *
 * The film, the mark, and the one control. Nothing else on the screen — no
 * headline, no tagline, no particulars: they were competing with footage of
 * the campus, which says where you are better than a line of type does.
 *
 * `h-[100svh]` with `overflow-hidden` rather than `min-h`, because there is
 * deliberately nothing below the fold and a screen that scrolls a few pixels
 * on a phone reads as a layout bug.
 *
 * The mark and the button sit hard against the top and bottom, so both add
 * the phone's safe-area inset to their own padding rather than trusting a
 * fixed value — on a notched iPhone in standalone the inset is what keeps
 * the lockup clear of the status bar.
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
    <main className="relative isolate flex h-[100svh] flex-col overflow-hidden bg-brand-900">
      <VideoBackdrop />

      {/* The scrim. Weighted to the two edges that carry something and left
          alone through the middle, so the footage is not flattened to hold
          contrast it does not need there. */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(38,7,11,0.62) 0%, rgba(38,7,11,0.16) 26%, rgba(38,7,11,0.22) 58%, rgba(38,7,11,0.82) 100%)",
        }}
        aria-hidden
      />

      <header
        className="relative z-10 shrink-0 px-6 sm:px-9"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 2rem)" }}
      >
        <BrandLockup tone="light" className="h-11 sm:h-12" />
      </header>

      <div className="flex-1" aria-hidden />

      <div
        className="relative z-10 shrink-0 px-6 sm:px-9"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2.5rem)" }}
      >
        <div className="mx-auto w-full max-w-sm">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
