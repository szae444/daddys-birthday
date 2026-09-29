import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { useState } from "react";
import { reasons } from "../content";
import { tick } from "../lib/audio";
import { Reveal, Tag, ease } from "./ui";

const tones = [
  "bg-cream text-ink",
  "bg-tomato text-cream",
  "bg-olive text-cream",
  "bg-mustard text-ink",
  "bg-denim text-cream",
];

function TopCard({ i, onThrow }: { i: number; onThrow: (dir: number) => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-18, 18]);
  return (
    <motion.div
      drag="x"
      dragSnapToOrigin
      style={{ x, rotate }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) onThrow(Math.sign(info.offset.x) || 1);
      }}
      initial={{ scale: 0.95, y: 16 }}
      animate={{ scale: 1, y: 0 }}
      variants={{ out: (dir: number) => ({ x: dir * 600, rotate: dir * 30, opacity: 0, transition: { duration: 0.45, ease } }) }}
      exit="out"
      className={`absolute inset-0 flex cursor-grab flex-col justify-between p-8 shadow-[0_24px_50px_-20px_rgba(35,26,21,0.55)] active:cursor-grabbing md:p-10 ${tones[i % tones.length]}`}
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] opacity-70">
        <span>Reason</span>
        <span>#{String(i + 1).padStart(2, "0")}</span>
      </div>
      <p className="font-display text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.05] tracking-tight">{reasons[i]}</p>
      <p className="font-hand text-2xl opacity-80">— swipe for another</p>
    </motion.div>
  );
}

export default function Reasons() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [seen, setSeen] = useState(1);

  const next = (d = 1) => {
    setDir(d);
    setIdx((i) => (i + 1) % reasons.length);
    setSeen((s) => Math.min(s + 1, reasons.length));
    tick(1.2);
  };

  return (
    <section id="reasons" className="relative overflow-hidden bg-blush px-4 py-28 md:px-10 md:py-36 lg:pl-28">
      <div className="grid grid-cols-12 items-center gap-y-16 md:gap-x-10">
        <div className="col-span-12 md:col-span-6">
          <Tag no="07" className="text-tomato-deep">Reasons, ranked</Tag>
          <Reveal>
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.88] tracking-tight">
              Why you're
              <br />
              <span className="italic">the best.</span>
            </h2>
          </Reveal>
          <div className="mt-10 flex items-end gap-4">
            <span className="font-display text-[8rem] font-black leading-[0.75] text-tomato tabular-nums">
              {String(seen).padStart(2, "0")}
            </span>
            <span className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              of {reasons.length} read
              <br />
              {seen === reasons.length ? "(the list goes on forever)" : "keep going"}
            </span>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[400px]">
            {/* the pile beneath */}
            {[2, 1].map((o) => (
              <div
                key={o}
                className={`absolute inset-0 ${tones[(idx + o) % tones.length]} border border-ink/10`}
                style={{ transform: `rotate(${o * 3 * (o % 2 ? 1 : -1)}deg) translateY(${o * 8}px)` }}
              />
            ))}
            <AnimatePresence custom={dir} initial={false}>
              <TopCard key={idx} i={idx} onThrow={next} />
            </AnimatePresence>
          </div>
          <div className="mt-10 flex justify-center gap-3">
            <button
              onClick={() => next(-1)}
              className="border-2 border-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-paper"
              aria-label="Next reason"
            >
              ← Toss
            </button>
            <button
              onClick={() => next(1)}
              className="border-2 border-ink bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-tomato hover:border-tomato"
            >
              Next reason →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
