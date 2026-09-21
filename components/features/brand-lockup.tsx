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
 * Two tones, because the supplied artwork is ink on solid white and vanishes
 * on the brand maroon:
 *
 * - `dark` (default) is that original, for `paper` surfaces — the top bar,
 *   the footer, anywhere light.
 * - `light` is a knockout derived from it: the white ground turned into
 *   transparency by ink coverage, the wordmark taken to white and the swoosh
 *   to the crest gold. It is what lets the mark sit directly on a dark field
 *   instead of inside a white plate floating on one.
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
      src={light ? "/logo/iitmaa-light.webp" : "/logo/iitmaa.svg"}
      alt={EVENT_NAME}
      width={light ? 728 : 216}
      height={light ? 220 : 66}
      priority
      className={cn("w-auto", className)}
    />
  );
}
