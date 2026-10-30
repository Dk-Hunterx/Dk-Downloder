# All-in-One Video Downloader — Backend Service

A high-performance Python Flask + `yt-dlp` backend microservice for video extraction, audio extraction, and streaming download proxying for YouTube, Instagram Reels, Facebook Reels, and TikTok.

---

## 🚀 Free-Tier Deployment Options

### Option 1: Render.com (Recommended Free Tier)
1. Fork or push this repository to GitHub.
2. Sign in to [Render.com](https://render.com) and click **New Web Service**.
3. Connect your repository.
4. Set:
   - **Root Directory**: `backend`
   - **Environment**: `Docker` or `Python 3`
   - **Build Command**: `pip install -r requirements.txt` (if using Python native)
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
5. Click **Create Web Service**. Your service URL will be `https://your-service.onrender.com`.

### Option 2: Railway.app (Free Trial Tier)
1. In Railway, click **New Project** > **Deploy from GitHub repo**.
2. Select the repository and set Root Directory to `/backend`.
3. Railway automatically detects the `Dockerfile` and provisions the container with `ffmpeg` enabled.

### Option 3: Google Cloud Run (Free Tier)
1. Build & submit container:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/video-downloader-backend backend/
   ```
2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy video-downloader-backend \
     --image gcr.io/YOUR_PROJECT_ID/video-downloader-backend \
     --platform managed \
     --allow-unauthenticated \
     --memory 512Mi
   ```

---

## 🛠️ Local Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

API will run on `http://localhost:5000`.

---

## ⚖️ Legal & Compliance Notice
- Only public media is extractable.
- Never bypass DRM, copyright locks, paywalls, or private access permissions.
- Ensure compliance with platform Terms of Service.
