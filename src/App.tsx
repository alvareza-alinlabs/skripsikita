/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EmptyState } from './components/EmptyState';
import { PdfViewer } from './components/PdfViewer';
import { DownloadModal } from './components/DownloadModal';
import { PopupInstall } from './components/PopupInstall';
import { LastViewedToast } from './components/LastViewedToast';
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import configData from './data/config.json';
import { File, Download, Loader2 } from 'lucide-react';

// Initialize PDF.js worker using unpkg CDN as fallback
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function AppContent() {
  const [file, setFile] = useState<File | string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [watermark, setWatermark] = useState("SKRIPSIKITA");
  const [zoom, setZoom] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isDownloadingDocument, setIsDownloadingDocument] = useState(false);
  
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  
  const { slug, ext } = useParams<{ slug: string, ext: string }>();
  const navigate = useNavigate();

  // Get current config based on slug
  const configMap: Record<string, any> = configData;
  const currentConfig = slug ? configMap[slug] : null;

  useEffect(() => {
    if (ext === 'pdf=clear' || ext === 'pdf=download') {
      setWatermark('');
    } else if (currentConfig && currentConfig.nama) {
      const cleanName = currentConfig.nama.replace('Skripsi Atas Nama ', '').trim();
      const firstWord = cleanName.split(' ')[0] || "SKRIPSIKITA";
      setWatermark(firstWord.toUpperCase());
    }

    // Save to local storage for "Last Viewed" feature
    if (currentConfig && slug && ext) {
      // Don't save the hidden ext paths in recent
      const displayExt = ext.split('=')[0]; // pdf=clear -> pdf
      try {
        localStorage.setItem('lastViewedSkripsi', JSON.stringify({
          slug,
          ext: displayExt,
          nama: currentConfig.nama,
          timestamp: Date.now()
        }));
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    }
  }, [currentConfig, slug, ext]);

  useEffect(() => {
    let lastWidth = window.innerWidth;
    let timeoutId: any;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentWidth = window.innerWidth;
        // Only update if width actually changed by a meaningful amount
        // This prevents mobile scroll from triggering resize due to address bar or scrollbar quirks
        if (Math.abs(currentWidth - lastWidth) > 10) {
          lastWidth = currentWidth;
          setWindowWidth(currentWidth);
        }
      }, 150);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // When slug or ext changes, update the file state
  useEffect(() => {
    if (slug && currentConfig && ext && ext.startsWith('pdf')) {
      let urlToLoad = currentConfig.pdfUrl;
      
      // Convert Google Drive view links to direct download links
      if (urlToLoad.includes('drive.google.com/file/d/')) {
        const match = urlToLoad.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          // Use confirm=t to try bypassing the virus scan prompt for larger files
          urlToLoad = `https://drive.google.com/uc?export=download&id=${match[1]}&confirm=t`;
        }
      }

      if (urlToLoad.startsWith('http')) {
        // Use proxy to bypass CORS for Google Drive links
        urlToLoad = `https://corsproxy.io/?${encodeURIComponent(urlToLoad)}`;
      }
      
      // Fetch as blob to prevent repeated requests and handle properly
      const fetchPdf = async () => {
        try {
          setIsDownloadingDocument(true);
          const response = await fetch(urlToLoad);
          if (!response.ok) throw new Error("Failed to fetch");
          const blob = await response.blob();
          
          if (blob.type && blob.type.includes('text/html')) {
             throw new Error('Received HTML instead of PDF (likely Google Drive virus scan warning)');
          }
          
          const objectUrl = URL.createObjectURL(blob);
          setFile(objectUrl);
          setZoom(1);
        } catch (err) {
          console.error('PDF Fetch Error:', err);
          // Fallback to setting URL directly 
          setFile(urlToLoad);
          setZoom(1);
        } finally {
          setIsDownloadingDocument(false);
        }
      };

      fetchPdf();
    } else {
      setFile(null);
    }
  }, [slug, ext, currentConfig]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const clearFile = () => {
    setFile(null);
    setNumPages(null);
    navigate('/');
  };

  // Base width responsive scaling
  const baseWidth = windowWidth < 640 ? windowWidth - 32 : Math.min(windowWidth - 340, 800) > 400 ? Math.min(windowWidth - 340, 800) : windowWidth - 64;

  const headerFileState = currentConfig && (ext === 'pdf' || ext === 'doc') ? currentConfig.nama : file;

  return (
    <div className="h-[100dvh] w-full bg-slate-100 flex flex-col font-sans overflow-hidden text-slate-800">
      <Header 
        file={headerFileState}
        watermark={watermark}
        setWatermark={setWatermark}
        zoom={zoom}
        setZoom={setZoom}
        clearFile={clearFile}
        onDownload={currentConfig ? () => setIsDownloadModalOpen(true) : undefined}
      />

      <div className="flex flex-1 min-h-0 relative">
        <Sidebar file={headerFileState} />

        <main className="flex-1 bg-slate-200/50 overflow-y-auto relative flex flex-col pb-0 scroll-smooth">
          {slug && !currentConfig ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
               <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Dokumen Tidak Ditemukan</h2>
                 <p className="text-slate-500 mb-6">Tautan dokumen yang Anda tuju tidak tersedia atau salah.</p>
                 <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                   Kembali ke Beranda
                 </button>
               </div>
            </div>
          ) : currentConfig && ext === 'doc' ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
               <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
                 <div className="mx-auto w-16 h-16 bg-red-50 border border-red-100 flex items-center justify-center rounded-2xl mb-6 shadow-inner">
                   <File className="w-8 h-8 text-red-500" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Format DOCX</h2>
                 <p className="text-slate-500 mb-8 leading-relaxed">Format dokumen Word (DOC/DOCX) tidak dapat dipratinjau langsung di browser. Anda dapat mengunduh dokumen secara langsung.</p>
                 <button 
                   onClick={() => setIsDownloadModalOpen(true)}
                   className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-sm font-medium flex items-center justify-center gap-2"
                 >
                   <Download className="w-5 h-5" /> Buka Menu Unduhan
                 </button>
               </div>
            </div>
          ) : isDownloadingDocument ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/80">
              <div className="flex flex-col items-center gap-4 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                <p className="font-medium animate-pulse">Menyiapkan dokumen lokal...</p>
              </div>
            </div>
          ) : !file ? (
            <EmptyState />
          ) : (
            <PdfViewer 
              file={file}
              numPages={numPages}
              onDocumentLoadSuccess={onDocumentLoadSuccess}
              baseWidth={baseWidth}
              zoom={zoom}
              setZoom={setZoom}
              watermark={watermark}
            />
          )}
        </main>
      </div>

      {currentConfig && (
        <DownloadModal 
          isOpen={isDownloadModalOpen || ext === 'pdf=download'}
          onClose={() => setIsDownloadModalOpen(false)}
          documentConfig={currentConfig}
          watermarkText={watermark}
          skipPin={ext === 'pdf=clear' || ext === 'pdf=download'}
          autoDownload={ext === 'pdf=download'}
        />
      )}
    </div>
  );
}

function PopupInstallWrapper() {
  const location = useLocation();
  // Don't show popup if URL has parameters (slug/ext) to keep direct links clean
  const isDirectLink = location.pathname.split('/').filter(Boolean).length >= 2;
  
  if (isDirectLink) {
    return null;
  }
  
  return <PopupInstall />;
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/:slug/:ext" element={<AppContent />} />
          <Route path="*" element={<AppContent />} />
        </Routes>
        <PopupInstallWrapper />
        <LastViewedToast />
      </BrowserRouter>
    </>
  );
}

