import React, { useState } from 'react';
import { ActivityItem } from '../types';
import { Plus, Trash, RotateCcw, AlertCircle, Edit, Save, X } from 'lucide-react';

interface ActivityCustomizerProps {
  activities: ActivityItem[];
  onChange: (activities: ActivityItem[]) => void;
  onReset: () => void;
  onLoadKepalaSekolah?: () => void;
  showCustomAlert?: (title: string, message: string) => void;
  showCustomConfirm?: (title: string, message: string, onConfirm: () => void) => void;
}

export default function ActivityCustomizer({
  activities,
  onChange,
  onReset,
  onLoadKepalaSekolah,
  showCustomAlert,
  showCustomConfirm
}: ActivityCustomizerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // States for adding a new activity
  const [isAdding, setIsAdding] = useState(false);
  const [newComponentName, setNewComponentName] = useState('1. Merencanakan Pembelajaran atau Pembimbingan');
  const [newActivityName, setNewActivityName] = useState('');

  // Check if current activities looks like Kepala Sekolah activities
  const isCurrentlyKepalaSekolah = activities.some(act => act.id.startsWith('ks'));

  const handleStartEdit = (item: ActivityItem) => {
    setEditingId(item.id);
    setEditName(item.activityName);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) {
      if (showCustomAlert) {
        showCustomAlert('Format Pengisian Salah', 'Nama rincian kegiatan tidak boleh dikosongkan!');
      } else {
        alert('Nama kegiatan tidak boleh kosong!');
      }
      return;
    }
    const updated = activities.map((act) => {
      if (act.id === id) {
        return {
          ...act,
          activityName: editName.trim(),
        };
      }
      return act;
    });
    onChange(updated);
    setEditingId(null);
  };

  const handleDeleteItem = (id: string) => {
    const doDelete = () => {
      const updated = activities.filter((act) => act.id !== id);
      // Re-index output codes (No) dynamically to keep it clean and sequential (e.g. 1, 2, 3...)
      const reindexed = updated.map((act, index) => {
        return {
          ...act,
          no: (index + 1).toString(),
        };
      });
      onChange(reindexed);
    };

    if (showCustomConfirm) {
      showCustomConfirm(
        'Hapus Kegiatan',
        'Apakah Anda yakin ingin menghapus kegiatan ini dari daftar rancangan laporan Anda?',
        doDelete
      );
    } else {
      if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini dari daftar default Anda?')) {
        doDelete();
      }
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityName.trim()) {
      if (showCustomAlert) {
        showCustomAlert('Wajib Diisi', 'Nama rincian kegiatan baru harus diisi terlebih dahulu!');
      } else {
        alert('Nama kegiatan baru harus diisi!');
      }
      return;
    }

    // Determine the next index
    const nextIndex = (activities.length + 1).toString();
    const newId = `custom_activity_${Date.now()}`;

    const newActivity: ActivityItem = {
      id: newId,
      no: nextIndex,
      component: newComponentName,
      activityName: newActivityName.trim(),
      duration: 0,
      isActive: false,
      photos: [],
      photoCaptions: [],
    };

    onChange([...activities, newActivity]);
    setNewActivityName('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <Edit className="w-5 h-5 text-sky-600" />
          <h2 className="font-semibold text-slate-800 text-sm">Sesuaikan Daftar Kegiatan Baku</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Baru</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            title="Kembalikan semua daftar kegiatan sesuai template bawaan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
        </div>
      </div>

      {/* Template Preset Selector Quick Bar */}
      <div className="bg-slate-100/50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-750">Pilih Template Peran Pengguna:</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isCurrentlyKepalaSekolah ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'}`}>
            {isCurrentlyKepalaSekolah ? 'Template Kepala Sekolah Aktif' : 'Template Guru Umum Aktif'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onReset}
            className={`px-3 py-2 rounded-lg font-extrabold text-center border cursor-pointer transition-all ${
              !isCurrentlyKepalaSekolah
                ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            1. Guru Umum / Mapel (Permen 11/2025)
          </button>
          
          {onLoadKepalaSekolah && (
            <button
              type="button"
              onClick={onLoadKepalaSekolah}
              className={`px-3 py-2 rounded-lg font-extrabold text-center border cursor-pointer transition-all ${
                isCurrentlyKepalaSekolah
                  ? 'bg-sky-600 border-sky-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              2. Kepala Sekolah (Manejerial & Supervisi)
            </button>
          )}
        </div>
      </div>

      {/* Add new activity form drawer */}
      {isAdding && (
        <form onSubmit={handleAddActivity} className="p-4 border border-sky-100 rounded-xl bg-sky-50/20 space-y-3.5 animate-fade-in text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-xs">Tambah Kegiatan Kustom</h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Masukkan Ke Komponen Penilaian:
            </label>
            <select
              value={newComponentName}
              onChange={(e) => setNewComponentName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-sky-500 text-slate-700 font-medium"
            >
              <option value="1. Merencanakan Pembelajaran atau Pembimbingan">1. Merencanakan Pembelajaran atau Pembimbingan</option>
              <option value="2. Melaksanakan Pembelajaran atau Pembimbingan">2. Melaksanakan Pembelajaran atau Pembimbingan</option>
              <option value="3. Menilai Hasil Pembelajaran atau Pembimbingan">3. Menilai Hasil Pembelajaran atau Pembimbingan</option>
              <option value="4. Membimbing dan Melatih Murid">4. Membimbing dan Melatih Murid</option>
              <option value="5. Melaksanakan Tugas Tambahan">5. Melaksanakan Tugas Tambahan</option>
              <option value="6. Kehadiran ASN Guru">6. Kehadiran ASN Guru</option>
              <option value="7. Pelaksanaan Tugas BK">7. Pelaksanaan Tugas BK</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Uraian Kegiatan Guru:
            </label>
            <textarea
              value={newActivityName}
              onChange={(e) => setNewActivityName(e.target.value)}
              placeholder="Tulis uraian kegiatan guru secara lengkap di sini. Contoh: Melaksanakan pengawasan Ujian Satuan Pendidikan (USP) sekolah..."
              className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:border-sky-500 text-slate-700 min-h-[60px]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg"
            >
              Simpan Kegiatan
            </button>
          </div>
        </form>
      )}

      {/* Editable rows list */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {activities.map((act) => {
          const isEditing = editingId === act.id;

          return (
            <div
              key={act.id}
              className={`flex items-start justify-between gap-3 p-3 rounded-lg border text-xs ${
                isEditing
                  ? 'border-sky-500 bg-sky-50/10'
                  : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    No. {act.no}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">
                    {act.component}
                  </span>
                </div>

                {isEditing ? (
                  <textarea
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 border border-sky-200 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium text-slate-700 bg-white min-h-[50px]"
                  />
                ) : (
                  <p className="text-slate-600 font-medium">
                    {act.activityName}
                  </p>
                )}
              </div>

              {/* Actions panel */}
              <div className="flex items-center gap-1.5 shrink-0 pt-1">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(act.id)}
                      className="bg-sky-50 hover:bg-sky-100 text-sky-700 p-1.5 rounded"
                      title="Simpan"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1.5 rounded"
                      title="Batal"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(act)}
                      className="text-slate-500 hover:text-sky-600 hover:bg-slate-100 p-1.5 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(act.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                      title="Hapus"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-250 rounded-xl p-3 flex gap-2 text-[11px] text-amber-800">
        <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
        <p className="leading-normal">
          <strong>Perhatian:</strong> Perubahan daftar kegiatan ini disimpan di peramban (browser) Anda. 
          Gunakan tombol <strong>Reset Default</strong> untuk memulihkan tabel seperti sediakala bila ada kekeliruan.
        </p>
      </div>
    </div>
  );
}
