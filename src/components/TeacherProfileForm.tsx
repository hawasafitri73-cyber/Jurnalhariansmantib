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
