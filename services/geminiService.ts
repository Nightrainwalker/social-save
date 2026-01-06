import { Platform, VideoMetadata } from "../types";

// Pure regex-based platform detection
export const detectPlatform = (url: string): Platform => {
  if (url.includes('instagram.com')) return Platform.Instagram;
  if (url.includes('facebook.com') || url.includes('fb.watch')) return Platform.Facebook;
  return Platform.Unknown;
};

// Mock service to simulate video analysis without AI
export const analyzeVideoUrl = async (url: string): Promise<VideoMetadata> => {
  // Simulate a short network delay for realism
  await new Promise(resolve => setTimeout(resolve, 800));

  const platform = detectPlatform(url);
  
  if (platform === Platform.Unknown) {
    throw new Error("Unsupported platform. Please provide a valid Facebook or Instagram URL.");
  }

  let title = "Social Media Video";
  let id = "video-" + Date.now();
  
  if (platform === Platform.Instagram) {
    // Try to extract an ID from the URL for a fake title
    const match = url.match(/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      id = match[1];
      title = `Instagram Clip (${id.substring(0, 8)})`;
    } else {
      title = "Instagram Story/Reel";
    }
  } else if (platform === Platform.Facebook) {
    title = `Facebook Video`;
  }

  return {
    title: title,
    author: "Unknown User",
    description: "Social media content",
    platform: platform,
    // Reliable placeholder image
    thumbnailUrl: `https://picsum.photos/seed/${id}/600/400`,
    // IMPORTANT: This is a direct link to a sample MP4 that supports cross-origin downloading.
    // In a real production app, this would be the scraped URL from the backend.
    downloadUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  };
};
