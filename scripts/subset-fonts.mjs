/**
 * Builds the display font the site ships: Newsreader (upright) cut down to the
 * characters English, Spanish and German need and to the weights the design
 * uses, keeping the optical-size axis that gives headlines their display cut.
 *
 * Run `node scripts/subset-fonts.mjs` after upgrading @fontsource-variable/newsreader
 * or when a new language needs more characters. The output is committed.
 */
import { readFile, writeFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

const source =
  'node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2';
const target = 'src/assets/fonts/newsreader-display.woff2';

const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const accents = 'áéíóúüñÁÉÍÓÚÜÑ¿¡äöÄÖßàèìòùçÇ';
const punctuation = '“”„‚‘’«»‹›…–—·•€£©®™°×✓ ';

const input = await readFile(source);
const output = await subsetFont(input, ascii + accents + punctuation, {
  targetFormat: 'woff2',
  variationAxes: { wght: { min: 300, max: 500 } },
});
await writeFile(target, output);
console.log(`${source}\n  ${input.length} bytes -> ${target} ${output.length} bytes`);
