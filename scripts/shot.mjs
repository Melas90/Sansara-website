/**
 * Screenshot helper for visual checks, no dependencies. Drives a local Chromium-based browser
 * (Edge or Chrome) over its DevTools protocol, so real viewport widths work (375, 768, 1024, 1440).
 *
 *   node scripts/shot.mjs <url> <out.png> [width=1440] [selector] [fullPage=1]
 *   node scripts/shot.mjs http://localhost:4321/lab/ lab.png 375 "#contact"
 *
 * With a selector the page scrolls it into view and captures the viewport from there;
 * without one it captures the full page (capped by the browser at 16384px).
 */
import { spawn } from 'node:child_process';
import { promises as fs, existsSync } from 'node:fs';

const [url, out, widthArg = '1440', selector, fullArg = '1'] = process.argv.slice(2);
if (!url || !out) { console.error('usage: node scripts/shot.mjs <url> <out.png> [width] [selector] [fullPage]'); process.exit(1); }
const width = Number(widthArg);
const height = 900;

const candidates = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) { console.error('no Chromium-based browser found; set BROWSER=<path>'); process.exit(1); }

const port = 9222 + Math.floor(Math.random() * 500);
const proc = spawn(browser, [`--remote-debugging-port=${port}`, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', `--window-size=${width},${height}`, 'about:blank'], { stdio: 'ignore' });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) {
  await wait(200);
  try { const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); target = list.find((t) => t.type === 'page'); } catch { /* not up yet */ }
}
if (!target) { proc.kill(); console.error('browser did not start'); process.exit(1); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 800 });
await send('Page.navigate', { url });
await wait(2500); // fonts, entrance animations
// Scroll through the page once so every section's entrance animation has played, then return to the top.
await send('Runtime.evaluate', {
  expression: `(async () => { document.documentElement.style.scrollBehavior = 'auto'; const h = document.documentElement.scrollHeight; for (let y = 0; y < h; y += ${Math.round(height * 0.6)}) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 1200)); })()`,
  awaitPromise: true,
});
if (selector) {
  await send('Runtime.evaluate', { expression: `document.querySelector(${JSON.stringify(selector)})?.scrollIntoView({block:'start'})`, awaitPromise: true });
  await wait(1500);
}
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.result.value;
const full = !selector && fullArg !== '0';
let clip;
if (full) {
  clip = { x: 0, y: 0, width, height: await evaluate('Math.min(document.documentElement.scrollHeight, 16000)'), scale: 1 };
} else {
  clip = { x: 0, y: await evaluate('window.scrollY'), width, height, scale: 1 };
}
const shot = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true });
if (!shot.result) { console.error('capture failed:', JSON.stringify(shot.error)); ws.close(); proc.kill(); process.exit(1); }
await fs.writeFile(out, Buffer.from(shot.result.data, 'base64'));
console.log(`saved ${out} (${clip.width}x${clip.height})`);
ws.close();
proc.kill();
