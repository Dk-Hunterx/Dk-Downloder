import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Sparkles, RefreshCw } from 'lucide-react';

interface HeroHeaderProps {
  isDarkMode: boolean;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ isDarkMode }) => {
  return (
    <section className="relative pt-10 pb-12 overflow-hidden">
      {/* Subtle ambient gradient mesh in background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Anti-slop zero-pill clean unboxed metadata */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-indigo-400 mb-4 tracking-wide">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> High-Speed Streams
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Private & Stateless
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Zero History
          </span>
        </div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
          style={{ textWrap: 'balance' }}
        >
          All Video Downloader
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className={`mt-4 text-lg sm:text-xl font-normal max-w-2xl mx-auto ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
          style={{ textWrap: 'balance' }}
        >
          Download your favorite content in one place.
        </motion.p>

        {/* Quick highlight feature badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-4 text-xs text-slate-400">
          <span>MP4 Video in 1080p Full HD</span>
          <span aria-hidden="true" className="text-slate-700">/</span>
          <span>MP3 Audio Extraction (320kbps)</span>
          <span aria-hidden="true" className="text-slate-700">/</span>
          <span>No Watermarks</span>
          <span aria-hidden="true" className="text-slate-700">/</span>
          <span>Zero Registration</span>
        </div>
      </div>
    </section>
  );
};
