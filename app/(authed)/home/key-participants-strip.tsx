import type { CSSProperties } from "react";

import Link from "next/link";

import { ArrowUpRight } from "@/components/icons";
import { SpeakerCard } from "@/components/features/speaker-card";

export interface Person {
  id: string;
  full_name: string;
  designation: string | null;
  company: string | null;
  photo_url: string | null;
  /** Alumni batch as the event site prints it, e.g. "BTCE '79 & DAA '25". */
  batch: string | null;
}

/**
 * How many ride the belts, across both rows.
 *
 * Every speaker twice over is 164 photographs on the home screen, which is a
 * lot to ask of a phone on venue wifi for a strip you can only ever see a
 * dozen of. The belts are a taste; "View all" is the directory.
 */
const BELT_MAX = 24;

/** Seconds per card. Long enough to finish reading a name and a title. */
const SECONDS_PER_CARD = 2.6;

/**
 * The speakers, on two belts running against each other.
 *
 * One row travels right to left and the row beneath it travels left to right.
 * Opposing motion is what stops the pair reading as one wide band sliding off
 * the page, and it puts twice as many faces on screen as a single row without
 * going any faster.
 *
 * Each row is its own list rendered twice, and the track is translated by
 * exactly half its own width — so the seam always lands back where it
 * started and the loop has no jump, no matter how many cards a row holds.
 * The second row uses a mirrored keyframe rather than `animation-direction:
 * reverse`, because reversing replays the easing backwards and the two rows
 * visibly fall out of step. Both are `linear`, so neither drifts.
 */
export function KeyParticipantsStrip({ people }: { people: Person[] }) {
  if (people.length === 0) return null;

  const belt = people.slice(0, BELT_MAX);
  // Split down the middle. With an odd count the top row takes the extra.
  const mid = Math.ceil(belt.length / 2);
  const rows = [belt.slice(0, mid), belt.slice(mid)].filter((r) => r.length > 0);

  return (
    <div className="marquee-hoverable relative flex flex-col gap-4 overflow-hidden">
      {rows.map((row, rowIndex) => (
        <MarqueeRow
          key={rowIndex}
          row={row}
          // Row 0 runs right to left; row 1 comes back the other way.
          direction={rowIndex % 2 === 0 ? "rtl" : "ltr"}
          // Keep the colour cycle continuous across the two rows rather than
          // restarting it, so the second row is not a copy of the first.
          colourOffset={rowIndex === 0 ? 0 : mid}
        />
      ))}
    </div>
  );
}

function MarqueeRow({
  row,
  direction,
  colourOffset,
}: {
  row: Person[];
  direction: "rtl" | "ltr";
  colourOffset: number;
}) {
  const stream = [...row, ...row];
  const half = row.length;
  const seconds = Math.max(12, Math.round(half * SECONDS_PER_CARD * 2));

  return (
    <ul
      className={`flex w-max items-stretch gap-4 px-3 sm:px-5 lg:px-6 ${
        direction === "rtl" ? "animate-marquee-rtl" : "animate-marquee-ltr"
      }`}
      style={{ "--marquee-duration": `${seconds}s` } as CSSProperties}
    >
      {stream.map((person, i) => (
        <li
          key={`${person.id}-${i}`}
          className="w-[176px] shrink-0 sm:w-[196px]"
          // The second copy is scenery; a screen reader should hear each
          // name once.
          aria-hidden={i >= half}
        >
          <SpeakerCard
            person={person}
            index={colourOffset + (i % half)}
            labelled={i < half}
            sizes="196px"
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * "View all" under the strip.
 *
 * A filled button rather than an underlined link: it is the one thing to do
 * in this section, and the same treatment the masthead's "View directions"
 * uses, so the two read as the same kind of control.
 */
export function ViewAllSpeakers() {
  return (
    <div className="flex justify-center px-3 sm:px-5 lg:px-6">
      <Link
        href="/speakers"
        className="group/btn inline-flex h-10 items-center gap-2 rounded-md bg-brand-800 px-5 text-[13px] font-medium text-white transition-colors hover:bg-brand-900"
      >
        View all
        <ArrowUpRight
          className="size-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
          strokeWidth={1.8}
        />
      </Link>
    </div>
  );
}
