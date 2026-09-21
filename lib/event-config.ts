// Single source of truth for event identity (name, venue, dates, branding).
//
// Everything specific to this edition lives here, so changing the event is a
// one-file change rather than a scavenger hunt through JSX.
//
// Much of this file is deliberately empty. The content arrays - hero slides,
// sectors, highlights, press, sponsors - held the previous event's material.
// An empty array is the correct state for them: every consumer guards on
// `.length` and lays out without the section. Better blank than showing
// somebody else's event.

export const EVENT_CITY = "TBD";
export const EVENT_STATE = "TBD";
export const EVENT_NAME = "IITMAA Sangam";
export const EVENT_SHORT_NAME = "Sangam";
export const EVENT_APP_NAME = "IITMAA Sangam";

/** Event theme. */
export const EVENT_TAGLINE = "IITMAA Sangam";
export const EVENT_SUBTAGLINE = "";

/**
 * Event day, IST.
 *
 * NOT cosmetic: lib/slots.ts builds the entire meeting-availability grid from
 * this date. Changing it moves every generated availability slot, so set the
 * real date before anyone books anything.
 */
export const EVENT_DATE_ISO = "2026-12-01";
export const EVENT_DATE_LABEL = "Date to be announced \u00b7 all times IST";
export const EVENT_DATE_TEXT = "Date to be announced";
export const EVENT_DATE_STAT = { value: "TBD", hint: "2026" };

export const EVENT_VENUE = "Venue to be announced";
export const EVENT_VENUE_SHORT = "Venue TBD";
export const EVENT_VENUE_STAT = { value: "TBD", hint: "Venue" };
export const EVENT_MAPS_URL = "";

/** Headline delegate count. */
export const EVENT_ATTENDEE_COUNT = "TBD";

/** Footfall across the day, which is not the delegate count. */
export const EVENT_VISITOR_COUNT = "TBD";

export const EVENT_FOCUS_AREAS = "";

/**
 * The event row in public.events that every scoped query filters on.
 *
 * Every table belonging to an event (sessions, sponsors, exhibitors,
 * announcements, meetings, availability, allowlist) must filter on this, and
 * every insert must set it.
 *
 * Overridable via env so a staging deploy can point at another edition.
 */
export const EVENT_ID =
  process.env.NEXT_PUBLIC_EVENT_ID ?? "5a9a0000-0000-4000-8000-000000000003";

/**
 * Folder prefix inside the `LOGOS` storage bucket.
 *
 * Storage is not event-scoped the way the database is, so each edition reads
 * from its own prefix. Upload sponsor logos to `sangam/<tier>/`. Until then
 * the sponsor board is empty, which is the correct state.
 */
export const EVENT_STORAGE_PREFIX = "sangam";

/**
 * Home-screen hero carousel. Empty until this event's artwork exists - the
 * carousel renders nothing rather than another event's banners.
 */
export const EVENT_HERO_SLIDES: {
  src: string;
  alt: string;
  /** Optional overlay caption. Set both to label a person on the banner. */
  name?: string;
  role?: string;
}[] = [];

/**
 * Focussed sectors - the subject areas the event's sessions cover.
 *
 * `image` files live in public/sectors/.
 */
export interface EventSector {
  slug: string;
  label: string;
  /** One line on what the sector covers, for the detail row. */
  blurb: string;
  image: string;
}

export const EVENT_SECTORS: EventSector[] = [];

/** "Event in numbers". Shown on the About screen. */
export const EVENT_NUMBERS: { value: string; label: string }[] = [];

/** Who the event is for. */
export const EVENT_AUDIENCE: {
  name: string;
  body: string;
  icon: string;
}[] = [];

/** Event vision. Used on the About screen. */
export const EVENT_VISION: string[] = [];

/** Organising contacts. */
export const EVENT_CONTACTS: {
  name: string;
  role?: string;
  phone: string;
  email?: string;
}[] = [];

/** Social accounts - the single source of truth for these links. */
export interface EventSocial {
  key: "linkedin" | "instagram" | "x" | "youtube" | "facebook";
  label: string;
  href: string;
}

export const EVENT_SOCIALS: EventSocial[] = [];

/** Event help group. Empty until one exists. */
export const EVENT_WHATSAPP_URL = "";

/**
 * Event highlights - the things that happen on the day.
 * Tiles live in public/highlights/.
 */
export const EVENT_HIGHLIGHTS: {
  slug: string;
  label: string;
  image: string;
}[] = [];

/**
 * The 23 IITs, for the marquee under the About section on the home screen.
 *
 * `logo` points at public/iits/<slug>.webp. The marks were taken from each
 * institute's English Wikipedia article and trimmed to a common 200x120 box -
 * scaled to FIT that box, not to its width, so a tall crest and a wide
 * wordmark carry the same visual weight in the row. Sources are listed in
 * public/iits/SOURCES.md.
 *
 * These are trademarks, used here to identify the institutes taking part.
 *
 * Ordered by year of establishment, oldest first.
 */
export const EVENT_IITS: { slug: string; name: string; logo: string }[] = [
  { slug: "kharagpur", name: "IIT Kharagpur", logo: "/iits/kharagpur.webp" },
  { slug: "bombay", name: "IIT Bombay", logo: "/iits/bombay.webp" },
  { slug: "madras", name: "IIT Madras", logo: "/iits/madras.webp" },
  { slug: "kanpur", name: "IIT Kanpur", logo: "/iits/kanpur.webp" },
  { slug: "delhi", name: "IIT Delhi", logo: "/iits/delhi.webp" },
  { slug: "guwahati", name: "IIT Guwahati", logo: "/iits/guwahati.webp" },
  { slug: "roorkee", name: "IIT Roorkee", logo: "/iits/roorkee.webp" },
  { slug: "ropar", name: "IIT Ropar", logo: "/iits/ropar.webp" },
  {
    slug: "bhubaneswar",
    name: "IIT Bhubaneswar",
    logo: "/iits/bhubaneswar.webp",
  },
  {
    slug: "gandhinagar",
    name: "IIT Gandhinagar",
    logo: "/iits/gandhinagar.webp",
  },
  { slug: "hyderabad", name: "IIT Hyderabad", logo: "/iits/hyderabad.webp" },
  { slug: "jodhpur", name: "IIT Jodhpur", logo: "/iits/jodhpur.webp" },
  { slug: "patna", name: "IIT Patna", logo: "/iits/patna.webp" },
  { slug: "indore", name: "IIT Indore", logo: "/iits/indore.webp" },
  { slug: "mandi", name: "IIT Mandi", logo: "/iits/mandi.webp" },
  {
    slug: "varanasi-bhu",
    name: "IIT (BHU) Varanasi",
    logo: "/iits/varanasi-bhu.webp",
  },
  { slug: "palakkad", name: "IIT Palakkad", logo: "/iits/palakkad.webp" },
  { slug: "tirupati", name: "IIT Tirupati", logo: "/iits/tirupati.webp" },
  { slug: "dhanbad", name: "IIT (ISM) Dhanbad", logo: "/iits/dhanbad.webp" },
  { slug: "bhilai", name: "IIT Bhilai", logo: "/iits/bhilai.webp" },
  { slug: "goa", name: "IIT Goa", logo: "/iits/goa.webp" },
  { slug: "jammu", name: "IIT Jammu", logo: "/iits/jammu.webp" },
  { slug: "dharwad", name: "IIT Dharwad", logo: "/iits/dharwad.webp" },
];

export const EVENT_IIT_SLUGS = [
  "kharagpur",
  "bombay",
  "madras",
  "kanpur",
  "delhi",
  "guwahati",
  "roorkee",
  "ropar",
  "bhubaneswar",
  "gandhinagar",
  "hyderabad",
  "jodhpur",
  "patna",
  "indore",
  "mandi",
  "varanasi-bhu",
  "palakkad",
  "tirupati",
  "dhanbad",
  "bhilai",
  "goa",
  "jammu",
  "dharwad",
] as const;

/**
 * Promotional video on the home and About screens.
 *
 * Null until there is one for this event: both screens skip the section
 * rather than embedding an empty player.
 */
export const EVENT_VIDEO_EMBED: {
  id: string;
  isLive: boolean;
  heading: string;
  caption: string;
} | null = null;

export interface EventMediaItem {
  src: string;
  alt: string;
  caption?: string;
}

export const EVENT_MEDIA: EventMediaItem[] = [];

export interface EventPressItem {
  outlet: string;
  headline: string;
  summary: string;
  /** The outlet's own preview image, mirrored locally. Null where the site
   *  blocks hotlinking - the card then runs without one. */
  image: string | null;
  href: string;
}

export const EVENT_PRESS: EventPressItem[] = [];

export interface EventPost {
  /** Handle without the @. Also names the mirrored avatar. */
  handle: string;
  name: string;
  /** The badge X actually shows on the account. */
  badge: "blue" | "gold" | null;
  avatar: string;
  /** Already formatted - no client-side date maths for fixed posts. */
  date: string;
  /** When it was posted. The strip sorts on this; `date` is only shown. */
  at: string;
  text: string;
  image: string;
  imageAlt: string;
  /** The post is a video; `image` is the frame X shows for it. */
  video?: boolean;
  href: string;
}

export const EVENT_POSTS: EventPost[] = [];

export interface EventLegacySpeaker {
  slug: string;
  name: string;
  role: string;
  image: string;
}

export const EVENT_LEGACY_SPEAKERS: EventLegacySpeaker[] = [];

export interface EventPastSponsor {
  slug: string;
  name: string;
  logo: string;
}

export const EVENT_PAST_SPONSORS: EventPastSponsor[] = [];

export interface EventScaleStat {
  value: string;
  label: string;
  short: string;
  icon: string;
}

export const EVENT_SCALE: EventScaleStat[] = [
  {
    value: EVENT_VISITOR_COUNT,
    label: "Visitors expected",
    short: "Visitors",
    icon: "/audience/ceos.webp",
  },
  {
    value: String(EVENT_IITS.length),
    label: "IITs represented",
    short: "IITs",
    icon: "/audience/directors.webp",
  },
];

export const EVENT_SCALE_STANDIN: EventScaleStat = {
  value: EVENT_ATTENDEE_COUNT,
  label: "Delegates",
  short: "Delegates",
  icon: "/audience/investors.webp",
};

/** The mark for the live exhibitor count - the Expo tab's own icon. */
export const EVENT_SCALE_EXHIBITOR_ICON = "/ui/nav-expo.webp";

/**
 * Promotional banners across the top of the agenda.
 *
 * Empty until the artwork exists, and the strip draws numbered placeholders
 * at the exact size to fill instead of collapsing - the point of the slots is
 * that someone can see where the banners go before they have them.
 *
 * Drop files in public/promos, add them here, and the placeholders give way
 * to the real thing. 1200x675 (16:9); `href` is optional and makes a banner
 * a link.
 */
export interface EventPromo {
  src: string;
  alt: string;
  href?: string;
}

export const EVENT_PROMOS: EventPromo[] = [];

/** Placeholders drawn while EVENT_PROMOS is empty. */
export const EVENT_PROMO_SLOTS = 3;

/**
 * Artwork for the login prompt. Null until the file exists, and the banner
 * lays out without it rather than pointing <Image> at a 404.
 */
export const EVENT_LOGIN_ART: string | null = "/ui/login-desk.webp";

/**
 * Artwork for the two app prompts - the slide-up that offers to install the
 * app, and the one that asks to turn notifications on afterwards.
 */
export const EVENT_INSTALL_ART: string | null = "/ui/install-app.webp";
export const EVENT_NOTIFY_ART: string | null = "/ui/notify.webp";
