import React, { useState } from 'react';
import { Link, AlertTriangle, Zap } from 'lucide-react';
import { analyzeVideoUrl, detectPlatform } from './services/geminiService';
import { AnalysisState, Platform } from './types';
import { VideoResultCard } from './components/VideoResultCard';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({ status: 'idle' });

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    
    const platform = detectPlatform(url);
    if (platform === Platform.Unknown) {
      setAnalysisState({ 
        status: 'error', 
        error: 'Please enter a valid Facebook or Instagram URL.' 
      });
      return;
    }

    setAnalysisState({ status: 'analyzing' });

    try {
      const metadata = await analyzeVideoUrl(url);
      setAnalysisState({ status: 'success', data: metadata });
    } catch (error: any) {
      setAnalysisState({ 
        status: 'error', 
        error: "Failed to process video. Please check the URL." 
      });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard');
    }
  };

  const reset = () => {
    setAnalysisState({ status: 'idle' });
    setUrl('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <DownloadIcon className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Social<span className="text-indigo-400">Save</span></span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 pt-16 pb-24 flex flex-col items-center">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Video Downloader
          </h1>
          <p className="text-lg text-slate-400">
            Simple tool to download Facebook & Instagram videos.
          </p>
        </div>

        {/* Input Area */}
        {analysisState.status !== 'success' && (
          <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-300">
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-lg">
              <div className="pl-4 text-slate-500">
                <Link size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste link here..."
                className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:ring-0 focus:outline-none placeholder:text-slate-600 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <div className="pr-2 flex items-center gap-2">
                 {!url && (
                    <button 
                      onClick={handlePaste}
                      className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      Paste
                    </button>
                 )}
                <button
                  onClick={handleAnalyze}
                  disabled={!url || analysisState.status === 'analyzing'}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  {analysisState.status === 'analyzing' ? (
                     <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                  ) : (
                     <>
                       <span>Go</span>
                       <Zap size={18} />
                     </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {analysisState.status === 'error' && (
          <div className="mt-6 w-full max-w-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 px-4 py-3 rounded-lg flex items-center gap-3">
            <AlertTriangle size={20} className="shrink-0" />
            <p>{analysisState.error}</p>
          </div>
        )}

        {/* Result Area */}
        {analysisState.status === 'success' && analysisState.data && (
           <VideoResultCard metadata={analysisState.data} onReset={reset} />
        )}

      </main>
    </div>
  );
};

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default App;
