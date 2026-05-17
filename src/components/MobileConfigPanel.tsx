import React from 'react';
import { Settings, Minus, Plus } from 'lucide-react';

interface MobileConfigPanelProps {
  watermark: string;
  setWatermark: (val: string) => void;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

export function MobileConfigPanel({ watermark, setWatermark, setZoom }: MobileConfigPanelProps) {
  return (
    <div className="md:hidden bg-slate-900 border-t border-slate-700 p-3 sm:p-4 shrink-0 flex items-center justify-between gap-3 sm:gap-4 z-50 fixed bottom-0 left-0 right-0 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 flex-1 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
        <Settings className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input 
          type="text" 
          value={watermark} 
          onChange={(e) => setWatermark(e.target.value)}
          placeholder="Set watermark"
          className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-200 placeholder-slate-500 focus:ring-0"
        />
      </div>
      <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg px-1.5 py-1.5 border border-slate-700 h-full shrink-0">
        <button 
          onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} 
          className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-700 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setZoom(z => Math.min(2.5, z + 0.1))} 
          className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
