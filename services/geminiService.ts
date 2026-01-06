import { Platform, VideoMetadata } from "../types";

// Pure regex-based platform detection
export const detectPlatform = (url: string): Platform => {
  if (url.includes('instagram.com')) return Platform.Instagram;
  if (url.includes('facebook.com') || url.includes('fb.watch')) return Platform.Facebook;
  return Platform.Unknown;
};

// Real API implementation
const fetchFromRapidAPI = async (url: string, apiKey: string): Promise<VideoMetadata> => {
  const platform = detectPlatform(url);
  
  // This is a generic implementation for "Social Media Video Downloader" on RapidAPI.
  // We use a popular endpoint structure. 
  // Host: social-media-video-downloader.p.rapidapi.com
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'social-media-video-downloader.p.rapidapi.com'
    }
  };

  try {
    // Note: In a real scenario, you might need to url-encode the parameter
    const response = await fetch(`https://social-media-video-downloader.p.rapidapi.com/smvd/get/all?url=${encodeURIComponent(url)}`, options);
    
    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        throw new Error("Invalid API Key or Quota Exceeded");
      }
      throw new Error("API Error");
    }

    const data = await response.json();
    
    // Mapping logic depends on the specific API response structure.
    // This assumes a generic structure often returned by these APIs.
    // If the API returns valid data:
    if (data && data.links && data.links.length > 0) {
      // Find a high quality video link
      const videoLink = data.links.find((l: any) => l.quality === 'hd' || l.quality === '1080p') || data.links[0];
      
      return {
        title: data.title || `${platform} Video`,
        author: "Social User",
        description: "Downloaded via API",
        platform: platform,
        thumbnailUrl: data.picture || "https://placehold.co/600x400/1e293b/cbd5e1?text=No+Thumbnail",
        downloadUrl: videoLink.link,
        isDemo: false
      };
    } else {
      throw new Error("No video links found in API response");
    }
  } catch (error) {
    console.error("RapidAPI Fetch Error:", error);
    throw error;
  }
};

export const analyzeVideoUrl = async (url: string, apiKey?: string): Promise<VideoMetadata> => {
  const platform = detectPlatform(url);
  
  if (platform === Platform.Unknown) {
    throw new Error("Unsupported platform. Please provide a valid Facebook or Instagram URL.");
  }

  // 1. REAL MODE: If user provided a key, try to fetch genuinely
  if (apiKey && apiKey.trim().length > 10) {
    try {
      return await fetchFromRapidAPI(url, apiKey);
    } catch (error: any) {
      console.warn("Real API failed with error:", error.message);
      // Optional: Re-throw if you want to stop completely, or fall through to demo
      if (error.message.includes("Invalid API Key")) {
        throw new Error("Your API Key is invalid or expired. Please check settings.");
      }
      // If it's just a parsing error, we might fall back, but let's be strict for now
      throw new Error(`Real download failed: ${error.message}. Check your API Key or quota.`);
    }
  }

  // 2. DEMO MODE: Simulation
  await new Promise(resolve => setTimeout(resolve, 800));

  let title = "Social Media Video";
  let id = "video-" + Date.now();
  
  if (platform === Platform.Instagram) {
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
    thumbnailUrl: `https://picsum.photos/seed/${id}/600/400`,
    downloadUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isDemo: true
  };
};
