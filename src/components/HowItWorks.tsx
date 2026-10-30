import React from 'react';
import { Copy, SlidersHorizontal, DownloadCloud } from 'lucide-react';

interface HowItWorksProps {
  isDarkMode: boolean;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ isDarkMode }) => {
  const steps = [
    {
      num: '01',
      title: 'Copy the Video Link',
      description: 'Open YouTube, Instagram, Facebook Reels, or TikTok. Click the Share button and select "Copy Link".',
      icon: <Copy className="w-5 h-5 text-indigo-400" />,
    },
    {
      num: '02',
      title: 'Select Platform & Quality',
      description: 'Select your platform, tap Paste, and choose your format: Full HD 1080p MP4 or high-fidelity 320kbps MP3 audio.',
      icon: <SlidersHorizontal className="w-5 h-5 text-purple-400" />,
    },
    {
      num: '03',
      title: 'Save Directly to Device',
      description: 'Click Download to save the file instantly to your mobile gallery or computer Downloads folder.',
      icon: <DownloadCloud className="w-5 h-5 text-emerald-400" />,
    },
  ];

  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          How It Works
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Download any video or sound in 3 simple steps without registering or installing apps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className={`p-6 rounded-2xl border transition-all ${
              isDarkMode
                ? 'bg-slate-900/60 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
                {step.icon}
              </div>
              <span className="font-mono text-2xl font-extrabold text-slate-700 dark:text-slate-700">
                {step.num}
              </span>
            </div>

            <h3 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {step.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
