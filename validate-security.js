#!/usr/bin/env node
/**
 * Pre-deploy security validation gate (brief §18.10).
 * Runs via "predeploy": "npm run validate". No external deps: walks the tree
 * with fs so it works without `glob`.
 */
import fs from 'fs';
import path from 'path';

let errors = 0;
const fail = (msg) => { console.error(`\x1b[31m✗ SECURITY: ${msg}\x1b[0m`); errors++; };
const pass = (msg) => console.log(`\x1b[32m✓ ${msg}\x1b[0m`);

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      walk(p, exts, out);
    } else if (exts.some(e => entry.name.endsWith(e))) {
      out.push(p);
    }
  }
  return out;
}

const srcFiles = walk('src', ['.js', '.jsx', '.ts', '.tsx']);
const apiFiles = walk('api', ['.js']);

// 1. No API keys in client source
const keyPatterns = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'AIza', 'VITE_.*KEY', 'VITE_.*SECRET'];
let keyHit = false;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  for (const pattern of keyPatterns) {
    if (new RegExp(pattern).test(content)) { fail(`Possible API key in client code: ${file} (${pattern})`); keyHit = true; }
  }
}
if (!keyHit) pass('No API key patterns in client source');

// 2. No dangerouslySetInnerHTML without DOMPurify (per file)
let dsihHit = false;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('dangerouslySetInnerHTML') && !content.includes('DOMPurify')) { fail(`dangerouslySetInnerHTML without DOMPurify: ${file}`); dsihHit = true; }
}
if (!dsihHit) pass('dangerouslySetInnerHTML usage is DOMPurify-protected');

// 3. No rehype-raw (ignore comment lines warning against it)
let rehypeHit = false;
for (const file of srcFiles) {
  const active = fs.readFileSync(file, 'utf-8').split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
  if (active.includes('rehype-raw') || active.includes('rehypeRaw')) { fail(`rehype-raw detected (XSS risk): ${file}`); rehypeHit = true; }
}
if (!rehypeHit) pass('No rehype-raw in markdown renderer');

// 4. All target="_blank" links have rel="noopener"
let blankHit = false;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(/target=["']_blank["']/g) || [];
  if (matches.length && !content.includes('noopener')) { fail(`target="_blank" without noopener: ${file}`); blankHit = true; }
}
if (!blankHit) pass('All _blank links have noopener');

// 5. vercel.json has CSP
try {
  const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf-8'));
  const hasCSP = vercel.headers?.some(h => h.headers?.some(hh => hh.key === 'Content-Security-Policy'));
  hasCSP ? pass('CSP header present in vercel.json') : fail('vercel.json missing Content-Security-Policy');
} catch { fail('vercel.json missing or invalid'); }

// 6. .env gitignored
try {
  const gi = fs.readFileSync('.gitignore', 'utf-8');
  gi.includes('.env') ? pass('.env is gitignored') : fail('.env not in .gitignore');
} catch { fail('.gitignore missing'); }

// 7. No eval() / new Function()
let evalHit = false;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  if (/\beval\s*\(/.test(content) || /new\s+Function\s*\(/.test(content)) { fail(`eval/new Function: ${file}`); evalHit = true; }
}
if (!evalHit) pass('No eval() in source');

// 8. API files use server-only env vars
let apiHit = false;
for (const file of apiFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('NEXT_PUBLIC_') || content.includes('VITE_')) { fail(`client-exposed env var in server code: ${file}`); apiHit = true; }
}
if (!apiHit) pass('API files use server-only env vars');

console.log(`\n${errors === 0 ? '\x1b[32m✓ All security checks passed.\x1b[0m' : `\x1b[31m✗ ${errors} security issue(s) found.\x1b[0m`}`);
if (errors > 0) process.exit(1);
