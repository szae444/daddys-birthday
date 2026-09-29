import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { scrapbookPhotos as photos } from "../lib/photos";
import { seeded } from "../lib/util";
import { tick } from "../lib/audio";
import { Arrow, Photo, Reveal, Tag, ease } from "./ui";

function useIsDesktop() {
  const q = "(min-width: 768px)";
  const [m, setM] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

function layout(seed: number) {
  const r = seeded(seed);
  const cols = 4;
  return photos.map((_, i) => ({
    left: ((i % cols) / cols) * 82 + r() * 4,
    top: Math.floor(i / cols) * 400 + r() * 50 + (i % 2 ? 30 : 0),
    rot: (r() - 0.5) * 16,
  }));
}

function Polaroid({ i, className = "" }: { i: number; className?: string }) {
  const p = photos[i];
  return (
    <div className={`relative w-full bg-cream p-2.5 pb-12 shadow-[0_14px_30px_-12px_rgba(35,26,21,0.45)] ${className}`}>
      <span className={`tape -top-3 ${i % 2 ? "left-3 -rotate-6" : "right-3 rotate-6"}`} />
      <div className="relative aspect-square overflow-hidden">
        <Photo src={p.src} alt={p.caption} />
        {/* old-camera style date stamp */}
        {p.year && p.src && (
          <span className="absolute bottom-1.5 right-2 font-mono text-[11px] font-medium uppercase tracking-wider text-[#ffa640] [text-shadow:0_0_4px_rgba(255,120,30,0.7)]">
            {p.year}
          </span>
        )}
      </div>
      <p className="absolute bottom-2.5 left-3 right-3 truncate font-hand text-xl text-ink">{p.caption}</p>
    </div>
  );
}

export default function Scrapbook() {
  const board = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const [seed, setSeed] = useState(7);
  const pos = useMemo(() => layout(seed), [seed]);
  const [z, setZ] = useState<number[]>(() => photos.map((_, i) => i));
  const [open, setOpen] = useState<number | null>(null);
  const dragged = useRef(false);
  const rows = Math.ceil(photos.length / 4);

  const front = (i: number) => setZ((prev) => { const top = Math.max(...prev) + 1; const n = [...prev]; n[i] = top; return n; });

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o! + 1) % photos.length);
      if (e.key === "ArrowLeft") setOpen((o) => (o! - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section id="scrapbook" className="relative bg-kraft px-4 py-24 md:px-10 md:py-32 lg:pl-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Tag no="03">The Scrapbook</Tag>
          <Reveal>
            <h2 className="mt-6 font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88] tracking-tight">
              Exhibit A<span className="text-tomato">—</span>
              <br />
              <span className="italic">through Z.</span>
            </h2>
          </Reveal>
        </div>
        <div className="flex items-center gap-4">
          {desktop && (
            <span className="hidden items-center gap-2 font-hand text-2xl text-ink-soft lg:flex">
              drag them around! <Arrow className="h-10 w-16 rotate-[20deg]" />
            </span>
          )}
          <button
            onClick={() => { setSeed((s) => s + 13); tick(0.8); }}
            className="border-2 border-ink bg-paper px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] shadow-[4px_4px_0_var(--color-ink)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-ink)] active:translate-y-0.5 active:shadow-[2px_2px_0_var(--color-ink)]"
          >
            Shuffle the pile
          </button>
        </div>
      </div>

      {desktop ? (
        <div
          ref={board}
          className="dotgrid relative mt-14 rounded-sm border-2 border-dashed border-ink/25"
          style={{ height: `${rows * 400 + 60}px` }}
        >
          {photos.map((_, i) => (
            <motion.button
              key={`${seed}-${i}`}
              drag
              dragConstraints={board}
              dragElastic={0.15}
              dragMomentum
              onPointerDown={() => { dragged.current = false; front(i); }}
              onDragStart={() => { dragged.current = true; }}
              onClick={() => { if (!dragged.current) { setOpen(i); tick(); } }}
              initial={{ opacity: 0, scale: 0.6, rotate: pos[i].rot * 3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: pos[i].rot }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, rotate: 0 }}
              whileDrag={{ scale: 1.08, rotate: pos[i].rot / 3, cursor: "grabbing" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease }}
              className="absolute w-[17%] min-w-[170px] cursor-grab text-left"
              style={{ left: `${pos[i].left}%`, top: `${pos[i].top + 30}px`, zIndex: z[i] }}
              aria-label={`Open photo: ${photos[i].caption}`}
            >
              <Polaroid i={i} />
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8">
          {photos.map((_, i) => (
            <Reveal key={i} delay={(i % 2) * 0.1}>
              <button onClick={() => setOpen(i)} className="block w-full text-left" style={{ transform: `rotate(${pos[i].rot / 2}deg)` }}>
                <Polaroid i={i} />
              </button>
            </Reveal>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[65] grid place-items-center bg-ink/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              key={open}
              initial={{ scale: 0.85, rotate: -6, opacity: 0 }}
              animate={{ scale: 1, rotate: -1.5, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              onClick={(e) => e.stopPropagation()}
              className="w-[min(88vw,560px)]"
            >
              <div className="relative bg-cream p-4 pb-20">
                <div className="aspect-[4/5] overflow-hidden">
                  <Photo src={photos[open].src} alt={photos[open].caption} />
                </div>
                <p className="absolute bottom-5 left-5 font-hand text-4xl text-ink">{photos[open].caption}</p>
                <p className="absolute bottom-7 right-5 font-mono text-xs text-ink-mute">
                  {String(open + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </p>
              </div>
            </motion.div>
            <div className="absolute inset-x-4 bottom-6 flex justify-between font-mono text-xs uppercase tracking-[0.2em] text-paper md:inset-x-10">
              <button className="px-3 py-2 hover:text-mustard" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + photos.length) % photos.length); }}>← Prev</button>
              <button className="px-3 py-2 hover:text-mustard" onClick={() => setOpen(null)}>Close ✕</button>
              <button className="px-3 py-2 hover:text-mustard" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % photos.length); }}>Next →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
