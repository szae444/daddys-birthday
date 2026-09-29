import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { dad } from "../content";
import { celebratingAge, fmt, birth, isBirthdayToday, nextBirthday, useNow } from "../lib/util";
import { Arrow, Photo, Starburst, ease } from "./ui";

const coverLines = [
  { p: "02", t: "A letter he'll pretend not to cry at", href: "#letter" },
  { p: "03", t: "The scrapbook: evidence of a life well-lived", href: "#scrapbook" },
  { p: "04", t: "Then & now: same grin, more stories", href: "#thennow" },
  { p: "07", t: "10 reasons, ranked (they're all #1)", href: "#reasons" },
  { p: "08", t: "Make a wish — blow out the candles", href: "#cake" },
  { p: "09", t: "The joke machine (groans guaranteed)", href: "#jokes" },
];

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const now = useNow(1000);
  const seconds = (now.getTime() - birth.getTime()) / 1000;
  const today = isBirthdayToday(now);
  const days = Math.ceil((nextBirthday(now).getTime() - now.getTime()) / 864e5);

  // Headline weight follows the cursor across the cover
  const mx = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 80, damping: 20 });
  const wght = useTransform(smx, [0, 1], [320, 900]);
  const soft = useTransform(smx, [0, 1], [0, 100]);
  const fvs = useTransform([wght, soft], ([w, s]) => `"wght" ${w}, "SOFT" ${s}, "WONK" 1, "opsz" 144`);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const titleX = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const line = (d: number) => ({
    initial: { y: "110%" },
    animate: ready ? { y: "0%" } : {},
    transition: { duration: 1.1, delay: d, ease },
  });

  return (
    <section
      ref={ref}
      id="cover"
      onPointerMove={(e) => mx.set(e.clientX / window.innerWidth)}
      className="relative min-h-[100svh] overflow-hidden px-4 pb-10 pt-5 md:px-10 lg:pl-28"
    >
      {/* Masthead strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink pb-3 font-mono text-[11px] uppercase tracking-[0.2em]">
        <span>Vol. {String(celebratingAge(now)).padStart(2, "0")} — The {dad.name} Issue</span>
        <span className="hidden sm:inline">{now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        <span>Price: one (1) hug</span>
      </div>

      <div className="relative mt-6 grid grid-cols-12 gap-x-4 md:mt-10">
        {/* Headline */}
        <motion.h1
          style={{ fontVariationSettings: fvs, x: titleX }}
          className="col-span-12 font-display leading-[0.82] tracking-[-0.03em] lg:col-span-8"
        >
          <span className="-mb-[0.22em] block overflow-hidden pb-[0.22em] text-[clamp(4rem,14vw,12rem)]">
            <motion.span className="block" {...line(0.1)}>Happy</motion.span>
          </span>
          <span className="-mb-[0.22em] block overflow-hidden pb-[0.22em] pl-[8vw] text-[clamp(4rem,14vw,12rem)] italic">
            <motion.span className="block" {...line(0.22)}>Birthday,</motion.span>
          </span>
          <span className="-mb-[0.22em] block overflow-hidden pb-[0.22em] text-[clamp(5rem,20vw,17rem)] text-tomato">
            <motion.span className="block" {...line(0.34)}>{dad.name}.</motion.span>
          </span>
        </motion.h1>

        {/* Cover photo */}
        <motion.div
          style={{ y: photoY }}
          initial={{ opacity: 0, rotate: 12, y: 60 }}
          animate={ready ? { opacity: 1, rotate: 4 } : {}}
          transition={{ duration: 1.2, delay: 0.5, ease }}
          className="relative col-span-8 col-start-3 mt-10 sm:col-span-6 sm:col-start-6 lg:absolute lg:right-0 lg:top-4 lg:mt-0 lg:w-[30%]"
        >
          <div className="relative bg-cream p-3 pb-14 shadow-[0_20px_50px_-20px_rgba(35,26,21,0.5)]">
            <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" />
            <div className="aspect-[4/5] overflow-hidden">
              <Photo src={dad.coverPhoto} alt={`${dad.name} on the cover`} className="origin-[48%_40%] scale-[1.45]" />
            </div>
            <p className="absolute bottom-3.5 left-4 right-4 truncate font-hand text-xl text-ink">{dad.coverCaption}</p>
          </div>
          <Starburst className="absolute -bottom-10 -left-12 h-32 w-32 rotate-[-12deg] md:h-36 md:w-36">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-ink">Limited</span>
            <span className="block font-display text-3xl font-black leading-none text-ink">{celebratingAge(now)}</span>
            <span className="block font-mono text-[10px] uppercase tracking-widest text-ink">edition</span>
          </Starburst>
          <div className="absolute -left-40 top-6 hidden items-start gap-1 text-ink-soft xl:flex">
            <span className="font-hand mt-1 text-2xl">cover star</span>
            <Arrow className="h-14 w-20 rotate-12" />
          </div>
        </motion.div>
      </div>

      {/* Cover lines + live counter */}
      <div className="relative mt-20 grid grid-cols-12 gap-6 lg:mt-12">
        <motion.ol
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="col-span-12 space-y-2 md:col-span-7 lg:col-span-5"
        >
          <li className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">Inside this issue</li>
          {coverLines.map((c) => (
            <li key={c.p}>
              <a href={c.href} className="group flex items-baseline gap-4 border-b border-ink/15 py-1.5">
                <span className="font-mono text-xs text-tomato">p.{c.p}</span>
                <span className="font-display text-lg transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-2 group-hover:italic">
                  {c.t}
                </span>
              </a>
            </li>
          ))}
        </motion.ol>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8, ease }}
          className="col-span-12 self-end md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">Being awesome for</p>
          <p className="font-mono text-3xl tabular-nums tracking-tight md:text-4xl">{fmt(seconds)}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">seconds &amp; counting</p>
          <p className="mt-4 inline-block -rotate-2 bg-ink px-3 py-1 font-hand text-2xl text-paper">
            {today ? "It's today! 🎉" : `${days} day${days === 1 ? "" : "s"} to go`}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
