import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { dad } from "../content";

export const PALETTE = ["#d6452b", "#e4a73c", "#5d6a38", "#34506b", "#efc9b8", "#fbf6ec"];

export const birth = new Date(dad.birthDate + "T00:00:00");

/** Next birthday (today counts if it's today) */
export function nextBirthday(now = new Date()) {
  const b = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (b < today) b.setFullYear(b.getFullYear() + 1);
  return b;
}

export function isBirthdayToday(now = new Date()) {
  return now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate();
}

export function useNow(interval = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}

export const fmt = (n: number) => Math.floor(n).toLocaleString("en-US");

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function burst(x = 0.5, y = 0.6) {
  if (reduced()) return;
  confetti({ particleCount: 90, spread: 80, origin: { x, y }, colors: PALETTE, scalar: 1.05, ticks: 220 });
}

export function celebrate() {
  if (reduced()) return;
  const end = Date.now() + 1600;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: PALETTE });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: PALETTE });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function emojiRain(emojis = ["🎂", "🎉", "👔", "🍺", "⛳", "🔧"]) {
  if (reduced()) return;
  const shapes = emojis.map((text) => confetti.shapeFromText({ text, scalar: 2.4 }));
  confetti({ shapes, scalar: 2.4, particleCount: 60, spread: 140, startVelocity: 35, origin: { y: 0.2 }, ticks: 300 });
}

/** Deterministic pseudo-random for stable scatter layouts */
export function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

/** The age being celebrated: the birthday closest to today (upcoming or just passed).
    The day before he turns 45 this is 45, and it stays 45 in the weeks after. */
export function celebratingAge(now = new Date()) {
  const next = nextBirthday(now);
  const last = new Date(next);
  last.setFullYear(next.getFullYear() - 1);
  const closest = next.getTime() - now.getTime() <= now.getTime() - last.getTime() ? next : last;
  return closest.getFullYear() - birth.getFullYear();
}
