/* Photos live in the  Photos/  folder at the top of the project.
   `npm run photos` (run automatically by `npm run dev` / `npm run build`)
   makes small, web-ready copies in src/assets/photos/ — those are what the
   site actually shows. Refer to a picture in content.ts by its file name,
   e.g. "IMG_2656.jpeg". Pictures content.ts doesn't mention still show up
   at the end of the scrapbook. */
import { dad, photos as listed, thenAndNow, timeline } from "../content";

const optimized = import.meta.glob("/src/assets/photos/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const key = (p: string) => p.split("/").pop()!.replace(/\.[^.]+$/, "").toLowerCase();

/** file base name → URL. Only the optimized copies are ever used, so the
    full-size originals (with GPS data) never end up in the published site. */
const byKey = new Map<string, string>();
for (const [p, url] of Object.entries(optimized)) byKey.set(key(p), url);

/** File name (or full URL) → usable image URL. "" if not found. */
export function resolvePhoto(src?: string) {
  if (!src) return "";
  if (/^(https?:|data:|\/)/.test(src)) return src;
  return byKey.get(key(src)) ?? "";
}

/** Turns "dad-and-me_beach.jpg" into "dad and me beach"; camera names become "" */
function captionFromFile(name: string) {
  if (/^(img|dsc|pxl|photo|image|screenshot|received|fb_img|mvimg|dcim)?[\W_-]*\d/i.test(name)) return "";
  return name.replace(/[_-]+/g, " ").trim();
}

const used = new Set(
  [dad.coverPhoto, thenAndNow.then.src, thenAndNow.now.src, ...listed.map((p) => p.src), ...timeline.map((t) => t.photo)]
    .filter(Boolean)
    .map((s) => key(s!)),
);

const extras = [...byKey.keys()]
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .filter((k) => !used.has(k))
  .map((k) => ({ src: byKey.get(k)!, caption: captionFromFile(k), year: "" }));

const hasFolderPhotos = byKey.size > 0;

/** Scrapbook list: your captioned photos, then any other pictures in the folder.
    Empty placeholder frames are hidden as soon as real photos exist. */
export const scrapbookPhotos = [
  ...listed.filter((p) => !hasFolderPhotos || resolvePhoto(p.src)).map((p) => ({ ...p, src: resolvePhoto(p.src) })),
  ...extras,
];
