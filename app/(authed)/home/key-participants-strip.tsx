import type { CSSProperties } from "react";

import Image from "next/image";
import Link from "next/link";

import { ArrowUpRight } from "@/components/icons";
import { initials } from "@/lib/utils";

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
 * The speakers, drifting right to left.
 *
 * This used to show one card at a time and swap it every 4.2 seconds. With
 * eighty-odd speakers that is nearly six minutes to see the line-up once, and
 * whoever you wanted to look at had usually just gone. A marquee shows a dozen
 * at a glance and never takes a name away before it has been read; the full
 * list is a tap away under it.
 *
 * The list is rendered twice and the track translated by exactly half its
 * width, so the seam lands back at the start and the loop has no jump. The
 * second copy is scenery — `aria-hidden`, so a screen reader hears each name
 * once — and the whole thing stops on hover and for anyone who has asked for
 * reduced motion.
 */
/**
 * How many ride the belt.
 *
 * Every speaker twice over is 164 photographs on the home screen, which is a
 * lot to ask of a phone on venue wifi for a strip you can only ever see a
 * dozen of. The belt is a taste; "View all" is the directory.
 */
const BELT_MAX = 24;

export function KeyParticipantsStrip({ people }: { people: Person[] }) {
  if (people.length === 0) return null;

  const belt = people.slice(0, BELT_MAX);
  const stream = [...belt, ...belt];
  const half = belt.length;
  // Scaled to the number of cards so adding speakers slows the belt instead
  // of speeding it up. ~2.6s per card is about the time it takes to read a
  // name and a title.
  const seconds = Math.round(belt.length * 2.6);

  return (
    <div className="marquee-hoverable relative overflow-hidden">
      <ul
        className="animate-marquee-rtl flex w-max gap-4 px-3 sm:px-5 lg:px-6"
        style={{ "--marquee-duration": `${seconds}s` } as CSSProperties}
      >
        {stream.map((person, i) => (
          <li
            key={`${person.id}-${i}`}
            className="w-[168px] shrink-0 sm:w-[184px]"
            aria-hidden={i >= half}
          >
            <ParticipantCard person={person} labelled={i < half} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * One speaker, set the way the event site sets them: the name, then the role
 * across as many lines as it takes, then the batch in italic underneath.
 *
 * The role is deliberately not collapsed onto one line with a separator.
 * "Controller of Warship Production & Acquisition, Indian Navy" reads as one
 * run-on title that way; on two lines it reads as a job and a place, which is
 * what it is.
 */
function ParticipantCard({
  person,
  labelled,
}: {
  person: Person;
  labelled: boolean;
}) {
  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-paper-deep">
        {person.photo_url ? (
          <Image
            src={person.photo_url}
            alt={labelled ? person.full_name : ""}
            fill
            sizes="184px"
            className="object-cover object-top"
          />
        ) : (
          <div className="grid h-full place-items-center text-3xl font-semibold text-brand-800/70">
            {initials(person.full_name)}
          </div>
        )}
      </div>

      <p className="mt-2.5 font-display text-[13px] font-semibold leading-snug text-brand-950">
        {person.full_name}
      </p>
      {person.designation ? (
        <p className="mt-0.5 text-[11.5px] leading-4 text-brand-900/70">
          {person.designation}
        </p>
      ) : null}
      {person.company ? (
        <p className="text-[11.5px] leading-4 text-brand-900/70">
          {person.company}
        </p>
      ) : null}
      {person.batch ? (
        <p className="mt-1 text-[11px] font-semibold italic leading-4 text-iit-600">
          {person.batch}
        </p>
      ) : null}
    </article>
  );
}

/** "View all" under the strip, sized to say how many there are. */
export function ViewAllSpeakers({ count }: { count: number }) {
  return (
    <div className="px-3 sm:px-5 lg:px-6">
      <Link
        href="/speakers"
        className="group/link inline-flex items-center gap-1.5 border-b border-brand-800/30 pb-0.5 text-[13px] font-medium text-brand-800 transition-colors hover:border-brand-800"
      >
        View all {count} speakers
        <ArrowUpRight
          className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
          strokeWidth={1.6}
        />
      </Link>
    </div>
  );
}
