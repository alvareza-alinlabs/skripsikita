import { useState, useEffect } from 'react';
import { Lock, Download, FileText, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentConfig: {
    nama: string;
    pdfUrl: string;
    docUrl: string;
    pin: string;
  };
  watermarkText: string;
  skipPin?: boolean;
  autoDownload?: boolean;
}

export function DownloadModal({ isOpen, onClose, documentConfig, watermarkText, skipPin, autoDownload }: DownloadModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(skipPin || false);
  const [downloading, setDownloading] = useState<string | null>(null);

  // If skipPin changes while open, update unlocked state
  useEffect(() => {
    if (skipPin) {
      setUnlocked(true);
    }
  }, [skipPin]);

  const downloadRealPdf = async (auto = false) => {
    try {
      setDownloading('pdf');
      let urlToFetch = documentConfig.pdfUrl;
      
      if (urlToFetch.includes('drive.google.com/file/d/')) {
        const match = urlToFetch.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          urlToFetch = `https://drive.google.com/uc?export=download&id=${match[1]}&confirm=t`;
        }
      }

      if (urlToFetch.startsWith('http')) {
        urlToFetch = `https://corsproxy.io/?${encodeURIComponent(urlToFetch)}`;
      }
      
      const res = await fetch(urlToFetch);
      if (!res.ok) throw new Error("Terjadi kesalahan jaringan");
      const fetchedBlob = await res.blob();
      
      if (fetchedBlob.type && fetchedBlob.type.includes('text/html')) {
         // Google Drive might return an HTML virus warning page.
         // Let's fallback to normal direct link if so.
         throw new Error("Received HTML instead of PDF.");
      }
      
      const blob = new Blob([fetchedBlob], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${documentConfig.nama}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
    } catch (err) {
      console.error(err);
      // Fallback
      const link = document.createElement('a');
      link.href = documentConfig.pdfUrl;
      link.download = `${documentConfig.nama}.pdf`;
      link.click();
    } finally {
      setDownloading(null);
    }
  };

  useEffect(() => {
    if (autoDownload && isOpen && skipPin) {
      if (downloading === 'pdf') return;
      downloadRealPdf(true);
    }
  }, [autoDownload, isOpen, skipPin, documentConfig.pdfUrl, documentConfig.nama]);


  const handleVerify = () => {
    if (pin === documentConfig.pin) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPin('');
    setError(false);
    setUnlocked(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden pb-8 sm:pb-0 z-[1000]"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
            
            <div className="p-6 sm:p-8">
              <div className="mb-6 mt-2 relative">
                <div className="w-12 h-8 absolute -top-8 left-1/2 -translate-x-1/2 flex justify-center sm:hidden">
                  <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
                </div>
                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mb-4">
                  {unlocked ? <Download className="w-6 h-6 text-red-600" /> : <Lock className="w-6 h-6 text-red-600" />}
                </div>
                <h3 className="text-xl font-bold text-slate-800">Unduh Dokumen</h3>
                <p className="text-slate-500 text-sm mt-1">{documentConfig.nama}</p>
              </div>

              {!unlocked ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Masukkan PIN untuk mengunduh
                    </label>
                    <input 
                      type="password"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value);
                        setError(false);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                      placeholder="••••••"
                      className={`w-full px-4 py-2.5 rounded-xl border ${error ? 'border-red-400 ring-1 ring-red-400' : 'border-slate-200'} bg-slate-50 focus:bg-white outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono tracking-widest text-lg`}
                      
                    />
                    {error && (
                      <p className="text-red-500 text-xs mt-2 font-medium">PIN yang Anda masukkan salah.</p>
                    )}
                  </div>
                  <button 
                    onClick={handleVerify}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-sm transition-colors"
                  >
                    Verifikasi PIN
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm mb-6 flex items-start gap-3">
                    <div className="mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Akses diberikan.</p>
                      <p className="text-green-600 mt-0.5">Silakan unduh dokumen Anda di bawah ini.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => {
                        downloadRealPdf();
                      }}
                      disabled={downloading === 'pdf'}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors group cursor-pointer w-full text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-2.5 rounded-lg group-hover:bg-red-100 transition-colors">
                          <FileText className="w-6 h-6 text-slate-500 group-hover:text-red-500" />
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700 block">
                            {downloading === 'pdf' ? "Mengunduh..." : "Unduh Dokumen PDF"}
                          </span>
                          <span className="text-xs text-slate-500">File asli kualitas penuh</span>
                        </div>
                      </div>
                      <Download className={`w-5 h-5 text-slate-400 group-hover:text-red-500 ${downloading === 'pdf' ? 'animate-bounce' : ''}`} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
