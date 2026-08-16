import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.join(process.cwd(), 'scripts', 'carousel-mockups');
const types = { '.html': 'text/html', '.css': 'text/css' };
http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(p, (err, data) => {
    if (err) { res.writeHead(404); res.end('nf'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(p)] || 'text/plain' });
    res.end(data);
  });
}).listen(4321, () => console.log('mockup server on 4321'));
