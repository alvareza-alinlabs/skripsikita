import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Clock, ChevronRight, X } from 'lucide-react';

export function LastViewedToast() {
  const [lastViewed, setLastViewed] = useState<{slug: string, ext: string, nama: string} | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only show on root page
    if (location.pathname !== '/') {
      setIsVisible(false);
      return;
    }

    const checkAndShow = () => {
      try {
        const saved = localStorage.getItem('lastViewedSkripsi');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.slug && parsed.ext && parsed.nama) {
            setLastViewed(parsed);
            // Add a small delay for better UX
            setTimeout(() => setIsVisible(true), 500);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('welcome-popup-closed', checkAndShow);
    
    return () => {
      window.removeEventListener('welcome-popup-closed', checkAndShow);
    };
  }, [location.pathname]);

  if (!lastViewed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-[500] sm:max-w-[400px] sm:min-w-[340px] bg-white rounded-2xl shadow-2xl shadow-slate-300/60 border border-slate-200 p-4 sm:p-5 flex flex-col gap-3 mx-auto"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold">Buka Skripsi Terakhir?</span>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              navigate(`/${lastViewed.slug}/${lastViewed.ext}`);
            }}
            className="w-full bg-red-50/30 hover:bg-red-50/80 border border-slate-200 hover:border-red-200 rounded-xl p-3 flex flex-col text-left transition-all relative overflow-hidden group shadow-sm"
          >
            <span className="font-semibold text-slate-800 line-clamp-2 text-sm pr-6 leading-snug group-hover:text-red-700 transition-colors">
              {lastViewed.nama}
            </span>
            <span className="text-xs font-bold text-red-500 mt-1 uppercase tracking-wider">
              {lastViewed.ext} FORMAT
            </span>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 group-hover:text-red-600 transition-all group-hover:translate-x-1">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
