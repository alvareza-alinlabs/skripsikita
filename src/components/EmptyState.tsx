import { ShieldCheck, BookOpen, Clock, FileBadge } from 'lucide-react';
import { motion } from 'motion/react';

export function EmptyState() {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-red-600" />,
      title: "Keamanan Terjamin",
      description: "Akses dokumen dilindungi dengan hak cipta dan watermark dinamis layar penuh."
    },
    {
      icon: <FileBadge className="w-6 h-6 text-red-600" />,
      title: "Dokumen Resmi",
      description: "Semua skripsi telah diverifikasi dan merupakan dokumen asli mahasiswa."
    },
    {
      icon: <Clock className="w-6 h-6 text-red-600" />,
      title: "Akses Kapan Saja",
      description: "Platform repositori digital yang dapat diakses dari perangkat apapun."
    }
  ];

  return (
    <div className="flex-1 flex w-full bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-100/50 blur-3xl mix-blend-multiply opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100/50 blur-3xl mix-blend-multiply opacity-60"></div>
      
      <div className="flex-1 overflow-y-auto z-10 w-full relative">
        <div className="min-h-full flex flex-col items-center justify-start p-6 sm:p-12 pb-32 sm:pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl w-full text-center flex flex-col items-center my-auto py-8"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", bounce: 0.4 }}
              className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-600 to-rose-600 rounded-3xl flex items-center justify-center mb-6 sm:mb-8 shadow-xl shadow-red-500/20 ring-4 sm:ring-8 ring-red-50/50"
            >
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 mb-4 sm:mb-6 tracking-tight">
              Repositori <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">Digital</span>
            </h2>
            
            <p className="text-slate-600 mb-10 sm:mb-16 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-medium px-4">
              Sistem pengarsipan tugas akhir mahasiswa yang aman dan terpercaya. 
              Silakan pilih dokumen dari menu samping atau gunakan tautan untuk mulai membaca.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full text-left px-4">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="bg-white/90 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-red-100 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-tight">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

