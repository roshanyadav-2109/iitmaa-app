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
 * Navy line art on a light ground, so it belongs on `paper` surfaces — the
 * top bar, the login card, the footer. It disappears on the brand navy; put
 * it on a card there, as the login screen does.
 *
 * Callers set the height with a class (`h-8`, `h-10`); the width follows.
 */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <Image
      src="/logo/iitmaa.svg"
      alt={EVENT_NAME}
      width={216}
      height={66}
      priority
      className={cn("w-auto", className)}
    />
  );
}
