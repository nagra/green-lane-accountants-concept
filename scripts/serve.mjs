// Serves dist/ locally, mirroring GitHub Pages: directory URLs get a trailing
// slash and index.html, and unknown paths get 404.html.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT ?? 4173);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const send = async (res, status, file) => {
  res.writeHead(status, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(await readFile(file));
};

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = path.join(distDir, decodeURIComponent(url.pathname));

  try {
    if (file !== distDir && !file.startsWith(distDir + path.sep)) throw new Error('outside dist');
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        res.writeHead(301, { Location: `${url.pathname}/${url.search}` });
        return res.end();
      }
      return await send(res, 200, path.join(file, 'index.html'));
    }
    return await send(res, 200, file);
  } catch {
    return send(res, 404, path.join(distDir, '404.html')).catch(() => {
      res.writeHead(404).end('Not found');
    });
  }
}).listen(port, () => {
  console.log(`Previewing dist/ at http://localhost:${port}/`);
});
