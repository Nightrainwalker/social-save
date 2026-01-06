import React, { useState, useEffect } from 'react';
import { Link, AlertTriangle, Zap } from 'lucide-react';
import { analyzeVideoUrl, detectPlatform } from './services/geminiService';
import { VideoMetadata, AnalysisState, HistoryItem, Platform } from './types';
import { VideoResultCard } from './components/VideoResultCard';
import { HistoryList } from './components/HistoryList';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({ status: 'idle' });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('socialSaveHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('socialSaveHistory', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    
    // Basic validation
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
      
      // Add to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        url,
        timestamp: Date.now(),
        metadata
      };
      setHistory(prev => [newItem, ...prev].slice(0, 5)); // Keep last 5
    } catch (error: any) {
      setAnalysisState({ 
        status: 'error', 
        error: error.message || "Failed to analyze video. Please check the URL and try again." 
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
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0f172a] to-[#0f172a] text-white selection:bg-indigo-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <DownloadIcon className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-100">Social<span className="text-indigo-400">Save</span></span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                <Zap size={12} className="text-yellow-400" />
                <span>Fast & Local</span>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Download Social Videos <br/>
            <span className="text-indigo-400">Instantly</span>
          </h1>
          <p className="text-lg text-slate-400">
            Paste a link from Facebook or Instagram to get the download link. No API keys required.
          </p>
        </div>

        {/* Input Area */}
        {analysisState.status !== 'success' && (
          <div className="w-full max-w-2xl relative group animate-in zoom-in-95 duration-500">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
              <div className="pl-4 text-slate-500">
                <Link size={20} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Facebook or Instagram link here..."
                className="flex-1 bg-transparent border-none text-white px-4 py-5 focus:ring-0 focus:outline-none placeholder:text-slate-600 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <div className="pr-2 flex items-center gap-2">
                 {!url && (
                    <button 
                      onClick={handlePaste}
                      className="hidden sm:flex text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
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
                     <>
                       <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                       <span className="hidden sm:inline">Processing...</span>
                     </>
                  ) : (
                     <>
                       <span>Get Video</span>
                       <Zap size={18} />
                     </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Supported Platforms Hints */}
            <div className="flex justify-center gap-6 mt-6 text-slate-500 text-sm">
               <span className="flex items-center gap-2 hover:text-slate-300 transition-colors"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Facebook</span>
               <span className="flex items-center gap-2 hover:text-slate-300 transition-colors"><div className="w-2 h-2 rounded-full bg-pink-500"></div> Instagram</span>
               <span className="flex items-center gap-2 hover:text-slate-300 transition-colors"><div className="w-2 h-2 rounded-full bg-slate-500"></div> Reels & Stories</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {analysisState.status === 'error' && (
          <div className="mt-6 w-full max-w-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 px-4 py-3 rounded-lg flex items-center gap-3 animate-in shake">
            <AlertTriangle size={20} className="shrink-0" />
            <p>{analysisState.error}</p>
          </div>
        )}

        {/* Result Area */}
        {analysisState.status === 'success' && analysisState.data && (
           <VideoResultCard metadata={analysisState.data} onReset={reset} />
        )}

        {/* History */}
        {analysisState.status !== 'success' && (
           <HistoryList 
             history={history} 
             onClear={() => setHistory([])}
             onSelect={(hUrl) => { setUrl(hUrl); handleAnalyze(); }}
           />
        )}

      </main>
    </div>
  );
};

// Simple Icon Component for the logo
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
