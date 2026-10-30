export type PlatformId = 'youtube' | 'instagram' | 'facebook' | 'tiktok';

export interface VideoFormatOption {
  formatId: string;
  label: string;
  quality: string;
  ext: 'mp4' | 'mp3';
  type: 'video' | 'audio';
  resolution?: string;
  bitrate?: string;
  filesizeApprox: string;
  downloadUrl: string;
}

export interface VideoMetadata {
  id: string;
  platform: PlatformId;
  originalUrl: string;
  title: string;
  author: string;
  authorUrl?: string;
  thumbnail: string;
  duration?: string;
  views?: string;
  formats: VideoFormatOption[];
  notice?: string;
  isSample?: boolean;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  tagline: string;
  badge: string;
  supportedFormats: string[];
  accentColor: string;
  accentBg: string;
  borderColor: string;
  urlPlaceholder: string;
  exampleUrl: string;
  exampleLabel: string;
  matchRegex: RegExp;
  tips: string[];
}

export interface AdSlotConfig {
  id: string;
  slotType: 'leaderboard' | 'rectangle' | 'native';
  dimensions: string;
  headline: string;
  body: string;
  sponsorName: string;
  ctaText: string;
}
