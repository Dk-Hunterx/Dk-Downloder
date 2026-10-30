import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PlatformId } from '../types';
import { PLATFORMS } from '../data/platforms';
import { YouTubeIcon, InstagramIcon, FacebookIcon, TikTokIcon } from './PlatformIcons';

interface PlatformSelectionProps {
  onSelectPlatform: (id: PlatformId) => void;
  isDarkMode: boolean;
}

export const PlatformSelection: React.FC<PlatformSelectionProps> = ({
  onSelectPlatform,
  isDarkMode,
}) => {
  const platformsList = [
    {
      config: PLATFORMS.youtube,
      icon: <YouTubeIcon className="w-8 h-8 text-red-500" />,
      gradient: 'from-red-500/20 via-red-500/5 to-transparent',
      glowColor: 'group-hover:border-red-500/50',
      badge: '4K / 1080p / MP3',
      popularTag: 'Most Popular',
    },
    {
      config: PLATFORMS.instagram,
      icon: <InstagramIcon className="w-8 h-8 text-pink-500" />,
      gradient: 'from-pink-500/20 via-purple-500/5 to-transparent',
      glowColor: 'group-hover:border-pink-500/50',
      badge: 'Reels · Audio · Fast',
      popularTag: 'Trending Reels',
    },
    {
      config: PLATFORMS.facebook,
      icon: <FacebookIcon className="w-8 h-8 text-blue-500" />,
      gradient: 'from-blue-500/20 via-blue-500/5 to-transparent',
      glowColor: 'group-hover:border-blue-500/50',
      badge: 'Watch · Reels · HD',
      popularTag: 'Public Videos',
    },
    {
      config: PLATFORMS.tiktok,
      icon: <TikTokIcon className="w-8 h-8 text-cyan-400" />,
      gradient: 'from-cyan-500/20 via-pink-500/5 to-transparent',
      glowColor: 'group-hover:border-cyan-500/50',
      badge: 'No Watermark · Sound',
      popularTag: 'Clean Output',
    },
  ];

  return (
    <section id="platforms" className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-2 mb-6">
        <div>
          <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Choose Your Platform
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Select a service to launch the dedicated optimized video & audio downloader.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-medium">
          4 Platforms Supported · Zero Registration
        </div>
      </div>

      {/* Grid of 4 Large Attractive Platform Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {platformsList.map((item, index) => {
          const { config, icon, gradient, glowColor, badge } = item;
          return (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${glowColor} ${
                isDarkMode
                  ? 'bg-slate-900/70 border-slate-800 hover:bg-slate-900 shadow-lg shadow-black/20'
                  : 'bg-white border-slate-200 hover:shadow-xl shadow-slate-200/50'
              }`}
              onClick={() => onSelectPlatform(config.id)}
            >
              {/* Subtle top gradient glow */}
              <div
                className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`}
              />

              {/* Card Body */}
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner group-hover:scale-105 transition-transform">
                      {icon}
                    </div>
                    <span className="text-[11px] font-mono font-medium text-slate-400 tracking-wider uppercase">
                      {badge}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {config.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {config.tagline}
                  </p>

                  {/* Formats preview */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{config.supportedFormats[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{config.supportedFormats[config.supportedFormats.length - 1]}</span>
                    </div>
                  </div>
                </div>

                {/* Open Downloader Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-800/40">
                  <div
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      isDarkMode
                        ? 'bg-slate-800 text-slate-200 group-hover:bg-indigo-600 group-hover:text-white'
                        : 'bg-slate-100 text-slate-800 group-hover:bg-indigo-600 group-hover:text-white'
                    }`}
                  >
                    <span>Open Downloader</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
