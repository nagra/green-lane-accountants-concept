// Builds the static site into dist/. No dependencies beyond Node itself.
//
//   BASE_PATH  Path the site is served from, used only by 404.html, which can be
//              served at any URL depth. Defaults to "/". Every other page uses
//              relative links, so the build works at any sub-path.

import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, renderPage, svg } from '../src/layout.mjs';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(projectDir, 'src');
const pagesDir = path.join(srcDir, 'pages');
const outDir = path.join(projectDir, 'dist');

const site = JSON.parse(await readFile(path.join(srcDir, 'site.json'), 'utf8'));
const basePath = normaliseBasePath(process.env.BASE_PATH);

await rm(outDir, { recursive: true, force: true });
await cp(path.join(srcDir, 'assets'), path.join(outDir, 'assets'), { recursive: true });

const fingerprint = async (file) => {
  const hash = createHash('sha256').update(await readFile(path.join(srcDir, file))).digest('hex').slice(0, 10);
  return `${file}?v=${hash}`;
};
const assets = { css: await fingerprint('assets/css/site.css'), js: await fingerprint('assets/js/site.js') };

const entries = await readdir(pagesDir, { recursive: true, withFileTypes: true });
const pageFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
  .map((entry) => path.relative(pagesDir, path.join(entry.parentPath, entry.name)))
  .sort();

const urlPaths = [];
for (const file of pageFiles) {
  const source = await readFile(path.join(pagesDir, file), 'utf8');
  const { meta, body } = parsePage(source, file);
  const segments = file.split(path.sep);
  const depth = segments.length - 1;
  const root = meta.absoluteLinks ? basePath : depth === 0 ? './' : '../'.repeat(depth);
  const urlPath = segments.at(-1) === 'index.html' ? `/${segments.slice(0, -1).map((s) => `${s}/`).join('')}` : `/${segments.join('/')}`;
  const tokens = { ...site, root };

  const html = tidyContactText(renderPage({ site, meta, body: fill(body, tokens, file), root, assets, urlPath }));
  await mkdir(path.join(outDir, ...segments.slice(0, -1)), { recursive: true });
  await writeFile(path.join(outDir, file), html);
  if (meta.sitemap !== false) urlPaths.push(urlPath);
}

// Search files are only produced for the production build (site.json "preview": false).
if (!site.preview) {
  const urls = urlPaths.map((p) => `  <url><loc>${escapeHtml(site.productionUrl + p)}</loc></url>`).join('\n');
  await writeFile(
    path.join(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  await writeFile(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.productionUrl}/sitemap.xml\n`);
}

console.log(`Built ${pageFiles.length} pages to dist/ (${site.preview ? 'preview' : 'production'} mode, base path ${basePath})`);

function normaliseBasePath(value = '/') {
  const trimmed = value.trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

// Each page starts with a JSON comment holding its metadata.
function parsePage(source, file) {
  const match = source.match(/^<!--\s*(\{[\s\S]*?\})\s*-->\s*/);
  if (!match) throw new Error(`${file}: missing metadata comment`);
  const meta = JSON.parse(match[1]);
  for (const key of ['title', 'description']) {
    if (!meta[key]) throw new Error(`${file}: metadata is missing "${key}"`);
  }
  return { meta, body: source.slice(match[0].length) };
}

// In visible text only: keeps the phone number on one line, and lets the long
// email address wrap after the "@" on narrow screens rather than mid-word.
function tidyContactText(html) {
  const phone = escapeHtml(site.phone);
  const [local, domain] = escapeHtml(site.email).split('@');
  return html
    .replace(/>[^<]+</g, (text) => text.replaceAll(phone, phone.replaceAll(' ', '&nbsp;')))
    .replaceAll(`>${local}@${domain}<`, `>${local}@<wbr>${domain}<`);
}

// Replaces {{token}} with escaped site values and {{svg:name}} with inline SVG.
function fill(template, tokens, file) {
  return template.replace(/\{\{\s*([\w:-]+)\s*\}\}/g, (match, key) => {
    if (key.startsWith('svg:')) {
      const graphic = svg[key.slice(4)];
      if (!graphic) throw new Error(`${file}: unknown graphic ${match}`);
      return graphic;
    }
    if (!(key in tokens)) throw new Error(`${file}: unknown token ${match}`);
    return escapeHtml(tokens[key]);
  });
}
