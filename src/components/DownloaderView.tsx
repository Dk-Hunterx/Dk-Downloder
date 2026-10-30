import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ClipboardPaste,
  Download,
  AlertCircle,
  CheckCircle2,
  Music,
  Video,
  ExternalLink,
  Loader2,
  X,
  FileCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { PlatformId, VideoMetadata, VideoFormatOption } from '../types';
import { PLATFORMS } from '../data/platforms';
import { YouTubeIcon, InstagramIcon, FacebookIcon, TikTokIcon } from './PlatformIcons';
import { AdBanner } from './AdBanner';

interface DownloaderViewProps {
  platformId: PlatformId;
  onBack: () => void;
  isDarkMode: boolean;
  onOpenBackendGuide: () => void;
}

export const DownloaderView: React.FC<DownloaderViewProps> = ({
  platformId,
  onBack,
  isDarkMode,
  onOpenBackendGuide,
}) => {
  const platform = PLATFORMS[platformId];

  // In-memory strictly local state (resets on reload, zero localStorage/sessionStorage/cookies)
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [selectedFormatTab, setSelectedFormatTab] = useState<'video' | 'audio'>('video');
  const [clipboardMessage, setClipboardMessage] = useState<string | null>(null);
  const [downloadingFormatId, setDownloadingFormatId] = useState<string | null>(null);

  const getPlatformIcon = (size = 'w-6 h-6') => {
    switch (platformId) {
      case 'youtube':
        return <YouTubeIcon className={`${size} text-red-500`} />;
      case 'instagram':
        return <InstagramIcon className={`${size} text-pink-500`} />;
      case 'facebook':
        return <FacebookIcon className={`${size} text-blue-500`} />;
      case 'tiktok':
        return <TikTokIcon className={`${size} text-cyan-400`} />;
    }
  };

  const validateUrl = (input: string): boolean => {
    if (!input.trim()) {
      setValidationError('Please enter or paste a video link.');
      return false;
    }

    try {
      new URL(input.trim());
    } catch {
      setValidationError('Please enter a complete URL starting with http:// or https://');
      return false;
    }

    if (!platform.matchRegex.test(input.trim())) {
      setValidationError(
        `This URL does not match ${platform.name}. Please enter a valid ${platform.name} link or try our sample URL.`
      );
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text);
          validateUrl(text);
          setClipboardMessage('Link pasted from clipboard!');
          setTimeout(() => setClipboardMessage(null), 2500);
          return;
        }
      }
      setClipboardMessage('Clipboard empty or permission not granted.');
      setTimeout(() => setClipboardMessage(null), 2500);
    } catch {
      setClipboardMessage('Clipboard access blocked. Please paste manually using Ctrl+V or long press.');
      setTimeout(() => setClipboardMessage(null), 3000);
    }
  };

  const handleClear = () => {
    setUrl('');
    setValidationError(null);
    setMetadata(null);
  };

  const handleUseExample = () => {
    setUrl(platform.exampleUrl);
    setValidationError(null);
    fetchVideoData(platform.exampleUrl);
  };

  const fetchVideoData = async (targetUrl: string) => {
    if (!validateUrl(targetUrl)) return;

    setIsLoading(true);
    setValidationError(null);
    setMetadata(null);

    try {
      const response = await fetch('/api/fetch-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: platformId, url: targetUrl.trim() }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to fetch video information for this link.');
      }

      setMetadata(result.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
      setValidationError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideoData(url);
  };

  const handleTriggerDownload = (format: VideoFormatOption) => {
    setDownloadingFormatId(format.formatId);

    // Create a temporary hidden link to invoke native browser download
    const link = document.createElement('a');
    link.href = format.downloadUrl;
    link.setAttribute('download', `${metadata?.title || 'video'}.${format.ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingFormatId(null);
    }, 1500);
  };

  const filteredFormats = metadata?.formats.filter((f) => f.type === selectedFormatTab) || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Navigation Row: Back button + Platform identification */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              : 'bg-white border-slate-200 text-slate-700 hover:text-black hover:border-slate-300 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Platforms</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shadow-inner">
            {getPlatformIcon('w-5 h-5')}
          </div>
          <span className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {platform.name} Downloader
          </span>
        </div>
      </div>

      {/* Main Downloader Control Box */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`rounded-3xl border p-5 sm:p-8 relative overflow-hidden transition-all ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800 shadow-2xl shadow-black/40'
            : 'bg-white border-slate-200 shadow-lg'
        }`}
      >
        <div className="max-w-3xl mx-auto">
          {/* Header instructions */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Paste {platform.name} Link
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Supports public reels, videos, shorts, and audio extracts. No sign-in needed.
            </p>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div
              className={`relative flex items-center rounded-2xl border transition-all ${
                validationError
                  ? 'border-red-500/80 ring-2 ring-red-500/20'
                  : isDarkMode
                  ? 'border-slate-700/80 bg-slate-950/70 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
                  : 'border-slate-300 bg-slate-50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
              }`}
            >
              <div className="pl-4 pr-2 text-slate-400">
                {getPlatformIcon('w-5 h-5')}
              </div>

              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (validationError) validateUrl(e.target.value);
                }}
                placeholder={platform.urlPlaceholder}
                className={`w-full py-3.5 pr-20 text-sm font-normal bg-transparent focus:outline-none ${
                  isDarkMode ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                }`}
              />

              {/* Action buttons inside input box */}
              <div className="absolute right-2 flex items-center gap-1.5">
                {url && (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Clear URL"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handlePaste}
                  title="Paste from clipboard"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                      : 'bg-slate-200 text-slate-700 hover:text-black hover:bg-slate-300'
                  }`}
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Paste</span>
                </button>
              </div>
            </div>

            {/* Quick Helper Bar: Example URL trigger & clipboard notification */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span>Want to test?</span>
                <button
                  type="button"
                  onClick={handleUseExample}
                  className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 cursor-pointer font-medium"
                >
                  Try verified sample link ({platform.exampleLabel})
                </button>
              </div>

              {clipboardMessage && (
                <span className="text-emerald-400 font-medium animate-fade-in flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {clipboardMessage}
                </span>
              )}
            </div>

            {/* Primary Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[48px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Media Streams...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Get Download Links</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Validation / Error Banner */}
          <AnimatePresence>
            {validationError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-200">Unable to process link</div>
                  <p className="mt-0.5 text-red-300/90 leading-relaxed">{validationError}</p>
                  <div className="mt-2 text-slate-400 flex items-center gap-2">
                    <span>Quick fix:</span>
                    <button
                      onClick={handleUseExample}
                      className="text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
                    >
                      Load sample {platform.name} test link
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading Animation Skeleton */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                <div className="text-sm font-medium text-slate-300">
                  Retrieving format manifests and audio tracks...
                </div>
              </div>
              <div className="h-4 bg-slate-800 rounded-md w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-800 rounded-md w-1/2 animate-pulse" />
              <div className="h-28 bg-slate-800/60 rounded-xl animate-pulse" />
            </motion.div>
          )}

          {/* Video Metadata Preview and Download Options */}
          <AnimatePresence>
            {metadata && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3 }}
                className="mt-8 pt-6 border-t border-slate-800 space-y-6"
              >
                {/* Result Preview Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row gap-4 items-start ${
                    isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full sm:w-48 aspect-video sm:aspect-4/3 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                    <img
                      src={metadata.thumbnail}
                      alt={metadata.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {metadata.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[11px] font-mono text-white font-medium">
                        {metadata.duration}
                      </span>
                    )}
                  </div>

                  {/* Metadata Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium mb-1.5">
                      <span>{platform.name}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{metadata.author}</span>
                    </div>

                    <h3
                      className={`text-base sm:text-lg font-bold leading-snug tracking-tight line-clamp-2 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                      style={{ textWrap: 'balance' }}
                    >
                      {metadata.title}
                    </h3>

                    {/* Unboxed metadata line */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span>Available Formats: MP4 / MP3</span>
                      <span aria-hidden="true">·</span>
                      <span>Audio 320kbps</span>
                      <span aria-hidden="true">·</span>
                      <a
                        href={metadata.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                      >
                        <span>View Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Format Tabs: Video (MP4) vs Audio (MP3) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Select Download Quality
                    </span>

                    {/* Format Switcher Tabs */}
                    <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSelectedFormatTab('video')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedFormatTab === 'video'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Video (MP4)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedFormatTab('audio')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedFormatTab === 'audio'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Music className="w-3.5 h-3.5" />
                        <span>Audio (MP3)</span>
                      </button>
                    </div>
                  </div>

                  {/* Formats List */}
                  <div className="space-y-2">
                    {filteredFormats.map((format) => {
                      const isDownloading = downloadingFormatId === format.formatId;
                      return (
                        <div
                          key={format.formatId}
                          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                            isDarkMode
                              ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                              {format.type === 'video' ? (
                                <Video className="w-4 h-4" />
                              ) : (
                                <Music className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                  {format.label}
                                </span>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                                  {format.ext}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                {format.resolution && <span>{format.resolution}</span>}
                                {format.bitrate && <span>{format.bitrate}</span>}
                                <span aria-hidden="true">·</span>
                                <span className="font-mono text-slate-300">{format.filesizeApprox}</span>
                              </div>
                            </div>
                          </div>

                          {/* Direct Download Button */}
                          <button
                            type="button"
                            onClick={() => handleTriggerDownload(format)}
                            disabled={isDownloading}
                            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                              isDownloading
                                ? 'bg-emerald-600 text-white'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30'
                            }`}
                          >
                            {isDownloading ? (
                              <>
                                <FileCheck className="w-4 h-4 animate-bounce" />
                                <span>Downloading...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                <span>Download {format.ext.toUpperCase()}</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Technical / Legal Compliance Note */}
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Real Downloads & Compliance</span>
                  </div>
                  <p className="leading-relaxed">
                    Downloads initiate directly through authorized browser streaming headers. Personal and educational usage only. Protected DRM content, private group posts, and videos requiring login cannot be accessed without credentials.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Reserved Ad Space in Downloader view */}
      <AdBanner slot="leaderboard" isDarkMode={isDarkMode} />

      {/* Platform Instructions & Tips Accordion */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>How to Copy {platform.name} Links</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="font-mono text-indigo-400 font-bold">1.</span>
              <span>Open the {platform.name} app or website on your phone or computer.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-indigo-400 font-bold">2.</span>
              <span>Find the video, Reel, or Short you wish to download.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-indigo-400 font-bold">3.</span>
              <span>Tap the <strong>Share</strong> button and tap <strong>Copy Link</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-indigo-400 font-bold">4.</span>
              <span>Return here, tap <strong>Paste</strong>, and select your preferred quality.</span>
            </li>
          </ul>
        </div>

        <div
          className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Info className="w-4 h-4 text-indigo-400" />
            <span>Self-Host & Python Backend Info</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Need high-volume batch downloads or private content processing? Deploy our production Flask + yt-dlp backend microservice to Render or Cloud Run with zero hosting costs.
          </p>
          <div className="mt-3">
            <button
              onClick={onOpenBackendGuide}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              <span>View Free-Tier Python Backend & Dockerfile</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
