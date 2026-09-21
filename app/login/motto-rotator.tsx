"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * The IIT Madras motto, cycling through three languages.
 *
 * The motto is Sanskrit — सिद्धिर्भवति कर्मजा, from Bhagavad Gita 4.12 — and
 * the institute renders it in English as "Success is born out of action".
 * Those two are the institute's own words.
 *
 * The Tamil is a translation, not an official rendering: IIT Madras publishes
 * no Tamil version of the motto, so there was nothing to copy. It is marked
 * here rather than quietly presented as official, because this screen is seen
 * by people who would know the difference.
 *
 * Devanagari is the script Sanskrit and Hindi share, so the middle entry
 * serves as both — a separate Hindi paraphrase beside the original would be
 * the same sentence twice in the same letters.
 */
const MOTTO: {
  lang: string;
  text: string;
  official: boolean;
  /** Poppins carries Latin and Devanagari; Tamil needs its own face. */
  font?: string;
}[] = [
  { lang: "English", text: "Success is born out of action", official: true },
  { lang: "Sanskrit", text: "सिद्धिर्भवति कर्मजा", official: true },
  {
    lang: "Tamil",
    text: "செயலால் வெற்றி பிறக்கும்",
    official: false,
    font: "font-tamil",
  },
];

/** Long enough to read a phrase rather than glimpse a word. */
const HOLD_MS = 3600;

export function MottoRotator({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % MOTTO.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, []);

  const line = MOTTO[index];

  return (
    // The height is fixed to the tallest of the three so the lines below do
    // not step up and down as the phrase changes — Devanagari and Tamil both
    // carry marks above and below the baseline that English does not.
    <div className="min-h-[96px] sm:min-h-[112px]" aria-live="polite">
      <div
        key={line.text}
        className="animate-login-greeting"
        // The keyframe fades in and out at its own start and end, so its
        // duration has to track the interval or the phrase sits invisible in
        // the gap between them.
        style={{ animationDuration: `${HOLD_MS}ms` }}
      >
        <p className="eyebrow text-gold-400/75">{line.lang}</p>
        <h1
          className={cn(
            "mt-2 max-w-[16ch] font-display text-[30px] font-semibold leading-[1.15] tracking-tight sm:text-[38px] sm:leading-[1.1]",
            line.font,
            className
          )}
        >
          {line.text}
        </h1>
      </div>
    </div>
  );
}
