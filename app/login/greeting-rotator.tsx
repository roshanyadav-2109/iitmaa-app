"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const GREETINGS = [
  "Welcome",
  "स्वागत है",
  "ಸ್ವಾಗತ",
  "स्वागत आहे",
  "வரவேற்கிறோம்",
  "স্বাগতম",
  "স্বাগতম",
  "స్వాగతం",
  "સ્વાગત છે",
  "ਸੁਆਗਤ ਹੈ",
  "ସ୍ୱାଗତ",
  "സ്വാഗതം",
  "स्वागत आसा",
];

/**
 * "Welcome", cycling through the languages the alumni actually speak.
 *
 * The one thing on the sign-in screen that could not belong to any other
 * event app, so it is the screen's headline rather than a label above the
 * button. `className` carries the colour: it sits on the maroon field here,
 * and the caller decides what reads against whatever is behind it.
 */
export function GreetingRotator({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % GREETINGS.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const greeting = GREETINGS[index];

  return (
    <div className="min-h-[52px] sm:min-h-[64px]" aria-live="polite">
      <div key={greeting} className="animate-login-greeting">
        <h1
          className={cn(
            "font-display text-[38px] font-semibold leading-none tracking-tight sm:text-[48px]",
            className
          )}
        >
          {greeting}
        </h1>
      </div>
    </div>
  );
}
