import React from 'react';
import { TeacherProfile } from '../types';
import { User, Calendar, BookOpen, GraduationCap, ShieldCheck, School } from 'lucide-react';
import { SMAN_3_BOMBANA_TEACHERS } from '../data';

const MAPEL_KELAS_10 = [
  'PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI',
  'PENDIDIKAN AGAMA KRISTEN DAN BUDI PEKERTI',
  'B.INDO',
  'MATEMATIKA',
  'PEND.PANCASILA',
  'B.INGGRIS',
  'PJOK',
  'FISIKA',
  'KIMIA',
  'SEJARAH INDONESIA',
  'GEOGRAFI',
  'EKONOMI',
  'BIOLOGI',
  'PKWU',
  'TIK',
  'SOSIOLOGI',
  'MULOK',
  'BIMBINGAN KONSELING (BK)',
];

const MAPEL_KELAS_11_12 = [
  'PENDIDIKAN AGAMA ISLAM DAN BUDI PEKERTI',
  'PENDIDIKAN AGAMA KRISTEN DAN BUDI PEKERTI',
  'B.INDO',
  'PEMINATAN B.INDO',
  'MATEMATIKA',
  'PEND.PANCASILA',
  'B.INGGRIS',
  'PEMINATAN B. INGGRIS',
  'PJOK',
  'PEMINATAN FISIKA',
  'PEMINATAN KIMIA',
  'SEJARAH UMUM',
  'PEMINATAN SEJARAH',
  'GEOGRAFI',
  'PEMINATAN GEOGRAFI',
  'EKONOMI',
  'PEMINATAN EKONOMI',
  'BIOLOGI',
  'PEMINATAN BIOLOGI',
  'PKWU',
  'SOSIOLOGI',
  'PEMINATAN SOSIOLOGI',
  'MULOK',
  'BIMBINGAN KONSELING (BK)',
];

const SUGGESTED_TEACHERS = SMAN_3_BOMBANA_TEACHERS.map(t => t.nama);

interface TeacherProfileFormProps {
  profile: TeacherProfile;
  onChange: (profile: TeacherProfile) => void;
}

export default function TeacherProfileForm({ profile, onChange }: TeacherProfileFormProps) {
  // Helper to find matching teacher details
  const findMatchedTeacher = (nameVal: string) => {
    if (!nameVal) return null;
    const clean = nameVal.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    if (clean.length < 3) return null;
    
    // Exact match first
    let found = SMAN_3_BOMBANA_TEACHERS.find(
      (t) => t.nama.toLowerCase().trim() === nameVal.toLowerCase().trim()
    );
    if (found) return found;

    // Loose match
    found = SMAN_3_BOMBANA_TEACHERS.find((t) => {
      const dbClean = t.nama.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
      return dbClean === clean || dbClean.includes(clean) || clean.includes(dbClean);
    });
    
    return found || null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'namaGuru') {
      const matched = findMatchedTeacher(value);
      if (matched) {
        const hasNip = matched.nip && matched.nip !== '-';
        // Auto-select type and populate identity
        const newNipType = hasNip ? 'NIP' : 'NUPTK';
        const newNipValue = hasNip ? matched.nip : matched.nuptk;
        
        onChange({
          ...profile,
          namaGuru: value,
          nipType: newNipType,
          nip: newNipValue,
          tugasTambahan: matched.tugasTambahan || '',
          // Prefill custom additional tasks (if they are asb-humas, etc) if field isn't edited yet
          waliKelas: matched.tugasTambahan === 'Wali kelas' ? profile.waliKelas || 'Ada' : profile.waliKelas,
        });
        return;
      }
    }
    
    onChange({
      ...profile,
      [name]: value,
    });
  };

  const handleNipTypeChange = (type: 'NIP' | 'NUPTK') => {
    const matched = findMatchedTeacher(profile.namaGuru);
    let newNipValue = profile.nip;
    
    if (matched) {
      if (type === 'NIP') {
        newNipValue = matched.nip && matched.nip !== '-' ? matched.nip : '-';
      } else {
        newNipValue = matched.nuptk && matched.nuptk !== '-' ? matched.nuptk : '-';
      }
    }
    
    onChange({
      ...profile,
      nipType: type,
      nip: newNipValue,
    });
  };

  // Determine selectable subject value or if it is a manual input
  const isAllKelas10 = MAPEL_KELAS_10.includes(profile.mataPelajaran);
  const isAllKelas1112 = MAPEL_KELAS_11_12.includes(profile.mataPelajaran);
  
  let selectMapelValue = '';
  if (profile.mataPelajaran === 'PANITIA ULANGAN') {
    selectMapelValue = 'PANITIA ULANGAN';
  } else if (profile.mataPelajaran === 'Kepala Sekolah') {
    selectMapelValue = 'Kepala Sekolah';
  } else if (isAllKelas10 || isAllKelas1112) {
    selectMapelValue = profile.mataPelajaran;
  } else if (profile.mataPelajaran !== '') {
    selectMapelValue = 'custom';
  }

  const handleMapelSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      onChange({
        ...profile,
        mataPelajaran: '',
      });
    } else {
      onChange({
        ...profile,
        mataPelajaran: value,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <GraduationCap className="w-5 h-5 text-sky-600" />
        <h2 className="font-semibold text-slate-800 text-sm">Profil Guru & Sekolah</h2>
      </div>

      {/* Selector Peran LKH (Guru vs Kepala Sekolah) */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-extrabold text-slate-750 block">Tipe Laporan Kinerja (LKH):</span>
          <span className="text-[10.5px] text-slate-500 font-medium">Beralih peran pelapor untuk mengubah skema penandatanganan dan penilai secara otomatis.</span>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-3xs w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => onChange({ 
              ...profile, 
              isKepalaSekolah: false,
              tugasTambahan: profile.tugasTambahan === 'Kepala Sekolah' ? '' : profile.tugasTambahan,
              mataPelajaran: profile.mataPelajaran === 'Kepala Sekolah' ? '' : profile.mataPelajaran,
              namaGuru: profile.namaGuru === (profile.namaKepalaSekolah || 'Yakob Simson Barthimeus S.Pd., M.Pd., MM') ? '' : profile.namaGuru,
              nip: profile.nip === (profile.nipKepalaSekolah || '19781203200701 1 004') ? '' : profile.nip,
              jabatan: profile.jabatan === (profile.jabatanKepalaSekolah || 'Pembina Utama Muda, IV/c') ? '' : profile.jabatan,
            })}
            className={`px-4 py-2 rounded-md font-bold text-center cursor-pointer transition-all ${
              !profile.isKepalaSekolah
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Guru Umum
          </button>
          <button
            type="button"
            onClick={() => onChange({ 
              ...profile, 
              isKepalaSekolah: true, 
              tugasTambahan: 'Kepala Sekolah', 
              mataPelajaran: 'Kepala Sekolah',
              namaGuru: profile.namaKepalaSekolah || 'Yakob Simson Barthimeus S.Pd., M.Pd., MM',
              nip: profile.nipKepalaSekolah || '19781203200701 1 004',
              jabatan: profile.jabatanKepalaSekolah || 'Pembina Utama Muda, IV/c'
            })}
            className={`px-4 py-2 rounded-md font-bold text-center cursor-pointer transition-all ${
              profile.isKepalaSekolah
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Kepala Sekolah
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Nama Guru */}
        <div className="space-y-1">
          <div className="flex justify-between items-center mb-0.5">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Nama Guru Lengkap & Gelar
            </label>
            {findMatchedTeacher(profile.namaGuru) && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-1 leading-none">
                <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Terkoneksi NIP/NUPTK
              </span>
            )}
          </div>
          <div className="relative">
            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="namaGuru"
              value={profile.namaGuru}
              onChange={handleChange}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val) {
                  const matched = findMatchedTeacher(val);
                  if (matched) {
                    onChange({
                      ...profile,
                      namaGuru: matched.nama,
                    });
                  } else if (!val.includes(',')) {
                    // Fail-safe: if manual name doesn't contain a comma, append title
                    const isFitrawan = val.toLowerCase() === 'fitrawan' || val.toLowerCase().includes('fitrawan');
                    const suffix = isFitrawan ? ', S.Sos' : ', S.Pd';
                    onChange({
                      ...profile,
                      namaGuru: `${val}${suffix}`
                    });
                  }
                }
              }}
              placeholder="Contoh: Hawa Safitri, S.Pd."
              list="teacher-names"
              autoComplete="on"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
            />
            <datalist id="teacher-names">
              {SUGGESTED_TEACHERS.map((teacher, index) => (
                <option key={index} value={teacher} />
              ))}
            </datalist>
          </div>
        </div>

        {/* NIP / NUPTK */}
        <div className="space-y-1">
          <div className="flex justify-between items-center mb-0.5">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Pilihan Identitas Pegawai
            </label>
            <div className="flex bg-slate-100 p-0.5 rounded-md text-[10.5px] border border-slate-200">
              <button
                type="button"
                onClick={() => handleNipTypeChange('NIP')}
                className={`px-2 py-0.5 rounded font-extrabold cursor-pointer transition-colors ${
                  (profile.nipType || 'NIP') === 'NIP'
                    ? 'bg-sky-600 text-white shadow-3xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                NIP
              </button>
              <button
                type="button"
                onClick={() => handleNipTypeChange('NUPTK')}
                className={`px-2 py-0.5 rounded font-extrabold cursor-pointer transition-colors ${
                  profile.nipType === 'NUPTK'
                    ? 'bg-sky-600 text-white shadow-3xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                NUPTK
              </button>
            </div>
          </div>
          <div className="relative">
            <ShieldCheck className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="nip"
              value={profile.nip}
              onChange={handleChange}
              placeholder={
                (profile.nipType || 'NIP') === 'NIP'
                  ? "Contoh NIP: 19991203 202404 2 002 (Tulis '-' jika belum PNS)"
                  : 'Contoh NUPTK: 1234567890123456 (16 digit angka unik)'
              }
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
            />
          </div>
        </div>

        {/* Jabatan & Golongan */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Pangkat / Jabatan / Golongan
          </label>
          <input
            type="text"
            name="jabatan"
            value={profile.jabatan}
            onChange={handleChange}
            placeholder="Contoh: Guru Pertama / Penata Muda, III/a"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700"
          />
        </div>

        {/* Tanggal Laporan */}
        <div className="space-y-1 font-semibold text-sky-700">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tanggal Kegiatan Hari Ini
          </label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-sky-600" />
            <input
              type="date"
              name="tanggal"
              value={profile.tanggal}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sky-800 font-semibold cursor-pointer shadow-xs"
            />
          </div>
        </div>

        {/* Nama Sekolah */}
        <div className="space-y-1 md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Nama Instansi / Sekolah (Kop Tabel)
          </label>
          <div className="relative">
            <School className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="namaSekolah"
              value={profile.namaSekolah}
              onChange={handleChange}
              placeholder="Contoh: SD Negeri Nusantara Merdeka Yogyakarta"
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
            />
          </div>
        </div>

        {/* Mata Pelajaran */}
        <div className="space-y-1 md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Mata Pelajaran Diajar
          </label>
          <div className="relative">
            <BookOpen className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 z-10" />
            <select
              value={selectMapelValue}
              onChange={handleMapelSelectChange}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 bg-white font-medium cursor-pointer"
            >
              <option value="">-- Pilih Mata Pelajaran --</option>
              <optgroup label="MAPEL KELAS XI DAN XII">
                {MAPEL_KELAS_11_12.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
              <optgroup label="MAPEL KELAS 10">
                {MAPEL_KELAS_10.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </optgroup>
              <optgroup label="KEPANITIAAN / TUGAS LAIN">
                <option value="PANITIA ULANGAN">PANITIA ULANGAN</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
              </optgroup>
              <option value="custom">⚠ Isi Sendiri / Tulis Manual</option>
            </select>
          </div>
          
          {selectMapelValue === 'custom' && (
            <input
              type="text"
              name="mataPelajaran"
              value={profile.mataPelajaran}
              onChange={handleChange}
              placeholder="Tulis Mata Pelajaran secara manual..."
              className="mt-1.5 w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 bg-sky-50/20"
            />
          )}
        </div>

        {/* Tugas Tambahan */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tugas Tambahan Lainnya
          </label>
          <input
            type="text"
            name="tugasTambahan"
            value={profile.tugasTambahan || ''}
            onChange={handleChange}
            placeholder="Contoh: Staf Perpustakaan, Guru Piket, Kepala Laboratorium"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            <button
              type="button"
              onClick={() => onChange({ ...profile, tugasTambahan: 'Staf Perpustakaan' })}
              className="px-2 py-0.5 text-[9px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded cursor-pointer transition-colors"
            >
              + Staf Perpustakaan
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...profile, tugasTambahan: 'Kepala Perpustakaan' })}
              className="px-2 py-0.5 text-[9px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded cursor-pointer transition-colors"
            >
              + Kepala Perpustakaan
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...profile, tugasTambahan: 'Guru Piket' })}
              className="px-2 py-0.5 text-[9px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded cursor-pointer transition-colors"
            >
              + Guru Piket
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...profile, tugasTambahan: 'Kepala Laboratorium' })}
              className="px-2 py-0.5 text-[9px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded cursor-pointer transition-colors"
            >
              + Kepala Lab
            </button>
          </div>
        </div>

        {/* Wali Kelas */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tugas Wali Kelas (Kelas yang Diampu)
          </label>
          <input
            type="text"
            name="waliKelas"
            value={profile.waliKelas || ''}
            onChange={handleChange}
            placeholder="Contoh: XI F1 (Kosongkan jika bukan)"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
          />
        </div>

        {/* Guru Wali */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tugas Guru Wali / Wali Asuh (Kelas/Kelompok)
          </label>
          <input
            type="text"
            name="guruWali"
            value={profile.guruWali || ''}
            onChange={handleChange}
            placeholder="Contoh: XII F3 (Kosongkan jika bukan)"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
          />
        </div>

        {/* Beban Kerja */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Beban Kerja Pembelajaran
            </label>
            {profile.bebanKerja && (
              <button
                type="button"
                onClick={() => onChange({ ...profile, bebanKerja: '' })}
                className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider cursor-pointer"
              >
                Hapus / Kosongkan
              </button>
            )}
          </div>
          <input
            type="text"
            name="bebanKerja"
            value={profile.bebanKerja || ''}
            onChange={handleChange}
            placeholder="Contoh: 37 Jam 30 Menit/Minggu (7,46 Jam/Hari)"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
          />
          <div className="flex flex-wrap gap-1 md:gap-1.5 mt-1.5">
            <span className="text-[10px] text-slate-400 self-center font-medium mr-1">Rekomendasi No. 11/2025:</span>
            <button
              type="button"
              onClick={() => onChange({ ...profile, bebanKerja: '37 Jam 30 Menit/Minggu (7,46 Jam/Hari)' })}
              className="px-2 py-0.5 text-[10px] font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md cursor-pointer transition-colors shadow-3xs"
            >
              37,5 Jam (Lengkap)
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...profile, bebanKerja: '37 Jam 30 Menit/Minggu' })}
              className="px-2 py-0.5 text-[10px] font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md cursor-pointer transition-colors shadow-3xs"
            >
              37 Jam 30 Menit
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...profile, bebanKerja: '' })}
              className="px-2 py-0.5 text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md cursor-pointer transition-colors"
            >
              Isi Manual
            </button>
          </div>
        </div>

        {/* Kota Penandatanganan */}
        <div className="space-y-1">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Kota / Wilayah Tanda Tangan
          </label>
          <input
            type="text"
            name="kotaTandaTangan"
            value={profile.kotaTandaTangan || ''}
            onChange={handleChange}
            placeholder="Contoh: Rumbia, Bombana"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
          />
        </div>

        {/* Upload Foto TTD Guru */}
        <div className="space-y-1 pt-2 border-t border-dashed border-slate-100 md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Foto Tanda Tangan Anda (Opsional - Jika Ingin Pakai Foto TTD Asli)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                id="guru-signature-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        onChange({
                          ...profile,
                          guruSignature: event.target.result as string,
                        });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="guru-signature-upload"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer shadow-3xs transition-all w-full text-center"
              >
                📁 Pilih & Unggah Foto TTD Guru
              </label>
              <p className="text-[10px] text-slate-400 mt-1">
                Gunakan foto ttd berlatar belakang transparan atau putih (JPG/PNG).
              </p>
            </div>
            
            {profile.guruSignature ? (
              <div className="flex flex-col items-center gap-1.5 bg-white p-2.5 rounded-lg border border-slate-200 shadow-3xs shrink-0 w-full sm:w-48">
                <img
                  src={profile.guruSignature}
                  alt="Pratinjau TTD"
                  className="h-12 max-w-[120px] object-contain mix-blend-multiply"
                />
                
                <div className="w-full space-y-1 pt-1.5 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                    <span>↕ Geser TTD:</span>
                    <span className="text-sky-600 bg-sky-50 px-1 rounded text-[9px]">{(profile.guruSignatureYOffset ?? -15)}px</span>
                  </div>
                  <input
                    type="range"
                    min="-60"
                    max="40"
                    step="1"
                    value={profile.guruSignatureYOffset ?? -15}
                    onChange={(e) => onChange({
                      ...profile,
                      guruSignatureYOffset: parseInt(e.target.value)
                    })}
                    className="w-full accent-sky-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-slate-400">
                    <span>Atas</span>
                    <span>Bawah</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onChange({ ...profile, guruSignature: '' })}
                  className="text-[9px] text-red-500 hover:text-red-700 font-extrabold uppercase hover:underline cursor-pointer mt-1"
                >
                  Hapus Foto TTD
                </button>
              </div>
            ) : (
              <div className="h-14 w-32 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-[10px] text-slate-400 font-medium bg-slate-100 shrink-0">
                Belum Ada Foto TTD
              </div>
            )}
          </div>
        </div>

        {/* Kepala Sekolah */}
        <div className="space-y-1 pt-2 border-t border-dashed border-slate-100 md:col-span-2">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tanda Tangan Pejabat Pengesah (Kepala Sekolah)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-medium block">Nama & Gelar</span>
              <input
                type="text"
                name="namaKepalaSekolah"
                value={profile.namaKepalaSekolah}
                onChange={handleChange}
                placeholder="Nama Kepala Sekolah & Gelar"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700 font-medium"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-medium block">NIP</span>
              <input
                type="text"
                name="nipKepalaSekolah"
                value={profile.nipKepalaSekolah}
                onChange={handleChange}
                placeholder="NIP Kepala Sekolah"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-medium block">Pangkat / Golongan</span>
              <input
                type="text"
                name="jabatanKepalaSekolah"
                value={profile.jabatanKepalaSekolah || ''}
                onChange={handleChange}
                placeholder="Contoh: Pembina Utama Muda, IV/c"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
