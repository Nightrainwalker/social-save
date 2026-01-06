import { Platform, VideoMetadata } from "../types";

// Helper to determine platform
export const detectPlatform = (url: string): Platform => {
  if (url.includes('instagram.com')) return Platform.Instagram;
  if (url.includes('facebook.com') || url.includes('fb.watch')) return Platform.Facebook;
  return Platform.Unknown;
};

// Local analysis without AI
export const analyzeVideoUrl = async (url: string): Promise<VideoMetadata> => {
  // Simulate a short processing delay for better UX
  await new Promise(resolve => setTimeout(resolve, 800));

  const platform = detectPlatform(url);
  
  if (platform === Platform.Unknown) {
    throw new Error("Unsupported platform. Please provide a valid Facebook or Instagram URL.");
  }

  // Extract ID/Info based on URL patterns
  let title = "Social Media Video";
  let id = "generic";
  
  if (platform === Platform.Instagram) {
    // Matches /p/CODE, /reel/CODE, /tv/CODE
    const match = url.match(/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      id = match[1];
      title = `Instagram Post (${id.substring(0, 8)}...)`;
    } else {
      title = "Instagram Video";
      id = "insta-" + Math.random().toString(36).substring(7);
    }
  } else if (platform === Platform.Facebook) {
    // Extended heuristics for FB IDs including reels
    const match = url.match(/(?:videos\/|watch\?v=|fb\.watch\/|reel\/)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        id = match[1];
        title = `Facebook Video (${id.substring(0, 8)}...)`;
    } else {
        title = "Facebook Video";
        id = "fb-" + Math.random().toString(36).substring(7);
    }
  }

  return {
    title: title,
    author: "Unknown User (Private)",
    description: "Ready to download. Original metadata is hidden due to privacy settings.",
    hashtags: ["video", "social", "download"],
    platform: platform,
    estimatedDuration: "Unknown",
    // Use the extracted ID as the seed to ensure different videos get different placeholders
    thumbnailUrl: `https://picsum.photos/seed/${id}/600/400`
  };
};
