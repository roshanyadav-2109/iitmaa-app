import Image from "next/image";

import { cn } from "@/lib/utils";
import { EVENT_NAME } from "@/lib/event-config";

/**
 * The IIT Madras Alumni Association mark.
 *
 * The association's own artwork, taken from iitmaasangam.com. Deliberately
 * the year-neutral IITMAA mark rather than the site's SANGAM lockup: that one
 * still reads "2024" down its edge, and a stale year on every screen is worse
 * than no year at all.
 *
 * Two tones, cut from one transparent master:
 *
 * - `dark` (default) is the mark as drawn, for `paper` surfaces — the top
 *   bar, the footer, anywhere light.
 * - `light` takes only the navy wordmark to white, for dark fields. The
 *   flame keeps its own orange and blue: it reads on the maroon as drawn,
 *   and repainting a brand mark's artwork to solve a text-contrast problem
 *   would be the wrong fix. The cut is by luminance — the wordmark's navy
 *   sits at ~30 and the flame's blue at ~121, so the threshold lands in open
 *   space between them rather than near either.
 *
 * The master this replaced was ink on solid white with no transparency,
 * which put a white box around the mark on every warm `paper` ground in the
 * app, and forced the sign-in screen to park it inside a plate.
 */
export function BrandLockup({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <Image
      src={light ? "/logo/iitmaa-light.webp" : "/logo/iitmaa.webp"}
      alt={EVENT_NAME}
      width={1000}
      height={301}
      priority
      className={cn("w-auto", className)}
    />
  );
}
