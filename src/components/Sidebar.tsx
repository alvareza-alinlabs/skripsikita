import { FileText, Database } from 'lucide-react';

interface SidebarProps {
  file: File | string | null;
}

export function Sidebar({ file }: SidebarProps) {
  if (!file) return null;

  const fileName = typeof file === 'string' ? file : file.name;
  const fileSize = typeof file === 'string' ? 'Remote / Local File' : `${(file.size / 1024 / 1024).toFixed(2)} MB`;

  return (
    <aside className="w-64 xl:w-72 bg-white border-r border-slate-200 flex-col shrink-0 hidden lg:flex shadow-sm z-10">
      <div className="p-5 border-b border-slate-100 flex items-center gap-2">
        <FileText className="w-4 h-4 text-red-600" />
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Document Outline</h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Modern styled empty state for outline */}
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
             <Database className="w-5 h-5 text-slate-300" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Outline tidak tersedia</p>
          <p className="text-xs text-slate-400 mt-1">Dokumen lokal ini tidak mendukung ekstraksi outline.</p>
        </div>
      </nav>
      <div className="p-5 bg-slate-50 border-t border-slate-200">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Metadata</div>
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
           <div className="text-sm font-semibold text-slate-800 truncate mb-1" title={fileName}>{fileName}</div>
           <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
             <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
             {fileSize}
           </div>
        </div>
      </div>
    </aside>
  );
}
