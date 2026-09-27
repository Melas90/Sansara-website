/**
 * Build: assembles pages/<page>/<page>.html + pages/<page>/copy.md + partials
 * into dist/. No dependencies. Run with `node scripts/build.mjs`.
 *
 * Template syntax (kept deliberately small):
 *   <!-- @route /path/ -->                first line of a page, optional
 *   <!-- @include _partials/header.html --> inline another file (recursive)
 *   {{ hero.headline }}                   a value from copy.md (inline markdown rendered)
 *   {{{ hero.headline }}}                 the same, as plain text (for attributes, <title>)
 *   {{#each what_we_do.offers}} … {{name}} … {{@index}} … {{/each}}
 *   {{#if founders.people}} … {{else}} … {{/if}}
 *   {{ shared.nav.system }}               values from pages/_partials/copy.md
 *   {{ site.name }} {{ page.route }}      build-time values
 *
 * copy.md format: `## Section` starts a key (slugified: "What we do" → what_we_do),
 * `### sub` nests one level, then an indentation-based subset of YAML:
 *   key: value            string
 *   key:                  nested object or list (decided by the next line)
 *   - item                list of strings
 *   - key: value          list of objects
 *   - "a: b"               quoted item: always a string, even with ": " inside
 * A value that starts with `PENDING` renders as a visible pending marker.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { site, routes } from './site.config.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES = path.join(ROOT, 'pages');
const DIST = path.join(ROOT, 'dist');

/* ---------- copy.md ---------- */

export const slug = (s) =>
  s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

/**
 * Where does the nested block of a key with no value start? A list may sit at the same
 * indent as its key (`rotating:` then `- phrase`, as YAML allows), an object must be indented.
 */
function childIndent(lines, i, keyIndent) {
  let j = i;
  while (j < lines.length && !lines[j].trim()) j++;
  const next = lines[j];
  if (!next) return null;
  const ind = next.match(/^\s*/)[0].length;
  if (/^\s*-\s/.test(next) && ind === keyIndent) return keyIndent;
  return ind > keyIndent ? ind : null;
}

/** Parse an indentation-based block of lines into an object or array. */
function parseBlock(lines, i, indent) {
  while (i < lines.length && !lines[i].trim()) i++;
  const first = lines[i];
  if (!first) return [{}, i];
  const isList = /^\s*-\s/.test(first);
  const out = isList ? [] : {};
  while (i < lines.length) {
    const raw = lines[i];
    if (!raw.trim()) { i++; continue; }
    const ind = raw.match(/^\s*/)[0].length;
    if (ind < indent) break;
    if (ind > indent) { i++; continue; } // stray deeper line, skip
    if (isList) {
      const m = raw.match(/^\s*-\s(.*)$/);
      if (!m) break;
      const body = m[1];
      // a quoted item is always a plain string, even with ": " inside
      const quoted = body.trim().match(/^"(.*)"$/);
      if (quoted) { out.push(quoted[1]); i++; continue; }
      const kv = body.match(/^([A-Za-z0-9_ -]+):(?:\s(.*))?$/);
      if (kv) {
        // object item: first key on the dash line, the rest indented by 2
        const obj = {};
        const itemIndent = ind + 2;
        if (kv[2] !== undefined && kv[2] !== '') { obj[slug(kv[1])] = kv[2]; i++; }
        else {
          const ci = childIndent(lines, i + 1, itemIndent);
          if (ci === null) { obj[slug(kv[1])] = ''; i++; }
          else { const [v, j] = parseBlock(lines, i + 1, ci); obj[slug(kv[1])] = v; i = j; }
        }
        const [rest, j] = parseBlock(lines, i, itemIndent);
        if (!Array.isArray(rest)) Object.assign(obj, rest);
        i = j;
        out.push(obj);
      } else { out.push(body.trim()); i++; }
    } else {
      const kv = raw.match(/^\s*([A-Za-z0-9_ -]+):(?:\s(.*))?$/);
      if (!kv) break;
      const key = slug(kv[1]);
      if (kv[2] !== undefined && kv[2] !== '') { out[key] = kv[2]; i++; }
      else {
        const ci = childIndent(lines, i + 1, indent);
        if (ci === null) { out[key] = ''; i++; }
        else { const [v, j] = parseBlock(lines, i + 1, ci); out[key] = v; i = j; }
      }
    }
  }
  return [out, i];
}

export function parseCopy(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const data = {};
  let section = null, sub = null, buf = [];
  const flush = () => {
    if (!buf.some((l) => l.trim())) { buf = []; return; }
    const firstIndent = buf.find((l) => l.trim()).match(/^\s*/)[0].length;
    const [v, end] = parseBlock(buf, 0, firstIndent);
    // never drop copy silently: anything the block did not read is an error (e.g. keys after a list)
    const left = buf.slice(end).find((l) => l.trim() && !/^s*<!--/.test(l));
    if (left) throw new Error(`copy.md: "${left.trim().slice(0, 60)}" in ${section}${sub ? "." + sub : ""} was not read. Keys cannot follow a list; move them above it.`);
    if (section && sub) data[section][sub] = v;
    else if (section && !Array.isArray(v)) Object.assign(data[section], v);
    buf = [];
  };
  for (const line of lines) {
    if (/^#\s/.test(line)) continue; // page title
    if (/^<!--/.test(line.trim()) && /-->$/.test(line.trim())) continue; // comments
    const h2 = line.match(/^##\s+(.*)$/);
    const h3 = line.match(/^###\s+(.*)$/);
    if (h2) { flush(); section = slug(h2[1]); sub = null; data[section] ??= {}; continue; }
    if (h3) { flush(); sub = slug(h3[1]); continue; }
    buf.push(line);
  }
  flush();
  return data;
}

/* ---------- inline markdown ---------- */

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function inline(value) {
  if (value == null) return '';
  const s = String(value);
  const pend = s.match(/^PENDING:?\s*(.*)$/);
  if (pend) return `<!-- ⚠️ PENDING: ${escapeHtml(pend[1])} --><span class="pend" title="${escapeHtml(pend[1])}">Pending</span>`;
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="serif">$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/(^|[\s(])'/g, '$1‘').replace(/'/g, '’');
}

const plain = (value) => {
  if (value == null) return '';
  const s = String(value);
  if (/^PENDING/.test(s)) return 'Pending';
  return escapeHtml(s.replace(/\*\*?(.+?)\*\*?/g, '$1').replace(/\[(.+?)\]\(.+?\)/g, '$1'));
};

/* ---------- templates ---------- */

function lookup(scope, expr) {
  const key = expr.trim();
  if (key === 'this') return scope[scope.length - 1]?.this ?? scope[scope.length - 1];
  for (let i = scope.length - 1; i >= 0; i--) {
    const ctx = scope[i];
    if (ctx == null || typeof ctx !== 'object') continue;
    if (key.startsWith('@')) { if (ctx[key] !== undefined) return ctx[key]; continue; }
    const parts = key.split('.');
    let v = ctx;
    for (const p of parts) { v = v?.[p]; if (v === undefined) break; }
    if (v !== undefined) return v;
  }
  return undefined;
}

const warnings = [];
const warn = (file, expr) => warnings.push(`${path.relative(ROOT, file)}: no copy for {{ ${expr} }}`);

/**
 * Find the outermost `{{#name expr}} … {{/name}}` block starting at or after `from`,
 * counting nested blocks of the same name. Returns null when there is none.
 */
function findBlock(tpl, name, from = 0) {
  const open = new RegExp(`{{#${name}\\s+([^}]+)}}`, 'g');
  open.lastIndex = from;
  const start = open.exec(tpl);
  if (!start) return null;
  const tokens = new RegExp(`{{#${name}\\s+[^}]+}}|{{/${name}}}`, 'g');
  tokens.lastIndex = open.lastIndex;
  let depth = 1, m;
  while ((m = tokens.exec(tpl))) {
    depth += m[0].startsWith(`{{#${name}`) ? 1 : -1;
    if (depth === 0) {
      return { expr: start[1], before: tpl.slice(0, start.index), body: tpl.slice(open.lastIndex, m.index), after: tpl.slice(tokens.lastIndex) };
    }
  }
  throw new Error(`unclosed {{#${name}}} in template`);
}

/** Split an `{{#if}}` body on its own `{{else}}`, ignoring nested ifs. */
function splitElse(body) {
  const tokens = /{{#if\s+[^}]+}}|{{\/if}}|{{else}}/g;
  let depth = 0, m;
  while ((m = tokens.exec(body))) {
    if (m[0].startsWith('{{#if')) depth++;
    else if (m[0] === '{{/if}}') depth--;
    else if (depth === 0) return [body.slice(0, m.index), body.slice(tokens.lastIndex)];
  }
  return [body, ''];
}

export function render(tpl, scope, file) {
  // {{#each}} … {{/each}}, outermost first; the body is rendered with the item in scope, so nesting works.
  let block;
  while ((block = findBlock(tpl, 'each'))) {
    const list = lookup(scope, block.expr);
    const out = !Array.isArray(list) ? '' : list.map((item, idx) => {
      const ctx = typeof item === 'object' && item !== null ? { ...item } : { this: item };
      ctx['@index'] = idx; ctx['@number'] = String(idx + 1).padStart(2, '0'); ctx['@first'] = idx === 0; ctx['@last'] = idx === list.length - 1;
      return render(block.body, [...scope, ctx], file);
    }).join('');
    tpl = block.before + out + block.after;
  }
  while ((block = findBlock(tpl, 'if'))) {
    const [yes, no] = splitElse(block.body);
    const v = lookup(scope, block.expr);
    const truthy = Array.isArray(v) ? v.length > 0 : Boolean(v) && !/^PENDING/.test(String(v));
    tpl = block.before + render(truthy ? yes : no, scope, file) + block.after;
  }
  tpl = tpl.replace(/{{{\s*([^}]+?)\s*}}}/g, (_, expr) => {
    const v = lookup(scope, expr);
    if (v === undefined) warn(file, expr);
    return plain(v);
  });
  return tpl.replace(/{{\s*([^#/}][^}]*?)\s*}}/g, (_, expr) => {
    const v = lookup(scope, expr);
    if (v === undefined) warn(file, expr);
    return typeof v === 'object' ? '' : inline(v);
  });
}

async function includePartials(html, fromFile, depth = 0) {
  if (depth > 10) throw new Error('include loop in ' + fromFile);
  const re = /<!--\s*@include\s+([^\s]+)\s*-->/g;
  const parts = [];
  let last = 0, m;
  while ((m = re.exec(html))) {
    parts.push(html.slice(last, m.index));
    const file = path.join(PAGES, m[1]);
    const inc = await fs.readFile(file, 'utf8');
    parts.push(await includePartials(inc, file, depth + 1));
    last = re.lastIndex;
  }
  parts.push(html.slice(last));
  return parts.join('');
}

/* ---------- files ---------- */

async function copyDir(from, to, filter = () => true) {
  await fs.mkdir(to, { recursive: true });
  for (const e of await fs.readdir(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) await copyDir(s, d, filter);
    else if (filter(e.name)) await fs.copyFile(s, d);
  }
}

async function readCopy(dir, lang) {
  const name = lang === site.defaultLanguage ? 'copy.md' : `copy.${lang}.md`;
  try { return parseCopy(await fs.readFile(path.join(dir, name), 'utf8')); }
  catch { return null; }
}

export async function build() {
  warnings.length = 0;
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });
  await copyDir(path.join(ROOT, 'brand'), path.join(DIST, 'brand'), (n) => !n.endsWith('.md'));
  await copyDir(path.join(PAGES, '_assets'), path.join(DIST, 'assets'));
  try { await copyDir(path.join(ROOT, 'public'), DIST); } catch { /* no public folder yet */ }

  const pages = [];
  for (const dir of await fs.readdir(PAGES, { withFileTypes: true })) {
    if (!dir.isDirectory() || dir.name === '_assets' || dir.name === '_partials') continue;
    // The design lab is for deciding, not shipping: left out of production builds (Netlify sets CONTEXT).
    if (dir.name === '_lab' && process.env.CONTEXT === 'production') continue;
    const folder = path.join(PAGES, dir.name);
    for (const f of await fs.readdir(folder)) {
      if (!f.endsWith('.html')) continue;
      pages.push({ folder, file: path.join(folder, f), name: f.replace(/\.html$/, '') });
    }
  }

  const written = [];
  for (const lang of site.languages) {
    const shared = (await readCopy(path.join(PAGES, '_partials'), lang)) ?? {};
    for (const p of pages) {
      let html = await fs.readFile(p.file, 'utf8');
      const routeTag = html.match(/^<!--\s*@route\s+(\S+)\s*-->\s*\n?/);
      const route = routeTag ? routeTag[1] : routes[p.name] ?? `/${p.name}/`;
      if (routeTag) html = html.slice(routeTag[0].length);
      const prefix = lang === site.defaultLanguage ? '' : `/${lang}`;
      // `<!-- @copy home -->` lets a page (the lab) borrow another page's copy instead of duplicating words.
      let copy = {};
      for (const m of html.matchAll(/<!--\s*@copy\s+(\S+)\s*-->/g)) {
        Object.assign(copy, (await readCopy(path.join(PAGES, m[1]), lang)) ?? {});
      }
      Object.assign(copy, (await readCopy(p.folder, lang)) ?? {});
      html = await includePartials(html, p.file);
      const year = new Date().getFullYear();
      const scope = [{ site: { ...site, year }, page: { route: prefix + route, lang, name: p.name }, shared, ...copy }];
      html = render(html, scope, p.file);
      const out = route.endsWith('.html')
        ? path.join(DIST, prefix, route)
        : path.join(DIST, prefix, route, 'index.html');
      await fs.mkdir(path.dirname(out), { recursive: true });
      await fs.writeFile(out, html);
      written.push(prefix + route);
    }
  }
  return { written, warnings: [...warnings] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const t = Date.now();
  const { written, warnings } = await build();
  for (const w of warnings) console.warn('warn  ' + w);
  console.log(`built ${written.length} page(s) in ${Date.now() - t}ms: ${written.join(', ')}`);
}
