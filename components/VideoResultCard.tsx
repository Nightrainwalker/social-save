import React, { useState } from 'react';
import { VideoMetadata, Platform, DownloadQuality } from '../types';
import { Download, Facebook, Instagram, AlertCircle, CheckCircle } from 'lucide-react';

interface VideoResultCardProps {
  metadata: VideoMetadata;
  onReset: () => void;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({ metadata, onReset }) => {
  const [downloading, setDownloading] = useState<DownloadQuality | null>(null);
  const [downloadComplete, setDownloadComplete] = useState<boolean>(false);

  const handleDownload = (quality: DownloadQuality) => {
    setDownloading(quality);
    setDownloadComplete(false);
    
    // Simulate download delay
    setTimeout(() => {
      setDownloading(null);
      setDownloadComplete(true);
      
      // Reset success message after a few seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    }, 2000);
  };

  const PlatformIcon = metadata.platform === Platform.Instagram ? Instagram : Facebook;
  const platformColor = metadata.platform === Platform.Instagram ? "text-pink-500" : "text-blue-500";

  return (
    <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden shadow-xl animate-fade-in-up">
      <div className="p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-slate-700/50 ${platformColor}`}>
              <PlatformIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white line-clamp-1">{metadata.title}</h3>
              <p className="text-sm text-slate-400">By @{metadata.author} • {metadata.estimatedDuration}</p>
            </div>
          </div>
          <div className="flex gap-2">
             <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
               Ready
             </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail / Visual */}
          <div className="w-full md:w-1/3 shrink-0">
             <div className="aspect-[4/3] md:aspect-square w-full rounded-xl overflow-hidden relative group">
                <img 
                  src={metadata.thumbnailUrl} 
                  alt={metadata.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Download className="text-white w-8 h-8" />
                </div>
             </div>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-3">
                {metadata.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {metadata.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">#{tag}</span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
               <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Download Options</h4>
               
               <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleDownload('HD')}
                    disabled={!!downloading}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white py-2 px-4 rounded-lg font-medium transition-all active:scale-95"
                  >
                    {downloading === 'HD' ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Download size={18} /> HD (1080p)
                      </>
                    )}
                  </button>
                  <button 
                     onClick={() => handleDownload('SD')}
                     disabled={!!downloading}
                     className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white py-2 px-4 rounded-lg font-medium transition-all active:scale-95"
                  >
                     {downloading === 'SD' ? (
                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Download size={18} /> SD (480p)
                      </>
                    )}
                  </button>
               </div>
               
               {downloadComplete && (
                 <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-2 text-sm text-emerald-200 animate-in fade-in slide-in-from-bottom-2">
                    <CheckCircle size={16} className="mt-0.5 shrink-0" />
                    <p>Analysis complete. In a production environment, the file would now be saved to your device.</p>
                 </div>
               )}

               <button onClick={onReset} className="w-full text-center text-slate-500 hover:text-slate-400 text-sm mt-2 hover:underline">
                 Analyze another video
               </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Disclaimer Footer */}
      <div className="bg-slate-900/50 p-4 border-t border-slate-700/50 flex items-start gap-2">
        <AlertCircle size={14} className="text-slate-500 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500">
          This tool uses AI to analyze public social media posts. It does not bypass private account security or DRM. Please respect copyright laws when downloading content.
        </p>
      </div>
    </div>
  );
};
