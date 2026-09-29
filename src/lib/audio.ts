/* All sound is synthesised with the Web Audio API — no audio files needed. */

let ctx: AudioContext | null = null;
let muted = false;

export function audio() {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export const setMuted = (m: boolean) => { muted = m; };
export const isMuted = () => muted;

const freq = (n: string) => {
  const map: Record<string, number> = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
  const semis = map[n[0]] + (Number(n.slice(-1)) - 4) * 12;
  return 440 * Math.pow(2, semis / 12);
};

/** A single music-box "ping" */
function ping(f: number, at: number, dur: number, gain = 0.18, out?: AudioNode) {
  const c = audio();
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(gain, at + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, at + Math.max(dur, 0.6) * 1.6);
  g.connect(out ?? c.destination);
  [1, 2, 3.01].forEach((h, i) => {
    const o = c.createOscillator();
    o.type = i === 0 ? "sine" : "triangle";
    o.frequency.value = f * h;
    const hg = c.createGain();
    hg.gain.value = [1, 0.25, 0.08][i];
    o.connect(hg).connect(g);
    o.start(at);
    o.stop(at + Math.max(dur, 0.6) * 1.7);
  });
}

const MELODY: [string, number][] = [
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
  ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
  ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
];
const BEAT = 0.46;

/** Happy Birthday on a music box, looping until stopped. */
export class MusicBox {
  private timer: number | undefined;
  private bus: GainNode | null = null;
  playing = false;
  private repeat = true;
  private onDone?: () => void;
  onChange?: (playing: boolean) => void;

  /** Play the song a single time, then call onDone */
  playOnce(onDone?: () => void) {
    this.stop();
    this.repeat = false;
    this.onDone = onDone;
    this.begin();
  }

  start() {
    this.repeat = true;
    this.onDone = undefined;
    this.begin();
  }

  private begin() {
    if (this.playing) return;
    const c = audio();
    this.bus = c.createGain();
    this.bus.gain.value = 0.9;
    this.bus.connect(c.destination);
    this.playing = true;
    this.onChange?.(true);
    this.loop();
  }

  private loop = () => {
    if (!this.playing || !this.bus) return;
    const c = audio();
    let t = c.currentTime + 0.08;
    for (const [n, d] of MELODY) {
      ping(freq(n), t, d * BEAT, 0.16, this.bus);
      t += d * BEAT;
    }
    const total = MELODY.reduce((s, [, d]) => s + d, 0) * BEAT + 1.2;
    this.timer = window.setTimeout(() => {
      if (this.repeat) return this.loop();
      const done = this.onDone;
      this.stop();
      done?.();
    }, total * 1000);
  };

  stop() {
    this.playing = false;
    window.clearTimeout(this.timer);
    if (this.bus) {
      const c = audio();
      this.bus.gain.setTargetAtTime(0, c.currentTime, 0.15);
      const b = this.bus;
      setTimeout(() => b.disconnect(), 800);
      this.bus = null;
    }
    this.onChange?.(false);
  }

  toggle() { this.playing ? this.stop() : this.start(); }
}

export const musicBox = new MusicBox();

function noise(dur: number) {
  const c = audio();
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource();
  s.buffer = buf;
  return s;
}

/** Ba-dum-tss */
export function rimshot() {
  if (muted) return;
  const c = audio();
  const t = c.currentTime;
  [0, 0.14].forEach((off, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.setValueAtTime(i ? 150 : 190, t + off);
    o.frequency.exponentialRampToValueAtTime(60, t + off + 0.15);
    g.gain.setValueAtTime(0.5, t + off);
    g.gain.exponentialRampToValueAtTime(0.001, t + off + 0.18);
    o.connect(g).connect(c.destination);
    o.start(t + off);
    o.stop(t + off + 0.2);
  });
  const n = noise(0.9);
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 6000;
  const g = c.createGain();
  g.gain.setValueAtTime(0.35, t + 0.3);
  g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
  n.connect(hp).connect(g).connect(c.destination);
  n.start(t + 0.3);
}

/** Balloon pop */
export function pop() {
  if (muted) return;
  const c = audio();
  const t = c.currentTime;
  const n = noise(0.12);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 1400;
  const g = c.createGain();
  g.gain.setValueAtTime(0.9, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  n.connect(bp).connect(g).connect(c.destination);
  n.start(t);
}

/** Candle puff */
export function puff() {
  if (muted) return;
  const c = audio();
  const t = c.currentTime;
  const n = noise(0.4);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.4, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  n.connect(lp).connect(g).connect(c.destination);
  n.start(t);
}

/** Soft paper/click tick */
export function tick(pitch = 1) {
  if (muted) return;
  const c = audio();
  const t = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "triangle";
  o.frequency.value = 880 * pitch;
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + 0.1);
}

/** Little ascending chime for wins */
export function chime() {
  if (muted) return;
  const c = audio();
  ["C5", "E5", "G5", "C6"].forEach((n, i) => ping(freq(n), c.currentTime + i * 0.09, 0.4, 0.12));
}
