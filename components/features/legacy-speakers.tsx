"use client";

import { useDriftScroll } from "@/hooks/use-drift-scroll";
import { SpeakerCard } from "@/components/features/speaker-card";
import { EVENT_LEGACY_SPEAKERS } from "@/lib/event-config";

/**
 * Who previous editions have had on stage, drifting past.
 *
 * A moving row rather than a grid: fifty-odd portraits stacked on a phone is
 * a wall of faces, which reads as this year's line-up however it is labelled.
 * A row that never stops moving reads as a back catalogue, which is what it
 * is.
 *
 * Same card as the current speakers — the framed photograph with its mirrored
 * square corner, name and role set below on the page's own ground. The frame
 * is the thing that ties the two rows together; what separates them is the
 * heading and the fact that this one keeps moving.
 *
 * The row carries the list twice and wraps at half its own width, so at the
 * loop point the second copy sits exactly where the first began and there is
 * no seam. That only holds if every repeat is identical, which is why the
 * page inset lives on the middle div and the spacing is a margin on each
 * card: padding on the scrolled list would make half the width land short of
 * one full copy, and the row would jump by that difference every time round.
 *
 * It is a scroll container, so it can be swiped as well as watched; the drift
 * stands aside while it is being touched, pauses under the pointer and for
 * keyboard focus, and prefers-reduced-motion stops it altogether — nothing
 * here needs the movement to be legible.
 */
export function LegacySpeakers() {
  const ref = useDriftScroll<HTMLDivElement>(30);

  if (EVENT_LEGACY_SPEAKERS.length === 0) return null;

  const stream = [...EVENT_LEGACY_SPEAKERS, ...EVENT_LEGACY_SPEAKERS];
  const half = EVENT_LEGACY_SPEAKERS.length;

  return (
    <div
      ref={ref}
      className="no-scrollbar -mx-3 overflow-x-auto overscroll-x-contain [scroll-behavior:auto] sm:-mx-5 lg:-mx-6"
      aria-label="Speakers at previous editions"
    >
      <div className="pl-3 sm:pl-5 lg:pl-6">
        <ul className="flex w-max items-stretch">
          {stream.map((person, i) => (
            <li
              key={`${person.slug}-${i}`}
              className="mr-4 w-[152px] shrink-0 sm:w-[176px]"
              // The second copy is scenery; a screen reader should hear each
              // name once.
              aria-hidden={i >= half}
            >
              <SpeakerCard
                person={splitRole(person)}
                index={i % half}
                variant="plain"
                labelled={i < half}
                sizes="176px"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * The config carries a single `role` string, occasionally two parts joined by
 * a pipe because that is how the source site wrote it across two lines. Split
 * it back so the card can set a job and a place on their own lines, the way
 * it does for this year's speakers.
 */
function splitRole(person: (typeof EVENT_LEGACY_SPEAKERS)[number]) {
  const parts = person.role
    .split("|")
    .map((s) => s.trim().replace(/,$/, ""))
    .filter(Boolean);

  return {
    full_name: person.name,
    designation: parts[0] ?? null,
    company: parts.length > 1 ? parts.slice(1).join(", ") : null,
    photo_url: person.image,
    // Past editions did not publish batches on the site, so there is nothing
    // honest to put here.
    batch: null,
  };
}
