import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  isDarkMode: boolean;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ isDarkMode }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need to sign up, log in, or pay to download?',
      a: 'No. All Video Downloader requires zero registration, zero accounts, and zero payments. The service is 100% free and client-stateless.',
    },
    {
      q: 'Where do downloaded videos go on iOS (iPhone/iPad) and Android?',
      a: 'On iOS, downloads appear in the Safari Downloads folder inside the Files app, which you can save to Camera Roll with one tap (Share > Save Video). On Android, files are saved immediately to your Downloads folder and Gallery.',
    },
    {
      q: 'Does this site keep logs or store my download history?',
      a: 'Never. We enforce a zero-storage architecture. No database exists, no cookies or localStorage are written, and refreshing your browser completely resets the interface to a pristine state.',
    },
    {
      q: 'Can I extract only the audio (MP3) from a video?',
      a: 'Yes! Every supported video gives you the choice between MP4 video (up to 1080p Full HD) and standalone MP3 audio (320kbps and 128kbps) for podcasts, music, and background sounds.',
    },
    {
      q: 'Why does a specific private video or story fail to download?',
      a: 'We respect privacy and content creator rights. Videos set to private, friends-only, or behind an account password or DRM cannot be downloaded without authentic credentials.',
    },
    {
      q: 'How can I run my own high-capacity private backend?',
      a: 'Click "Self-Host & Free Deploy" in the navigation bar to access the full Python Flask + yt-dlp source code and our 1-click free deployment guide for Render and Cloud Run.',
    },
  ];

  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Got Questions? We Have Answers.
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className={`text-sm sm:text-base font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-400 border-t border-slate-800/40 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
