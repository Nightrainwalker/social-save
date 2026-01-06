import React from 'react';
import { HistoryItem, Platform } from '../types';
import { Clock, ExternalLink, Trash2 } from 'lucide-react';

interface HistoryListProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelect: (url: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClear, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
          <Clock size={18} /> Recent Analysis
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 size={12} /> Clear History
        </button>
      </div>
      
      <div className="grid gap-3">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="group bg-slate-800/40 hover:bg-slate-700/60 border border-slate-700/50 rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer"
            onClick={() => onSelect(item.url)}
          >
            <div className="flex items-center gap-3 overflow-hidden">
               <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.metadata?.platform === Platform.Instagram ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-blue-600'}`}>
                  <span className="text-xs font-bold text-white">
                    {item.metadata?.platform === Platform.Instagram ? 'IG' : 'FB'}
                  </span>
               </div>
               <div className="min-w-0">
                 <h4 className="text-sm font-medium text-slate-200 truncate pr-4">
                   {item.metadata?.title || item.url}
                 </h4>
                 <p className="text-xs text-slate-500 truncate">
                   {new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString()}
                 </p>
               </div>
            </div>
            
            <div className="p-2 text-slate-500 group-hover:text-indigo-400 transition-colors">
              <ExternalLink size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
