# DK Downloader

A responsive, stateless downloader interface for public media from YouTube, Instagram, Facebook, and TikTok. The app uses a React/Vite frontend, an Express web server, and a Python/Flask + yt-dlp media service.

## Features

- No account, cookies, or download history.
- Public media metadata and available MP4/MP3 formats.
- Actual format selection; no placeholder/sample stream URLs.
- Mobile-first interface with light/dark themes.
- Server-side URL allowlisting and safe temporary-file cleanup.
- Clear handling for private, unavailable, unsupported, or restricted media.

## Run locally

Requirements: Node.js 20+, Python 3.11+, and FFmpeg.

Terminal 1 — media API:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Terminal 2 — web app:
```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://127.0.0.1:5000`. To use another backend, set `BACKEND_URL`.

## Production deployment

Deploy the Flask service from the `backend` directory using its Dockerfile. Set `FRONTEND_ORIGIN` to the exact frontend origin. Deploy the Node web service with `NODE_ENV=production` and `BACKEND_URL=https://your-backend.example`. Build with `npm run build`.

Do not deploy the media API as an unrestricted public proxy. Add platform-level rate limiting, request quotas, and monitoring before public launch. Keep FFmpeg installed in the backend container.

## API

- `GET /api/health` — service health.
- `POST /api/fetch-info` — JSON body: `{"platform":"youtube","url":"https://..."}`.
- `GET /api/download?platform=...&url=...&formatId=...` — streams a generated attachment.

## Important

Use this service only for media you own, have permission to download, or that the platform makes available for downloading. It does not bypass DRM, paywalls, account restrictions, or private content. Platform terms and local laws still apply.
