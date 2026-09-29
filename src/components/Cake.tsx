import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { candleCount, dad } from "../content";
import { chime, puff } from "../lib/audio";
import { music } from "../lib/music";
import { celebrate } from "../lib/util";
import { Tag, ease } from "./ui";

const candleColors = ["#d6452b", "#34506b", "#e4a73c", "#5d6a38", "#efc9b8"];

export default function Cake() {
  const [lit, setLit] = useState<boolean[]>(() => Array(candleCount).fill(true));
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const litRef = useRef(lit);
  litRef.current = lit;
  const stream = useRef<MediaStream | null>(null);
  const raf = useRef(0);
  const micCtx = useRef<AudioContext | null>(null);
  const allOut = lit.every((l) => !l);
  const [singing, setSinging] = useState(music.state.singing);
  useEffect(() => music.subscribe((s) => setSinging(s.singing)), []);

  const blow = (i: number) => {
    if (!litRef.current[i]) return;
    puff();
    setLit((prev) => {
      const n = [...prev];
      n[i] = false;
      return n;
    });
  };

  useEffect(() => {
    if (allOut) {
      stopMic();
      chime();
      celebrate();
    }
  }, [allOut]);

  const stopMic = () => {
    cancelAnimationFrame(raf.current);
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    micCtx.current?.close();
    micCtx.current = null;
    setListening(false);
  };
  useEffect(() => stopMic, []);

  /** Blow into the microphone: loud, sustained, low-frequency noise = blowing */
  const startMic = async () => {
    setMicError("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = s;
      const ctx = (micCtx.current = new AudioContext());
      const src = ctx.createMediaStreamSource(s);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      const data = new Uint8Array(an.frequencyBinCount);
      setListening(true);
      let strong = 0;
      let last = 0;
      const loop = (t: number) => {
        an.getByteFrequencyData(data);
        let low = 0;
        for (let i = 0; i < 24; i++) low += data[i];
        low /= 24;
        strong = low > 120 ? strong + 1 : Math.max(0, strong - 1);
        if (strong > 6 && t - last > 140) {
          const on = litRef.current.map((l, i) => (l ? i : -1)).filter((i) => i >= 0);
          if (on.length) blow(on[Math.floor(Math.random() * on.length)]);
          last = t;
        }
        raf.current = requestAnimationFrame(loop);
      };
      raf.current = requestAnimationFrame(loop);
    } catch {
      setMicError("No mic access — just tap the flames instead!");
    }
  };

  const relight = () => setLit(Array(candleCount).fill(true));

  return (
    <section id="cake" className="relative overflow-hidden bg-ink px-4 py-28 text-paper md:px-10 md:py-36 lg:pl-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[32vw] font-black leading-none text-transparent"
        style={{ WebkitTextStroke: "1px rgba(243,235,220,0.09)" }}
      >
        wish
      </div>

      <div className="relative flex flex-wrap items-start justify-between gap-6">
        <Tag no="08" className="text-mustard">The Cake</Tag>
        <p className="max-w-xs font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-paper/60">
          Tap each flame — or turn on the mic and actually blow.
        </p>
      </div>

      <div className="relative mt-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={allOut ? "done" : "wish"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease }}
            className="text-center font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.9] tracking-tight"
          >
            {allOut ? (
              <>Wish <span className="italic text-mustard">granted,</span> {dad.name}.</>
            ) : (
              <>Close your eyes. <span className="italic text-tomato">Make a wish.</span></>
            )}
          </motion.h2>
        </AnimatePresence>

        {/* Cake */}
        <div className="relative mt-36 w-[min(88vw,420px)]">
          {/* candles */}
          <div className="absolute -top-[88px] left-[10%] right-[10%] flex justify-around">
            {lit.map((on, i) => (
              <button
                key={i}
                onClick={() => blow(i)}
                aria-label={on ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
                className="relative flex h-[100px] w-8 flex-col items-center justify-end"
              >
                <AnimatePresence>
                  {on && (
                    <motion.span
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-0 flex flex-col items-center"
                    >
                      <span className="absolute -top-3 h-12 w-12 rounded-full bg-mustard/30 blur-xl" />
                      <span className="flame block h-8 w-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-t from-tomato via-mustard to-cream" />
                    </motion.span>
                  )}
                </AnimatePresence>
                {!on && (
                  <motion.span
                    initial={{ opacity: 0.8, y: 0 }}
                    animate={{ opacity: 0, y: -40 }}
                    transition={{ duration: 1.4 }}
                    className="absolute top-2 h-6 w-2 rounded-full bg-paper/40 blur-sm"
                  />
                )}
                <span
                  className="block h-14 w-3 rounded-t-sm"
                  style={{
                    background: `repeating-linear-gradient(135deg, ${candleColors[i % candleColors.length]} 0 6px, #fbf6ec 6px 10px)`,
                  }}
                />
              </button>
            ))}
          </div>
          {/* tiers */}
          <div className="relative mx-auto h-16 w-[80%] rounded-t-md bg-cream">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="absolute -bottom-4 left-0 h-6 w-full" aria-hidden>
              <path d="M0 0 H100 V6 C95 6 95 16 90 16 C85 16 86 6 80 6 C74 6 75 13 68 13 C62 13 63 6 55 6 C48 6 49 18 42 18 C35 18 36 6 28 6 C22 6 22 12 16 12 C10 12 10 6 0 6 Z" fill="#fbf6ec" />
            </svg>
          </div>
          <div className="relative h-20 w-full rounded-t-md bg-tomato">
            <div className="absolute inset-x-0 top-8 flex justify-around">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-mustard" />
              ))}
            </div>
          </div>
          <div className="relative -mx-[6%] h-24 rounded-t-md bg-denim">
            <p className="absolute inset-0 grid place-items-center font-hand text-4xl text-cream">Happy B-day {dad.name}</p>
          </div>
          <div className="-mx-[12%] h-4 rounded-full bg-paper/80" />
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {allOut ? (
            <button onClick={relight} className="border-2 border-paper px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:bg-paper hover:text-ink">
              Relight the candles
            </button>
          ) : (
            <button
              onClick={listening ? stopMic : startMic}
              className={`border-2 px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                listening ? "animate-pulse border-tomato bg-tomato text-cream" : "border-paper hover:bg-paper hover:text-ink"
              }`}
            >
              {listening ? "● Listening… blow!" : "🎤 Use microphone"}
            </button>
          )}
          <button
            onClick={() => music.singHappyBirthday()}
            className="border-2 border-mustard bg-mustard px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-transform hover:-translate-y-0.5"
          >
            {singing ? "■ Stop singing" : "♪ Sing Happy Birthday"}
          </button>
        </div>
        {micError && <p className="mt-4 font-hand text-2xl text-mustard">{micError}</p>}
      </div>
    </section>
  );
}
