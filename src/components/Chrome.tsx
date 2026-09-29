/* Site "chrome": index rail, scroll progress, sound dock, footer */
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { dad, music as song } from "../content";
import { isMuted, setMuted } from "../lib/audio";
import { music, type MusicState } from "../lib/music";

const songTitle = song.title;
const songArtist = song.artist;
import { emojiRain } from "../lib/util";

export const sections = [
  { id: "cover", label: "Cover" },
  { id: "letter", label: "The Letter" },
  { id: "scrapbook", label: "Scrapbook" },
  { id: "thennow", label: "Then & Now" },
  { id: "years", label: "The Years" },
  { id: "numbers", label: "Numbers" },
  { id: "reasons", label: "Reasons" },
  { id: "cake", label: "The Cake" },
  { id: "jokes", label: "Jokes" },
  { id: "gifts", label: "Gifts" },
  { id: "balloons", label: "Balloons" },
  { id: "wishes", label: "Wish Wall" },
];

export function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[55] h-1 origin-left bg-tomato" />;
}

function useActive() {
  const [active, setActive] = useState("cover");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

export function IndexRail() {
  const active = useActive();
  const [open, setOpen] = useState(false);
  const dark = ["years", "cake", "balloons"].includes(active);

  return (
    <>
      {/* Desktop rail */}
      <nav
        aria-label="Sections"
        className={`fixed left-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-2.5 transition-all duration-500 lg:flex ${dark ? "text-paper" : "text-ink"} ${active === "years" ? "pointer-events-none opacity-0" : ""}`}
      >
        {sections.map((s, i) => {
          const on = active === s.id;
          return (
            <a key={s.id} href={`#${s.id}`} className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
              <span className={`transition-all duration-300 ${on ? "text-tomato" : "opacity-40 group-hover:opacity-100"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`h-px transition-all duration-500 ${on ? "w-6 bg-tomato" : "w-2 bg-current opacity-30"}`} />
              <span className={`whitespace-nowrap px-1.5 py-0.5 transition-all duration-300 ${dark ? "bg-ink" : "bg-paper"} -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100`}>
                {s.label}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Mobile index */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] shadow-[3px_3px_0_var(--color-ink)] lg:hidden"
      >
        Index
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            exit={{ clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[66] flex flex-col justify-center bg-ink px-6 text-paper lg:hidden"
          >
            <button onClick={() => setOpen(false)} className="absolute right-5 top-5 font-mono text-xs uppercase tracking-[0.2em]">Close ✕</button>
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-paper/15 py-2">
                <span className="font-mono text-xs text-tomato">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-3xl italic">{s.label}</span>
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export function SoundDock() {
  const [state, setState] = useState<MusicState>(music.state);
  const [muted, setM] = useState(isMuted());
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => music.subscribe(setState), []);
  // Create the YouTube player right away so it's ready when the envelope opens
  useEffect(() => { if (host.current) music.mount(host.current); }, []);

  const yt = state.source === "youtube";
  const showCard = yt && state.playing;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2"
      data-music-source={state.source}
      data-music-playing={state.playing}
      data-music-ready={state.ready}
    >
      {/* The YouTube player itself stays invisible: audio only */}
      <div
        ref={host}
        aria-hidden
        className="pointer-events-none fixed bottom-0 right-0 -z-10 h-[200px] w-[200px] overflow-hidden opacity-0 [&>iframe]:h-full [&>iframe]:w-full"
      />

      {/* Now-playing card: text only */}
      <div
        className={`absolute bottom-full right-0 mb-3 flex items-center gap-3 bg-ink py-2.5 pl-3 pr-4 text-paper shadow-[0_20px_40px_-15px_rgba(35,26,21,0.6)] transition-all duration-500 ease-[var(--ease-out-expo)] ${
          showCard ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        } ${yt ? "" : "hidden"}`}
        aria-live="polite"
      >
        <span className="flex h-5 items-end gap-[3px]" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="eq-bar w-[3px] bg-mustard" style={{ animationDelay: `${i * -0.23}s` }} />
          ))}
        </span>
        <span className="whitespace-nowrap">
          <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-mustard">Now playing</span>
          <span className="block font-display text-base leading-tight">
            <span className="italic">{songTitle}</span>
            <span className="text-paper/60"> by </span>
            {songArtist}
          </span>
        </span>
      </div>

      <AnimatePresence>
        {!yt && state.playing && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="hidden bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-paper sm:block"
          >
            ♪ Now playing — Happy Birthday (music box)
          </motion.span>
        )}
      </AnimatePresence>
      <button
        onClick={() => { const m = !muted; setMuted(m); setM(m); }}
        aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
        className="grid h-11 w-11 place-items-center border-2 border-ink bg-paper font-mono text-sm shadow-[3px_3px_0_var(--color-ink)]"
      >
        {muted ? "🔇" : "🔊"}
      </button>
      <button
        onClick={() => music.toggle()}
        aria-label={state.playing ? "Pause music" : "Play music"}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-ink shadow-lg transition-transform hover:scale-105"
      >
        <span
          className={`absolute inset-1 rounded-full ${state.playing ? "spin-slow" : ""}`}
          style={{ background: "repeating-radial-gradient(circle, #231a15 0 2px, #3a2c24 2px 4px)" }}
        />
        <span className="relative grid h-5 w-5 place-items-center rounded-full bg-tomato text-[8px] text-cream">{state.playing ? "❚❚" : "▶"}</span>
      </button>
    </div>
  );
}

export function Footer({ onReplay }: { onReplay: () => void }) {
  return (
    <footer className="relative overflow-hidden bg-tomato px-4 pb-24 pt-24 text-cream md:px-10 lg:pl-28">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/70">End of issue · Thanks for reading</p>
      <h2 className="mt-6 font-display text-[clamp(4rem,15vw,14rem)] font-black leading-[0.82] tracking-[-0.04em]">
        Love you,
        <br />
        <span className="font-light italic">{dad.name}.</span>
      </h2>
      <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-t-2 border-cream/40 pt-6">
        <p className="font-hand text-3xl">Made with every bit of love — {dad.from}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => emojiRain()} className="border-2 border-cream px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-cream hover:text-tomato">
            One more party 🎉
          </button>
          <button onClick={onReplay} className="bg-cream px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-tomato transition-colors hover:bg-ink hover:text-cream">
            Read it again ↺
          </button>
        </div>
      </div>
      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/50">psst — try ↑ ↑ ↓ ↓ ← → ← → B A</p>
    </footer>
  );
}
