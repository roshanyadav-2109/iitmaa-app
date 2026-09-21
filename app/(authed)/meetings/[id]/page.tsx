import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * The thread for a meeting is the thread for the two people in it.
 *
 * This route used to render its own chat: a second message component, inside
 * the app's page padding, under an extra header of its own, with the composer
 * left below the fold. Both routes resolved the same conversation — the same
 * ordered participant pair — so there was never two of anything except the UI.
 *
 * So it resolves who the other person is and hands over to /chat/[userId],
 * which is the one thread that owns the screen and lays messages out as a
 * transcript. "Open chat" on the meetings list links straight there and never
 * arrives here; this stays for links already in the wild.
 */
export default async function MeetingChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirect=${encodeURIComponent(`/meetings/${id}`)}`);

  const { data } = await supabase
    .from("meetings")
    .select("requester_id, invitee_id, status")
    .eq("id", id)
    .maybeSingle();
  const meeting =
    (data as { requester_id: string; invitee_id: string; status: string } | null) ?? null;
  if (!meeting) notFound();
  if (meeting.requester_id !== user.id && meeting.invitee_id !== user.id) notFound();

  // A conversation exists once the meeting is accepted; before that there is
  // nothing to open, and the meetings list does not offer the link anyway.
  if (meeting.status !== "accepted") redirect("/meetings");

  const peerId =
    meeting.requester_id === user.id ? meeting.invitee_id : meeting.requester_id;
  redirect(`/chat/${peerId}`);
}
