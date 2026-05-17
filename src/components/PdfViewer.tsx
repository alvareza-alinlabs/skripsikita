import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { AnimatePresence, motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { usePinch } from '@use-gesture/react';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

interface PdfViewerProps {
  file: File | string;
  numPages: number | null;
  onDocumentLoadSuccess: (info: { numPages: number }, pdfDocument: any) => void;
  baseWidth: number;
  zoom: number;
  setZoom?: React.Dispatch<React.SetStateAction<number>>;
  watermark: string;
}

const MemoizedDocument = React.memo(Document);

function LazyPage({ index, baseWidth, zoom, watermark }: any) {
  const [hasRendered, setHasRendered] = useState(false);
  const [debouncedZoom, setDebouncedZoom] = useState(zoom);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedZoom(zoom);
    }, 300);
    return () => clearTimeout(timer);
  }, [zoom]);

  const { ref, inView } = useInView({
    rootMargin: '1500px 0px',
    triggerOnce: false,
  });

  const { ref: visibleRef, inView: isFullyVisible } = useInView({
    rootMargin: '-40% 0px -40% 0px',
  });

  useEffect(() => {
    if (isFullyVisible) {
      window.dispatchEvent(new CustomEvent('pdf-page-change', { detail: index + 1 }));
    }
  }, [isFullyVisible, index]);

  useEffect(() => {
    if (inView && !hasRendered) {
      setHasRendered(true);
    }
  }, [inView, hasRendered]);

  const setRefs = useCallback((node: any) => {
    ref(node);
    visibleRef(node);
  }, [ref, visibleRef]);

  return (
    <div 
      ref={setRefs}
      id={`pdf-page-${index + 1}`}
      className="relative shadow-xl shadow-slate-300/50 bg-white select-none rounded border border-slate-100 overflow-hidden"
      style={{ display: 'flex', flexDirection: 'column', width: baseWidth * zoom, minHeight: (baseWidth * zoom) * 1.414 }}
    >
      {hasRendered ? (
        <Page 
          pageNumber={index + 1} 
          width={baseWidth * debouncedZoom}
          renderTextLayer={true} 
          renderAnnotationLayer={true}
          loading={
            <div 
              className="bg-slate-50 animate-pulse flex items-center justify-center text-slate-400" 
              style={{ width: baseWidth * zoom, height: (baseWidth * zoom) * 1.414 }}
            >
              Memuat halaman {index + 1}...
            </div>
          }
        />
      ) : (
        <div 
          className="bg-slate-50 flex items-center justify-center text-slate-300" 
          style={{ width: baseWidth * zoom, height: (baseWidth * zoom) * 1.414 }}
        >
          - {index + 1} -
        </div>
      )}
      
      {watermark && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden z-[100] gap-20 sm:gap-40 opacity-[0.08]">
          <span className="text-red-600 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black -rotate-[35deg] whitespace-nowrap tracking-tighter">{watermark}</span>
          <span className="text-red-600 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black -rotate-[35deg] whitespace-nowrap tracking-tighter">{watermark}</span>
          <span className="text-red-600 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black -rotate-[35deg] whitespace-nowrap tracking-tighter hidden sm:block">{watermark}</span>
        </div>
      )}
    </div>
  );
}

function PageIndicator({ numPages }: { numPages: number | null }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<any>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const handlePageChange = (e: any) => setCurrentPage(e.detail);
    window.addEventListener('pdf-page-change', handlePageChange);
    return () => window.removeEventListener('pdf-page-change', handlePageChange);
  }, []);

  useEffect(() => {
    const container = document.querySelector('main');
    if (!container) return;

    const handleScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        setIsScrolling(true);
      }
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isScrollingRef.current = false;
        setIsScrolling(false);
      }, 1000);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isScrolling && numPages && (
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-[200] bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-md shadow-xl text-sm font-medium"
        >
          Halaman {currentPage} / {numPages}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PdfViewer({ file, numPages, onDocumentLoadSuccess, baseWidth, zoom, setZoom, watermark }: PdfViewerProps) {
  const [showZoom, setShowZoom] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  usePinch(
    ({ offset: [d] }) => {
      if (setZoom) setZoom(Math.max(0.2, Math.min(d, 4)));
    },
    {
      target: containerRef,
      from: () => [zoom, 0],
      scaleBounds: { min: 0.2, max: 4 },
    }
  );

  const options = useMemo(() => ({
    cMapUrl: 'https://unpkg.com/pdfjs-dist@4.4.162/cmaps/',
    cMapPacked: true,
  }), []);

  useEffect(() => {
    setShowZoom(true);
    const timeout = setTimeout(() => setShowZoom(false), 1500);
    return () => clearTimeout(timeout);
  }, [zoom]);

  return (
    <div 
      ref={containerRef} 
      className="w-full py-8 md:py-12 px-4 sm:px-6 flex flex-col items-center relative"
      style={{ touchAction: 'pan-x pan-y' }}
    >
      <AnimatePresence>
        {showZoom && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-800/90 text-white px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm font-medium text-sm z-[200] select-none pointer-events-none"
          >
            {Math.round(zoom * 100)}%
          </motion.div>
        )}
      </AnimatePresence>
       
      <PageIndicator numPages={numPages} />

       <MemoizedDocument
          file={file}
          options={options}
          onLoadSuccess={(pdf) => {
             setPdfDoc(pdf);
             onDocumentLoadSuccess({ numPages: pdf.numPages }, pdf);
          }}
          loading={
            <div className="py-32 flex flex-col items-center gap-6 text-slate-500">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
              </div>
              <p className="font-semibold tracking-wide text-sm uppercase text-slate-600">Memuat Dokumen...</p>
            </div>
          }
          className="flex flex-col items-center gap-8 sm:gap-12 w-full"
        >
          {Array.from(new Array(numPages || 0), (el, index) => (
            <LazyPage 
              key={`page_${index + 1}`} 
              index={index}
              baseWidth={baseWidth}
              zoom={zoom}
              watermark={watermark}
            />
          ))}
        </MemoizedDocument>
    </div>
  );
}
