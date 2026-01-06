export enum Platform {
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  Unknown = 'Unknown'
}

export interface VideoMetadata {
  title: string;
  author: string;
  description: string;
  platform: Platform;
  thumbnailUrl: string;
  downloadUrl: string;
  isDemo?: boolean;
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  error?: string;
  data?: VideoMetadata;
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  metadata?: VideoMetadata;
}

export interface AppSettings {
  rapidApiKey: string;
}
