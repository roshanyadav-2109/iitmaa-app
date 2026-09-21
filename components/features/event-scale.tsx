import {
  CaseMinimalistic,
  Diploma,
  HandMoney,
  Store,
  UserRound,
  Users,
} from "@/components/icons";
import type { EventScaleStat, ScaleIcon } from "@/lib/event-config";

/** The glyph each figure carries. */
const SCALE_ICONS: Record<ScaleIcon, typeof Users> = {
  delegates: Users,
  visitors: UserRound,
  investors: HandMoney,
  startups: Diploma,
  exhibitors: Store,
};

/**
 * The size of the event in four figures, under the masthead.
 *
 * One row at every width, including a phone, which is the constraint that
 * shapes the rest: four blocks across 328px leaves about 77px each, so the
 * label is the short form, the figure is 17px rather than 28px, and the mark
 * sits above them both instead of beside.
 *
 * The marks are glyphs from the app's own set rather than raster art. The
 * previous ones were red PNGs knocked out to white with `brightness-0
 * invert`, because a raster cannot be recoloured with `fill` — which also
 * meant they could never follow the palette. These inherit `currentColor`,
 * so they stay right whatever the brand does next.
 */
export function EventScale({ stats }: { stats: EventScaleStat[] }) {
  if (stats.length === 0) return null;

  return (
    <dl className="grid grid-cols-4 gap-1.5 sm:gap-3">
      {stats.map((stat) => {
        const Glyph = SCALE_ICONS[stat.icon] ?? Users;
        return (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-start gap-1.5 rounded-md bg-brand-800 px-1 py-3 text-center sm:px-2 sm:py-4"
          >
            {/* Gold on maroon — the crest's own pairing, and the one place
                the gold carries rather than decorates. 7.25:1 on brand-800. */}
            <Glyph
              className="size-[20px] shrink-0 text-gold-300 sm:size-[24px]"
              strokeWidth={1.5}
            />
            <dt className="sr-only">{stat.label}</dt>
            <dd className="min-w-0">
              <span className="block font-display text-[17px] font-semibold leading-none tabular-nums text-white sm:text-[21px]">
                {stat.value}
              </span>
              <span className="mt-1 block text-[10px] leading-tight text-white/70 sm:text-[11.5px]">
                {stat.short}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
