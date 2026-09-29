import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { jokes } from "../content";
import { rimshot, tick } from "../lib/audio";
import { Reveal, Tag, ease } from "./ui";

const groans = ["😐", "🙄", "😩", "🤦‍♂️", "💀"];

export default function Jokes() {
  const [order] = useState(() => [...jokes.keys()].sort(() => Math.random() - 0.5));
  const [n, setN] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [pulled, setPulled] = useState(false);
  const [score, setScore] = useState(0);
  const [rated, setRated] = useState<number | null>(null);
  const [setup, punch] = jokes[order[n % order.length]];

  const pull = () => {
    setPulled(true);
    tick(0.6);
    setTimeout(() => {
      setN((x) => x + 1);
      setRevealed(false);
      setRated(null);
      setPulled(false);
    }, 380);
  };

  const reveal = () => {
    setRevealed(true);
    rimshot();
  };

  const rate = (i: number) => {
    if (rated !== null) return;
    setRated(i);
    setScore((s) => s + i + 1);
    tick(1 + i * 0.15);
  };

  return (
    <section id="jokes" className="relative overflow-hidden bg-mustard px-4 py-28 md:px-10 md:py-36 lg:pl-28">
      <div className="grid grid-cols-12 gap-y-14 md:gap-x-10">
        <div className="col-span-12 lg:col-span-5">
          <Tag no="09">The Joke Machine</Tag>
          <Reveal>
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,6rem)] leading-[0.88] tracking-tight">
              Certified
              <br />
              <span className="italic">dad-grade</span>
              <br />
              humour.
            </h2>
          </Reveal>
          <p className="mt-6 max-w-sm">
            A tribute to the man who has never once let a pun go unsaid. Pull the lever, reveal the punchline, rate the groan.
          </p>
          <div className="mt-10 inline-flex items-baseline gap-3 border-2 border-ink bg-paper px-4 py-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Groans collected</span>
            <motion.span key={score} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="font-display text-3xl font-black tabular-nums">
              {score}
            </motion.span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7">
          <div className="relative flex gap-4">
            {/* Machine body */}
            <div className="relative flex-1 border-2 border-ink bg-paper shadow-[8px_8px_0_var(--color-ink)]">
              <div className="flex items-center justify-between border-b-2 border-ink bg-ink px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mustard">
                <span>Joke-o-matic 3000</span>
                <span>No. {String(n + 1).padStart(3, "0")}</span>
              </div>
              <div className="min-h-[300px] p-6 md:p-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={n}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.4, ease }}
                  >
                    <p className="font-display text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.1] tracking-tight">{setup}</p>
                    <div className="mt-6 min-h-[5rem]">
                      {revealed ? (
                        <motion.p
                          initial={{ scale: 0.8, rotate: -4, opacity: 0 }}
                          animate={{ scale: 1, rotate: -1.5, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 14 }}
                          className="inline-block bg-tomato px-4 py-2 font-hand text-4xl text-cream"
                        >
                          {punch}
                        </motion.p>
                      ) : (
                        <button
                          onClick={reveal}
                          className="border-2 border-dashed border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:border-solid hover:bg-ink hover:text-paper"
                        >
                          Reveal punchline
                        </button>
                      )}
                    </div>
                    {revealed && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-8">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">Groan-o-meter</p>
                        <div className="mt-2 flex gap-2">
                          {groans.map((g, i) => (
                            <button
                              key={i}
                              onClick={() => rate(i)}
                              aria-label={`Groan level ${i + 1}`}
                              className={`grid h-12 w-12 place-items-center border-2 text-2xl transition-all duration-200 hover:-translate-y-1 ${
                                rated === i ? "border-ink bg-ink" : "border-ink/20 hover:border-ink"
                              } ${rated !== null && rated !== i ? "opacity-30" : ""}`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Lever */}
            <button onClick={pull} aria-label="Pull the lever for another joke" className="group relative w-12 shrink-0">
              <div className="absolute left-1/2 top-24 h-40 w-4 -translate-x-1/2 border-2 border-ink bg-paper" />
              <motion.div
                animate={{ rotate: pulled ? 160 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16 }}
                style={{ originY: 1 }}
                className="absolute bottom-[calc(100%-11rem)] left-1/2 -ml-1 h-32 w-2 bg-ink"
              >
                <span className="absolute -left-4 -top-6 h-10 w-10 rounded-full border-2 border-ink bg-tomato transition-transform group-hover:scale-110" />
              </motion.div>
              <span className="absolute -bottom-2 left-1/2 w-24 -translate-x-1/2 text-center font-hand text-xl leading-none">pull me!</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
