import Image from "next/image";

import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export interface SpeakerCardPerson {
  full_name: string | null;
  designation: string | null;
  company: string | null;
  photo_url: string | null;
  /** Alumni batch as the event site prints it, e.g. "BTCE '79 & DAA '25". */
  batch: string | null;
}

/**
 * The four panel colours the event site cycles through, in its order.
 *
 * Taken from iitmaasangam.com's own stylesheet rather than eyeballed, so a
 * card here and a card there are the same colour. `bg-darkblue` is grey on
 * their site — the class name is theirs, the value is what it actually is.
 */
const PANELS = ["#663366", "#E06A3C", "#01164F", "#808080"] as const;

/**
 * One speaker, framed the way the event site frames them.
 *
 * The corner is the whole idea: 25px on three corners and a right angle on
 * the fourth, and which corner is square alternates down the row. The site
 * does this with two classes, `card-box` and `card-box-right`; mirroring it
 * per card is what makes a row read as a set rather than a grid of
 * rounded rectangles.
 *
 * The role is italic and set at 60% white over the panel, and the batch sits
 * under it in the same voice — again theirs, not invented.
 */
export function SpeakerCard({
  person,
  index,
  labelled = true,
  priority = false,
  sizes = "184px",
}: {
  person: SpeakerCardPerson;
  /** Position in the row; drives the panel colour and which corner is square. */
  index: number;
  /** False for a marquee's duplicated copy, which a screen reader should skip. */
  labelled?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const panel = PANELS[index % PANELS.length];
  // Odd cards mirror the square corner, exactly as card-box / card-box-right do.
  const squareCorner = index % 2 === 0 ? "rounded-bl-none" : "rounded-br-none";
  const name = person.full_name ?? "";

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[22px]",
        squareCorner
      )}
    >
      <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-paper-deep">
        {person.photo_url ? (
          <Image
            src={person.photo_url}
            alt={labelled ? name : ""}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-top"
          />
        ) : (
          <div className="grid h-full place-items-center text-3xl font-semibold text-brand-800/60">
            {initials(name)}
          </div>
        )}
      </div>

      <div
        className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5"
        style={{ backgroundColor: panel }}
      >
        <p className="font-display text-[14px] font-semibold leading-5 text-white">
          {name}
        </p>
        {person.designation ? (
          <p className="mt-2 text-[12.5px] font-medium italic leading-[18px] text-white/60">
            {person.designation}
          </p>
        ) : null}
        {person.company ? (
          <p className="text-[12.5px] font-medium italic leading-[18px] text-white/60">
            {person.company}
          </p>
        ) : null}
        {person.batch ? (
          <p className="mt-1.5 text-[12px] font-medium italic leading-4 text-white/60">
            {person.batch}
          </p>
        ) : null}
      </div>
    </article>
  );
}
