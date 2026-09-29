import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { balloonNotes } from "../content";
import { chime, pop } from "../lib/audio";
import { burst, seeded } from "../lib/util";
import { Tag } from "./ui";

export default function Balloons() {
  const r = useMemo(() => seeded(42), []);
  const specs = useMemo(
    () =>
      balloonNotes.map((_, i) => ({
        left: 4 + ((i * 97) % 88),
        dur: 11 + r() * 8,
        delay: -r() * 14,
        sway: 10 + r() * 20,
        size: 70 + r() * 40,
        color: ["#d6452b", "#e4a73c", "#34506b", "#efc9b8", "#fbf6ec"][i % 5],
      })),
    [r],
  );
  const [popped, setPopped] = useState<number[]>([]);
  const [note, setNote] = useState<number | null>(null);

  const hit = (i: number, e: React.MouseEvent) => {
    if (popped.includes(i)) return;
    pop();
    burst(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    setPopped((p) => [...p, i]);
    setNote(i);
    if (popped.length + 1 === balloonNotes.length) setTimeout(chime, 300);
  };

  return (
    <section id="balloons" className="relative h-[110vh] min-h-[720px] overflow-hidden bg-olive text-cream">
      <div className="relative z-20 flex flex-wrap items-start justify-between gap-6 px-4 pt-24 md:px-10 lg:pl-28">
        <div>
          <Tag no="11" className="text-mustard">Pop the balloons</Tag>
          <h2 className="mt-6 max-w-2xl font-display text-[clamp(2.8rem,6.5vw,5.5rem)] leading-[0.9] tracking-tight">
            Every one has a <span className="italic text-mustard">little note</span> inside.
          </h2>
        </div>
        <div className="text-right">
          <p className="font-display text-7xl font-black leading-none tabular-nums">
            {popped.length}
            <span className="text-3xl font-light text-cream/60">/{balloonNotes.length}</span>
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/60">notes found</p>
        </div>
      </div>

      {specs.map((s, i) =>
        popped.includes(i) ? null : (
          <motion.button
            key={i}
            onClick={(e) => hit(i, e)}
            aria-label="Pop balloon"
            className="absolute bottom-0 z-10 cursor-pointer"
            style={{ left: `${s.left}%`, width: s.size }}
            initial={{ y: "30vh" }}
            animate={{ y: ["30vh", "-120vh"], x: [0, s.sway, -s.sway, 0] }}
            transition={{
              y: { duration: s.dur, repeat: Infinity, ease: "linear", delay: s.delay },
              x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.08 }}
          >
            <svg viewBox="0 0 60 110" className="w-full drop-shadow-lg">
              <path d="M30 2 C 52 2, 58 26, 56 38 C 53 58, 38 70, 30 72 C 22 70, 7 58, 4 38 C 2 26, 8 2, 30 2 Z" fill={s.color} />
              <path d="M14 18 C 18 10, 24 8, 28 8" stroke="#fff" strokeOpacity=".45" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M27 72 L33 72 L30 77 Z" fill={s.color} />
              <path d="M30 77 C 26 86, 34 94, 29 108" stroke="#fbf6ec" strokeOpacity=".7" strokeWidth="1" fill="none" />
            </svg>
          </motion.button>
        ),
      )}

      <AnimatePresence>
        {note !== null && (
          <motion.div
            key={note}
            initial={{ y: -60, rotate: -20, opacity: 0 }}
            animate={{ y: 0, rotate: -3, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute bottom-16 left-1/2 z-30 w-[min(86vw,380px)] -translate-x-1/2 bg-cream p-6 text-ink shadow-2xl"
            onClick={() => setNote(null)}
          >
            <span className="tape -top-3 left-8 -rotate-6" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">Note {popped.length} of {balloonNotes.length}</p>
            <p className="mt-2 font-hand text-4xl leading-tight">{balloonNotes[note]}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {popped.length === balloonNotes.length && (
        <button
          onClick={() => { setPopped([]); setNote(null); }}
          className="absolute bottom-6 right-6 z-30 border-2 border-cream px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] hover:bg-cream hover:text-olive"
        >
          Refill balloons
        </button>
      )}
    </section>
  );
}
