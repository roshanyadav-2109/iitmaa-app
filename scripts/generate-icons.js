// Generates every rasterised app mark from one source file.
// Run: npm run generate-icons
//
// Source is public/logo/iitmaa.svg — the association's own mark, vector, so
// every size is rendered rather than resampled and there is no separate
// favicon artwork to keep in step.
//
// Emits:
//   public/icons/icon-192.png, icon-512.png, icon-maskable-512.png
//   app/icon.png, app/apple-icon.png   (Next's own metadata routes)
//   android/store_icon.png             (Play listing / TWA)
//   public/splash/splash-<w>x<h>.png   (iOS launch images)
//
// Everything sits on the paper tint rather than the brand navy: the mark is
// navy-and-orange line art and disappears against a navy tile. The same
// reason the splash screens are light — see capacitor.config.ts, whose
// SplashScreen background has to agree with these files or the launch flashes
// one colour then the other.
//
// The lockup is horizontal (216x66) and a square tile therefore carries a lot
// of vertical air. That is the honest trade: cropping to the emblem alone
// severs the arc that sweeps the full width of the logo, which reads as a
// broken mark rather than a simplified one.
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const MARK = path.join(ROOT, "public", "logo", "iitmaa.svg");
const ICON_DIR = path.join(ROOT, "public", "icons");
const SPLASH_DIR = path.join(ROOT, "public", "splash");
const APP_DIR = path.join(ROOT, "app");
const ANDROID_DIR = path.join(ROOT, "android");

/** Paper tint — matches the app background and the native splash colour. */
const BG = "#EFF3FA";

/** Share of the tile the mark spans. Maskable needs a wider safe zone. */
const FILL = 0.86;
const FILL_MASKABLE = 0.62;

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

/** The mark, rendered from vector to `width` px across. */
async function render(width) {
  return sharp(MARK, { density: 600 })
    .resize(Math.round(width), null, { fit: "inside" })
    .png()
    .toBuffer();
}

/** Square tile with the mark centred on the paper tint. */
async function square(size, out, fill = FILL) {
  const mark = await render(size * fill);
  await sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(out);
  console.log("  %s (%dx%d)", path.relative(ROOT, out), size, size);
}

/** Launch image: the mark centred on the same ground, sized to the short edge. */
async function splash(w, h) {
  const mark = await render(Math.min(w, h) * 0.6);
  const out = path.join(SPLASH_DIR, `splash-${w}x${h}.png`);
  await sharp({ create: { width: w, height: h, channels: 4, background: BG } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(out);
  console.log("  %s", path.relative(ROOT, out));
}

async function main() {
  console.log("icons:");
  await square(192, path.join(ICON_DIR, "icon-192.png"));
  await square(512, path.join(ICON_DIR, "icon-512.png"));
  await square(512, path.join(ICON_DIR, "icon-maskable-512.png"), FILL_MASKABLE);
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
