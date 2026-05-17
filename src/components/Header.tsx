import React, { useState, useEffect } from 'react';
import { Settings, Minus, Plus, Download, MoreVertical, FileText, Share2, ClipboardCheck, BookCheck, Sparkles, X, Languages, Edit3, AlignLeft, Table, AlignCenterHorizontal, Zap, Library, Quote, TextSelect } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface HeaderProps {
  file: File | string | null;
  watermark: string;
  setWatermark: (val: string) => void;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  clearFile: () => void;
  onDownload?: () => void;
}

export function Header({ file, watermark, setWatermark, zoom, setZoom, clearFile, onDownload }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const getUserName = () => {
    if (!file) return null;
    if (typeof file === 'string') {
      if (file.startsWith('http') || file.startsWith('blob:') || file === '/skripsi.pdf') return null;
      return file.replace('Skripsi Atas Nama ', ''); 
    }
    return file.name;
  };

  const userName = getUserName();

  const handleFeatureClick = () => {
    setToastMessage("Fitur dalam tahap pengembangan");
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SkripsiKita',
          text: 'Lihat dokumen skripsi ini',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setToastMessage("Tautan berhasil disalin!");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <>
      <header className="h-16 bg-white flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 shrink-0 shadow-sm z-[200] relative">
        <div className="flex items-center gap-3">
          <div className="flex flex-col justify-center">
            <span className="font-bold text-lg sm:text-xl tracking-tight flex items-center gap-2 leading-none">
              <span><span className="text-red-600">Skripsi</span><span className="text-black">Kita</span></span> 
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px] ml-1 border border-slate-200 h-4 items-center">v2.0.0</span>
            </span>
            {userName && (
              <span className="text-xs text-slate-400 font-light truncate max-w-[150px] sm:max-w-xs mt-1 leading-none">
                {userName}
              </span>
            )}
          </div>
        </div>
        
        {file && (
          <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200 shadow-inner">
            <Settings className="w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              value={watermark} 
              onChange={(e) => setWatermark(e.target.value)}
              placeholder="Watermark text"
              className="bg-transparent border-none outline-none text-sm font-medium w-48 text-slate-700 placeholder-slate-400 focus:ring-0"
            />
          </div>
        )}

        <div className="flex items-center gap-2 md:gap-4 relative">
          {file && (
             <div className="flex items-center gap-2">
                <div className="flex bg-slate-50 rounded-lg p-1 border border-slate-200 hidden sm:flex">
                  <button 
                    onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} 
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                    title="Perkecil"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setZoom(z => Math.min(2.5, z + 0.1))} 
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                    title="Perbesar"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
               {onDownload && (
                 <button 
                   onClick={onDownload}
                   className="px-3 py-2 sm:px-4 sm:py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 border border-red-200"
                   title="Unduh"
                 >
                   <Download className="w-4 h-4" />
                   <span className="hidden md:inline">Unduh</span>
                 </button>
               )}
               
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 ml-1"
               >
                 <MoreVertical className="w-5 h-5" />
               </button>
             </div>
          )}
        </div>
      </header>

      {/* Features Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-[300] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-white shadow-2xl h-full flex flex-col border-l border-slate-200"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Alat Profesional</h3>
                  <p className="text-xs text-slate-500 font-medium">Tingkatkan kualitas skripsi Anda</p>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* Section 1 */}
                <div className="space-y-1">
                  <div className="px-3 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Aksi Dasar</div>
                  <button onClick={handleShareClick} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-4 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Share2 className="w-4 h-4" />
                    </div>
                    Bagikan Tautan Dokumen
                  </button>
                  <button onClick={handleFeatureClick} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-4 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    Analisa Dokumen Cerdas
                  </button>
                </div>

                {/* Section 2 */}
                <div className="space-y-1">
                  <div className="px-3 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Pengecekan Akademik</div>
                  <button onClick={handleFeatureClick} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-4 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div>Cek Plagiasi Turnitin</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Pemeriksaan kemiripan teks akurat</div>
                    </div>
                  </button>
                  <button onClick={handleFeatureClick} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-4 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div>Validasi Daftar Pustaka</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Format APA/Harvard/IEEE otomatis</div>
                    </div>
                  </button>
                </div>

                {/* Section 3 */}
                <div className="space-y-1">
                  <div className="px-3 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">AI Assistant</div>
                  <button onClick={handleFeatureClick} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-4 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Edit3 className="w-4 h-4" />
                    </div>
                    Parafrase Kalimat (AI)
                  </button>
                  <button onClick={handleFeatureClick} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-4 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Languages className="w-4 h-4" />
                    </div>
                    Terjemahkan Abstrak
                  </button>
                  <button onClick={handleFeatureClick} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-4 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <AlignLeft className="w-4 h-4" />
                    </div>
                    Ringkasan per BAB (AI)
                  </button>
                </div>

                {/* Section 4 */}
                <div className="space-y-1">
                  <div className="px-3 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Ekstraksi & Sitasi</div>
                  <button onClick={handleFeatureClick} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-4 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Table className="w-4 h-4" />
                    </div>
                    Ekstrak Tabel ke Excel
                  </button>
                  <button onClick={handleFeatureClick} className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-4 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Library className="w-4 h-4" />
                    </div>
                    Cari Referensi Terkait
                  </button>
                </div>

              </div>
              
              <div className="p-5 border-t border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-red-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-800">SkripsiKita Pro</div>
                    <div className="text-[10px] text-red-600 font-medium">Buka semua fitur canggih</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[3000] bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl font-medium text-sm whitespace-nowrap border border-slate-700 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
