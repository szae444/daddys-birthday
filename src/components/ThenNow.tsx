import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { dad, thenAndNow } from "../content";
import { resolvePhoto } from "../lib/photos";
import { tick } from "../lib/audio";
import { Arrow, Reveal, Tag } from "./ui";

type Side = typeof thenAndNow.then;

function Img({ side, className = "" }: { side: Side; className?: string }) {
  return (
    <img
      src={resolvePhoto(side.src)}
      alt={side.label}
      draggable={false}
      className={`absolute inset-0 h-full w-full select-none object-cover ${className}`}
      style={{ objectPosition: side.focus, transform: `scale(${side.zoom})`, transformOrigin: side.focus }}
    />
  );
}

/** Drag the handle to wipe between an old photo and a new one */
export default function ThenNow() {
  const box = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(50);
  const dragging = useRef(false);
  const inView = useInView(box, { once: true, margin: "-25% 0px" });
  const touched = useRef(false);

  // A little "wipe" hint the first time it scrolls into view
  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = animate(50, [50, 18, 82, 50], {
      duration: 2.6,
      ease: "easeInOut",
      onUpdate: (v) => { if (!touched.current) setX(v); },
    });
    return () => c.stop();
  }, [inView]);

  const move = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setX(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  if (!resolvePhoto(thenAndNow.then.src) || !resolvePhoto(thenAndNow.now.src)) return null;

  return (
    <section id="thennow" className="relative bg-paper px-4 py-28 md:px-10 md:py-36 lg:pl-28">
      <div className="grid grid-cols-12 items-center gap-y-12 md:gap-x-10">
        <div className="col-span-12 lg:col-span-4">
          <Tag no="04" className="text-denim">Then &amp; Now</Tag>
          <Reveal>
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.88] tracking-tight">
              Then<span className="text-tomato">&amp;</span>
              <br />
              <span className="italic">Now.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xs text-ink-soft">Slide between the years. Same guy, same grin, just a few more stories.</p>
          </Reveal>
          <div className="mt-8 hidden items-center gap-2 text-ink-soft lg:flex">
            <span className="font-hand text-2xl">drag the handle</span>
            <Arrow className="h-10 w-16 -rotate-12" />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="relative rotate-[0.6deg] bg-cream p-3 pb-12 shadow-[0_30px_60px_-30px_rgba(35,26,21,0.55)] md:p-4 md:pb-14">
            <span className="tape -top-3 left-10 -rotate-6" />
            <span className="tape -top-3 right-10 rotate-3" />
            <div
              ref={box}
              role="slider"
              tabIndex={0}
              aria-label={`Compare ${dad.name} then and now`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(x)}
              className="relative aspect-[4/3] cursor-ew-resize touch-none overflow-hidden bg-ink"
              onPointerDown={(e) => {
                touched.current = true;
                dragging.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                move(e.clientX);
                tick(0.9);
              }}
              onPointerMove={(e) => dragging.current && move(e.clientX)}
              onPointerUp={() => { dragging.current = false; }}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") { touched.current = true; setX((v) => Math.max(0, v - 5)); }
                if (e.key === "ArrowRight") { touched.current = true; setX((v) => Math.min(100, v + 5)); }
              }}
            >
              <Img side={thenAndNow.now} />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
                <Img side={thenAndNow.then} className="sepia-[0.25] saturate-[0.9]" />
              </div>

              <span className="absolute left-3 top-3 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-paper" style={{ opacity: x > 12 ? 1 : 0 }}>
                {thenAndNow.then.label}
              </span>
              <span className="absolute right-3 top-3 bg-tomato px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cream" style={{ opacity: x < 88 ? 1 : 0 }}>
                {thenAndNow.now.label}
              </span>

              {/* handle */}
              <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-cream shadow-[0_0_0_1px_rgba(35,26,21,0.25)]" style={{ left: `${x}%` }}>
                <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-ink bg-cream font-mono text-sm text-ink shadow-lg">
                  ◀▶
                </span>
              </div>
            </div>
            <p className="absolute bottom-3 left-4 font-hand text-2xl text-ink md:bottom-4 md:text-3xl">{thenAndNow.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
