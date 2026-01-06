import React, { useState } from 'react';
import { VideoMetadata, Platform } from '../types';
import { Download, Facebook, Instagram, AlertCircle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';

interface VideoResultCardProps {
  metadata: VideoMetadata;
  onReset: () => void;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({ metadata, onReset }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadStatus('idle');

    try {
      // Attempt 1: Fetch blob (Better user experience as it forces download dialog)
      const response = await fetch(metadata.downloadUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
      
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setDownloadStatus('success');
    } catch (error) {
      console.error("Direct download failed, falling back:", error);
      // Attempt 2: Fallback to direct window open if CORS blocks the fetch
      setDownloadStatus('error');
      window.open(metadata.downloadUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const PlatformIcon = metadata.platform === Platform.Instagram ? Instagram : Facebook;
  const platformColor = metadata.platform === Platform.Instagram ? "text-pink-500" : "text-blue-500";

  return (
    <div className="w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl mt-8">
      <div className="p-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg bg-slate-700/50 ${platformColor}`}>
            <PlatformIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white line-clamp-1">{metadata.title}</h3>
            <p className="text-sm text-slate-400">Ready for download</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="w-full md:w-1/3 shrink-0">
             <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-lg">
                <img 
                  src={metadata.thumbnailUrl} 
                  alt={metadata.title} 
                  className="w-full h-full object-cover" 
                />
             </div>
          </div>

          {/* Actions */}
          <div className="flex-1 flex flex-col justify-center">
             
             <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full mb-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white py-3 px-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                {isDownloading ? (
                   <>
                     <Loader2 className="animate-spin" /> Processing...
                   </>
                ) : (
                  <>
                    <Download size={20} /> Download MP4
                  </>
                )}
              </button>
               
             {downloadStatus === 'success' && (
               <div className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-sm text-emerald-200">
                  <CheckCircle size={16} />
                  <span>Download started!</span>
               </div>
             )}

             {downloadStatus === 'error' && (
               <div className="mb-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-200">
                  <p className="flex items-center gap-2 mb-1"><AlertCircle size={16} /> Auto-download failed.</p>
                  <a href={metadata.downloadUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white flex items-center gap-1">
                    Click here to open video directly <ExternalLink size={12}/>
                  </a>
               </div>
             )}

             <button onClick={onReset} className="text-slate-500 hover:text-slate-300 text-sm hover:underline mt-2">
               Paste another link
             </button>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900/50 p-3 border-t border-slate-700/50 flex items-center gap-2">
        <AlertCircle size={14} className="text-slate-500 shrink-0" />
        <p className="text-xs text-slate-500">
          If the download doesn't start, check your pop-up blocker.
        </p>
      </div>
    </div>
  );
};
