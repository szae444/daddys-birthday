import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { dad } from "../content";
import { ease } from "./ui";

/** Opening screen: a sealed envelope. Clicking it breaks the seal and
    lets the letter slide out before the site is revealed. */
export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const [gone, setGone] = useState(false);

  const open = () => {
    if (opening) return;
    setOpening(true);
    onOpen();
    setTimeout(() => setGone(true), 1900);
  };

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="gate"
          className="fixed inset-0 z-[70] grid place-items-center overflow-hidden bg-ink px-4"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="absolute left-4 top-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50 md:left-8 md:top-8">
            Special delivery · Handle with love
          </div>
          <div className="absolute bottom-4 right-4 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/50 md:bottom-8 md:right-8">
            Postmarked {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>

          <div className="flex flex-col items-center gap-10">
            <button
              onClick={open}
              aria-label="Open the envelope"
              className="group relative h-[230px] w-[340px] cursor-pointer [perspective:1200px] sm:h-[270px] sm:w-[400px]"
            >
              {/* letter peeking out */}
              <motion.div
                className="absolute inset-x-5 top-4 bottom-4 z-[2] rounded-sm bg-cream p-5 text-left shadow-md"
                animate={opening ? { y: -170 } : { y: 0 }}
                transition={{ delay: 0.55, duration: 0.9, ease }}
              >
                <p className="font-hand text-3xl leading-none text-ink">Happy birthday,</p>
                <p className="font-display text-4xl italic text-tomato">{dad.name}!</p>
              </motion.div>

              {/* envelope body */}
              <div className="absolute inset-0 z-[3] overflow-hidden rounded-sm bg-kraft shadow-2xl">
                <svg viewBox="0 0 400 270" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  <path d="M0 270 L200 140 L400 270 Z" fill="#dccaa9" />
                  <path d="M0 0 L200 150 L0 270 Z" fill="#e2d1b2" />
                  <path d="M400 0 L200 150 L400 270 Z" fill="#e2d1b2" />
                </svg>
                <div className="absolute bottom-5 left-6 text-left">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-soft">To</p>
                  <p className="font-hand text-3xl text-ink">The Best {dad.name}</p>
                </div>
                {/* stamp */}
                <div className="absolute right-5 top-5 grid h-16 w-14 place-items-center border-2 border-dashed border-tomato/70 bg-cream text-2xl">
                  🎂
                </div>
              </div>

              {/* flap */}
              <motion.div
                className="absolute inset-x-0 top-0 h-[58%] origin-top"
                style={{ transformStyle: "preserve-3d", zIndex: opening ? 1 : 5 }}
                animate={opening ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.6, ease }}
              >
                <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="h-full w-full drop-shadow-md">
                  <path d="M0 0 L400 0 L200 158 Z" fill="#d7c29c" />
                </svg>
              </motion.div>

              {/* wax seal */}
              <motion.div
                className="absolute left-1/2 top-[50%] z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-tomato font-display text-2xl italic text-cream shadow-lg transition-transform duration-300 group-hover:scale-110"
                animate={opening ? { scale: 0, rotate: 90, opacity: 0 } : {}}
                transition={{ duration: 0.3 }}
              >
                D
              </motion.div>
            </button>

            <motion.p
              className="font-hand text-2xl text-paper/80"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              tap the seal to open ↑
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
