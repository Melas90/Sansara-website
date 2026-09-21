/**
 * Builds the serif fonts the site ships: Newsreader upright and italic, cut
 * down to the characters English, Spanish and German need and to the weights
 * the design uses. The upright keeps its optical-size axis, which gives
 * headlines their display cut; the italic is only used at text sizes.
 *
 * Run `node scripts/subset-fonts.mjs` after upgrading @fontsource-variable/newsreader
 * or when a new language needs more characters. The output is committed.
 */
import { readFile, writeFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

const base = 'node_modules/@fontsource-variable/newsreader/files/';
const jobs = [
  [`${base}newsreader-latin-opsz-normal.woff2`, 'src/assets/fonts/newsreader-display.woff2'],
  [`${base}newsreader-latin-wght-italic.woff2`, 'src/assets/fonts/newsreader-italic.woff2'],
];

const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const accents = 'áéíóúüñÁÉÍÓÚÜÑ¿¡äöÄÖßàèìòùçÇ';
const punctuation = '“”„‚‘’«»‹›…–—·•€£©®™°×✓ ';

for (const [source, target] of jobs) {
  const input = await readFile(source);
  const output = await subsetFont(input, ascii + accents + punctuation, {
    targetFormat: 'woff2',
    variationAxes: { wght: { min: 300, max: 500 } },
  });
  await writeFile(target, output);
  console.log(`${input.length} -> ${output.length} bytes  ${target}`);
}
