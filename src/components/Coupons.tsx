import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { coupons, dad } from "../content";
import { chime } from "../lib/audio";
import { burst } from "../lib/util";
import { Reveal, Tag } from "./ui";

/** A single scratch-off coupon drawn on a <canvas> foil layer */
function Scratch({ c, i }: { c: (typeof coupons)[number]; i: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  const drawing = useRef(false);

  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const r = { width: cv.offsetWidth, height: cv.offsetHeight };
    const dpr = window.devicePixelRatio || 1;
    cv.width = r.width * dpr;
    cv.height = r.height * dpr;
    ctx.scale(dpr, dpr);
    // foil
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, "#b9ab94");
    g.addColorStop(0.5, "#d9cdb8");
    g.addColorStop(1, "#a99a82");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, r.width, r.height);
    for (let k = 0; k < 900; k++) {
      ctx.fillStyle = `rgba(35,26,21,${Math.random() * 0.08})`;
      ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 2, 2);
    }
    ctx.fillStyle = "#231a15";
    ctx.font = "500 12px 'DM Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE  ✺  SCRATCH HERE", r.width / 2, r.height / 2 + 4);
  }, []);

  const scratch = (e: React.PointerEvent) => {
    if (!drawing.current || done) return;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 22, 0, Math.PI * 2);
    ctx.fill();
  };

  const check = () => {
    drawing.current = false;
    if (done) return;
    const cv = canvas.current!;
    const data = cv.getContext("2d")!.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0;
    for (let k = 3; k < data.length; k += 64) if (data[k] === 0) clear++;
    if (clear / (data.length / 64) > 0.5) {
      setDone(true);
      chime();
      const b = cv.getBoundingClientRect();
      burst((b.left + b.width / 2) / window.innerWidth, (b.top + b.height / 2) / window.innerHeight);
    }
  };

  return (
    <Reveal delay={i * 0.1}>
      <div
        className={`relative flex border-2 border-ink bg-cream ${i % 2 ? "md:translate-y-10 rotate-1" : "-rotate-1"}`}
      >
        {/* stub */}
        <div className="flex w-16 shrink-0 flex-col items-center justify-center border-r-2 border-dashed border-ink/40 py-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
            Admit one · No. 00{i + 1}
          </span>
        </div>
        <div className="relative flex-1 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">This coupon entitles {dad.name} to</p>
          <div className="relative mt-3 min-h-[92px]">
            <div className="flex min-h-[92px] flex-col justify-center">
              <p className="font-display text-2xl leading-tight tracking-tight md:text-3xl">{c.title}</p>
              <p className="mt-1 font-hand text-xl text-ink-soft">{c.fine}</p>
            </div>
            <motion.canvas
              ref={canvas}
              animate={done ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={`absolute inset-0 h-full w-full touch-none ${done ? "pointer-events-none" : "cursor-crosshair"}`}
              onPointerDown={(e) => { drawing.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); scratch(e); }}
              onPointerMove={scratch}
              onPointerUp={check}
              onPointerLeave={check}
              aria-label="Scratch to reveal the coupon"
            />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute">No expiry date. Non-transferable. Redeem with a hug.</p>
        </div>
        {done && (
          <motion.span
            initial={{ scale: 2, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: -14 }}
            className="absolute -right-3 -top-4 border-2 border-tomato px-2 py-0.5 font-mono text-xs uppercase tracking-[0.2em] text-tomato"
          >
            Valid ✓
          </motion.span>
        )}
      </div>
    </Reveal>
  );
}

export default function Coupons() {
  return (
    <section id="gifts" className="relative px-4 py-28 md:px-10 md:py-40 lg:pl-28">
      <div className="grid grid-cols-12 gap-y-12">
        <div className="col-span-12 md:col-span-8 lg:col-span-6">
          <Tag no="10" className="text-denim">The Gift Coupons</Tag>
          <Reveal>
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.88] tracking-tight">
              Scratch to <span className="italic text-tomato">claim</span> your prizes.
            </h2>
          </Reveal>
        </div>
        <div className="col-span-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c, i) => (
            <Scratch key={i} c={c} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
