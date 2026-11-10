import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
const release = `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT || '1'}`;
if (!process.env.GITHUB_RUN_ID) throw new Error('Missing deployment run ID');
const routes = ['/', '/members/', '/clients/', '/recruitment/', '/contact/'];
const files = Object.fromEntries(await Promise.all(routes.map(async route => {
  const content = await fs.readFile(`dist${route}index.html`);
  return [route, createHash('sha256').update(content).digest('hex')];
})));
const manifest = { release, source: process.env.GITHUB_SHA, files };
await fs.mkdir('dist/deployments', { recursive: true });
await fs.writeFile(`dist/deployments/${release}.json`, JSON.stringify(manifest));
await fs.writeFile('deployment-manifest.json', JSON.stringify(manifest));
console.log(`Prepared deployment verification for ${release}`);
