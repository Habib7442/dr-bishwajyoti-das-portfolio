/**
 * Regenerates the brand icons: navy (#13315C) rounded square with a sky (#4CB8E8) single-stroke ear
 * (the Lucide "ear" icon used on the site, with a heavier stroke so it still reads at 16px).
 *
 *   node scripts/make-favicons.mjs
 *
 * Writes:
 *   app/icon.svg                                  scalable favicon (modern browsers)
 *   app/favicon.ico                               16 / 32 / 48 (PNG-in-ICO; Safari + older browsers)
 *   app/apple-icon.png                            180 (full-bleed square; iOS rounds it)
 *   public/icons/android-chrome-192x192.png       192
 *   public/icons/android-chrome-512x512.png       512
 *   public/icons/icon-maskable-512x512.png        512 (full bleed, ear inside the 80% safe zone)
 *
 * Colors match the @theme tokens in app/globals.css (primary / accent).
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const NAVY = "#13315C";
const SKY = "#4CB8E8";

// lucide-react "ear" (24×24 grid)
const EAR_PATHS = ["M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0", "M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4"];
const EAR_CENTER = { x: 12.5, y: 12 }; // centre of the paths' bounding box
const EAR_HEIGHT = 20; // bounding box height incl. stroke, in grid units

/**
 * Icon SVG on a 512 canvas.
 * - rounded: 22% corner radius (favicon / android); false = full-bleed square (apple, maskable)
 * - fill: ear height as a share of the canvas (smaller for maskable so it stays in the safe zone)
 * - stroke: stroke width in grid units (Lucide uses 2; 2.75 survives 16px)
 */
function svg({ rounded = true, fill = 0.62, stroke = 2.75 } = {}) {
  const scale = (512 * fill) / EAR_HEIGHT;
  const radius = rounded ? 112 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${radius}" fill="${NAVY}"/>
  <g transform="translate(256 256) scale(${scale.toFixed(3)}) translate(${-EAR_CENTER.x} ${-EAR_CENTER.y})" fill="none" stroke="${SKY}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">
    ${EAR_PATHS.map((d) => `<path d="${d}"/>`).join("\n    ")}
  </g>
</svg>
`;
}

/** Render an SVG straight at the target size (sharper than downscaling one big bitmap) */
const png = (source, size) =>
  sharp(Buffer.from(source), { density: Math.max(72, (72 * size) / 512) * 4 })
    .resize(size, size, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toBuffer();

/** ICO container with PNG-encoded entries (supported by every current browser) */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = 6 + dir.length;
  entries.forEach(({ size, data }, i) => {
    const o = i * 16;
    dir.writeUInt8(size >= 256 ? 0 : size, o);
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1);
    dir.writeUInt8(0, o + 2); // palette
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4); // colour planes
    dir.writeUInt16LE(32, o + 6); // bits per pixel
    dir.writeUInt32LE(data.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([header, dir, ...entries.map((e) => e.data)]);
}

const rounded = svg();
const square = svg({ rounded: false, fill: 0.58 });
const maskable = svg({ rounded: false, fill: 0.44 });

const icoEntries = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(rounded, size) })));

const outputs = [
  ["app/icon.svg", Buffer.from(rounded)],
  ["app/favicon.ico", ico(icoEntries)],
  ["app/apple-icon.png", await png(square, 180)],
  ["public/icons/android-chrome-192x192.png", await png(rounded, 192)],
  ["public/icons/android-chrome-512x512.png", await png(rounded, 512)],
  ["public/icons/icon-maskable-512x512.png", await png(maskable, 512)],
  // scratch previews for checking small sizes (not used by the site)
  ...(process.argv.includes("--preview") ? [[process.argv.at(-1) + "/favicon-16.png", icoEntries[0].data], [process.argv.at(-1) + "/favicon-32.png", icoEntries[1].data]] : []),
];

for (const [path, data] of outputs) {
  await writeFile(path, data);
  console.log(`wrote ${path} (${data.length} bytes)`);
}
