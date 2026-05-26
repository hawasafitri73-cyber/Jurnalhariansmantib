import React, { useState } from 'react';
import { Scale, BookOpen, Clock, Award, ShieldAlert, CheckCircle, FileText, ChevronDown, ChevronUp, Check, ListChecks } from 'lucide-react';

export default function PermenReference() {
  const [openSection, setOpenSection] = useState<string | null>('beban_keseluruhan');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const sections = [
    {
      id: 'beban_keseluruhan',
      title: 'Beban Kerja Keseluruhan',
      icon: <Clock className="w-4 h-4 text-sky-600" />,
      highlight: 'Wajib 37 Jam 30 Menit / Minggu',
      content: (
        <div className="space-y-3">
          <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-xl text-slate-700 font-medium leading-relaxed">
            <span className="font-extrabold text-sky-900 block mb-1 uppercase tracking-wider text-[10px]">Ketentuan Pokok Pasal 2:</span>
            "Guru melaksanakan beban kerja selama <strong className="text-sky-950 underline decoration-sky-300">37 jam 30 menit</strong> dalam 1 minggu (tidak termasuk jam istirahat)."
          </div>
          <p className="text-xs text-slate-500">
            Seluruh beban waktu ini dibagi secara merata untuk menyelesaikan 5 tugas utama guru (kegiatan pokok) sebagaimana dicantumkan pada bagian di bawah ini secara fungsional.
          </p>
        </div>
      )
    },
    {
      id: 'merencanakan',
      title: '1. Merencanakan Pembelajaran / Pembimbingan',
      icon: <FileText className="w-4 h-4 text-emerald-600" />,
      highlight: 'Dilakukan dalam Jam Kerja Efektif',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Kegiatan perencanaan ini dilakukan dalam jam kerja efektif guru yang meliputi sub-kegiatan:
          </p>
          <div className="space-y-2">
            <div className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded shrink-0">A</span>
              <div>
                <strong className="text-xs text-slate-800 block font-bold">Pengkajian Kurikulum:</strong>
                <span className="text-slate-600 text-xs text-slate-500">Meliputi kurikulum pembelajaran, kurikulum pembimbingan, atau kurikulum program kebutuhan khusus pada satuan pendidikan.</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded shrink-0">B</span>
              <div>
                <strong className="text-xs text-slate-800 block font-bold">Pembuatan Rencana Pelaksanaan:</strong>
                <span className="text-slate-600 text-xs text-slate-500">Penyusunan Rencana Pelaksanaan Pembelajaran (RPP) atau Modul Ajar (MA) / Rencana Pelaksanaan Pembimbingan sesuai dengan standar proses pendidikan.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'melaksanakan',
      title: '2. Melaksanakan Pembelajaran / Pembimbingan',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      highlight: 'Min 24 Jam s/d Max 40 Jam Tatap Muka',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-600 font-medium">Tugas pelaksanaan ini diatur secara ketat dengan ketentuan jam tatap muka sebagai berikut:</p>
          
          <div className="space-y-2 text-xs">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5 flex items-start gap-2">
              <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-bold block">Beban Mengajar:</strong>
                <span className="text-slate-600">Paling sedikit <span className="font-bold text-indigo-900">24 jam tatap muka</span> dan paling banyak <span className="font-bold text-indigo-900">40 jam tatap muka per minggu</span>.</span>
              </div>
            </div>
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5 flex items-start gap-2">
              <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-bold block">Bagi Guru BK:</strong>
                <span className="text-slate-600">Membimbing paling sedikit <span className="font-bold text-indigo-900">5 rombongan belajar (rombel) per tahun</span>.</span>
              </div>
            </div>
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5 flex items-start gap-2">
              <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-bold block">Cakupan Kegiatan:</strong>
                <span className="text-slate-600">Terbuka lebar pada kegiatan <span className="font-semibold text-slate-800">Intrakurikuler</span>, <span className="font-semibold text-slate-800">Kokurikuler</span>, <span className="font-semibold text-slate-800">Ekstrakurikuler</span>, serta <span className="font-semibold text-slate-800">Bimbingan dan Konseling</span>.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'menilai',
      title: '3. Menilai Hasil Pembelajaran / Pembimbingan',
      icon: <ListChecks className="w-4 h-4 text-amber-600" />,
      highlight: 'Masuk Bagian Jam Kerja Rutin Guru',
      content: (
        <div className="space-y-2.5">
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">Definisi Penilaian Hasil:</p>
          <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl text-slate-700 text-xs italic">
            "Merupakan proses pengumpulan dan pengolahan informasi secara berkelanjutan untuk mengukur pencapaian hasil belajar atau perkembangan nyata dari murid."
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kegiatan pengolahan nilai raport, analisis butir soal, pelaksanaan remedi, pengisian data e-Rapor, dan pelaporan perkembangan murid ini dilakukan sebagai bagian integral yang melekat dari jam kerja rutin harian guru.
          </p>
        </div>
      )
    },
    {
      id: 'membimbing',
      title: '4. Membimbing dan Melatih Murid',
      icon: <Award className="w-4 h-4 text-rose-600" />,
      highlight: 'Termasuk Tugas Guru Wali',
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-600 font-medium">Mekanisme pembimbingan dilakukan melalui ragam kegiatan berikut:</p>
          <div className="space-y-2 text-xs">
            <div className="bg-rose-50/30 border border-rose-100 rounded-lg p-2.5">
              <strong className="text-slate-800 font-bold block">Saluran Pembimbingan:</strong>
              <span className="text-slate-600">Dilakukan secara resmi melalui kegiatan <span className="font-semibold text-slate-800">kokurikuler (seperti projek P5)</span> dan/atau kegiatan <span className="font-semibold text-slate-800">ekstrakurikuler</span>.</span>
            </div>
            
            <div className="bg-rose-50/30 border border-rose-100 rounded-lg p-2.5">
              <strong className="text-slate-800 font-semibold text-rose-950 block">Tugas Guru Wali (Sangat Strategis):</strong>
              <span className="text-slate-600 leading-normal block mt-1">
                Melaksanakan pendampingan akademik mandiri terstruktur, pembinaan karakter orisinal, minat bakat, serta pelacakan rekam jejak psikososial pribadi bagi murid-murid dampingannya.
              </span>
              <div className="bg-rose-100/60 font-semibold text-rose-950 text-[10.5px] px-2.5 py-1.5 rounded-md mt-2 flex items-center justify-between">
                <span>Ekuivalensi Jam Tugas Guru Wali:</span>
                <span className="font-extrabold text-rose-800 bg-white px-2 py-0.5 rounded border border-rose-200">2 Jam Tatap Muka / Minggu</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tugas_tambahan',
      title: '5. Melaksanakan Tugas Tambahan',
      icon: <ShieldAlert className="w-4 h-4 text-sky-600" />,
      highlight: 'Sistem Hitung Ekuivalensi Resmi',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Tugas tambahan tertentu secara hukum dapat dihitung (diekuivalensikan) guna melengkapi pemenuhan syarat kelayakan minimal sertifikasi guru / syarat beban dasar <strong className="text-slate-700">24 jam mengajar per minggu</strong>:
          </p>

          {/* Sub A */}
          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-800 text-xs border-b border-slate-200 pb-1 flex justify-between items-center text-sky-950">
              <span>A. TUGAS TAMBAHAN UTAMA</span>
              <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded text-[9.5px]">Ekuivalen 12 Jam Tatap Muka / Minggu</span>
            </h5>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 pl-1">
              <li>Wakil kepala satuan pendidikan (Wakasek)</li>
              <li>Ketua program keahlian (Khusus SMK)</li>
              <li>Kepala perpustakaan sekolah</li>
              <li>Kepala laboratorium, bengkel, atau unit produksi/teaching factory</li>
            </ul>
          </div>

          {/* Sub B */}
          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-800 text-xs border-b border-slate-200 pb-1 flex justify-between items-center text-teal-950">
              <span>B. TUGAS TAMBAHAN LAIN (GPK)</span>
              <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[9.5px]">Ekuivalen 6 Jam Tatap Muka / Minggu</span>
            </h5>
            <div className="text-xs text-slate-600 pl-1">
              <span className="font-semibold text-slate-700">Pembimbing Khusus</span> pada sekolah penyelenggara pendidikan inklusi atau terpadu.
            </div>
          </div>

          {/* Sub C */}
          <div className="space-y-2">
            <h5 className="font-extrabold text-slate-800 text-xs border-b border-slate-200 pb-1 flex justify-between items-center text-emerald-950">
              <span>C. TUGAS TAMBAHAN LAINNYA</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[9.5px]">Maksimal Kumulatif 6 Jam Tatap Muka / Minggu</span>
            </h5>
            
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1 border border-slate-200 rounded-lg text-xs">
              {[
                { name: 'Wali Kelas', hours: '2 jam' },
                { name: 'Pembina OSIS', hours: '2 jam' },
                { name: 'Pembina Ekstrakurikuler', hours: '2 jam (min. 20 murid)' },
                { name: 'Koordinator Pengembangan Kompetensi', hours: '2 jam' },
                { name: 'Pengurus BKK SMK', hours: 'Ketua (2 jam), Personil (1 jam)' },
                { name: 'Guru Piket', hours: '1 jam (min. 1 hari/minggu)' },
                { name: 'Pengurus LSP Pihak Pertama', hours: 'Ketua (2 jam), Kepala Bagian (1 jam)' },
                { name: 'Koordinator Pengelolaan Kinerja Guru', hours: '2 jam' },
                { name: 'Koordinator Pembelajaran Berbasis Projek (P5)', hours: '2 jam per rombongan belajar' },
                { name: 'Koordinator Pembelajaran Pendidikan Inklusi', hours: '2 jam' },
                { name: 'TPPK / Satgas (Pencegahan Kekerasan)', hours: 'Koordinator (2 jam), Anggota/Satgas (1 jam)' },
                { name: 'Pengurus Kepanitiaan Acara Sekolah', hours: '1 jam (min. 1 bulan)' },
                { name: 'Pengurus Organisasi Bidang Pendidikan', hours: 'Nasional (3 jam), Provinsi (2 jam), Kab/Kota (1 jam)' },
                { name: 'Tutor Pendidikan Kesetaraan (Paket A/B/C)', hours: 'Maksimal 6 jam (rasio 1:1)' },
                { name: 'Instruktur / Narasumber / Fasilitator Nasional', hours: '1 jam' },
                { name: 'Peserta Program Pengembangan Kompetensi', hours: '1 jam' },
                { name: 'Koordinator KKG / MGMP / Gugus', hours: '1 jam' },
                { name: 'Pengurus Organisasi Kemasyarakatan Nonpolitik', hours: '1 jam' },
                { name: 'Pengurus Organisasi Pemerintahan Nonstruktural', hours: '1 jam' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between p-2 hover:bg-slate-50">
                  <span className="font-semibold text-slate-700">{item.name}</span>
                  <span className="font-extrabold text-emerald-800 shrink-0 select-all bg-emerald-50/50 px-1.5 rounded">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
      
      {/* Header Referensi */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Scale className="w-5 h-5 text-sky-600" />
        <div>
          <h2 className="font-bold text-slate-800 text-sm">Referensi Hukum Resmi</h2>
          <p className="text-[10px] text-slate-400 font-medium">Permendikdasmen RI No. 11 Tahun 2025</p>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-normal">
        Rincian ekuivalensi dan panduan 5 tugas utama (kegiatan pokok) guru resmi sesuai regulasi terbaru:
      </p>

      {/* Accordion Deck */}
      <div className="space-y-2.5">
        {sections.map((sec) => {
          const isOpen = openSection === sec.id;
          return (
            <div key={sec.id} className="border border-slate-200 rounded-lg overflow-hidden transition-all shadow-3xs bg-white hover:border-slate-300">
              {/* Box Handler */}
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className="w-full flex items-center justify-between p-3 text-left focus:outline-none focus:bg-slate-50/50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-slate-100">
                    {sec.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">{sec.title}</h4>
                    <span className="text-[9.5px] font-bold text-sky-700 block mt-0.5">{sec.highlight}</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-450" /> : <ChevronDown className="w-4 h-4 text-slate-450" />}
              </button>

              {/* Expander body */}
              {isOpen && (
                <div className="p-3.5 border-t border-slate-150 bg-slate-50/30 text-xs leading-normal animate-fade-in text-slate-600">
                  {sec.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Official Footnote banner */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mt-2 text-[10px] text-slate-400">
        <div className="flex items-start gap-1.5 leading-tight">
          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p>
            Mencabut dan menyatakan tidak berlaku Peraturan Menteri sebelumnya (Permendikbud No. 15 Tahun 2018 & Permendikbudristek No. 25 Tahun 2024). Resmi berlaku sejak tahun ajaran <strong>2025/2026</strong>.
          </p>
        </div>
      </div>

    </div>
  );
}
