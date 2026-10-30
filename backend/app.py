"""
All-in-One Video Downloader - Python Flask + yt-dlp Backend
Provides production-grade video metadata extraction and stream proxying.
Deployable on Render, Railway, Fly.io, or Google Cloud Run free tiers.
"""

import os
import re
import json
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import yt_dlp
import requests

app = Flask(__name__)
# Enable CORS for frontend origin
CORS(app, origins=["*"])

PORT = int(os.environ.get("PORT", 5000))

# yt-dlp configuration options
YTDL_BASE_OPTS = {
    'quiet': True,
    'no_warnings': True,
    'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    'noplaylist': True,
    'extract_flat': False,
    'skip_download': True,
    # Respect user-agent to prevent bot blocks
    'http_headers': {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }
}

def sanitize_title(title: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9_\-\s]', '', title)
    return cleaned.strip()[:60] or "video"

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "All Video Downloader Flask Backend",
        "engine": "yt-dlp",
        "version": yt_dlp.version.__version__
    })

@app.route('/api/info', methods=['POST'])
def get_video_info():
    data = request.get_json() or {}
    url = data.get('url', '').strip()
    platform = data.get('platform', '')

    if not url:
        return jsonify({"error": "URL parameter is required."}), 400

    try:
        ydl_opts = dict(YTDL_BASE_OPTS)
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            if not info:
                return jsonify({"error": "Unable to extract video information."}), 404

            title = info.get('title', 'Video Download')
            thumbnail = info.get('thumbnail') or (info.get('thumbnails')[-1]['url'] if info.get('thumbnails') else '')
            uploader = info.get('uploader') or info.get('channel') or info.get('creator') or 'Creator'
            duration_secs = info.get('duration', 0)
            mins = duration_secs // 60
            secs = duration_secs % 60
            duration_str = f"{mins:02d}:{secs:02d}"

            formats_list = []
            
            # Formats extraction
            raw_formats = info.get('formats', [])
            
            # Video qualities
            added_heights = set()
            for f in sorted(raw_formats, key=lambda x: (x.get('height') or 0), reverse=True):
                h = f.get('height')
                ext = f.get('ext')
                url_direct = f.get('url')
                
                if h and h in [1080, 720, 480, 360] and h not in added_heights and url_direct:
                    added_heights.add(h)
                    formats_list.append({
                        "formatId": f"mp4-{h}",
                        "label": f"{h}p {'Full HD' if h == 1080 else 'HD' if h == 720 else 'SD'}",
                        "quality": f"{h}p",
                        "ext": "mp4",
                        "type": "video",
                        "resolution": f"{f.get('width', 0)}x{h}",
                        "filesizeApprox": f"{round((f.get('filesize') or f.get('filesize_approx') or (h*1500000))/1048576, 1)} MB",
                        "directStreamUrl": url_direct
                    })

            # Audio extraction
            best_audio = next((f for f in raw_formats if f.get('vcodec') == 'none' and f.get('acodec') != 'none'), None)
            if best_audio and best_audio.get('url'):
                formats_list.append({
                    "formatId": "mp3-hq",
                    "label": "MP3 High Quality Audio",
                    "quality": "320 kbps",
                    "ext": "mp3",
                    "type": "audio",
                    "bitrate": "320 kbps",
                    "filesizeApprox": "5.4 MB",
                    "directStreamUrl": best_audio['url']
                })

            return jsonify({
                "success": True,
                "data": {
                    "id": info.get('id'),
                    "title": title,
                    "author": uploader,
                    "thumbnail": thumbnail,
                    "duration": duration_str,
                    "formats": formats_list,
                    "webpage_url": info.get('webpage_url', url)
                }
            })

    except yt_dlp.utils.DownloadError as e:
        error_msg = str(e)
        if "Private video" in error_msg or "Sign in" in error_msg:
            return jsonify({"error": "This video is private or requires account login. Only public content is supported."}), 403
        if "DRM" in error_msg or "copyright" in error_msg.lower():
            return jsonify({"error": "This content is protected by DRM or copyright restrictions."}), 403
        return jsonify({"error": f"Failed to extract video: {error_msg.split(';')[0]}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stream', methods=['GET'])
def stream_video():
    stream_url = request.args.get('url')
    title = request.args.get('title', 'download')
    ext = request.args.get('ext', 'mp4')

    if not stream_url:
        return jsonify({"error": "Missing stream URL"}), 400

    filename = f"{sanitize_title(title)}.{ext}"
    content_type = "audio/mpeg" if ext == "mp3" else "video/mp4"

    def generate():
        with requests.get(stream_url, stream=True, headers={'User-Agent': YTDL_BASE_OPTS['http_headers']['User-Agent']}) as r:
            for chunk in r.iter_content(chunk_size=65536):
                if chunk:
                    yield chunk

    response = Response(stream_with_context(generate()), content_type=content_type)
    response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT)
