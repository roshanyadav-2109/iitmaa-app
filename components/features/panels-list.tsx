import Image from "next/image";

import { EVENT_PANELS } from "@/lib/event-config";

/**
 * The panel banners, swipeable.
 *
 * Stacked, eight banners at 2.11:1 were most of a screen each and the titles
 * underneath were a scroll apart from the artwork they belonged to. Side by
 * side you can see the shape of the day in one gesture.
 *
 * Cards sit at 86% of the viewport rather than full width so the next one is
 * always part-visible. That peek is what tells you it swipes — a full-width
 * card looks like a static image until you happen to try.
 *
 * No fixed aspect and no object-cover: the artwork is about 2.11:1 and any
 * frame tighter than that trims the top and bottom off every banner. The
 * frame follows the picture instead, so whatever is uploaded next fits.
 */
export function PanelsCarousel() {
  if (EVENT_PANELS.length === 0) return null;

  return (
    <ul
      className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth scroll-pl-3 px-3 pb-1 sm:-mx-5 sm:scroll-pl-5 sm:px-5 lg:-mx-6 lg:scroll-pl-6 lg:px-6"
      aria-label="Panels and keynotes"
    >
      {EVENT_PANELS.map((panel) => (
        <li
          key={panel.slug}
          className="w-[86%] shrink-0 snap-start sm:w-[62%] lg:w-[48%]"
        >
          <figure>
            <Image
              src={panel.image}
              alt={panel.title}
              width={1200}
              height={568}
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 62vw, 48vw"
              className="block h-auto w-full rounded-lg bg-paper-deep"
            />
          </figure>
        </li>
      ))}
    </ul>
  );
}

/**
 * The same panels as rows in the programme list.
 *
 * Deliberately shaped like the session cards they sit alongside — a title and
 * what it is about — so the tab reads as one list whether or not a timed
 * schedule exists yet. Where a session card carries a time, these carry the
 * topic mark: there are no 2026 times published, and inventing them would be
 * worse than leaving the column out.
 */
export function PanelsAgendaList() {
  const panels = EVENT_PANELS.filter((p) => p.story);
  if (panels.length === 0) return null;

  return (
    <ul className="flex flex-col gap-2">
      {panels.map((panel) => (
        <li key={panel.slug}>
          <article className="rounded-lg border border-rule bg-paper-raised px-4 py-4 sm:px-5">
            <p className="eyebrow text-brand-800/70">Panel</p>
            <h3 className="mt-1 font-display text-[15px] font-semibold leading-snug text-brand-950">
              {panel.title}
            </h3>
            <p className="mt-2 max-w-[70ch] text-[13px] leading-[1.65] text-brand-900/75">
              {panel.story}
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}
