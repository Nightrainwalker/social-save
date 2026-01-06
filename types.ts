export enum Platform {
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  Unknown = 'Unknown'
}

export interface VideoMetadata {
  title: string;
  author: string;
  description: string;
  hashtags: string[];
  platform: Platform;
  thumbnailUrl?: string; // We might get this from search or placeholder
  estimatedDuration?: string;
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  metadata?: VideoMetadata;
}

export type DownloadQuality = 'SD' | 'HD' | 'Audio';

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  error?: string;
  data?: VideoMetadata;
}
