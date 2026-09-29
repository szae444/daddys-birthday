/* Background music controller.
   Streams the song from YouTube through the official IFrame Player API.
   If YouTube can't load (offline, blocked, embedding disabled) it falls
   back to the synthesised music-box "Happy Birthday". */
import { music as cfg } from "../content";
import { musicBox } from "./audio";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type MusicState = {
  playing: boolean;
  source: "youtube" | "musicbox";
  ready: boolean;
  /** true while the cake's "Happy Birthday" is interrupting the song */
  singing: boolean;
};

const LOAD_TIMEOUT = 12000;

class Music {
  state: MusicState = { playing: false, source: cfg.youtubeId ? "youtube" : "musicbox", ready: !cfg.youtubeId, singing: false };
  private player: any = null;
  private want = false;
  private listeners = new Set<(s: MusicState) => void>();

  constructor() {
    if (this.state.source === "musicbox") this.useMusicBox();
  }

  subscribe(fn: (s: MusicState) => void) {
    this.listeners.add(fn);
    fn(this.state);
    return () => { this.listeners.delete(fn); };
  }

  private set(p: Partial<MusicState>) {
    this.state = { ...this.state, ...p };
    this.listeners.forEach((f) => f(this.state));
  }

  /** Create the (small, visible) YouTube player inside `host`. Call once, early. */
  mount(host: HTMLElement) {
    if (this.player || this.state.source !== "youtube") return;
    const target = document.createElement("div");
    host.appendChild(target);

    const create = () => {
      if (this.player || this.state.source !== "youtube") return;
      this.player = new window.YT.Player(target, {
        videoId: cfg.youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          playlist: cfg.youtubeId,
          start: cfg.startAt || 0,
        },
        events: {
          onReady: () => {
            this.player.setVolume(cfg.volume ?? 70);
            this.set({ ready: true });
            if (this.want) this.player.playVideo();
          },
          onStateChange: (e: { data: number }) => {
            const S = window.YT.PlayerState;
            if (e.data === S.PLAYING) this.set({ playing: true });
            else if (e.data === S.PAUSED) this.set({ playing: false });
            else if (e.data === S.ENDED) {
              this.player.seekTo(cfg.startAt || 0, true);
              this.player.playVideo();
            }
          },
          onError: () => this.fallback(),
        },
      });
    };

    if (window.YT?.Player) create();
    else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { prev?.(); create(); };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.onerror = () => this.fallback();
        document.head.appendChild(s);
      }
    }
    window.setTimeout(() => { if (!this.state.ready && this.state.source === "youtube") this.fallback(); }, LOAD_TIMEOUT);
  }

  private useMusicBox() {
    musicBox.onChange = (p) => { if (!this.state.singing) this.set({ playing: p }); };
  }

  private fallback() {
    if (this.state.source === "musicbox") return;
    try { this.player?.destroy(); } catch { /* already gone */ }
    this.player = null;
    this.useMusicBox();
    this.set({ source: "musicbox", ready: true, playing: false });
    if (this.want) musicBox.start();
  }

  start() {
    this.want = true;
    if (this.state.source === "musicbox") musicBox.start();
    else if (this.state.ready) this.player.playVideo();
  }

  stop() {
    this.want = false;
    if (this.state.source === "musicbox") musicBox.stop();
    else this.player?.pauseVideo?.();
  }

  toggle() {
    this.want || this.state.playing ? this.stop() : this.start();
  }

  /** Cake button: pause the song, play "Happy Birthday" once, then resume. */
  singHappyBirthday() {
    if (this.state.singing) {
      musicBox.stop();
      return;
    }
    const resume = this.want;
    if (this.state.source === "youtube") this.player?.pauseVideo?.();
    else musicBox.stop();
    this.set({ singing: true });
    const restore = musicBox.onChange;
    musicBox.playOnce();
    // Finishing the song, or pressing the button again, ends the interruption
    musicBox.onChange = (p) => {
      if (p) return;
      musicBox.onChange = restore;
      this.set({ singing: false });
      if (resume) this.start();
    };
  }
}

export const music = new Music();
