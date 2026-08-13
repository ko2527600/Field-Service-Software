import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const sourceSvg = readFileSync(path.join(root, "src/assets/logo/logo-source.svg"));
const iconsDir = path.join(root, "public/icons");
mkdirSync(iconsDir, { recursive: true });

async function renderPng(size, outPath, { flatten = false } = {}) {
  let pipeline = sharp(sourceSvg, { density: 384 }).resize(size, size, {
    fit: "contain",
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  });
  if (flatten) {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } });
  }
  await pipeline.png().toFile(outPath);
  console.log("wrote", path.relative(root, outPath));
}

function packIco(pngBuffers) {
  // Modern ICO container: PNG-compressed images embedded directly (supported since Vista).
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + count * 16;
  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    offset += buffer.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map((p) => p.buffer)]);
}

async function main() {
  await renderPng(192, path.join(iconsDir, "icon-192.png"));
  await renderPng(512, path.join(iconsDir, "icon-512.png"));
  await renderPng(512, path.join(iconsDir, "icon-512-maskable.png"));
  await renderPng(180, path.join(iconsDir, "apple-touch-icon.png"), { flatten: true });

  const favicon16 = await sharp(sourceSvg, { density: 384 })
    .resize(16, 16, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
  const favicon32 = await sharp(sourceSvg, { density: 384 })
    .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();

  const ico = packIco([
    { size: 16, buffer: favicon16 },
    { size: 32, buffer: favicon32 },
  ]);
  writeFileSync(path.join(root, "public/favicon.ico"), ico);
  console.log("wrote public/favicon.ico");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
