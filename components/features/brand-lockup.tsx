import { cn } from "@/lib/utils";
import { EVENT_NAME } from "@/lib/event-config";

/**
 * The event wordmark.
 *
 * Set in type rather than drawn, on purpose. What stood here before was a row
 * of three crests belonging to other organisations, and none of them were
 * this event's to display. A wordmark is the honest placeholder: it names the
 * event and claims nothing else.
 *
 * When there is real artwork, drop it in public/logo/ and swap the span for
 * an <Image> — every caller already passes its own height class, so nothing
 * else has to change.
 */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display font-semibold leading-none tracking-tight text-brand-900",
        className
      )}
    >
      {EVENT_NAME}
    </span>
  );
}
