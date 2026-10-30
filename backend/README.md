# DK Downloader — Media API

Flask + yt-dlp service for extracting metadata and processing downloads of supported **public** media.

## Local setup

Requires Python 3.11+ and FFmpeg.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

The API listens on port 5000 by default.

## Routes

- `GET /health` or `GET /api/health`
- `POST /api/fetch-info` with `{"platform":"youtube","url":"https://..."}`
- `GET /api/download?platform=youtube&url=...&formatId=video-720`

Supported format IDs: `video-1080`, `video-720`, `video-480`, `video-360` (only when available), and `audio-192`.

## Docker / Render

Choose Docker deployment with this folder as the service root. The included Dockerfile installs FFmpeg. Set `FRONTEND_ORIGIN` to your exact deployed frontend origin and set the platform-provided `PORT`.

## Security and use

The API requires HTTPS URLs and checks hostnames against supported platform domains. Do not expose it without platform-level rate limiting, quotas, and monitoring. Never use it to access private content, bypass DRM, authentication, paywalls, or platform restrictions. Users must have the rights or permission to save the media.
