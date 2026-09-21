import { LOGIN_BACKDROP_VIDEO_ID } from "@/lib/event-config";

/**
 * The film behind the sign-in panel.
 *
 * Every parameter here is doing one of three jobs the brief asked for.
 *
 * Silent: `mute=1`. It is also what makes autoplay legal — no browser will
 * start a video with sound unprompted, so an unmuted backdrop is simply a
 * still frame. There is no way back from it either: with `controls=0` and
 * pointer events off there is no volume control to find.
 *
 * No YouTube: `controls`, `showinfo`, `iv_load_policy`, `cc_load_policy` and
 * `fs` remove what can be removed, and `rel=0` keeps the end screen to this
 * channel. The rest — the title bar, the watch-on-YouTube link — has no
 * parameter, and is cropped out of frame by the oversizing in `.login-video`.
 * The nocookie host keeps it from writing tracking cookies for a visitor who
 * has not signed in yet.
 *
 * Not clickable: pointer events are off in CSS, `disablekb=1` drops the
 * keyboard shortcuts, and `tabIndex={-1}` with `aria-hidden` keeps it out of
 * the tab order and off the accessibility tree entirely. It is scenery.
 */
export function VideoBackdrop() {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: LOGIN_BACKDROP_VIDEO_ID, // `loop` is ignored without this
    controls: "0",
    disablekb: "1",
    fs: "0",
    modestbranding: "1",
    rel: "0",
    showinfo: "0",
    iv_load_policy: "3",
    cc_load_policy: "0",
    playsinline: "1",
  });

  return (
    <div
      className="login-backdrop pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <iframe
        className="login-video"
        src={`https://www.youtube-nocookie.com/embed/${LOGIN_BACKDROP_VIDEO_ID}?${params}`}
        title=""
        tabIndex={-1}
        allow="autoplay; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
