/* Makes web-ready copies of everything in Photos/ → src/assets/photos/
   - converts iPhone RAW (.dng), HEIC-free JPEG/PNG/WebP etc. to JPEG
   - fixes rotation, resizes to max 1600px, strips hidden data (incl. GPS)
   Your originals in Photos/ are never modified.
   Run with:  npm run photos */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "Photos";
const OUT = "src/assets/photos";
const OK = /\.(jpe?g|png|webp|gif|avif|tiff?|dng)$/i;

if (!fs.existsSync(SRC)) {
  console.log(`No ${SRC}/ folder here, using the existing copies in ${OUT}/`);
  process.exit(0);
}
fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(SRC).filter((f) => OK.test(f));
let made = 0;
for (const f of files) {
  const out = path.join(OUT, f.replace(/\.[^.]+$/, "").toLowerCase() + ".jpg");
  const src = path.join(SRC, f);
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(src).mtimeMs) continue;
  try {
    await sharp(src)
      .rotate()
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
    made++;
    console.log("✓", f, "→", out);
  } catch (e) {
    console.log("✗", f, "could not be converted:", e.message);
  }
}
console.log(`${made} new/updated, ${files.length} total in ${SRC}/`);
