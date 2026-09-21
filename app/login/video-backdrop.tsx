"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  LOGIN_BACKDROP_START_SECONDS,
  LOGIN_BACKDROP_VIDEO_ID,
} from "@/lib/event-config";

/**
 * The film behind the sign-in screen.
 *
 * The hard part is the first second, not the rest. Before playback starts,
 * YouTube paints its poster frame: the video's title, the channel, and a
 * large play button dead in the middle of the player. Oversizing the iframe
 * crops the title bar and the control strip because those live at the edges,
 * but it cannot touch something in the centre — scaling up only makes it
 * bigger.
 *
 * So the player stays behind an opaque cover until it reports that it is
 * actually PLAYING, and only then does the cover fade. That needs the iframe
 * API, because nothing about a plain embed says when playback began.
 *
 * If the API is blocked or never reaches PLAYING, the cover simply stays and
 * the screen is flat maroon with the mark and the button on it — which is a
 * fine sign-in screen, and a better one than a YouTube poster. Failure here
 * is meant to look like a decision.
 *
 * Silent throughout: `mute` is both the brief and the only way autoplay is
 * permitted. With `controls: 0`, `disablekb: 1`, pointer events off in CSS
 * and the whole thing `aria-hidden` and out of the tab order, there is no
 * control to reach even if one were painted.
 *
 * Looping is done here rather than with YouTube's `loop`, which restarts at
 * zero and would put the title card on screen every time round. On ENDED it
 * seeks back to the same offset the film opened on.
 */

interface YouTubePlayer {
  destroy: () => void;
  mute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getIframe: () => HTMLIFrameElement;
}

interface YouTubeApi {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (e: { target: YouTubePlayer }) => void;
        onStateChange: (e: { data: number; target: YouTubePlayer }) => void;
      };
    }
  ) => YouTubePlayer;
  PlayerState: { PLAYING: number; ENDED: number };
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const API_SRC = "https://www.youtube.com/iframe_api";

/** Loads the iframe API once, however many times this mounts. */
function loadApi(): Promise<YouTubeApi> {
  return new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }
    // The API calls exactly one global hook, so chain rather than replace it.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT) resolve(window.YT);
    };
    if (document.querySelector(`script[src="${API_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onerror = () => reject(new Error("yt_api_unavailable"));
    document.head.appendChild(script);
  });
}

export function VideoBackdrop() {
  const host = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // Nothing to reveal if the film is not going to run.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let player: YouTubePlayer | undefined;
    let cancelled = false;

    void loadApi()
      .then((YT) => {
        if (cancelled || !host.current) return;
        // The API replaces the element it is handed with an iframe, so it gets
        // a node created here rather than one React is tracking — otherwise
        // React tries to remove a node that no longer exists on unmount.
        const mount = document.createElement("div");
        host.current.appendChild(mount);

        player = new YT.Player(mount, {
          videoId: LOGIN_BACKDROP_VIDEO_ID,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            cc_load_policy: 0,
            start: LOGIN_BACKDROP_START_SECONDS,
          },
          events: {
            onReady: (e) => {
              // The API stamps its own width/height on the iframe. Those
              // would beat the cover maths in `.login-video`, leaving a 640px
              // box on a 400px screen instead of a full-bleed crop, so they
              // are cleared and the stylesheet left to size it.
              const frame = e.target.getIframe();
              frame.className = "login-video";
              frame.removeAttribute("width");
              frame.removeAttribute("height");
              frame.style.removeProperty("width");
              frame.style.removeProperty("height");
              e.target.mute();
              e.target.playVideo();
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
              if (e.data === YT.PlayerState.ENDED) {
                e.target.seekTo(LOGIN_BACKDROP_START_SECONDS, true);
                e.target.playVideo();
              }
            },
          },
        });
      })
      .catch(() => {
        /* the cover stays; the screen is maroon and correct */
      });

    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        /* already gone */
      }
      if (host.current) host.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      className="login-backdrop pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div ref={host} />
      {/* Opaque until the player says it is running. Sits after the host in
          the DOM so it paints over the iframe without needing a z-index. */}
      <div
        className={cn(
          "absolute inset-0 bg-brand-900 transition-opacity duration-700 ease-out",
          playing ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
}
