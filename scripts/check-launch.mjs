/**
 * Pre-launch check: fails if any PLACEHOLDER or [PENDIENTE] marker is still in
 * the config or content, so nothing ships pointing at a placeholder.
 * Run with `npm run check:launch`. Not part of CI on purpose: staging is
 * allowed to carry placeholders, production is not.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const roots = ['src/config', 'src/content', 'src/i18n'];
const markers = /PLACEHOLDER|\[PENDIENTE\]/;
const found = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else {
      const lines = (await readFile(path, 'utf8')).split('\n');
      lines.forEach((line, index) => {
        if (markers.test(line) && !line.trim().startsWith('*') && !line.trim().startsWith('//')) {
          found.push(`${path}:${index + 1}  ${line.trim()}`);
        }
      });
    }
  }
}

for (const root of roots) await walk(root);

if (found.length > 0) {
  console.error(`Not ready for launch. ${found.length} placeholder(s) left:\n`);
  console.error(found.join('\n'));
  process.exit(1);
}
console.log('No placeholders left. Ready for launch.');
