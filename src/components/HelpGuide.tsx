import React from 'react';
import { X, BookOpen, Printer, Save, RefreshCw } from 'lucide-react';

interface HelpGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpGuide({ isOpen, onClose }: HelpGuideProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in no-print">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-sky-900 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-100" />
            <h3 className="font-bold text-sm tracking-tight">Panduan Penggunaan & Cetak LKH</h3>
          </div>
          <button
            onClick={onClose}
            className="text-sky-100 hover:text-white hover:bg-sky-800/50 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed scrollbar">
          
          {/* Step 1 */}
          <div className="flex gap-3">
            <div className="bg-sky-50 text-sky-700 border border-sky-200 font-bold h-6 w-6 rounded-full flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-0.5">Lengkapi Profil & Tanggal</h4>
              <p>
                Isi identitas Anda pada tab <strong>Profil Guru</strong> (Nama, NIP/NUPTK, Instansi, Kelas, serta Nama Kepala Sekolah). 
                Pilih tanggal kegiatan harian hari ini. Data profil Anda akan otomatis tersimpan jadi Anda tidak perlu mengetiknya berulang kali esok hari.
              </p>
            </div>
          </div>

          {/* Step-by-Step Step 2 */}
          <div className="flex gap-3">
            <div className="bg-sky-50 text-sky-700 border border-sky-200 font-bold h-6 w-6 rounded-full flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-0.5">Pilih Kegiatan & Isi Durasi</h4>
              <p>
                Buka tab <strong>Pilih Kegiatan</strong>, centang mana saja kegiatan yang dilaksanakan hari ini. 
                Masukkan durasi waktu (jam kerja) kegiatan tersebut dengan menekan tombol <strong>+ / -</strong>.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-3">
            <div className="bg-sky-50 text-sky-700 border border-sky-200 font-bold h-6 w-6 rounded-full flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-0.5">Unggah Bukti Dokumentasi</h4>
              <p>
                Untuk setiap kegiatan yang dicentang, seret atau pilih gambar bukti fisik (foto kegiatan mengajar, rapat, upacara, dll). 
                Sistem akan mempres (memperkecil ukuran berkas) otomatis tanpa merusak kejelasan gambar, serta menatanya secara rapi sesuai referensi kegiatan.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-3">
            <div className="bg-sky-50 text-sky-700 border border-sky-200 font-bold h-6 w-6 rounded-full flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-0.5">Atur Grid & Tata Letak</h4>
              <p>
                Di bagian <strong>Pengaturan Cetak</strong>, tentukan apakah ingin mencetak format penuh (semua baris template sekolah diperlihatkan) 
                atau versi ringkas (hanya kegiatan terpilih). Pilih susunan kisi dokumentasi di lembar kedua (2x2, 2x3, atau 3x3 foto per halaman).
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-3">
            <div className="bg-sky-50 text-sky-700 border border-sky-200 font-bold h-6 w-6 rounded-full flex items-center justify-center shrink-0">
              5
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-0.5">Cetak / Simpan ke PDF</h4>
              <p className="flex flex-col gap-1">
                <span>Klik tombol <strong>Cetak ke PDF / Print</strong>. Pada jendela cetak browser:</span>
                <span>🟢 Pilih printer: <strong>Save as PDF (Simpan sebagai PDF)</strong>.</span>
                <span>🟢 Centang: <strong>Grafik Latar Belakang (Background Graphics)</strong> agar warna & garis tabel muncul semestinya.</span>
                <span>🟢 Matikan centang: <strong>Header dan Footer (Headers & Footers)</strong> untuk menyembunyikan tulisan URL margin browser.</span>
              </p>
            </div>
          </div>

          {/* Backup info */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mt-4 space-y-2">
            <h5 className="font-extrabold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Save className="w-4 h-4 text-sky-600" />
              Sistem Penyimpanan Data Aman
            </h5>
            <p className="text-[11px] text-slate-500 leading-normal">
              Aplikasi ini memproses semua foto dan ketikan Anda secara privat langsung di dalam peramban internet (browser) Anda. 
              Gunakan tombol <strong>Ekspor Data</strong> di bagian atas untuk mencadangkan data hari ini ke bentuk file berkas (.json), 
              lalu gunakan <strong>Impor Data</strong> di esok hari untuk mempercepat pengisian profil guru.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-sky-900 hover:bg-sky-950 text-white font-bold px-4 py-2 rounded-lg text-xs"
          >
            Saya Mengerti
          </button>
        </div>

      </div>
    </div>
  );
}
