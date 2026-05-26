import React, { useState, useEffect } from 'react';
import { TeacherProfile, ActivityItem, PrintSettings } from './types';
import {
  DEFAULT_TEACHER_PROFILE,
  DEFAULT_ACTIVITIES,
} from './data';
import AisHeader from './components/AisHeader';
import TeacherProfileForm from './components/TeacherProfileForm';
import ActivitySelector from './components/ActivitySelector';
import ActivityCustomizer from './components/ActivityCustomizer';
import ReportPreview from './components/ReportPreview';
import HelpGuide from './components/HelpGuide';
import PermenReference from './components/PermenReference';
import { User, ClipboardList, Settings2, Sliders, Eye, Scale } from 'lucide-react';

export default function App() {
  // --- States ---
  const [profile, setProfile] = useState<TeacherProfile>(DEFAULT_TEACHER_PROFILE);
  const [activities, setActivities] = useState<ActivityItem[]>(DEFAULT_ACTIVITIES);
  const [settings, setSettings] = useState<PrintSettings>({
    showOnlyActive: true,
    gridCols: 2,
    gridRows: 3,
    mergePhotos: true,
  });

  const [activeTab, setActiveTab] = useState<'profil' | 'kegiatan' | 'regulasi' | 'kustomizer'>('kegiatan');
  const [helpOpen, setHelpOpen] = useState(false);

  // --- Initial Loading from localStorage ---
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('lkh_teacher_profile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed.namaGuru === 'Nurhikmah, S.Pd.' || parsed.namaGuru === 'Nurhikmah, S.Pd') {
          parsed.namaGuru = '';
        }
        if (parsed.nip === '19771213 200604 2 011') {
          parsed.nip = '';
        }
        if (parsed.jabatan === 'Penata, III/c') {
          parsed.jabatan = '';
        }
        setProfile(parsed);
      }

      const storedSettings = localStorage.getItem('lkh_print_settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }

      const storedActivities = localStorage.getItem('lkh_teacher_activities_v3');
      if (storedActivities) {
        setActivities(JSON.parse(storedActivities));
      } else {
        setActivities(DEFAULT_ACTIVITIES);
      }
    } catch (err) {
      console.error('Gagal memuat simpanan lokal:', err);
    }
  }, []);

  // --- Auto-Save to LocalStorage when states change ---
  useEffect(() => {
    try {
      localStorage.setItem('lkh_teacher_profile', JSON.stringify(profile));
      localStorage.setItem('lkh_print_settings', JSON.stringify(settings));

      // Attempt to save everything, including lightweight compressed photos and photo captions.
      // This ensures work is saved automatically and persists perfectly upon reload!
      try {
        localStorage.setItem('lkh_teacher_activities_v3', JSON.stringify(activities));
      } catch (errQuota) {
        // Fallback: If localStorage capacity is exceeded due to too many images,
        // we keep the typed captions and text fields, but strip only the heavy binary photos
        console.warn('LocalStorage browser limit reached. Saving activities text and captions without physical image files:', errQuota);
        const textOnlyActivities = activities.map((act) => ({
          ...act,
          photos: [], // clear image blobs to save space
        }));
        localStorage.setItem('lkh_teacher_activities_v3', JSON.stringify(textOnlyActivities));
      }
    } catch (err) {
      console.error('Gagal menyimpan ke penyimpanan lokal:', err);
    }
  }, [profile, activities, settings]);

  // --- Backup Functions (JSON Import / Export) ---
  const handleExportBackup = () => {
    try {
      const timeStamp = new Date().toISOString().split('T')[0];
      const fileName = `LKH_Guru_${profile.namaGuru.replace(/\s+/g, '_')}_${timeStamp}.json`;
      
      const backupData = {
        meta: {
          app: 'LKH Guru Generator',
          createdAt: new Date().toISOString(),
          version: '1.2'
        },
        profile,
        activities, // Photos are included inside backup files safely!
        settings,
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal mengekspor berkas data.');
    }
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const payload = JSON.parse(e.target?.result as string);
        if (payload.profile && payload.activities) {
          setProfile(payload.profile);
          setActivities(payload.activities);
          if (payload.settings) {
            setSettings(payload.settings);
          }
          alert('Data LKH berhasil diimpor!');
        } else {
          alert('Format berkas backup JSON tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca berkas. Pastikan format berkas sesuai.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetActivities = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang daftar kegiatan ke bawaan pabrik? Customisasi kegiatan Anda akan hilang.')) {
      setActivities(DEFAULT_ACTIVITIES);
    }
  };

  const handleResetAllData = () => {
    if (confirm('Apakah Anda yakin ingin menyetel ulang SEMUA data (termasuk profil guru, kepala sekolah, beban kerja, dan daftar kegiatan harian) kembali ke draf contoh SMA Negeri 3 Bombana?')) {
      setProfile(DEFAULT_TEACHER_PROFILE);
      setActivities(DEFAULT_ACTIVITIES);
      localStorage.removeItem('lkh_teacher_profile');
      localStorage.removeItem('lkh_teacher_activities_v3');
      alert('Semua data berhasil disetel ulang ke draf contoh Jurnal Harian Guru!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* 1. Header Toolbar */}
      <AisHeader
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        onShowHelp={() => setHelpOpen(true)}
        onResetAll={handleResetAllData}
      />

      {/* 2. Main Workspace layout split */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* ======================================= */}
        {/* LEFT WORKSPACE: OPERATIONS & CONTROLS   */}
        {/* ======================================= */}
        <section className="xl:col-span-5 space-y-5 no-print flex flex-col max-h-[calc(100vh-120px)] overflow-y-auto pr-1">
          
          {/* Custom Tabs Bar */}
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-2 min-[420px]:grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab('profil')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'profil'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>1. Profil</span>
            </button>
            <button
              onClick={() => setActiveTab('kegiatan')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'kegiatan'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 shrink-0" />
              <span>2. Kegiatan</span>
            </button>
            <button
              onClick={() => setActiveTab('regulasi')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'regulasi'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Referensi Hukum Permendikdasmen No. 11 Tahun 2025"
            >
              <Scale className="w-3.5 h-3.5 shrink-0" />
              <span>3. Regulasi</span>
            </button>
            <button
              onClick={() => setActiveTab('kustomizer')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-[10px] sm:text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'kustomizer'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5 shrink-0" />
              <span>4. Template</span>
            </button>
          </div>

          {/* Active Tab Form Content Rendering */}
          <div className="flex-1">
            {activeTab === 'profil' && (
              <div className="animate-fade-in">
                <TeacherProfileForm profile={profile} onChange={setProfile} />
              </div>
            )}

            {activeTab === 'kegiatan' && (
              <div className="animate-fade-in">
                <ActivitySelector activities={activities} onChange={setActivities} />
              </div>
            )}

            {activeTab === 'regulasi' && (
              <div className="animate-fade-in">
                <PermenReference />
              </div>
            )}

            {activeTab === 'kustomizer' && (
              <div className="animate-fade-in">
                <ActivityCustomizer
                  activities={activities}
                  onChange={setActivities}
                  onReset={handleResetActivities}
                />
              </div>
            )}
          </div>

          {/* Persistent Printing settings widgets */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-sky-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Pengaturan Cetak & Tata Letak</h3>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Option 1: Full table vs Compact active table */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <label className="font-semibold text-slate-700 block">Metode Tampilan Tabel LKH</label>
                  <p className="text-[10px] text-slate-400">
                    Pilih apakah ingin menampilkan seluruh draf format kosong atau sekadar meringkas kegiatan terpilih Anda.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, showOnlyActive: false })}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                      !settings.showOnlyActive
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'
                    }`}
                  >
                    Seluruh Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, showOnlyActive: true })}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                      settings.showOnlyActive
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : 'bg-white border-slate-200 text-slate-550 hover:bg-slate-50'
                    }`}
                  >
                    Ringkas Terpilih
                  </button>
                </div>
              </div>

              {/* Option 2: Column grids layout configuration for photo archives */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-dashed border-slate-100">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Jumlah Kolom Foto (Grid)</label>
                  <select
                    value={settings.gridCols}
                    onChange={(e) => setSettings({ ...settings, gridCols: parseInt(e.target.value) || 2 })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg focus:outline-none text-slate-700"
                  >
                    <option value={1}>1 Kolom per Halaman</option>
                    <option value={2}>2 Kolom per Halaman (Baku)</option>
                    <option value={3}>3 Kolom per Halaman</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Jumlah Baris Foto (Grid)</label>
                  <select
                    value={settings.gridRows}
                    onChange={(e) => setSettings({ ...settings, gridRows: parseInt(e.target.value) || 3 })}
                    className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg focus:outline-none text-slate-700"
                  >
                    <option value={1}>1 Baris (Maks 1-3 foto)</option>
                    <option value={2}>2 Baris (Maks 4 foto)</option>
                    <option value={3}>3 Baris (Maks 6 foto - Baku)</option>
                    <option value={4}>4 Baris (Maks 8 foto)</option>
                  </select>
                </div>
              </div>

              <div className="text-[10px] bg-slate-50 p-2.5 rounded-lg text-slate-500 leading-normal border border-slate-150">
                ⭐ Dengan susunan grid <strong>{settings.gridCols} kol x {settings.gridRows} baris</strong>, satu lembar kertas lampiran PDF Anda akan memuat maksimal <strong>{settings.gridCols * settings.gridRows} foto</strong> secara otomatis. Foto selebihnya akan disusun merata pada halaman lampiran berikutnya!
              </div>

            </div>
          </div>
        </section>

        {/* ======================================= */}
        {/* RIGHT WORKSPACE: LIVE RENDER PRINT PREVIEW */}
        {/* ======================================= */}
        <section className="xl:col-span-7 bg-slate-500 rounded-2xl relative border border-slate-600/35 overflow-y-auto max-h-[85vh] p-4 md:p-8 flex flex-col shadow-inner select-none print:bg-white print:p-0 print:border-none print:shadow-none print:max-h-none print:overflow-visible">
          
          {/* Virtual Sheet Top Anchor Ribbon Helper */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between no-print mb-4 bg-slate-900/40 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-white/10 text-white text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-sky-300">
              <Eye className="w-4 h-4 shrink-0 animate-pulse" />
              <span>Tampilan Cetak Pratinjau (WYSIWYG)</span>
            </div>
            <span className="text-[10px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-600/50">
              Ukuran Kertas: F4 Vertikal
            </span>
          </div>

          {/* Spacing spacer on web preview for ribbon overlay */}
          <div className="h-10 no-print shrink-0"></div>

          {/* Paper Rendering Sheet Grid Container */}
          <div className="flex-1 w-full flex flex-col items-center justify-start py-4">
            <ReportPreview
              profile={profile}
              activities={activities}
              settings={settings}
            />
          </div>
        </section>

      </main>

      {/* 3. Instruction modal popup guidance overlay */}
      <HelpGuide isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Float support credit footer element on design margins */}
      <footer className="py-4 text-center text-[10px] text-slate-400 no-print border-t border-slate-200 bg-white mt-auto">
        <p>&copy; 2026 Penyusun Laporan Harian Interaktif Kependidikan dwi-bahasa. Diproses instan secara lokal.</p>
      </footer>
    </div>
  );
}
