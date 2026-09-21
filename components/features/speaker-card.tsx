import Image from "next/image";

import { cn, initials } from "@/lib/utils";

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
 * One speaker.
 *
 * The corner is the idea either way: 25px on three corners and a right angle
 * on the fourth, and which corner is square alternates down the row. The site
 * does this with two classes, `card-box` and `card-box-right`; mirroring it
 * per card is what makes a row read as a set rather than a grid of rounded
 * rectangles.
 *
 * Two variants, because the same card does not suit both places:
 *
 *   "panel" — the site's full treatment, the name and role set in white over
 *   a coloured block. Used on /speakers, where the grid is the page and the
 *   colour carries it.
 *
 *   "plain" — the frame on the photograph only, with the text set below it on
 *   the page's own ground. Used in the home strip, where a row of saturated
 *   blocks drifting past competes with everything around it, and the type is
 *   easier to read against paper than against four different colours.
 */
export function SpeakerCard({
  person,
  index,
  variant = "panel",
  labelled = true,
  priority = false,
  sizes = "196px",
}: {
  person: SpeakerCardPerson;
  /** Position in the row; drives the panel colour and which corner is square. */
  index: number;
  variant?: "panel" | "plain";
  /** False for a marquee's duplicated copy, which a screen reader should skip. */
  labelled?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  const panel = PANELS[index % PANELS.length];
  // Odd cards mirror the square corner, exactly as card-box / card-box-right do.
  const squareCorner = index % 2 === 0 ? "rounded-bl-none" : "rounded-br-none";
  const name = person.full_name ?? "";

  const photo = (
    <div
      className={cn(
        "relative aspect-square w-full shrink-0 overflow-hidden bg-paper-deep",
        // In "plain" the photo carries the frame itself, so it rounds on all
        // four corners (less the square one). In "panel" it is the top half of
        // a taller card, so only its top corners round.
        variant === "plain"
          ? cn("rounded-[22px]", squareCorner)
          : undefined
      )}
    >
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
  );

  if (variant === "plain") {
    return (
      <article className="flex h-full flex-col">
        {photo}
        <p className="mt-2.5 font-display text-[13px] font-semibold leading-snug text-brand-950">
          {name}
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

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[22px]",
        squareCorner
      )}
    >
      {photo}
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
