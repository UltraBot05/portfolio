// External-link allowlist (brief §18.6). All rendered project/demo/social
// URLs pass through this before becoming an href, so a future data source
// that made URLs user-editable can't inject javascript:/data: links.
const ALLOWED_PROTOCOLS = ['https:', 'http:'];
const ALLOWED_DOMAINS = [
  'github.com', 'gitlab.com',
  'vercel.app', 'netlify.app',
  'linkedin.com', 'medium.com',
  'youtube.com',
];

export function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return false;
    const domain = parsed.hostname.replace(/^www\./, '');
    return ALLOWED_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
  } catch {
    return false;
  }
}
