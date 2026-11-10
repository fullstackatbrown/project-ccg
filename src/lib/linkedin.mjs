// Content editors may paste bare domains or links copied from mobile sharing.
export function normalizeLinkedInUrl(value) {
  if (typeof value !== 'string') return '';
  const compact = value.trim().replace(/\s+/g, '');
  if (!compact) return '';
  const absolute = compact.startsWith('//') ? `https:${compact}` : /^https?:\/\//i.test(compact) ? compact : `https://${compact}`;
  try {
    const url = new URL(absolute);
    if (url.username || url.password || !/(^|\.)linkedin\.com$/i.test(url.hostname)) return '';
    if (!/^\/in\/[^/]+\/?$/.test(url.pathname)) return '';
    return `https://www.linkedin.com${url.pathname.replace(/\/$/, '')}/`;
  } catch {
    return '';
  }
}
