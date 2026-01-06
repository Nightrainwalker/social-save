import React, { useState, useEffect } from 'react';
import { Link, AlertTriangle, Zap, Settings, X, Key, ShieldCheck } from 'lucide-react';
import { analyzeVideoUrl, detectPlatform } from './services/geminiService';
import { AnalysisState, Platform, AppSettings } from './types';
import { VideoResultCard } from './components/VideoResultCard';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>({ status: 'idle' });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({ rapidApiKey: '' });

  // Load settings from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('social_save_api_key');
    if (savedKey) {
      setSettings({ rapidApiKey: savedKey });
    }
  }, []);

  const saveSettings = (newKey: string) => {
    setSettings({ rapidApiKey: newKey });
    localStorage.setItem('social_save_api_key', newKey);
  };

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
      // Pass the API key to the service
      const metadata = await analyzeVideoUrl(url, settings.rapidApiKey);
      setAnalysisState({ status: 'success', data: metadata });
    } catch (error: any) {
      setAnalysisState({ 
        status: 'error', 
        error: error.message || "Failed to process video. Please check the URL." 
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
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${settings.rapidApiKey ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            {settings.rapidApiKey ? <ShieldCheck size={18} /> : <Settings size={20} />}
            {settings.rapidApiKey ? 'Real Mode' : 'Settings'}
          </button>
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
            
            {!settings.rapidApiKey && (
              <p className="text-center text-xs text-slate-500 mt-4">
                Running in <span className="text-amber-400">Demo Mode</span>. Add an API Key in settings for real downloads.
              </p>
            )}
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

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Settings className="text-indigo-500" /> Configuration
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  RapidAPI Key (Optional)
                </label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input 
                    type="password" 
                    value={settings.rapidApiKey}
                    onChange={(e) => saveSettings(e.target.value)}
                    placeholder="Enter RapidAPI Key..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  To enable real downloads, get a free key for 
                  <a href="https://rapidapi.com/ugo-p-uBRXk4/api/social-media-video-downloader" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline mx-1">
                    Social Media Video Downloader
                  </a> 
                  on RapidAPI. Without a key, the app runs in Demo Mode.
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 text-xs text-slate-400 border border-slate-700/50">
                <strong>Privacy Note:</strong> Your API Key is stored locally in your browser and is never sent to our servers.
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
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
