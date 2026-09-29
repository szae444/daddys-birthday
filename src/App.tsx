import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";
import Envelope from "./components/Envelope";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Letter from "./components/Letter";
import Scrapbook from "./components/Scrapbook";
import ThenNow from "./components/ThenNow";
import Timeline from "./components/Timeline";
import Numbers from "./components/Numbers";
import Reasons from "./components/Reasons";
import Cake from "./components/Cake";
import Jokes from "./components/Jokes";
import Coupons from "./components/Coupons";
import Balloons from "./components/Balloons";
import WishWall from "./components/WishWall";
import { Footer, IndexRail, Progress, SoundDock } from "./components/Chrome";
import { music } from "./lib/music";
import { celebrate, emojiRain } from "./lib/util";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function App() {
  // Add ?skip to the URL to jump past the envelope while editing
  const skip = new URLSearchParams(location.search).has("skip");
  const [opened, setOpened] = useState(skip);
  const [gate, setGate] = useState(0);
  const lenis = useRef<Lenis | null>(null);

  // Smooth scrolling
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ lerp: 0.1, anchors: true });
    lenis.current = l;
    let id = 0;
    const raf = (t: number) => { l.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); l.destroy(); };
  }, []);

  // Lock scrolling until the envelope is opened
  useEffect(() => {
    document.documentElement.style.overflow = opened ? "" : "hidden";
    if (opened) lenis.current?.start(); else lenis.current?.stop();
  }, [opened]);

  // Easter egg
  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      pos = e.key === KONAMI[pos] ? pos + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) { pos = 0; emojiRain(); setTimeout(() => emojiRain(["👑", "🥇", "❤️"]), 500); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = () => {
    music.start(); // inside the click, so browsers allow sound
    setTimeout(() => { setOpened(true); celebrate(); }, 1500);
  };

  const replay = () => {
    music.stop();
    lenis.current ? lenis.current.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
    setOpened(false);
    setGate((g) => g + 1);
  };

  return (
    <>
      <div className="grain" aria-hidden />
      {!(skip && gate === 0) && <Envelope key={gate} onOpen={open} />}
      <Progress />
      <IndexRail />
      <SoundDock />
      <main key={`m${gate}`}>
        <Hero ready={opened} />
        <Ticker />
        <Letter />
        <Scrapbook />
        <ThenNow />
        <Timeline />
        <Numbers />
        <Reasons />
        <Cake />
        <Jokes />
        <Ticker tone="ink" reverse />
        <Coupons />
        <Balloons />
        <WishWall />
      </main>
      <Footer onReplay={replay} />
    </>
  );
}
