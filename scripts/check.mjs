/**
 * Checks run by `npm run verify` after a build:
 *  1. no raw colours or durations outside brand/tokens.css (hard rule 6)
 *  2. every internal link and asset in dist resolves (planned phase-2 routes are reported)
 *  3. lists every pending marker so nothing invented slips through (hard rule 3)
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { site, routes } from './site.config.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
let failed = false;
const fail = (m) => { failed = true; console.error('FAIL  ' + m); };

async function walk(dir, out = []) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, out); else out.push(p);
  }
  return out;
}

// 1. tokens only
for (const f of await walk(path.join(ROOT, 'pages'))) {
  if (!/\.(html|css|js)$/.test(f)) continue;
  const src = await fs.readFile(f, 'utf8');
  const rel = path.relative(ROOT, f);
  src.split('\n').forEach((line, i) => {
    if (/@allow-raw/.test(line)) return;
    if (/#[0-9a-fA-F]{3,8}\b/.test(line) && /(color|background|border|fill|stroke|shadow|gradient)/i.test(line))
      fail(`${rel}:${i + 1} raw colour, use a token`);
    if (/\b\d+(\.\d+)?m?s\b/.test(line) && /(transition|animation|duration|delay|setTimeout|setInterval)/i.test(line))
      fail(`${rel}:${i + 1} raw duration, use a token`);
  });
}

// 2. links
const files = await walk(DIST);
const exists = new Set(files.map((f) => '/' + path.relative(DIST, f).split(path.sep).join('/')));
const resolves = (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return true;
  if (exists.has(clean)) return true;
  if (clean.endsWith('/') && exists.has(clean + 'index.html')) return true;
  if (exists.has(clean + '/index.html')) return true;
  return false;
};
// A route in site.config.mjs that has no page yet is "not built yet", not broken.
const knownRoutes = [...site.plannedRoutes, ...Object.values(routes)];
const planned = new Set();
const seen = new Set();
for (const f of files.filter((f) => f.endsWith('.html'))) {
  const html = await fs.readFile(f, 'utf8');
  const rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) continue;
    if (!href.startsWith('/')) { fail(`${rel}: relative link "${href}", use a root-relative path`); continue; }
    if (resolves(href)) continue;
    const clean = href.split('#')[0];
    if (knownRoutes.includes(clean || '/')) { planned.add(clean || '/'); continue; }
    if (seen.has(rel + href)) continue;
    seen.add(rel + href);
    fail(`${rel}: broken link "${href}"`);
  }
}
if (planned.size) console.log('note  links to routes not built yet: ' + [...planned].sort().join(', '));

// 3. pending markers
const pending = new Map();
for (const f of files.filter((f) => f.endsWith('.html'))) {
  const html = await fs.readFile(f, 'utf8');
  const rel = '/' + path.relative(DIST, f).split(path.sep).join('/');
  for (const m of html.matchAll(/<!-- ⚠️ PENDING: ([^>]*?) -->/g)) {
    const pages = pending.get(m[1]) ?? new Set();
    pages.add(rel.replace(/index\.html$/, ''));
    pending.set(m[1], pages);
  }
}
if (pending.size) {
  console.log(`\n${pending.size} pending item(s):`);
  for (const [what, pages] of pending) console.log(`  ${what}  (${pages.size > 3 ? 'every page' : [...pages].join(', ')})`);
}

if (failed) process.exit(1);
console.log('\ncheck ok');
