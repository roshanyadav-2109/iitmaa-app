import type { Metadata } from "next";
import Image from "next/image";

import { getPublicKeyParticipants } from "@/lib/public-data";
import { EVENT_NAME } from "@/lib/event-config";
import { initials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Speakers",
};

export const dynamic = "force-dynamic";

/**
 * Every speaker, in the order the event site lists them.
 *
 * The home screen carries a drifting strip, which is a taste rather than a
 * directory — at eighty-odd people it can only ever show a dozen at a time.
 * This is the list you come to when you want to find someone, so it does not
 * move and nothing is truncated: the full role, across as many lines as it
 * takes, and the alumni batch underneath in the accent.
 */
export default async function SpeakersPage() {
  const people = await getPublicKeyParticipants();

  return (
    <div className="mx-auto w-full max-w-5xl px-3 pb-12 pt-4 sm:px-5 lg:px-6">
      <header>
        <h1 className="font-display text-[26px] font-semibold leading-tight text-brand-950">
          Speakers
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-6 text-brand-900/70">
          {people.length > 0
            ? `${people.length} voices at ${EVENT_NAME}.`
            : `The line-up for ${EVENT_NAME} will appear here.`}
        </p>
      </header>

      {people.length === 0 ? null : (
        <ul className="mt-7 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
          {people.map((p) => (
            <li key={p.id}>
              <article className="flex h-full flex-col">
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-paper-deep">
                  {p.photo_url ? (
                    <Image
                      src={p.photo_url}
                      alt={p.full_name ?? ""}
                      fill
                      sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 23vw"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-3xl font-semibold text-brand-800/70">
                      {initials(p.full_name ?? "")}
                    </div>
                  )}
                </div>

                <p className="mt-2.5 font-display text-[13.5px] font-semibold leading-snug text-brand-950">
                  {p.full_name}
                </p>
                {p.designation ? (
                  <p className="mt-0.5 text-[12px] leading-4 text-brand-900/70">
                    {p.designation}
                  </p>
                ) : null}
                {p.company ? (
                  <p className="text-[12px] leading-4 text-brand-900/70">
                    {p.company}
                  </p>
                ) : null}
                {p.batch ? (
                  <p className="mt-1 text-[11px] font-semibold italic leading-4 text-iit-600">
                    {p.batch}
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
