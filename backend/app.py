"""Secure, stateless media metadata and download API.

Only public URLs from supported platforms are accepted. This service does not
bypass DRM, authentication, paywalls, or private-account restrictions.
"""
import os
import re
import tempfile
from pathlib import Path
from urllib.parse import urlparse

from flask import Flask, jsonify, request, send_file, after_this_request
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024
CORS(app, resources={r"/api/*": {"origins": os.getenv("FRONTEND_ORIGIN", "*")}})

PLATFORMS = {
    "youtube": {"hosts": {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"}, "label": "YouTube"},
    "instagram": {"hosts": {"instagram.com", "www.instagram.com"}, "label": "Instagram"},
    "facebook": {"hosts": {"facebook.com", "www.facebook.com", "m.facebook.com", "fb.watch"}, "label": "Facebook"},
    "tiktok": {"hosts": {"tiktok.com", "www.tiktok.com", "vm.tiktok.com", "vt.tiktok.com"}, "label": "TikTok"},
}
VIDEO_HEIGHTS = (1080, 720, 480, 360)


def validate_media_url(raw_url, platform):
    if platform not in PLATFORMS or not isinstance(raw_url, str) or len(raw_url) > 2048:
        raise ValueError("Unsupported platform or invalid URL.")
    parsed = urlparse(raw_url.strip())
    host = (parsed.hostname or "").lower().rstrip(".")
    if parsed.scheme != "https" or not host or parsed.username or parsed.password:
        raise ValueError("Use a valid HTTPS public media URL.")
    if not any(host == allowed or host.endswith("." + allowed)
               for allowed in PLATFORMS[platform]["hosts"]):
        raise ValueError(f"This URL does not belong to {PLATFORMS[platform]['label']}.")
    return parsed.geturl()


def ydl_options(extra=None):
    opts = {
        "quiet": True, "no_warnings": True, "noplaylist": True,
        "skip_download": True, "socket_timeout": 15, "retries": 1,
        "extractor_retries": 1, "ignoreerrors": False,
        "cachedir": False,
    }
    if extra:
        opts.update(extra)
    return opts


def readable_size(value):
    if not value:
        return "Unknown size"
    return f"{value / (1024 * 1024):.1f} MB"


def get_formats(info):
    formats = []
    available = info.get("formats") or []
    for height in VIDEO_HEIGHTS:
        candidates = [f for f in available if f.get("height") == height
                      and f.get("vcodec") != "none"]
        if candidates:
            formats.append({
                "formatId": f"video-{height}", "label": f"{height}p video",
                "quality": f"{height}p", "ext": "mp4", "type": "video",
                "resolution": f"{candidates[-1].get('width', '?')}x{height}",
                "filesizeApprox": readable_size(candidates[-1].get("filesize") or candidates[-1].get("filesize_approx")),
                "downloadUrl": "",
            })
    if any(f.get("acodec") != "none" for f in available):
        formats.extend([
            {"formatId": "audio-192", "label": "MP3 High Quality", "quality": "192 kbps",
             "ext": "mp3", "type": "audio", "bitrate": "192 kbps",
             "filesizeApprox": "Varies", "downloadUrl": ""},
        ])
    return formats


def extract_info(url):
    with yt_dlp.YoutubeDL(ydl_options()) as ydl:
        return ydl.extract_info(url, download=False)


@app.get("/health")
@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "DK Downloader API", "engine": "yt-dlp"})


@app.post("/api/fetch-info")
@app.post("/api/info")
def fetch_info():
    body = request.get_json(silent=True) or {}
    try:
        platform = body.get("platform")
        url = validate_media_url(body.get("url"), platform)
        info = extract_info(url)
        if not info or info.get("_type") == "playlist":
            return jsonify({"success": False, "error": "A single public video is required."}), 422
        formats = get_formats(info)
        if not formats:
            return jsonify({"success": False, "error": "No supported downloadable formats were found."}), 422
        for item in formats:
            item["downloadUrl"] = "/api/download?platform={}&url={}&formatId={}".format(
                platform, __import__("urllib.parse").parse.quote(url, safe=""),
                item["formatId"])
        duration = info.get("duration")
        return jsonify({"success": True, "data": {
            "id": str(info.get("id") or ""), "platform": platform, "originalUrl": url,
            "title": info.get("title") or "Media", "author": info.get("uploader") or info.get("channel") or "Creator",
            "thumbnail": info.get("thumbnail") or "", "duration": f"{int(duration)//60:02d}:{int(duration)%60:02d}" if duration else None,
            "formats": formats, "notice": "Only public media you are authorized to save is supported."
        }})
    except ValueError as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
    except yt_dlp.utils.DownloadError as exc:
        message = str(exc).split("\n")[0][:240]
        return jsonify({"success": False, "error": f"Could not access this public media: {message}"}), 422
    except Exception:
        app.logger.exception("Metadata extraction failed")
        return jsonify({"success": False, "error": "Media could not be processed. Please try again later."}), 500


@app.get("/api/download")
def download():
    temp_dir = tempfile.mkdtemp(prefix="dkdl-")
    try:
        platform = request.args.get("platform", "")
        url = validate_media_url(request.args.get("url"), platform)
        format_id = request.args.get("formatId", "")
        if format_id not in {f"video-{h}" for h in VIDEO_HEIGHTS} | {"audio-192"}:
            return jsonify({"error": "Unsupported format selection."}), 400

        if format_id.startswith("video-"):
            height = int(format_id.split("-")[1])
            selector = f"bestvideo[height<={height}][ext=mp4]+bestaudio[ext=m4a]/best[height<={height}][ext=mp4]/best[height<={height}]"
            opts = {"format": selector, "merge_output_format": "mp4"}
            extension = "mp4"
        else:
            opts = {"format": "bestaudio/best",
                    "postprocessors": [{"key": "FFmpegExtractAudio", "preferredcodec": "mp3", "preferredquality": "192"}]}
            extension = "mp3"

        opts.update({"outtmpl": str(Path(temp_dir) / "%(title).80B.%(ext)s"), "noplaylist": True})
        with yt_dlp.YoutubeDL(ydl_options(opts)) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = Path(ydl.prepare_filename(info))
            if extension == "mp3":
                filename = filename.with_suffix(".mp3")
            if not filename.exists():
                candidates = list(Path(temp_dir).glob("*"))
                if not candidates:
                    raise RuntimeError("The media processor did not create an output file.")
                filename = candidates[0]

        @after_this_request
        def cleanup(response):
            response.call_on_close(lambda: __import__("shutil").rmtree(temp_dir, ignore_errors=True))
            return response

        safe_name = re.sub(r"[^A-Za-z0-9._ -]", "", filename.stem).strip()[:80] or "download"
        return send_file(filename, as_attachment=True, download_name=f"{safe_name}.{extension}",
                         mimetype="audio/mpeg" if extension == "mp3" else "video/mp4")
    except ValueError as exc:
        __import__("shutil").rmtree(temp_dir, ignore_errors=True)
        return jsonify({"error": str(exc)}), 400
    except yt_dlp.utils.DownloadError as exc:
        __import__("shutil").rmtree(temp_dir, ignore_errors=True)
        return jsonify({"error": f"Download failed: {str(exc).split(chr(10))[0][:200]}"}), 422
    except Exception:
        app.logger.exception("Download failed")
        __import__("shutil").rmtree(temp_dir, ignore_errors=True)
        return jsonify({"error": "Download failed. Please try another public link or format."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")))
