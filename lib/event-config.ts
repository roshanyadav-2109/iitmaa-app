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

export const EVENT_CITY = "Bengaluru";
export const EVENT_STATE = "Karnataka";
export const EVENT_NAME = "IITMAA Sangam 2026";
export const EVENT_SHORT_NAME = "Sangam 2026";
export const EVENT_APP_NAME = "Sangam 2026";

/** Event theme. */
// Both lines are the event's own, from iitmaasangam.com: "Atmanirbhar Bharat
// — Building a Self-Reliant India" is the vision the site leads with, and
// "India Unbound: The Decade of Atmanirbhartha" is its page title. The
// headline carries the first; swap them here if the other should lead.
export const EVENT_TAGLINE = "Atmanirbhar Bharat";
export const EVENT_SUBTAGLINE = "Building a Self-Reliant India";

/**
 * Event day, IST.
 *
 * NOT cosmetic: lib/slots.ts builds the entire meeting-availability grid from
 * this date. Changing it moves every generated availability slot, so set the
 * real date before anyone books anything.
 */
export const EVENT_DATE_ISO = "2026-09-26";
export const EVENT_DATE_LABEL =
  "Saturday 26 September 2026 · all times IST";
export const EVENT_DATE_TEXT = "September 26, 2026";
export const EVENT_DATE_STAT = { value: "26 Sep", hint: "2026" };

export const EVENT_VENUE = "Taj MG Road, Bengaluru";
export const EVENT_VENUE_SHORT = "Taj MG Road";
export const EVENT_VENUE_STAT = { value: "Taj MG Road", hint: "Bengaluru" };
export const EVENT_MAPS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Taj+MG+Road+Bengaluru";

/** Headline delegate count. */
/** "an audience of over 1000 delegates" — 2026 sponsors deck, p3. */
export const EVENT_ATTENDEE_COUNT = "1000+";

/** Footfall across the day, which is not the delegate count. */
/** "Engage with 5000+ alumni, decision-makers and industry pioneers" — p15. */
export const EVENT_VISITOR_COUNT = "5000+";

export const EVENT_FOCUS_AREAS =
  "deep technology, manufacturing, research, entrepreneurship, sustainability, " +
  "infrastructure, defence, healthcare, semiconductors, space and digital " +
  "public systems";

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
}[] = [
  {
    src: "/hero/bg-sangam-atmanirbhar-bharat-banner-2026.webp",
    alt: "SANGAM 2026: India Unbound: The Decade of Atmanirbhartha",
  },
  {
    src: "/hero/team-sangam-2026.webp",
    alt: "Meet the core team of IITMAA Sangam 2026 — 26 September 2026, 8am to 9pm, Taj MG Road, Bengaluru",
  },
  {
    src: "/panels/distinguished-speakers.webp",
    alt: "Distinguished Voices at Sangam 2026",
  },
  {
    src: "/panels/panel-ai.webp",
    alt: "Sovereign AI - now or never? A Roadmap to get there",
  },
];

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
export const EVENT_NUMBERS: { value: string; label: string }[] = [
  { value: "60,000+", label: "Global alumni network" },
  { value: "50", label: "Global active chapters" },
  { value: "170+", label: "Events annually" },
  { value: "7th", label: "Edition of the conclave" },
];

/** Who the event is for. */
export type AudienceIcon =
  | "angel"
  | "vc"
  | "policy"
  | "industry"
  | "founder";

export const EVENT_AUDIENCE: {
  name: string;
  body: string;
  /** Drawn from the app's own icon set, so it takes the accent colour. */
  icon?: AudienceIcon;
}[] = [
  { name: "Angel investors", body: "Backing the earliest rounds.", icon: "angel" },
  {
    name: "VC partners",
    body: "100+ investors expected across the day.",
    icon: "vc",
  },
  {
    name: "Policy makers",
    body: "Government, regulators and public institutions.",
    icon: "policy",
  },
  {
    name: "Industry & corporate leaders",
    body: "Operators from Indian and global enterprises.",
    icon: "industry",
  },
  {
    name: "Alumni founders",
    body: "50+ deep-tech startups from the IIT Madras ecosystem and beyond.",
    icon: "founder",
  },
];

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
  /** Optional: the tile grid falls back to type when there is no artwork. */
  image?: string;
  body?: string;
}[] = [
  {
    slug: "keynotes-panels",
    label: "Keynotes & Panels",
    body: "High-level discourse featuring policy makers, industry titans and celebrated alumni founders shaping the global economy.",
  },
  {
    slug: "master-classes",
    label: "Master Classes",
    body: "Expert-led accelerators on entrepreneurship, generative AI, data security and smart manufacturing.",
  },
  {
    slug: "networking",
    label: "Networking",
    body: "Relationship-building throughout, culminating in a curtain-raiser gala dinner.",
  },
];


/**
 * Reach, as the event site counts it.
 *
 * Their four counters, in their order. Every one is labelled "Impressions" on
 * the site with no platform against it, so they are reproduced that way
 * rather than guessed at.
 */
export const EVENT_DIGITAL_FOOTPRINT: {
  value: string;
  label: string;
  /** Tile colour, from the event site's own stylesheet. */
  colour: string;
}[] = [
  // Four grounds the site already uses, deliberately none of them the brand
  // navy: the tiles sit above a row of navy action tiles, and two blocks of
  // the same blue stacked read as one panel that has been split by accident.
  // The website prints all four as a bare "Impressions"; the sponsors deck
  // (p18) says which platform each one is, so the labels come from there.
  { value: "100K+", label: "LinkedIn", colour: "#663366" },
  { value: "25K+", label: "X", colour: "#E06A3C" },
  { value: "20K+", label: "Instagram", colour: "#26909A" },
  { value: "15K+", label: "YouTube", colour: "#808080" },
];

/**
 * Sponsors, as one piece of artwork.
 *
 * The site lays its sponsors out as a single composed image with the tier
 * bands drawn into it — the individual logo files it also references
 * (sponsor-1.png and friends) all 404. Re-hosted here rather than hotlinked,
 * and shown whole so the tiers stay as the organisers arranged them.
 */
export const EVENT_SPONSORS_IMAGE = "/sponsors/our-sponsors.webp";

export interface EventPanel {
  slug: string;
  title: string;
  /** The site's own "Story" paragraph. Empty for a card that is a banner. */
  story: string;
  image: string;
}

/**
 * The 2026 programme, as iitmaasangam.com publishes it.
 *
 * Titles, stories and artwork only. The panellist lists inside those modals
 * are last year's and were never cleared out — the Digital Payments panel
 * still names the OpenAI and Microsoft speakers who sat on the 2025 AI panel,
 * and the semiconductor one carries 2025's healthcare line-up. None of those
 * names appear on the 2026 speaker list. Putting them on a panel here would
 * tell an attendee to turn up for people who are not speaking.
 *
 * There are no times either: the site publishes no 2026 schedule, only last
 * year's as a pair of images. So these are what the day covers, not when.
 */
export const EVENT_PANELS: EventPanel[] = [
  {
    slug: "distinguished",
    title: "Distinguished Voices at Sangam 2026",
    story: "",
    image: "/panels/distinguished-speakers.webp",
  },
  {
    slug: "ai",
    title: "Sovereign AI - now or never? A Roadmap to get there",
    story: "GenerativeAI is beginning to be pervasive, although we must not forget PredictiveAI. The big question is Sovereign AI: where India should invest its limited generativeAI funds: in foundational models, or in the layers above and below? The layer above: use open source models, focus on applications in domains such as agriculture, medicine, defense, jurisprudence and governance? The layer below: data centers hosting multiple models? Can't ignore concerns about job loss, water/energy demand from data centers, biases from training/post training data that skew model output, hallucinations; loss of cultural and national sovereignty, based on western or chinese values or politically charged (left or right) perspectives baked into the models\".",
    image: "/panels/panel-ai.webp",
  },
  {
    slug: "defence",
    title: "Future Wars - How do we win?",
    story: "Warfare is changing with drones/missiles/space but land border supremacy, a blue water navy, and air defenses continue to be the core of national security. Surging Indian defense exports are a source of soft power as well, and must be ramped up. Jet engines and other critical technologies need to be indigenized. Information warfare, quantum warfare, and the malicious use of indian data need to be defended against.",
    image: "/panels/defence.webp",
  },
  {
    slug: "infrastructure",
    title: "Build world-class for भारत",
    story: "The creation of world-leading infra such as highways, rail, port, airport and metro as well as living/working spaces is game-changing for the average citizen. Not only is the emerging indian aesthetic eg in the new airports a matter of civic pride, but the fact that india can build the world's highest rail bridge,electrify 99.9% of its railways, dramatically increase its renewable energy output, build a graceful new state capital city: all this means that efficiency with beauty is the new mantra.",
    image: "/panels/infra.webp",
  },
  {
    slug: "fintech",
    title: "Digital Payments Revolution: Here we come, world!",
    story: "The Indian economy has grown steadily and has become resilient to external shocks. With the enthusiastic acceptance of UPI, india has set a global benchmark for Digital Public Infrastructure, and reduced its reliance on external players. The India Stack has the potential to further create \"a multi-protocol switch\" to complement SWIFT, ease trade in multiple currencies across multiple countries, and increase capital flows.",
    image: "/panels/fintech.webp",
  },
  {
    slug: "spacetech",
    title: "Space Tech - let a thousand flowers bloom",
    story: "There is an explosion of innovation in the aerospace industry in india, both in ISRO and the private sector. In addition to the official Indian manned space flight program, and reusable rockets, we have firms such as Agnikul, Skyroot, Galaxeye and a host of other private companies doing leading-edge work. There are new opportunities, in addition to traditional space exploration, including space tourism, space/satellite based warfare, space data centers, and enhanced civilian applications",
    image: "/panels/space-tech.webp",
  },
  {
    slug: "port-led",
    title: "Megaports with muscle - securing trade in the new Spice Route",
    story: "India is reviving the maritime trading power which it had 3000 years ago, through deepwater container ports such as Vizhinjam and Vadhavan, efficient cargo movement, shipbuilding, etc. Dual-use ports such as Galathea Bay in Great Nicobar enable the defense of straits and sea lanes. With a blue-water navy, port infrastructure, and the India Stack, India can attempt to recreate its earlier dominance of Indian Ocean trade, via offering quick, dependable good transportation and multi-party compatibility.",
    image: "/panels/port-led.webp",
  },
  {
    slug: "semiconductor",
    title: "Nanometers - does size really matter?",
    story: "India has always had the design talent, but it typically works for foreign firms. The physical fabs in India are now beginning to come on line, and with the manufacturing know-how, even at 28nm+, India can move up the value chain. There are also DLI recipients that are taping out their products, with production initially in overseas fabs, but moving to India shortly. Sustained progress on both fronts can reduce supply chain risks for defense and electronics manufacturing",
    image: "/panels/nanometer.webp",
  },
];

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
} | null = {
  // iitmaasangam.com carries no 2026 film yet \u2014 the event has not happened.
  // Both embeds on that site are last year's, so this is labelled as last
  // year's rather than implying it shows this year's programme. Swap the id
  // when there is a 2026 video.
  id: "HV8nfNAnBHk",
  isLive: false,
  heading: "Watch",
  caption: "Sangam 2025 \u2014 Building for Viksit Bharat",
};

export interface EventMediaItem {
  src: string;
  alt: string;
  caption?: string;
}

export const EVENT_MEDIA: EventMediaItem[] = [
  { src: "/gallery/sangam25-1.webp", alt: "Sangam 2025, photograph 1" },
  { src: "/gallery/sangam25-2.webp", alt: "Sangam 2025, photograph 2" },
  { src: "/gallery/sangam25-3.webp", alt: "Sangam 2025, photograph 3" },
  { src: "/gallery/sangam25-4.webp", alt: "Sangam 2025, photograph 4" },
  { src: "/gallery/sangam25-5.webp", alt: "Sangam 2025, photograph 5" },
  { src: "/gallery/sangam25-6.webp", alt: "Sangam 2025, photograph 6" },
  { src: "/gallery/sangam25-7.webp", alt: "Sangam 2025, photograph 7" },
  { src: "/gallery/sangam25-8.webp", alt: "Sangam 2025, photograph 8" },
  { src: "/gallery/sangam25-9.webp", alt: "Sangam 2025, photograph 9" },
  { src: "/gallery/sangam25-10.webp", alt: "Sangam 2025, photograph 10" },
  { src: "/gallery/sangam25-11.webp", alt: "Sangam 2025, photograph 11" },
  { src: "/gallery/sangam25-12.webp", alt: "Sangam 2025, photograph 12" },
  { src: "/gallery/sangam25-13.webp", alt: "Sangam 2025, photograph 13" },
  { src: "/gallery/sangam25-14.webp", alt: "Sangam 2025, photograph 14" },
  { src: "/gallery/sangam25-15.webp", alt: "Sangam 2025, photograph 15" },
  { src: "/gallery/sangam25-16.webp", alt: "Sangam 2025, photograph 16" },
  { src: "/gallery/sangam25-17.webp", alt: "Sangam 2025, photograph 17" },
  { src: "/gallery/sangam25-18.webp", alt: "Sangam 2025, photograph 18" },
  { src: "/gallery/sangam25-19.webp", alt: "Sangam 2025, photograph 19" },
  { src: "/gallery/sangam25-20.webp", alt: "Sangam 2025, photograph 20" },
  { src: "/gallery/sangam25-21.webp", alt: "Sangam 2025, photograph 21" },
  { src: "/gallery/sangam25-22.webp", alt: "Sangam 2025, photograph 22" },
  { src: "/gallery/sangam25-23.webp", alt: "Sangam 2025, photograph 23" },
  { src: "/gallery/sangam25-24.webp", alt: "Sangam 2025, photograph 24" },
  { src: "/gallery/sangam25-25.webp", alt: "Sangam 2025, photograph 25" },
  { src: "/gallery/sangam25-26.webp", alt: "Sangam 2025, photograph 26" },
  { src: "/gallery/sangam25-27.webp", alt: "Sangam 2025, photograph 27" },
  { src: "/gallery/sangam25-28.webp", alt: "Sangam 2025, photograph 28" },
  { src: "/gallery/sangam25-29.webp", alt: "Sangam 2025, photograph 29" },
  { src: "/gallery/sangam25-30.webp", alt: "Sangam 2025, photograph 30" },
  { src: "/gallery/sangam25-31.webp", alt: "Sangam 2025, photograph 31" },
  { src: "/gallery/sangam25-32.webp", alt: "Sangam 2025, photograph 32" },
  { src: "/gallery/sangam25-33.webp", alt: "Sangam 2025, photograph 33" },
  { src: "/gallery/sangam25-34.webp", alt: "Sangam 2025, photograph 34" },
  { src: "/gallery/sangam25-35.webp", alt: "Sangam 2025, photograph 35" },
  { src: "/gallery/sangam25-36.webp", alt: "Sangam 2025, photograph 36" },
  { src: "/gallery/sangam25-37.webp", alt: "Sangam 2025, photograph 37" },
  { src: "/gallery/sangam25-38.webp", alt: "Sangam 2025, photograph 38" },
  { src: "/gallery/sangam25-39.webp", alt: "Sangam 2025, photograph 39" },
  { src: "/gallery/sangam25-40.webp", alt: "Sangam 2025, photograph 40" },
  { src: "/gallery/sangam25-41.webp", alt: "Sangam 2025, photograph 41" },
  { src: "/gallery/sangam25-42.webp", alt: "Sangam 2025, photograph 42" },
  { src: "/gallery/sangam25-43.webp", alt: "Sangam 2025, photograph 43" },
  { src: "/gallery/sangam25-44.webp", alt: "Sangam 2025, photograph 44" },
  { src: "/gallery/sangam25-45.webp", alt: "Sangam 2025, photograph 45" },
];

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

export const EVENT_LEGACY_SPEAKERS: EventLegacySpeaker[] = [
  {
    slug: "shri-piyush-goyal",
    name: "Shri Piyush Goyal",
    role: "Minister for Commerce and Industry, Govt. of India | MP (Lok Sabha) North Mumbai",
    image: "/legacy/shri-piyush-goyal.webp",
  },
  {
    slug: "t-t-jagannathan",
    name: "T.T. Jagannathan",
    role: "Chairman Emeritus, TTK Prestige",
    image: "/legacy/t-t-jagannathan.webp",
  },
  {
    slug: "dr-s-somanath",
    name: "Dr. S. Somanath",
    role: "Vikram Sarabhai Professor, ISRO",
    image: "/legacy/dr-s-somanath.webp",
  },
  {
    slug: "shri-tejasvi-surya",
    name: "Shri Tejasvi Surya",
    role: "Lok Sabha MP, Bengaluru South",
    image: "/legacy/shri-tejasvi-surya.webp",
  },
  {
    slug: "sivasri-skandaprasad",
    name: "Sivasri Skandaprasad",
    role: "Founder Director at Ahuti",
    image: "/legacy/sivasri-skandaprasad.webp",
  },
  {
    slug: "dr-srivatsa-krishna-ias",
    name: "Dr. Srivatsa Krishna IAS",
    role: "CEO & Secretary, Coffee Board of India, Govt. of India",
    image: "/legacy/dr-srivatsa-krishna-ias.webp",
  },
  {
    slug: "madhavi-latha",
    name: "Madhavi Latha",
    role: "Prof. IISc",
    image: "/legacy/madhavi-latha.webp",
  },
  {
    slug: "kris-gopalakrishnan",
    name: "Kris Gopalakrishnan",
    role: "Chairman, Axilor Ventures | Co-Founder, Infosys",
    image: "/legacy/kris-gopalakrishnan.webp",
  },
  {
    slug: "dr-unnikrishnan-nair-s",
    name: "Dr. Unnikrishnan Nair S.",
    role: "Director, Vikram Sarabhai Space Centre",
    image: "/legacy/dr-unnikrishnan-nair-s.webp",
  },
  {
    slug: "prof-ashok-jhunjhunwala",
    name: "Prof. Ashok Jhunjhunwala",
    role: "Institute Professor, IIT Madras",
    image: "/legacy/prof-ashok-jhunjhunwala.webp",
  },
  {
    slug: "prof-preeti-aghalayam",
    name: "Prof. Preeti Aghalayam",
    role: "Director-in-Charge, IIT Madras Zanzibar",
    image: "/legacy/prof-preeti-aghalayam.webp",
  },
  {
    slug: "dr-shivkumar-kalyanaraman",
    name: "Dr. Shivkumar Kalyanaraman",
    role: "CEO, Anusandhan National Research Foundation, Govt. of India",
    image: "/legacy/dr-shivkumar-kalyanaraman.webp",
  },
  {
    slug: "srinivas-narayanan",
    name: "Srinivas Narayanan",
    role: "VP of Engineering, OpenAI",
    image: "/legacy/srinivas-narayanan.webp",
  },
  {
    slug: "aparna-chennapragada",
    name: "Aparna Chennapragada",
    role: "Chief Product Officer - Experiences & Devices, Microsoft",
    image: "/legacy/aparna-chennapragada.webp",
  },
  {
    slug: "tarun-mehta",
    name: "Tarun Mehta",
    role: "Co-Founder & CEO, Ather Energy Ltd.",
    image: "/legacy/tarun-mehta.webp",
  },
  {
    slug: "shyamala-rajaram",
    name: "Shyamala Rajaram",
    role: "President, IITMAA | CEO, Unimity Solutions",
    image: "/legacy/shyamala-rajaram.webp",
  },
  {
    slug: "sridhar-boovaraghavan",
    name: "Sridhar Boovaraghavan",
    role: "Secretary, IITMAA",
    image: "/legacy/sridhar-boovaraghavan.webp",
  },
  {
    slug: "bhaskar-bhat",
    name: "Bhaskar Bhat",
    role: "MD at Titan Industries",
    image: "/legacy/bhaskar-bhat.webp",
  },
  {
    slug: "k-vijay",
    name: "K. Vijay",
    role: "Executive Chairman, Ajax Engineering Limited",
    image: "/legacy/k-vijay.webp",
  },
  {
    slug: "dr-balaji-sampath",
    name: "Dr. Balaji Sampath",
    role: "Founder, AID India and Aha Guru",
    image: "/legacy/dr-balaji-sampath.webp",
  },
  {
    slug: "ambi-parameswaran",
    name: "Ambi Parameswaran",
    role: "Founder, Brand-Building.com",
    image: "/legacy/ambi-parameswaran.webp",
  },
  {
    slug: "dr-sridhar-tirumala",
    name: "Dr. Sridhar Tirumala",
    role: "Co-Founder and Co-CEO, Sukshi",
    image: "/legacy/dr-sridhar-tirumala.webp",
  },
  {
    slug: "shivani-pulimamidi",
    name: "Shivani Pulimamidi",
    role: "Co-Founder and Co-CEO, Sukshi",
    image: "/legacy/shivani-pulimamidi.webp",
  },
  {
    slug: "t-m-vijay-bhaskar",
    name: "T.M. Vijay Bhaskar",
    role: "Board of Governors, AquaMAP | Former Chief Secretary, Govt of Karnataka",
    image: "/legacy/t-m-vijay-bhaskar.webp",
  },
  {
    slug: "aravind-krishnan",
    name: "Aravind Krishnan",
    role: "MD & Head of Private Equity South East Asia, Blackstone",
    image: "/legacy/aravind-krishnan.webp",
  },
  {
    slug: "krishnan-narayanan",
    name: "Krishnan Narayanan",
    role: "Co-Founder & President Itihasa Foundation and Research",
    image: "/legacy/krishnan-narayanan.webp",
  },
  {
    slug: "swadeep-pillarisetti",
    name: "Swadeep Pillarisetti",
    role: "Founding Partner & MD, Blue Ocean Venture Partners",
    image: "/legacy/swadeep-pillarisetti.webp",
  },
  {
    slug: "cp-madhusudan",
    name: "CP Madhusudan",
    role: "Director, Vyuhaa Med Data",
    image: "/legacy/cp-madhusudan.webp",
  },
  {
    slug: "prof-rajat-moona",
    name: "Prof. Rajat Moona",
    role: "Director, IIT Gandhinagar",
    image: "/legacy/prof-rajat-moona.webp",
  },
  {
    slug: "prof-k-n-satyanarayana",
    name: "Prof. K.N. Satyanarayana",
    role: "Director, IIT Tirupati",
    image: "/legacy/prof-k-n-satyanarayana.webp",
  },
  {
    slug: "prof-shreepad-karmalkar",
    name: "Prof. Shreepad Karmalkar",
    role: "Director, IIT Bhubaneswar",
    image: "/legacy/prof-shreepad-karmalkar.webp",
  },
  {
    slug: "prof-bs-murty",
    name: "Prof. BS. Murty",
    role: "Director, IIT Hyderabad",
    image: "/legacy/prof-bs-murty.webp",
  },
  {
    slug: "jayesh-ranjan",
    name: "Jayesh Ranjan",
    role: "Special Chief Secretary, ITE&C, Govt. of Telangana",
    image: "/legacy/jayesh-ranjan.webp",
  },
  {
    slug: "bvr-mohan-reddy",
    name: "BVR Mohan Reddy",
    role: "Chairman, Cyient",
    image: "/legacy/bvr-mohan-reddy.webp",
  },
  {
    slug: "ben-mathias",
    name: "Ben Mathias",
    role: "Vertex Ventures",
    image: "/legacy/ben-mathias.webp",
  },
  {
    slug: "anil-valluri",
    name: "Anil Valluri",
    role: "Vice President, Palo Alto Networks",
    image: "/legacy/anil-valluri.webp",
  },
  {
    slug: "prof-r-sarathi",
    name: "Prof. R Sarathi",
    role: "Dean, Planning, IIT Madras",
    image: "/legacy/prof-r-sarathi.webp",
  },
  {
    slug: "phani-kishan-adellapali",
    name: "Phani Kishan Adellapali",
    role: "Co-founder, Swiggy",
    image: "/legacy/phani-kishan-adellapali.webp",
  },
  {
    slug: "kasturi-shankar",
    name: "Kasturi Shankar",
    role: "Actor, Lawyer, Activist",
    image: "/legacy/kasturi-shankar.webp",
  },
  {
    slug: "dr-ravi-gundlapalli",
    name: "Dr. Ravi Gundlapalli",
    role: "Founder & CEO, MentorCloud",
    image: "/legacy/dr-ravi-gundlapalli.webp",
  },
  {
    slug: "prof-boby-george",
    name: "Prof. Boby George",
    role: "Head, Medical Sciences & Technology, IITM",
    image: "/legacy/prof-boby-george.webp",
  },
  {
    slug: "sateesh-andra",
    name: "Sateesh Andra",
    role: "Managing Director, Endiya Partners",
    image: "/legacy/sateesh-andra.webp",
  },
  {
    slug: "dr-sapna-poti",
    name: "Dr. Sapna Poti",
    role: "Director, Strategic Alliances, Office of the Principal Scientific Adviser to Govt. of India",
    image: "/legacy/dr-sapna-poti.webp",
  },
  {
    slug: "atul-shinghal",
    name: "Atul Shinghal",
    role: "Founder and CEO, Scripbox",
    image: "/legacy/atul-shinghal.webp",
  },
  {
    slug: "dr-srikanth-sundararajan",
    name: "Dr. Srikanth Sundararajan",
    role: "General Partner, VentureEast",
    image: "/legacy/dr-srikanth-sundararajan.webp",
  },
  {
    slug: "dr-kavitha-sairam",
    name: "Dr. Kavitha Sairam",
    role: "Founder & CEO, FIB-SOL Life Technologies Pvt. Ltd.",
    image: "/legacy/dr-kavitha-sairam.webp",
  },
  {
    slug: "dr-shivakumar-kalyanaraman",
    name: "Dr. Shivakumar Kalyanaraman",
    role: "CTO, Microsoft Energy & Mobility",
    image: "/legacy/dr-shivakumar-kalyanaraman.webp",
  },
  {
    slug: "prof-m-s-sivakumar",
    name: "Prof. M.S. Sivakumar",
    role: "Ex-Dean Students, Head of the Department, Applied Mechanics, IIT Madras",
    image: "/legacy/prof-m-s-sivakumar.webp",
  },
  {
    slug: "k-r-jyothilal",
    name: "K.R. Jyothilal",
    role: "Addl. Chief Secretary, Govt. of Kerala",
    image: "/legacy/k-r-jyothilal.webp",
  },
  {
    slug: "dr-sundar-swaminathan",
    name: "Dr. Sundar Swaminathan",
    role: "Chair, Nephrology, IISc Bangalore",
    image: "/legacy/dr-sundar-swaminathan.webp",
  },
  {
    slug: "dr-sathya-sriram",
    name: "Dr. Sathya Sriram",
    role: "CEO, Apollo Preventive Care",
    image: "/legacy/dr-sathya-sriram.webp",
  },
  {
    slug: "mili-majumdar",
    name: "Mili Majumdar",
    role: "Senior Vice President, US Green Building Council",
    image: "/legacy/mili-majumdar.webp",
  },
  {
    slug: "prof-indumathi-nambi",
    name: "Prof. Indumathi Nambi",
    role: "Professor, Civil Engineering, IIT-M",
    image: "/legacy/prof-indumathi-nambi.webp",
  },
  {
    slug: "prof-krishna-kumar",
    name: "Prof. Krishna Kumar",
    role: "Institute Prof., IIT Madras",
    image: "/legacy/prof-krishna-kumar.webp",
  },
  {
    slug: "prof-ligy-philip",
    name: "Prof. Ligy Philip",
    role: "Prof., IIT,Madras",
    image: "/legacy/prof-ligy-philip.webp",
  },
];

export interface EventPastSponsor {
  slug: string;
  name: string;
  logo: string;
}

export const EVENT_PAST_SPONSORS: EventPastSponsor[] = [];

export type ScaleIcon =
  | "delegates"
  | "visitors"
  | "investors"
  | "startups"
  | "exhibitors";

export interface EventScaleStat {
  value: string;
  label: string;
  short: string;
  /** Drawn from the app's own icon set so it recolours with the palette. */
  icon: ScaleIcon;
}

const SCALE_ALL: EventScaleStat[] = [
  {
    value: EVENT_VISITOR_COUNT,
    label: "Visitors expected",
    short: "Visitors",
    icon: "visitors",
  },
  // Both from the 2026 sponsors deck (p3): "We aim to bring together 100+
  // investors and 50+ deep-tech startups". They fill the row and they are the
  // two figures a delegate actually wants before deciding to come.
  {
    value: "100+",
    label: "Investors expected",
    short: "Investors",
    icon: "investors",
  },
  {
    value: "50+",
    label: "Deep-tech startups",
    short: "Startups",
    icon: "startups",
  },
];

/**
 * Only the stats that have a number yet.
 *
 * A tile reading "TBD" in the display face is louder than no tile at all -- it
 * draws the eye to the one thing nobody has decided. Fill the counts above and
 * the tiles appear on their own.
 */
export const EVENT_SCALE: EventScaleStat[] = SCALE_ALL.filter(
  (s) => s.value && s.value !== "TBD"
);

export const EVENT_SCALE_STANDIN: EventScaleStat = {
  value: EVENT_ATTENDEE_COUNT,
  label: "Delegates",
  short: "Delegates",
  icon: "delegates",
};

/** The mark for the live exhibitor count - the Expo tab's own icon. */
export const EVENT_SCALE_EXHIBITOR_ICON = "exhibitors" as const;

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
