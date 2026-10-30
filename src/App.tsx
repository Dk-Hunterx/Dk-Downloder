/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PlatformId } from './types';
import { Navbar } from './components/Navbar';
import { HeroHeader } from './components/HeroHeader';
import { PlatformSelection } from './components/PlatformSelection';
import { DownloaderView } from './components/DownloaderView';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { AdBanner } from './components/AdBanner';
import { Footer } from './components/Footer';
import { BackendGuideModal } from './components/BackendGuideModal';

export default function App() {
  // Pure in-memory state: NO localStorage, NO sessionStorage, NO cookies.
  // Every page refresh guarantees a pristine reset to the initial homepage.
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isBackendGuideOpen, setIsBackendGuideOpen] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handleSelectPlatform = (platformId: PlatformId) => {
    setSelectedPlatform(platformId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedPlatform(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTo = (sectionId: string) => {
    if (selectedPlatform) {
      setSelectedPlatform(null);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Top Navigation */}
      <Navbar
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onOpenBackendGuide={() => setIsBackendGuideOpen(true)}
        onNavigateHome={handleBackToHome}
        onScrollTo={handleScrollTo}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!selectedPlatform ? (
            /* Homepage View: Hero + 4 Large Platform Cards + Info */
            <motion.div
              key="homepage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Hero Section */}
              <HeroHeader isDarkMode={isDarkMode} />

              {/* Reserved Ad Space: Top Leaderboard */}
              <AdBanner slot="leaderboard" isDarkMode={isDarkMode} />

              {/* 4 Clickable Platform Cards */}
              <PlatformSelection
                onSelectPlatform={handleSelectPlatform}
                isDarkMode={isDarkMode}
              />

              {/* Reserved Native In-Feed Ad Banner */}
              <AdBanner slot="native" isDarkMode={isDarkMode} />

              {/* Step-by-step How It Works */}
              <HowItWorks isDarkMode={isDarkMode} />

              {/* FAQ Section */}
              <FaqSection isDarkMode={isDarkMode} />
            </motion.div>
          ) : (
            /* Downloader View for Selected Platform */
            <motion.div
              key={`downloader-${selectedPlatform}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DownloaderView
                platformId={selectedPlatform}
                onBack={handleBackToHome}
                isDarkMode={isDarkMode}
                onOpenBackendGuide={() => setIsBackendGuideOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Clean Footer with Compliance & Disclaimers */}
      <Footer
        isDarkMode={isDarkMode}
        onOpenBackendGuide={() => setIsBackendGuideOpen(true)}
        onSelectPlatform={handleSelectPlatform}
      />

      {/* Python Flask Backend Documentation Modal */}
      <BackendGuideModal
        isOpen={isBackendGuideOpen}
        onClose={() => setIsBackendGuideOpen(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
