import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { timeline } from "../content";
import { Photo, Tag } from "./ui";

/** Pinned section that scrolls sideways through Dad's history */
export default function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDist(track.current.scrollWidth - window.innerWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const sx = useSpring(x, { stiffness: 120, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} id="years" className="relative bg-ink text-paper" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="absolute left-4 right-4 top-8 flex items-center justify-between md:left-10 md:right-10 lg:left-28">
          <Tag no="05" className="text-mustard">Through the years</Tag>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">scroll →</span>
        </div>

        <motion.div ref={track} style={{ x: sx }} className="flex w-max items-center gap-6 px-4 md:gap-10 md:px-10 lg:pl-28">
          <div className="w-[80vw] shrink-0 md:w-[42vw]">
            <h2 className="font-display text-[clamp(3.5rem,9vw,8.5rem)] leading-[0.85] tracking-tight">
              The <span className="italic text-mustard">long</span>
              <br />
              story,
              <br />
              <span className="text-tomato">short.</span>
            </h2>
          </div>

          {timeline.map((t, i) => (
            <article
              key={i}
              className={`relative flex w-[78vw] shrink-0 flex-col gap-5 sm:w-[48vw] lg:w-[30vw] ${i % 2 ? "md:mt-40" : "md:-mt-24"}`}
            >
              <span
                className="font-display text-[clamp(5rem,12vw,10rem)] font-black leading-none text-transparent"
                style={{ WebkitTextStroke: "1.5px var(--color-paper)" }}
              >
                {t.year}
              </span>
              {t.photo !== undefined && (
                <div className="aspect-[4/3] w-3/4 overflow-hidden bg-cream p-2">
                  <Photo src={t.photo} alt={t.title} />
                </div>
              )}
              <div className="border-l-2 border-tomato pl-5">
                <h3 className="font-display text-3xl italic">{t.title}</h3>
                <p className="mt-2 max-w-sm text-paper/70">{t.note}</p>
              </div>
            </article>
          ))}
          <div className="w-[20vw] shrink-0" />
        </motion.div>

        <div className="absolute bottom-10 left-4 right-4 h-px bg-paper/20 md:left-10 md:right-10 lg:left-28">
          <motion.div style={{ width: bar }} className="h-full bg-mustard" />
        </div>
      </div>
    </section>
  );
}
