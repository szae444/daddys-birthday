import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { dad, wishes } from "../content";
import { chime } from "../lib/audio";
import { Reveal, Tag } from "./ui";

type Wish = { name: string; text: string; mine?: boolean; id: number };
const KEY = "dad-bday-wishes";
const colors = ["bg-mustard", "bg-blush", "bg-cream", "bg-[#c9d3a8]", "bg-[#bccddb]"];

function load(): Wish[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export default function WishWall() {
  const [mine, setMine] = useState<Wish[]>(load);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const all: Wish[] = [...wishes.map((w, i) => ({ ...w, id: -1 - i })), ...mine];

  const save = (list: Wish[]) => {
    setMine(list);
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
  };

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    save([...mine, { name: name.trim() || "Someone who loves you", text: text.trim(), mine: true, id: Date.now() }]);
    setText("");
    chime();
  };

  return (
    <section id="wishes" className="dotgrid relative bg-paper px-4 py-28 md:px-10 md:py-36 lg:pl-28">
      <div className="grid grid-cols-12 gap-y-14 md:gap-x-10">
        <div className="col-span-12 lg:col-span-4">
          <Tag no="12" className="text-tomato">The Wish Wall</Tag>
          <Reveal>
            <h2 className="mt-6 font-display text-[clamp(3rem,6vw,5rem)] leading-[0.9] tracking-tight">
              Pin a wish for <span className="italic">{dad.name}.</span>
            </h2>
          </Reveal>
          <form onSubmit={add} className="mt-10 space-y-4 border-2 border-ink bg-cream p-5 shadow-[6px_6px_0_var(--color-ink)]">
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">From</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                placeholder="Your name"
                className="mt-1 w-full border-b-2 border-ink/30 bg-transparent py-1 font-hand text-2xl outline-none transition-colors placeholder:text-ink-mute/60 focus:border-tomato"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">Your wish</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={160}
                rows={3}
                placeholder="Happy birthday! I hope…"
                className="mt-1 w-full resize-none border-b-2 border-ink/30 bg-transparent py-1 font-hand text-2xl leading-snug outline-none transition-colors placeholder:text-ink-mute/60 focus:border-tomato"
              />
            </label>
            <button className="w-full bg-ink py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-tomato">
              Pin it to the wall →
            </button>
          </form>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            <AnimatePresence>
              {all.map((w, i) => (
                <motion.div
                  key={w.id}
                  layout
                  initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: ((i * 37) % 9) - 4 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  whileHover={{ rotate: 0, scale: 1.04, zIndex: 5 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`relative aspect-square p-4 shadow-[0_10px_24px_-12px_rgba(35,26,21,0.5)] ${colors[i % colors.length]}`}
                >
                  <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-tomato shadow" />
                  <p className="mt-3 font-hand text-xl leading-snug text-ink md:text-2xl">{w.text}</p>
                  <p className="absolute bottom-3 left-4 right-8 truncate font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft">— {w.name}</p>
                  {w.mine && (
                    <button
                      onClick={() => save(mine.filter((m) => m.id !== w.id))}
                      aria-label="Remove this wish"
                      className="absolute bottom-2 right-2 grid h-6 w-6 place-items-center text-ink-mute hover:text-tomato"
                    >
                      ✕
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
