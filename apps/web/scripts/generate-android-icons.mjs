import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceSvg = readFileSync(path.join(root, "src/assets/logo/logo-source.svg"));
const resDir = path.join(root, "android/app/src/main/res");

// Legacy launcher icon (pre-adaptive-icon devices), square, full-bleed white background.
const legacySizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
// Adaptive-icon foreground layer: rendered on a larger transparent canvas so the
// logo sits within the OS's visible "safe zone" once masked (circle/squircle/etc).
const foregroundSizes = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };

async function renderSquare(size, outPath) {
  await sharp(sourceSvg, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(outPath);
  console.log("wrote", path.relative(root, outPath));
}

async function renderRound(size, outPath) {
  const square = await sharp(sourceSvg, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  await sharp(square)
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toFile(outPath);
  console.log("wrote", path.relative(root, outPath));
}

async function renderForeground(size, outPath) {
  // Logo drawn at ~60% of the canvas, centered, transparent padding around it so
  // an adaptive mask (circle/squircle/rounded-square) never clips the artwork.
  const logoSize = Math.round(size * 0.6);
  const logo = await sharp(sourceSvg, { density: 384 })
    .resize(logoSize, logoSize, { fit: "contain" })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(outPath);
  console.log("wrote", path.relative(root, outPath));
}

async function main() {
  for (const [density, size] of Object.entries(legacySizes)) {
    const dir = path.join(resDir, `mipmap-${density}`);
    mkdirSync(dir, { recursive: true });
    await renderSquare(size, path.join(dir, "ic_launcher.png"));
    await renderRound(size, path.join(dir, "ic_launcher_round.png"));
  }
  for (const [density, size] of Object.entries(foregroundSizes)) {
    const dir = path.join(resDir, `mipmap-${density}`);
    await renderForeground(size, path.join(dir, "ic_launcher_foreground.png"));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
