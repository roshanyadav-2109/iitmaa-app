import Image from "next/image";

import { EVENT_PANELS } from "@/lib/event-config";

/**
 * What the day covers: the panels and keynotes, as the event site publishes
 * them.
 *
 * Not the agenda in the timetable sense — there is no 2026 timetable to show.
 * Each card is a topic and the organisers' own framing of it, so someone can
 * arrive knowing what the day is about even while the running order is still
 * being settled. When real sessions with times land in the database they
 * appear below this, and this stays as the overview.
 *
 * A card with no story is a banner rather than a panel; it renders as the
 * picture and its title alone instead of leaving an empty paragraph.
 */
export function PanelsList() {
  if (EVENT_PANELS.length === 0) return null;

  return (
    <ul className="space-y-5">
      {EVENT_PANELS.map((panel) => (
        <li
          key={panel.slug}
          className="overflow-hidden rounded-lg bg-paper-raised"
        >
          <div className="relative aspect-[1200/453] w-full bg-paper-deep">
            <Image
              src={panel.image}
              alt={panel.title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>
          <div className="px-4 py-4 sm:px-5 sm:py-5">
            <h3 className="font-display text-[15px] font-semibold leading-snug text-brand-950">
              {panel.title}
            </h3>
            {panel.story ? (
              <p className="mt-2 max-w-[70ch] text-[13px] leading-[1.65] text-brand-900/75">
                {panel.story}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
