/**
 * Dev server: `npm run dev`, then open http://localhost:4321/.
 * Rebuilds when any source file changed since the last request. No dependencies.
 */
import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { build } from './build.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 4321;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp',
  '.avif': 'image/avif', '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml',
};

async function newest(dir) {
  let t = 0;
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    t = Math.max(t, e.isDirectory() ? await newest(p) : (await fs.stat(p)).mtimeMs);
  }
  return t;
}

let last = 0;
async function ensureBuilt() {
  const t = Math.max(
    await newest(path.join(ROOT, 'pages')),
    await newest(path.join(ROOT, 'brand')),
    await newest(path.join(ROOT, 'scripts')),
  );
  if (t > last) {
    const { warnings } = await build();
    for (const w of warnings) console.warn('warn  ' + w);
    last = Date.now();
    console.log('rebuilt');
  }
}

http
  .createServer(async (req, res) => {
    try {
      await ensureBuilt();
      let url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (url.endsWith('/')) url += 'index.html';
      let file = path.join(DIST, url);
      try {
        if ((await fs.stat(file)).isDirectory()) {
          res.writeHead(301, { Location: url + '/' });
          return res.end();
        }
      } catch {
        if (url === '/index.html') { res.writeHead(302, { Location: '/lab/' }); return res.end(); } // no home page yet
        file = path.join(DIST, '404.html');
        res.statusCode = 404;
      }
      let body;
      try { body = await fs.readFile(file); } catch { return res.end('Not found'); }
      res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
      res.end(body);
    } catch (e) {
      res.statusCode = 500;
      res.end(String(e.stack || e));
    }
  })
  .listen(PORT, () => console.log(`dev server on http://localhost:${PORT}/  (lab at /lab/)`));
