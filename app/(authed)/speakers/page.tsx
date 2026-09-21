import type { Metadata } from "next";

import { SpeakerCard } from "@/components/features/speaker-card";
import { getPublicKeyParticipants } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Speakers",
};

export const dynamic = "force-dynamic";

/**
 * Every speaker, in the order the event site lists them and in its layout:
 * two across on a phone, four on a desktop, each card carrying the panel
 * colour and the mirrored square corner that the site alternates down a row.
 *
 * The home screen carries a drifting strip, which is a taste rather than a
 * directory — at eighty-odd people it can only ever show a dozen at a time.
 * This is the page you come to when you want to find someone, so nothing
 * moves and nothing is truncated.
 */
export default async function SpeakersPage() {
  const people = await getPublicKeyParticipants();

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-12 pt-4 sm:px-5 lg:px-6">
      <h1 className="font-display text-[26px] font-semibold leading-tight text-brand-950">
        Speakers
      </h1>

      {people.length === 0 ? null : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-7 md:grid-cols-3 lg:grid-cols-4">
          {people.map((p, i) => (
            <li key={p.id}>
              <SpeakerCard
                person={p}
                index={i}
                priority={i < 4}
                sizes="(max-width: 640px) 46vw, (max-width: 768px) 30vw, 23vw"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
