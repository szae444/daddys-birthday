import { titles } from "../content";

export default function Ticker({ tone = "tomato", reverse = false }: { tone?: "tomato" | "ink"; reverse?: boolean }) {
  const items = [...titles, ...titles];
  const bg = tone === "tomato" ? "bg-tomato text-cream" : "bg-ink text-paper";
  return (
    <div className={`relative z-10 overflow-hidden border-y-2 border-ink py-3 ${bg} ${reverse ? "rotate-1" : "-rotate-1"} -mx-4`} aria-label="Dad's official titles">
      <div className="marquee flex w-max gap-8 whitespace-nowrap" style={reverse ? { animationDirection: "reverse" } : undefined}>
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-2xl italic md:text-3xl">
            {t}
            <span className="not-italic text-mustard" aria-hidden>✺</span>
          </span>
        ))}
      </div>
    </div>
  );
}
