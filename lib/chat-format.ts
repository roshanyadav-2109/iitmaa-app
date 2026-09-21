/**
 * Formatting shared by the two message threads.
 *
 * There are two of them — the standalone chat at /chat/[userId] and the one
 * opened from a meeting at /meetings/[id] — and they had drifted: the chat was
 * rebuilt as a transcript while the meeting thread kept the older left/right
 * bubbles, so the same conversation looked like two different products
 * depending on which door you came through.
 *
 * These live here so the next change to how a message reads lands in both.
 */

/** The clock time a message was sent. */
export function timeShort(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * How long ago, in the fewest words that still say it: "just now" for the
 * last minute, then minutes, then hours, then nothing. Used for when a
 * message was read, which is a different question from when it was sent.
 *
 * Past a day it is deliberately empty, leaving a bare "Seen". A date there
 * would be read as when the message was sent, and the send time is already
 * the other half of the line — "Seen 16 May | 10:24" says two different days
 * about one message.
 */
export function agoShort(iso: string): string {
  const secs = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return "";
}

/** The separator above a day's messages. */
export function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(d, today)) return "Today";
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(d, yesterday)) return "Yesterday";

  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Messages in order, split into runs that share a day.
 *
 * Takes the shape rather than a concrete message type, so both threads can
 * pass their own row type without either of them owning the other's.
 */
export function groupByDay<T extends { created_at: string }>(
  messages: T[]
): { day: string; items: T[] }[] {
  const grouped: { day: string; items: T[] }[] = [];
  for (const m of messages) {
    const day = dayLabel(m.created_at);
    const last = grouped[grouped.length - 1];
    if (last && last.day === day) last.items.push(m);
    else grouped.push({ day, items: [m] });
  }
  return grouped;
}

/**
 * The line beside a sender's name: when it was sent, and for your own
 * messages whether it has been seen.
 */
export function messageMeta(
  mine: boolean,
  createdAt: string,
  readAt: string | null,
  showAgo: boolean
): string {
  if (!mine) return timeShort(createdAt);
  const state = readAt
    ? ["Seen", showAgo ? agoShort(readAt) : ""].filter(Boolean).join(" ")
    : "Sent";
  return [state, timeShort(createdAt)].join(" | ");
}
