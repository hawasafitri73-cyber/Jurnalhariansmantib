import React from 'react';
import { FileText, Download, Upload, Info, RotateCcw } from 'lucide-react';

interface AisHeaderProps {
  onExportBackup: () => void;
  onImportBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onShowHelp: () => void;
  onResetAll?: () => void;
}

export default function AisHeader({ onExportBackup, onImportBackup, onShowHelp, onResetAll }: AisHeaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-4 no-print shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="bg-sky-600 text-white p-2.5 rounded-xl shadow-xs flex items-center justify-center">
            <FileText className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
              Jurnal Harian & LKH Guru
              <span className="text-xs bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full font-sans font-semibold">
                Permendikdasmen No. 11/2025
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulir interaktif laporan kinerja harian guru berdasarkan Permendikdasmen RI No. 11 Tahun 2025 tentang Pemenuhan Beban Kerja Guru.
            </p>
          </div>
        </div>

        {/* Right: Utility Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Reset Template Contoh */}
          {onResetAll && (
            <button
              onClick={onResetAll}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-amber-700 hover:text-amber-800 hover:bg-amber-100 bg-amber-50 rounded-lg transition-colors font-semibold border border-amber-200 cursor-pointer"
              title="Kembalikan profil dan kegiatan ke contoh SMA Negeri 3 Bombana"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Muat Contoh Draf</span>
            </button>
          )}

          {/* Info/Panduan */}
          <button
            onClick={onShowHelp}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-sky-700 hover:bg-sky-50/50 rounded-lg transition-colors font-medium border border-slate-200"
            title="Saran pengisian & cara cetak ke PDF"
          >
            <Info className="w-4 h-4" />
            <span>Panduan</span>
          </button>

          {/* Backup Action: Import */}
          <button
            onClick={triggerFileInput}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 hover:text-sky-700 hover:bg-sky-50/50 rounded-lg transition-colors font-medium border border-slate-200"
            title="Import data hari sebelumnya (JSON)"
          >
            <Upload className="w-4 h-4" />
            <span>Impor Data</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportBackup}
            accept=".json"
            className="hidden"
          />

          {/* Backup Action: Export */}
          <button
            onClick={onExportBackup}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium border border-slate-300"
            title="Cadangkan data input saat ini (JSON)"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Data</span>
          </button>
        </div>
      </div>
    </header>
  );
}
