import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Server, Rocket, FileCode, ShieldAlert } from 'lucide-react';

interface BackendGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const BackendGuideModal: React.FC<BackendGuideModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'code' | 'docker' | 'deploy'>('architecture');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const flaskCodeSnippet = `from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
import yt_dlp
import requests

app = Flask(__name__)
CORS(app)

YTDL_OPTS = {
    'quiet': True,
    'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    'noplaylist': True,
    'skip_download': True
}

@app.route('/api/info', methods=['POST'])
def get_info():
    url = request.json.get('url')
    with yt_dlp.YoutubeDL(YTDL_OPTS) as ydl:
        info = ydl.extract_info(url, download=False)
        return jsonify({
            'title': info.get('title'),
            'thumbnail': info.get('thumbnail'),
            'author': info.get('uploader'),
            'formats': [{'ext': 'mp4', 'quality': '1080p', 'url': info.get('url')}]
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)`;

  const dockerfileSnippet = `FROM python:3.11-slim
RUN apt-get update && apt-get install -y ffmpeg curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
ENV PORT=5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-3xl max-h-[90vh] rounded-3xl border flex flex-col shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Python Flask + yt-dlp Backend Guide
              </h3>
              <p className="text-xs text-slate-400">
                Project architecture, Docker setup, and 100% free deployment options.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Architecture & Specs
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'code'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            app.py (Flask)
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`pb-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'docker'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Dockerfile & Packages
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`pb-3 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'deploy'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Free Cloud Deployment
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {activeTab === 'architecture' && (
            <div className="space-y-4 text-slate-300">
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                <div className="font-semibold text-white mb-1">Architecture Overview</div>
                This application follows a high-performance decoupled full-stack model:
                a lightweight React + TypeScript client communicating with an Express / Flask streaming proxy microservice.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs font-mono uppercase text-indigo-400 mb-1">Frontend</div>
                  <div className="font-bold text-white text-sm">React 19 + TypeScript + Vite</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Zero local storage, zero cookies, mobile-first touch optimization, instant URL validator.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-xs font-mono uppercase text-indigo-400 mb-1">Backend</div>
                  <div className="font-bold text-white text-sm">Express + Flask + yt-dlp</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Extracts metadata and serves audio/video streams with Content-Disposition headers.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Content Policy & Authorization Notice</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  The system adheres strictly to authorized public extraction standards. DRM-encrypted streams (Widevine), login-locked private accounts, and paywalled media are intentionally not bypassed.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">backend/app.py</span>
                <button
                  onClick={() => copyToClipboard(flaskCodeSnippet, 'app_code')}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  {copiedKey === 'app_code' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] leading-relaxed text-indigo-200 overflow-x-auto border border-slate-800">
                {flaskCodeSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">backend/Dockerfile</span>
                  <button
                    onClick={() => copyToClipboard(dockerfileSnippet, 'docker_code')}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                  >
                    {copiedKey === 'docker_code' ? (
                      <span className="text-emerald-400">Copied!</span>
                    ) : (
                      <span>Copy Dockerfile</span>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] leading-relaxed text-indigo-200 overflow-x-auto border border-slate-800">
                  {dockerfileSnippet}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="font-semibold text-white mb-1">requirements.txt</div>
                <div className="font-mono text-slate-400">
                  flask&gt;=3.0.0<br />
                  flask-cors&gt;=4.0.0<br />
                  yt-dlp&gt;=2024.12.23<br />
                  requests&gt;=2.31.0<br />
                  gunicorn&gt;=21.2.0
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4 text-slate-300">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Rocket className="w-4 h-4 text-indigo-400" />
                  <span>Free-Tier Deployment in 3 Minutes</span>
                </div>
                <p className="text-xs text-slate-400">
                  You can deploy the backend container free of charge on any of these platforms:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-semibold text-white text-xs">1. Render.com (Free Web Service)</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Connect GitHub repo, choose <strong>Docker</strong> or <strong>Python</strong> environment, set root directory to <code>backend</code>, and select the Free tier.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-semibold text-white text-xs">2. Railway.app (Free Trial)</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Deploy from GitHub directly. Railway automatically provisions the Docker container with FFmpeg included.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="font-semibold text-white text-xs">3. Google Cloud Run (Free Tier)</div>
                  <p className="text-xs text-slate-400 mt-1">
                    Scale-to-zero serverless container. Run <code>gcloud run deploy --source backend/</code> to launch with 2 million free requests per month.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            All files are available inside the <code>/backend</code> directory.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
