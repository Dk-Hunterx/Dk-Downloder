import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const BACKEND_URL = (process.env.BACKEND_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');

async function proxyApi(req: Request, res: Response) {
  try {
    const target = new URL(req.originalUrl, BACKEND_URL);
    const headers: Record<string, string> = {};
    if (req.headers['content-type']) headers['content-type'] = req.headers['content-type'];
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body ?? {}),
      signal: AbortSignal.timeout(10 * 60 * 1000),
    });
    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (['content-type', 'content-disposition', 'content-length', 'cache-control'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    if (!upstream.body) return res.end();
    Readable.fromWeb(upstream.body as import('stream/web').ReadableStream).pipe(res);
  } catch (error) {
    console.error('API proxy error:', error);
    if (!res.headersSent) res.status(502).json({ success: false, error: 'Downloader service is unavailable. Please try again shortly.' });
    else res.end();
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/*', proxyApi);
  app.post('/api/*', proxyApi);

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  } else {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DK Downloader web server listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start DK Downloader:', error);
  process.exit(1);
});
