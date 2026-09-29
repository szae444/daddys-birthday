import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { dad, letter } from "../content";
import { Reveal, Tag, Underline } from "./ui";

function Word({ w, i, total, progress }: { w: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start * 0.85, start * 0.85 + 0.08], [0.14, 1]);
  return <motion.span style={{ opacity }}>{w} </motion.span>;
}

export default function Letter() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const words = letter.paragraphs.map((p) => p.split(" "));
  const total = words.flat().length;
  let n = 0;

  return (
    <section id="letter" className="relative px-4 py-28 md:px-10 md:py-40 lg:pl-28">
      <div className="grid grid-cols-12 gap-y-12 md:gap-x-10">
        <div className="col-span-12 md:col-span-4 md:sticky md:top-28 md:self-start">
          <Tag no="02" className="text-tomato">The Letter</Tag>
          <Reveal>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">
              A few words I don't say{" "}
              <span className="relative inline-block italic">
                enough.
                <Underline className="-bottom-3 left-0 h-5 w-full" />
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xs text-ink-soft">
              Read slowly. The words fill in as you scroll — like I'm writing it right in front of you.
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative col-span-12 md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6">
          {/* paperclip */}
          <svg className="absolute -top-8 right-12 z-10 h-20 w-8 text-ink-mute" viewBox="0 0 24 64" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M8 20 V52 a6 6 0 0 0 12 0 V12 a8 8 0 0 0 -16 0 V50" />
          </svg>
          <div className="ruled relative -rotate-1 px-6 py-10 pl-20 shadow-[0_30px_60px_-30px_rgba(35,26,21,0.45)] md:px-12 md:pl-24">
            <p className="font-hand text-4xl text-denim">{letter.greeting}</p>
            <div className="mt-4 space-y-[2.2rem] font-hand text-[1.75rem] leading-[2.2rem] text-ink md:text-[1.9rem]">
              {words.map((para, pi) => (
                <p key={pi}>
                  {para.map((w) => {
                    const i = n++;
                    return <Word key={i} w={w} i={i} total={total} progress={scrollYProgress} />;
                  })}
                </p>
              ))}
            </div>
            <div className="mt-10 text-right">
              <p className="font-hand text-3xl text-ink-soft">{letter.signOff}</p>
              <p className="font-hand text-5xl text-tomato">{dad.from}</p>
            </div>
            <span className="absolute -bottom-6 left-10 rotate-6 font-hand text-xl text-ink-mute">p.s. check the scrapbook ↓</span>
          </div>
        </div>
      </div>
    </section>
  );
}
