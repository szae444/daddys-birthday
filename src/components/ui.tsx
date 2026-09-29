import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";
import { resolvePhoto } from "../lib/photos";

export const ease = [0.16, 1, 0.3, 1] as const;

/** Mono index label: "No. 03 — The Letter" */
export function Tag({ no, children, className = "" }: { no: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] ${className}`}>
      <span className="opacity-60">No.{no}</span>
      <span className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </div>
  );
}

/** Fade-and-rise when scrolled into view */
export function Reveal({ children, delay = 0, y = 24, ...rest }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay, ease }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Hand-drawn underline that draws itself */
export function Underline({ className = "", color = "var(--color-tomato)", delay = 0.2 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 300 24" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`} aria-hidden>
      <motion.path
        d="M4 16 C 60 6, 120 20, 180 10 S 270 8, 296 14"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease }}
      />
    </svg>
  );
}

/** Hand-drawn circle around something */
export function Circle({ className = "", color = "var(--color-tomato)", delay = 0.3 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`} aria-hidden>
      <motion.path
        d="M110 8 C 40 4, 4 30, 10 56 C 18 90, 150 98, 188 64 C 206 40, 170 8, 96 12"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay, ease }}
      />
    </svg>
  );
}

/** Loopy hand-drawn arrow */
export function Arrow({ className = "", flip = false, color = "currentColor" }: { className?: string; flip?: boolean; color?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={`pointer-events-none ${className}`} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <motion.path
        d="M6 10 C 30 60, 60 70, 76 44 C 86 26, 64 20, 62 38 C 60 58, 90 70, 112 62"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1, ease }}
      />
      <motion.path
        d="M100 54 L 113 62 L 100 71"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.9 }}
      />
    </svg>
  );
}

/** A photo, or a "photo goes here" placeholder when src is empty */
export function Photo({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  const url = resolvePhoto(src);
  if (url) return <img src={url} alt={alt} loading="lazy" decoding="async" draggable={false} className={`h-full w-full object-cover ${className}`} />;
  return (
    <div className={`ph flex h-full w-full flex-col items-center justify-center gap-1 text-ink-mute ${className}`}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="6" width="18" height="14" rx="1" />
        <circle cx="12" cy="13" r="3.5" />
        <path d="M8 6l1.5-2h5L16 6" />
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em]">photo goes here</span>
    </div>
  );
}

/** Sticker-style starburst */
export function Starburst({ children, className = "", color = "var(--color-mustard)" }: { children: ReactNode; className?: string; color?: string }) {
  const pts = Array.from({ length: 28 }, (_, i) => {
    const r = i % 2 ? 42 : 50;
    const a = (i / 28) * Math.PI * 2;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <div className={`relative grid place-items-center ${className}`}>
      <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
        <polygon points={pts} fill={color} />
      </svg>
      <div className="relative text-center">{children}</div>
    </div>
  );
}
