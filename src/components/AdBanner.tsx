import React, { useState } from 'react';
import { ExternalLink, Info, Sparkles } from 'lucide-react';

interface AdBannerProps {
  slot: 'leaderboard' | 'rectangle' | 'native';
  className?: string;
  isDarkMode?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className = '', isDarkMode = true }) => {
  const [showPublisherNote, setShowPublisherNote] = useState(false);

  if (slot === 'leaderboard') {
    return (
      <div className={`w-full my-6 flex flex-col items-center justify-center ${className}`}>
        <div className="w-full max-w-4xl px-4">
          <div className="flex items-center justify-between pb-1.5 text-[11px] text-slate-400">
            <span className="font-mono tracking-wider uppercase text-[10px]">Sponsored · 728×90 Ad Slot</span>
            <button
              onClick={() => setShowPublisherNote(!showPublisherNote)}
              className="hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3 h-3" />
              <span>Ad Info</span>
            </button>
          </div>

          <div
            className={`w-full min-h-[90px] rounded-xl border p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800/80 shadow-inner'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-slate-200">UltraFast Cloud VPN & Media Vault</div>
                <div className="text-xs text-slate-400">Browse securely with military-grade encryption and unlimited bandwidth.</div>
              </div>
            </div>

            <a
              href="#sponsored"
              onClick={(e) => {
                e.preventDefault();
                setShowPublisherNote(true);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>Learn More</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {showPublisherNote && (
            <div className="mt-2 text-[11px] text-slate-400 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-start justify-between gap-2">
              <p>
                <strong>Publisher Ad Slot:</strong> Reserved 728×90 (Leaderboard) for Google AdSense, Mediavine, or direct advertiser scripts. Embed your tag in this container.
              </p>
              <button
                onClick={() => setShowPublisherNote(false)}
                className="text-slate-400 hover:text-white px-1 text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (slot === 'rectangle') {
    return (
      <div className={`w-full flex flex-col items-center justify-center ${className}`}>
        <div className="flex items-center justify-between w-full pb-1 text-[11px] text-slate-400">
          <span className="font-mono text-[10px] tracking-wider uppercase">Ad Space · 300×250</span>
          <button
            onClick={() => setShowPublisherNote(!showPublisherNote)}
            className="hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Info className="w-3 h-3" />
            <span>Monetization</span>
          </button>
        </div>

        <div
          className={`w-full min-h-[220px] rounded-2xl border p-5 flex flex-col justify-between transition-all ${
            isDarkMode
              ? 'bg-slate-900/50 border-slate-800'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">Recommended Media Tool</div>
            <div className="text-base font-bold text-slate-200">HiFi Audio Converter Pro</div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Lossless audio extraction, bulk tag editing, and smart volume normalization for creator workflows.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Free 14-Day Trial</span>
            <button
              onClick={() => setShowPublisherNote(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Get Offer
            </button>
          </div>
        </div>

        {showPublisherNote && (
          <div className="mt-2 text-[11px] text-slate-400 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 w-full">
            Reserved 300×250 Medium Rectangle ad slot. Compatible with standard ad networks.
          </div>
        )}
      </div>
    );
  }

  // Native In-Feed slot
  return (
    <div className={`w-full my-8 ${className}`}>
      <div className="w-full max-w-4xl mx-auto px-4">
        <div
          className={`p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
            isDarkMode
              ? 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-200">Need High-Performance Video Hosting?</span>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Ad</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Scale your video assets globally with instant CDN delivery and zero buffer latency.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPublisherNote(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors whitespace-nowrap"
          >
            Explore Plans
          </button>
        </div>
      </div>
    </div>
  );
};
