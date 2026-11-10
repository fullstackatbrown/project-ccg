import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export async function checkLiveDeployment(manifest, origin) {
  const response = await fetch(new URL(`/deployments/${manifest.release}.json`, origin), { cache: 'no-store', signal: AbortSignal.timeout(15000) });
  if (!response.ok) return false;
  const live = await response.json();
  if (live.release !== manifest.release) return false;
  for (const [route, expected] of Object.entries(manifest.files)) {
    const url = new URL(route, origin);
    url.searchParams.set('release', manifest.release);
    const page = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
    if (!page.ok) return false;
    const actual = createHash('sha256').update(Buffer.from(await page.arrayBuffer())).digest('hex');
    if (actual !== expected) return false;
  }
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const manifest = JSON.parse(await fs.readFile(process.argv[2], 'utf8'));
  const origin = process.argv[3];
  const deadline = Date.now() + 180000;
  let verified = false;
  do {
    try { verified = await checkLiveDeployment(manifest, origin); }
    catch (error) { console.log(`Live verification pending: ${error.message}`); }
    if (verified) break;
    console.log('Waiting for the public site to serve the new deployment...');
    await new Promise(resolve => setTimeout(resolve, 10000));
  } while (Date.now() < deadline);
  if (!verified) throw new Error('GitHub Pages reported success, but the public site does not match this build. The release is not verified.');
  console.log('Verified the exact deployed HTML on all five public pages.');
}
