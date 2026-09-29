import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { dad } from "../content";
import { birth, celebratingAge, fmt } from "../lib/util";
import { Circle, Reveal, Tag } from "./ui";

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className="tabular-nums">{fmt(v)}</span>;
}

export default function Numbers() {
  const days = (Date.now() - birth.getTime()) / 864e5;
  const age = celebratingAge();
  const stats = [
    { n: days, label: "sunrises seen", note: "and most of them before us" },
    { n: days * 24 * 60 * 72, label: "heartbeats (approx.)", note: "a good chunk of them for us" },
    { n: days * 0.9, label: "dad jokes told", note: "a conservative estimate" },
    { n: age * 365 * 2.1, label: "cups of coffee", note: "fuel for the legend" },
    { n: days * 0.4, label: "things fixed around the house", note: "with duct tape, mostly" },
  ];

  return (
    <section id="numbers" className="relative px-4 py-28 md:px-10 md:py-40 lg:pl-28">
      <div className="grid grid-cols-12 gap-y-10">
        <div className="col-span-12 lg:col-span-4">
          <Tag no="06" className="text-olive">By the numbers</Tag>
          <Reveal>
            <h2 className="mt-6 font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">
              {age} years of{" "}
              <span className="relative inline-block italic">
                {dad.name}
                <Circle className="-inset-x-6 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+3rem)]" />
              </span>
              , in data.
            </h2>
          </Reveal>
          <p className="mt-6 max-w-xs text-sm text-ink-soft">
            Science was consulted. Science was mostly ignored.
          </p>
        </div>

        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <div className="group grid grid-cols-12 items-baseline gap-4 border-t-2 border-ink py-6 transition-colors duration-300 hover:bg-cream md:py-8">
                <span className="col-span-1 font-mono text-xs text-ink-mute">0{i + 1}</span>
                <span className="col-span-11 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-none tracking-tight transition-colors duration-300 group-hover:text-tomato md:col-span-7">
                  <Count to={s.n} />
                </span>
                <span className="col-span-11 col-start-2 md:col-span-4">
                  <span className="block font-display text-xl italic">{s.label}</span>
                  <span className="block font-hand text-xl text-ink-mute">{s.note}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
