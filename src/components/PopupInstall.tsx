import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const images = [
  '/gambar/popup1.webp',
  '/gambar/popup2.webp'
];

export function PopupInstall() {
  const [isOpen, setIsOpen] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent image click from firing
    if (!deferredPrompt) {
      alert("Browser Anda tidak mendukung instalasi atau aplikasi sudah diinstal.");
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('welcome-popup-closed'));
  };

  const handleImageClick = () => {
    if (currentImageIndex === 0) {
      setCurrentImageIndex(1);
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto w-full">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl relative flex flex-col">
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-30 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="relative w-full cursor-pointer" style={{ paddingBottom: '133.33%' }} onClick={handleImageClick}>
          {images.map((src, index) => (
            <img 
              key={src}
              src={src} 
              alt={`Promo ${index + 1}`} 
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            />
          ))}

          {/* Floating Install Button - Only visible on first slide when PWA is installable */}
          {currentImageIndex === 0 && deferredPrompt && (
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <button 
                onClick={handleInstallClick}
                className="w-full py-3.5 bg-red-600/90 backdrop-blur-sm text-white font-bold rounded-xl shadow-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Install Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
