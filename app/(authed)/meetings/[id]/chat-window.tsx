"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Send, Loader2 } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/utils";
import { groupByDay, messageMeta } from "@/lib/chat-format";

interface Person {
  full_name: string | null;
  photo_url: string | null;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

/**
 * The thread opened from a meeting.
 *
 * Laid out as a transcript, the same as /chat/[userId]: one column, with a
 * name and a face on every message. It used to be bubbles pushed to opposite
 * sides, which on a phone turns a conversation into two columns of half-width
 * scraps and leaves who is speaking encoded in a background colour.
 *
 * It needs both people to do that, so the page passes them down — it has
 * already fetched the requester and the invitee to draw its own header.
 */
export function ChatWindow({
  conversationId,
  userId,
  me,
  peer,
}: {
  conversationId: string;
  userId: string;
  me: Person;
  peer: Person;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement | null>(null);
  // "5m ago" is computed from the clock, so it is held back until after
  // hydration rather than rendered once on the server and again differently.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, conversation_id, sender_id, body, read_at, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      setMessages((data as Message[] | null) ?? []);
    })();
  }, [supabase, conversationId]);

  useEffect(() => {
    const ch = supabase
      .channel(`conv-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (payload.eventType === "INSERT") {
              const next = payload.new as Message;
              if (prev.some((m) => m.id === next.id)) return prev;
              return [...prev, next];
            }
            if (payload.eventType === "UPDATE") {
              const next = payload.new as Message;
              return prev.map((m) => (m.id === next.id ? next : m));
            }
            if (payload.eventType === "DELETE") {
              const old = payload.old as { id: string };
              return prev.filter((m) => m.id !== old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [supabase, conversationId]);

  useEffect(() => {
    const unread = messages.filter((m) => m.sender_id !== userId && !m.read_at);
    if (unread.length === 0) return;
    (async () => {
      const ids = unread.map((m) => m.id);
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .in("id", ids);
    })();
  }, [messages, userId, supabase]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function send() {
    const text = body.trim();
    if (!text || text.length > 2000) return;
    startTransition(async () => {
      const { error } = await supabase
        .from("messages")
        .insert({ conversation_id: conversationId, sender_id: userId, body: text });
      if (!error) setBody("");
    });
  }

  const grouped = groupByDay(messages);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-3 py-3 sm:px-4">
        {messages.length === 0 ? (
          <div className="py-12 text-center text-sm text-brand-900/60">
            No messages yet. Say hi.
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {grouped.map((g, gi) => (
              <li key={`g-${gi}`}>
                <div className="my-2 flex items-center gap-3">
                  <span className="h-px flex-1 bg-rule" aria-hidden />
                  <span className="text-[11px] font-medium text-brand-900/55">
                    {g.day}
                  </span>
                  <span className="h-px flex-1 bg-rule" aria-hidden />
                </div>

                <ul className="flex flex-col">
                  {g.items.map((m) => {
                    const mine = m.sender_id === userId;
                    const who = mine ? me : peer;
                    const name = mine
                      ? (me.full_name ?? "You")
                      : (peer.full_name ?? "Attendee");
                    return (
                      <li key={m.id} className="flex gap-3 px-1 py-2.5">
                        <Avatar className="size-12 shrink-0 rounded-md ring-1 ring-rule">
                          {who.photo_url ? (
                            <AvatarImage
                              src={who.photo_url}
                              alt=""
                              className="rounded-md object-cover"
                            />
                          ) : null}
                          <AvatarFallback className="rounded-md bg-paper-deep text-[13px] font-semibold text-brand-800">
                            {initials(name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <p className="text-[13.5px] font-semibold leading-tight text-brand-950">
                              {name}
                            </p>
                            <span className="text-[11px] tabular-nums text-brand-900/55">
                              {messageMeta(mine, m.created_at, m.read_at, mounted)}
                            </span>
                          </div>
                          <p className="mt-1 whitespace-pre-line break-words text-[14px] leading-6 text-brand-950">
                            {m.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-rule bg-white px-3 py-2">
        <div className="flex items-end gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 2000))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className="max-h-32 min-h-[40px] w-full min-w-0 flex-1 resize-none rounded-md border border-rule-strong bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-brand-800 focus:ring-2 focus:ring-rule"
          />
          <button
            type="button"
            onClick={send}
            disabled={pending || !body.trim()}
            className="inline-grid h-10 w-10 place-items-center rounded-md bg-brand-800 text-white transition-colors hover:bg-brand-900 disabled:opacity-60"
            aria-label="Send"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
