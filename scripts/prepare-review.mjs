import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
const review = join(root, '.review-preview');
await readFile(join(output, 'index.html')); // Require a successful Astro build first.
await mkdir(review, { recursive: true });
for (const entry of await readdir(review)) {
  if (entry !== '.vercel') await rm(join(review, entry), { recursive: true, force: true });
}
await cp(output, review, { recursive: true });
await writeFile(join(review, 'vercel.json'), JSON.stringify({
  version: 2,
  framework: null,
  buildCommand: null,
  installCommand: null,
  outputDirectory: '.',
  headers: [{ source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] }],
}, null, 2) + '\n');
await writeFile(join(review, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
// Check the artifact without logging or uploading any credential values.
const credentials = (await readFile(join(root, '.env'), 'utf8')).split('\n')
  .filter(line => /^PUBLIC_CONTENTFUL_.*TOKEN=/.test(line))
  .map(line => line.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, ''))
  .filter(Boolean);
async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === '.vercel') continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await check(path);
    else {
      if (entry.name.startsWith('.env')) throw new Error('Environment file found in review artifact.');
      if (/\.(?:html|js|json|css|txt)$/.test(entry.name)) {
        const text = await readFile(path, 'utf8');
        if (credentials.some(value => text.includes(value))) throw new Error('Contentful credential found in review artifact.');
      }
    }
  }
}
await check(review);
console.log('Review copy prepared in .review-preview. Contentful credentials remain local.');
