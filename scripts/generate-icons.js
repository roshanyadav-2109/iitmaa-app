// Generates every rasterised app mark from one source file.
// Run: npm run generate-icons
//
// Source is public/logo/sangam-mark.svg and nothing else — vector, so every
// size is rendered rather than resampled, and there is no separate favicon
// artwork to keep in step.
//
// Emits:
//   public/icons/icon-192.png, icon-512.png, icon-maskable-512.png
//   app/icon.png, app/apple-icon.png   (Next's own metadata routes)
//   android/store_icon.png             (Play listing / TWA)
//   public/splash/splash-<w>x<h>.png   (iOS launch images)
//
// The mark is full-bleed navy on purpose: a maskable icon must paint to the
// edge or the launcher's mask cuts into a transparent corner, and the glyph
// inside the SVG already sits within the safe zone.
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const MARK = path.join(ROOT, "public", "logo", "sangam-mark.svg");
const ICON_DIR = path.join(ROOT, "public", "icons");
const SPLASH_DIR = path.join(ROOT, "public", "splash");
const APP_DIR = path.join(ROOT, "app");
const ANDROID_DIR = path.join(ROOT, "android");

const BG = "#1B1464";

// The device sizes the manifest's apple-touch-startup-image links expect.
const SPLASH_SIZES = [
  [750, 1334],
  [828, 1792],
  [1125, 2436],
  [1170, 2532],
  [1179, 2556],
  [1206, 2622],
  [1290, 2796],
  [1320, 2868],
  [1536, 2048],
];

if (!fs.existsSync(MARK)) {
  console.error("Missing source mark: %s", MARK);
  process.exit(1);
}
for (const d of [ICON_DIR, SPLASH_DIR, ANDROID_DIR]) {
  fs.mkdirSync(d, { recursive: true });
}

/** Render the square mark at `size`, straight from the vector. */
async function square(size, out) {
  await sharp(MARK, { density: 384 })
    .resize(size, size, { fit: "contain" })
    .png()
    .toFile(out);
  console.log("  %s (%dx%d)", path.relative(ROOT, out), size, size);
}

/**
 * Launch image: the mark centred on the brand field.
 *
 * Sized against the short edge so the mark occupies the same share of the
 * screen on a tall phone and a square-ish tablet.
 */
async function splash(w, h) {
  const mark = Math.round(Math.min(w, h) * 0.32);
  const buf = await sharp(MARK, { density: 384 })
    .resize(mark, mark, { fit: "contain" })
    .toBuffer();

  const out = path.join(SPLASH_DIR, `splash-${w}x${h}.png`);
  await sharp({
    create: {
      width: w,
      height: h,
      channels: 4,
      background: BG,
    },
  })
    .composite([{ input: buf, gravity: "center" }])
    .png()
    .toFile(out);
  console.log("  %s", path.relative(ROOT, out));
}

async function main() {
  console.log("icons:");
  await square(192, path.join(ICON_DIR, "icon-192.png"));
  await square(512, path.join(ICON_DIR, "icon-512.png"));
  await square(512, path.join(ICON_DIR, "icon-maskable-512.png"));
  await square(512, path.join(APP_DIR, "icon.png"));
  await square(180, path.join(APP_DIR, "apple-icon.png"));
  await square(512, path.join(ANDROID_DIR, "store_icon.png"));

  console.log("splash:");
  for (const [w, h] of SPLASH_SIZES) {
    await splash(w, h);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
