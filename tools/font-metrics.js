// Prints the numbers behind the metric-matched fallback faces in
// css/base/typography.css: for each font given, the ascent, descent, and line
// gap the browser will use and its average lowercase advance; and, against the
// face named by --against, the four @font-face descriptors that make that
// local face take the web face's space.
//
//   node tools/font-metrics.js --against C:\Windows\Fonts\arial.ttf hanken-400.ttf hanken-500.ttf
//   node tools/font-metrics.js --against C:\Windows\Fonts\arialbd.ttf hanken-600.ttf sora-600.ttf sora-700.ttf
//
// The web faces as TrueType: ask Google Fonts for the stylesheet from a client
// that does not claim woff2 and it answers with .ttf URLs —
//
//   curl -A curl "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Sora:wght@600;700"
//
// then fetch each src. Re-run this whenever the version in those URLs changes;
// a new cut of a family can move its metrics.
//
// How the numbers are chosen. Browsers take line metrics from hhea, or from
// OS/2 typo when its USE_TYPO_METRICS bit is set; both families here set it
// and their two tables agree, so the values hold on every platform. The width
// match uses the average advance of a lowercase sample weighted by English
// letter frequency, computed the same way for both faces — the OS/2
// xAvgCharWidth field is not comparable across fonts, because older tables
// average a different set of glyphs. size-adjust is the ratio of those
// averages; the three overrides are the web face's own metrics divided by it,
// because the browser applies size-adjust to the override values as well.

import fs from 'node:fs';
import path from 'node:path';

const SAMPLE = 'aaabcdeeeefghiijklmnnoopqrrssttuvwxyz';

function readTables(buffer) {
  const count = buffer.readUInt16BE(4);
  const tables = {};
  for (let i = 0; i < count; i++) {
    const record = 12 + 16 * i;
    tables[buffer.toString('ascii', record, record + 4)] = buffer.readUInt32BE(record + 8);
  }
  return tables;
}

/** Character to glyph id through the BMP cmap subtable (format 4). */
function glyphLookup(buffer, cmap) {
  const count = buffer.readUInt16BE(cmap + 2);
  let subtable = null;
  for (let i = 0; i < count; i++) {
    const platform = buffer.readUInt16BE(cmap + 4 + 8 * i);
    const encoding = buffer.readUInt16BE(cmap + 6 + 8 * i);
    const offset = buffer.readUInt32BE(cmap + 8 + 8 * i);
    const unicode = platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10));
    if (unicode && buffer.readUInt16BE(cmap + offset) === 4) {
      subtable = cmap + offset;
      break;
    }
  }
  if (subtable === null) throw new Error('no format 4 cmap subtable');

  const segX2 = buffer.readUInt16BE(subtable + 6);
  const ends = subtable + 14;
  const starts = ends + segX2 + 2;
  const deltas = starts + segX2;
  const ranges = deltas + segX2;

  return (character) => {
    const code = character.charCodeAt(0);
    for (let s = 0; s < segX2 / 2; s++) {
      if (code > buffer.readUInt16BE(ends + 2 * s)) continue;
      const start = buffer.readUInt16BE(starts + 2 * s);
      if (code < start) return 0;
      const delta = buffer.readInt16BE(deltas + 2 * s);
      const rangeOffset = buffer.readUInt16BE(ranges + 2 * s);
      if (rangeOffset === 0) return (code + delta) & 0xffff;
      const glyph = buffer.readUInt16BE(ranges + 2 * s + rangeOffset + 2 * (code - start));
      return glyph ? (glyph + delta) & 0xffff : 0;
    }
    return 0;
  };
}

function measure(file) {
  const buffer = fs.readFileSync(file);
  const t = readTables(buffer);
  const unitsPerEm = buffer.readUInt16BE(t.head + 18);
  const useTypo = (buffer.readUInt16BE(t['OS/2'] + 62) & 0x80) !== 0;
  const ascent = useTypo ? buffer.readInt16BE(t['OS/2'] + 68) : buffer.readInt16BE(t.hhea + 4);
  const descent = useTypo ? buffer.readInt16BE(t['OS/2'] + 70) : buffer.readInt16BE(t.hhea + 6);
  const lineGap = useTypo ? buffer.readInt16BE(t['OS/2'] + 72) : buffer.readInt16BE(t.hhea + 8);

  const metricCount = buffer.readUInt16BE(t.hhea + 34);
  const glyph = glyphLookup(buffer, t.cmap);
  let total = 0;
  for (const character of SAMPLE) {
    const index = Math.min(glyph(character), metricCount - 1);
    total += buffer.readUInt16BE(t.hmtx + 4 * index);
  }

  return {
    file: path.basename(file),
    unitsPerEm,
    source: useTypo ? 'OS/2 typo' : 'hhea',
    ascent: ascent / unitsPerEm,
    descent: Math.abs(descent) / unitsPerEm,
    lineGap: lineGap / unitsPerEm,
    averageAdvance: total / SAMPLE.length / unitsPerEm,
  };
}

const percent = (value) => `${(value * 100).toFixed(2)}%`;

function overrides(web, fallback) {
  const sizeAdjust = web.averageAdvance / fallback.averageAdvance;
  return {
    'size-adjust': percent(sizeAdjust),
    'ascent-override': percent(web.ascent / sizeAdjust),
    'descent-override': percent(web.descent / sizeAdjust),
    'line-gap-override': percent(web.lineGap / sizeAdjust),
  };
}

const args = process.argv.slice(2);
const againstIndex = args.indexOf('--against');
const fallbackFile = againstIndex === -1 ? null : args[againstIndex + 1];
const files = args.filter((arg, index) => index !== againstIndex && index !== againstIndex + 1);

if (files.length === 0) {
  console.error('usage: node tools/font-metrics.js [--against <fallback.ttf>] <font.ttf> [...]');
  process.exit(1);
}

const faces = files.map(measure);
console.table(
  faces.map((face) => ({
    file: face.file,
    metrics: face.source,
    ascent: face.ascent.toFixed(4),
    descent: face.descent.toFixed(4),
    lineGap: face.lineGap.toFixed(4),
    averageAdvance: face.averageAdvance.toFixed(4),
  }))
);

if (fallbackFile) {
  const fallback = measure(fallbackFile);
  console.log(`\nAgainst ${fallback.file}:`);
  console.table(Object.fromEntries(faces.map((face) => [face.file, overrides(face, fallback)])));
}
