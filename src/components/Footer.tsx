import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
  onOpenBackendGuide: () => void;
  onSelectPlatform: (id: any) => void;
}

export const Footer: React.FC<FooterProps> = ({
  isDarkMode,
  onOpenBackendGuide,
  onSelectPlatform,
}) => {
  return (
    <footer
      className={`border-t transition-colors mt-16 ${
        isDarkMode
          ? 'bg-slate-950 border-slate-800 text-slate-400'
          : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                ▶
              </div>
              <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                All Video Downloader
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Fast, clean, and modern multi-platform video downloader for YouTube, Instagram, Facebook Reels, and TikTok. Built with privacy and mobile touch performance first.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Stateless · Zero Logs · Zero Registration</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Platforms
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectPlatform('youtube')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  YouTube Downloader
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPlatform('instagram')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Instagram Reels
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPlatform('facebook')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Facebook Reels & Video
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPlatform('tiktok')}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  TikTok No Watermark
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Compliance */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Developer & Self-Host
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenBackendGuide}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Flask + yt-dlp Backend
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBackendGuide}
                  className="hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Free Deploy on Render / Cloud Run
                </button>
              </li>
              <li>
                <span className="text-slate-400">Zero LocalStorage Guarantee</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> All Video Downloader is intended strictly for personal, non-commercial, and educational use. We do not host, store, or re-transmit copyrighted audio or video streams on our servers. All video downloads are processed client-side or streamed through standard authorized protocols. Users are solely responsible for ensuring they possess the right or permission from the original content owner before saving media.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3">
            <div>© {new Date().getFullYear()} All Video Downloader. All rights reserved.</div>
            <div className="text-slate-400 text-[11px]">
              Built with React, TypeScript & modern web standards.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
