import Image from "next/image";
import { MediaCarousel } from "@/components/features/media-carousel";
import {
  EVENT_CITY,
  EVENT_AUDIENCE,
  EVENT_CONTACTS,
  EVENT_DATE_TEXT,
  EVENT_HIGHLIGHTS,
  EVENT_MEDIA,
  EVENT_NAME,
  EVENT_NUMBERS,
  EVENT_SECTORS,
  EVENT_SUBTAGLINE,
  EVENT_TAGLINE,
  EVENT_VIDEO_EMBED,
  EVENT_VISION,
  EVENT_VENUE,
} from "@/lib/event-config";

export const dynamic = "force-dynamic";

/** Editorial section head, matching the home screen's rhythm. */
function Head({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="section-head flex items-baseline justify-between gap-4">
      <h2 className="font-display text-[19px] font-semibold leading-none text-brand-950">
        {title}
      </h2>
      {meta ? (
        <span className="eyebrow shrink-0 text-brand-900/50">{meta}</span>
      ) : null}
    </div>
  );
}

export default function AboutSummitPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-14 pb-12 pt-4">
      <section>
        <h1 className="font-display text-[26px] font-semibold leading-tight text-brand-950">
          {EVENT_TAGLINE}
        </h1>
        <p className="eyebrow mt-1.5 text-brand-800/75">{EVENT_SUBTAGLINE}</p>
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.75] text-brand-900/85">
          {EVENT_NAME} brings the IIT Madras alumni community together for a
          single day of focused work. Alumni, founders, investors and policy
          makers converge on {EVENT_DATE_TEXT} at {EVENT_VENUE}.
        </p>

        {/* The core team banner. It carries the date, the hours and the venue
            in the artwork, so it says the practical things the paragraph
            above deliberately does not repeat. */}
        <Image
          src="/hero/team-sangam-2026.webp"
          alt={`Meet the core team of ${EVENT_NAME}`}
          width={1200}
          height={521}
          sizes="(max-width: 768px) 100vw, 672px"
          className="mt-6 block h-auto w-full rounded-lg bg-paper-deep"
        />

      </section>

      {/* Last year, after this year and clearly marked as such. It used to
          open the page — a 2025 film above a 2026 headline, which read as
          though the film were this year's. */}
      {EVENT_MEDIA.length > 0 || EVENT_VIDEO_EMBED ? (
        <section>
          <Head title="Glimpses from last year" />

          {EVENT_MEDIA.length > 0 ? (
            <div className="mt-4">
              <MediaCarousel items={EVENT_MEDIA} />
            </div>
          ) : null}

          {EVENT_VIDEO_EMBED ? (
            <div className="mt-6">
              <div className="overflow-hidden rounded-lg bg-black">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${EVENT_VIDEO_EMBED.id}?playsinline=1&rel=0`}
                    title={EVENT_VIDEO_EMBED.caption}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute left-0 top-0 h-full w-full"
                  />
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-snug text-brand-900/70">
                {EVENT_VIDEO_EMBED.caption}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Event in numbers — set large in the display face, on rules rather
          than in four boxes, so the figures carry the section themselves. */}
      {EVENT_NUMBERS.length > 0 ? (
        <section>
          <Head title="Sangam in numbers" />
          <dl className="mt-1 grid grid-cols-2 gap-x-6">
            {EVENT_NUMBERS.map((n) => (
              <div
                key={n.label}
                className="py-3.5"
              >
                <dt className="sr-only">{n.label}</dt>
                <dd>
                  <span className="block font-display text-[30px] font-semibold leading-none tabular-nums text-brand-800">
                    {n.value}
                  </span>
                  <span className="mt-1.5 block text-[12.5px] leading-snug text-brand-900/60">
                    {n.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {EVENT_VISION.length > 0 ? (
        <section>
          <Head title="Vision" />
          <ol className="list-ruled mt-1">
            {EVENT_VISION.map((v, i) => (
              <li key={v} className="flex gap-4 py-3.5">
                <span
                  aria-hidden
                  className="w-6 shrink-0 pt-[3px] font-display text-[13px] font-semibold tabular-nums text-brand-800/50"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[14px] leading-[1.7] text-brand-900/85">
                  {v}
                </span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* The sectors in full — the home grid shows the tiles, this is where
          each one gets its line of explanation. */}
      {EVENT_SECTORS.length > 0 ? (
        <section>
          <Head title="Focussed Sectors" />
          <ul className="list-ruled mt-1">
            {EVENT_SECTORS.map((sector) => (
              <li key={sector.slug} className="flex items-start gap-3.5 py-3.5">
                <span className="relative size-12 shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={sector.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-[15px] font-semibold leading-snug text-brand-950">
                    {sector.label}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-6 text-brand-900/65">
                    {sector.blurb}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {EVENT_AUDIENCE.length > 0 ? (
        <section>
          <Head title="Who attends" />
          <ul className="list-ruled mt-1">
            {EVENT_AUDIENCE.map((a) => (
              <li key={a.name} className="flex items-start gap-3.5 py-3.5">
                {a.icon ? (
                  <Image
                    src={a.icon}
                    alt=""
                    width={34}
                    height={34}
                    className="mt-0.5 size-[34px] shrink-0 object-contain"
                  />
                ) : null}
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[15px] font-semibold text-brand-950">
                    {a.name}
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-6 text-brand-900/65">
                    {a.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {EVENT_CONTACTS.length > 0 ? (
        <section>
          <Head title="Contact the secretariat" />
          {/* Cards rather than a wrapping row. Six contacts in a flex row ran
              together once the separators went, and the phone and email wrapped
              under the name at unpredictable points. Each is now a bounded card
              with the name above and the two ways to reach them below.

              The links are sized as tap targets, not text: a phone number set at
              13px in a paragraph is a 16px-high thing to hit with a thumb, and
              these exist to be tapped on a phone at a venue. */}
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {EVENT_CONTACTS.map((c) => (
              <li
                key={c.phone}
                className="rounded-lg border border-rule bg-white p-4"
              >
                <p className="font-display text-[15px] font-semibold leading-snug text-brand-950">
                  {c.name}
                </p>
                {c.role ? (
                  <p className="eyebrow mt-0.5 text-brand-900/50">{c.role}</p>
                ) : null}
                <div className="mt-3 flex flex-col gap-1">
                  <a
                    href={`tel:${c.phone}`}
                    className="-mx-2 inline-flex min-h-[40px] items-center gap-2.5 rounded-md px-2 text-[13.5px] tabular-nums text-brand-800 transition-colors hover:bg-paper-deep"
                  >
                    <PhoneMark />
                    {c.phone}
                  </a>
                  {c.email ? (
                    <a
                      href={`mailto:${c.email}`}
                      className="-mx-2 inline-flex min-h-[40px] items-center gap-2.5 rounded-md px-2 text-[13.5px] text-brand-800 transition-colors hover:bg-paper-deep"
                    >
                      <GmailMark />
                      <span className="truncate">{c.email}</span>
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {/* What happens on the day. Ordered as the day runs, which is what
          makes the tile numbering meaningful rather than ornamental. */}
      {EVENT_HIGHLIGHTS.length > 0 ? (
        <section>
          <Head title="On the day" />
          {/* A list, not the tile grid. These carry a sentence each and no
              artwork, and a grid of pictures with no pictures in it is a
              grid of empty boxes. */}
          <ul className="list-ruled mt-1">
            {EVENT_HIGHLIGHTS.map((h) => (
              <li key={h.slug} className="py-3.5">
                <p className="font-display text-[15px] font-semibold text-brand-950">
                  {h.label}
                </p>
                {h.body ? (
                  <p className="mt-0.5 text-[13px] leading-6 text-brand-900/65">
                    {h.body}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Drawn inline rather than taken from the Solar set, like the social marks on
 * the home screen. A grey outline handset and a grey outline envelope are the
 * two most generic icons in existence; these say "call" and "Gmail" at a
 * glance instead.
 */
function PhoneMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="size-[18px] shrink-0"
    >
      {/* Solid receiver in the brand navy, with the red signal arcs the
          supplied icon set uses as its accent. */}
      <path
        fill="#1B1464"
        d="M7.3 3.6a1.7 1.7 0 0 1 2.4.5l1.5 2.4a1.7 1.7 0 0 1-.3 2.2l-1.3 1.1a10.6 10.6 0 0 0 4.6 4.6l1.1-1.3a1.7 1.7 0 0 1 2.2-.3l2.4 1.5a1.7 1.7 0 0 1 .5 2.4l-1 1.5c-.7 1-2 1.4-3.2 1A18.4 18.4 0 0 1 4.8 8c-.4-1.2 0-2.5 1-3.2l1.5-1.2z"
      />
      <path
        fill="#DD002B"
        d="M15.4 3.1a.85.85 0 0 0-.3 1.67 4.3 4.3 0 0 1 3.4 3.4.85.85 0 0 0 1.67-.3 6 6 0 0 0-4.77-4.77z"
      />
    </svg>
  );
}

function GmailMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="size-[18px] shrink-0"
    >
      <path fill="#4285F4" d="M3.4 20h2.4v-7.8L2 9.3v9.2c0 .8.6 1.5 1.4 1.5z" />
      <path fill="#34A853" d="M18.2 20h2.4c.8 0 1.4-.7 1.4-1.5V9.3l-3.8 2.9V20z" />
      <path fill="#FBBC04" d="M18.2 5.5v6.7L22 9.3V6.2c0-1.4-1.6-2.2-2.7-1.4l-1.1.7z" />
      <path fill="#EA4335" d="M5.8 12.2V5.5L12 10.1l6.2-4.6v6.7L12 16.8 5.8 12.2z" />
      <path fill="#C5221F" d="M2 6.2v3.1l3.8 2.9V5.5l-1.1-.7C3.6 4 2 4.8 2 6.2z" />
    </svg>
  );
}
