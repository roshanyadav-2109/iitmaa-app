import Image from "next/image";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { rethrowIfRedirect } from "@/lib/redirect";
import { SignInForm } from "./sign-in-form";
import { EVENT_NAME } from "@/lib/event-config";

export const dynamic = "force-dynamic";

/**
 * Sign in.
 *
 * The event lockup on white, and the one control under it. Nothing else.
 *
 * The lockup already carries everything the screen used to spell out in
 * type — the institute crest, the association, the year, and the theme —
 * so a headline beside it would only be saying the same thing twice in a
 * worse typeface.
 *
 * White rather than the app's warm `paper`: the artwork is cut from a white
 * ground, and on a tinted one the antialiased edges of the crest and the
 * wordmark show as a faint rectangle around it.
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
    <main
      className="flex min-h-[100svh] flex-col items-center justify-center bg-white px-6"
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 2.5rem)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 2.5rem)",
      }}
    >
      <div className="w-full max-w-sm">
        {/* `priority` because this is the largest thing on the first screen a
            visitor ever sees, and it is the whole screen until it loads. */}
        <Image
          src="/logo/sangam-2026.webp"
          alt={EVENT_NAME}
          width={1200}
          height={587}
          sizes="(max-width: 640px) 90vw, 384px"
          priority
          className="block h-auto w-full"
        />

        <div className="mt-11">
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
