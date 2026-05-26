import React, { useState } from 'react';
import { ActivityItem } from '../types';
import { Clock, Check, Camera, Upload, Trash2, X } from 'lucide-react';

interface ActivitySelectorProps {
  activities: ActivityItem[];
  onChange: (activities: ActivityItem[]) => void;
}

export default function ActivitySelector({ activities, onChange }: ActivitySelectorProps) {
  
  // High performance compression using HTML Canvas
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const max_width = 1200;
          const max_height = 900;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > max_width) {
              height = Math.round((height * max_width) / width);
              width = max_width;
            }
          } else {
            if (height > max_height) {
              width = Math.round((width * max_height) / height);
              height = max_height;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Downscaling quality to 0.65 for outstanding disk/base64 space compression with good print clarity
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleToggleActive = (id: string) => {
    const updated = activities.map((act) => {
      if (act.id === id) {
        const nextState = !act.isActive;
        return {
          ...act,
          isActive: nextState,
          duration: nextState ? (act.duration || 1) : 0, // Default to 1 hour if checked
          photos: nextState ? act.photos : [], // Discard photos if unchecked
          photoCaptions: nextState ? act.photoCaptions : [],
        };
      }
      return act;
    });
    onChange(updated);
  };

  const handleDurationChange = (id: string, value: number) => {
    const updated = activities.map((act) => {
      if (act.id === id) {
        return {
          ...act,
          duration: Number(value),
        };
      }
      return act;
    });
    onChange(updated);
  };

  const handlePhotoUpload = async (id: string, files: FileList | null) => {
    if (!files) return;
    const act = activities.find((a) => a.id === id);
    if (!act) return;

    const remainingSlots = 10 - act.photos.length;
    if (remainingSlots <= 0) {
      alert('Batas maksimal unggah foto untuk setiap kegiatan adalah 10 foto!');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const newPhotos: string[] = [];
    const newCaptions: string[] = [];

    for (const file of filesToUpload) {
      try {
        const base64 = await compressImage(file);
        newPhotos.push(base64);
        // Default caption index reference
        const photoNum = act.photos.length + newPhotos.length;
        newCaptions.push(`Foto ${photoNum}: Dokumentasi ${act.activityName.substring(0, 35)}...`);
      } catch (err: any) {
        alert(err.message || 'Gagal memproses gambar');
      }
    }

    const updated = activities.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          photos: [...a.photos, ...newPhotos],
          photoCaptions: [...a.photoCaptions, ...newCaptions],
        };
      }
      return a;
    });
    onChange(updated);
  };

  const handleRemovePhoto = (id: string, photoIdx: number) => {
    const updated = activities.map((act) => {
      if (act.id === id) {
        const newPhotos = [...act.photos];
        const newCaptions = [...act.photoCaptions];
        newPhotos.splice(photoIdx, 1);
        newCaptions.splice(photoIdx, 1);
        
        // Relabel photo numbers in captions to keep them sequential
        const refitCaptions = newCaptions.map((cap, idx) => {
          if (cap.startsWith('Foto ')) {
            return `Foto ${idx + 1}:${cap.substring(cap.indexOf(':') + 1)}`;
          }
          return cap;
        });

        return {
          ...act,
          photos: newPhotos,
          photoCaptions: refitCaptions,
        };
      }
      return act;
    });
    onChange(updated);
  };

  const handleCaptionChange = (id: string, photoIdx: number, newCap: string) => {
    const updated = activities.map((act) => {
      if (act.id === id) {
        const nextCaptions = [...act.photoCaptions];
        nextCaptions[photoIdx] = newCap;
        return {
          ...act,
          photoCaptions: nextCaptions,
        };
      }
      return act;
    });
    onChange(updated);
  };

  // Group activities by component
  const componentsList = Array.from(new Set(activities.map((a) => a.component)));

  // Global counts for easy tracking
  const totalHours = activities.reduce((sum, a) => sum + (a.isActive ? a.duration : 0), 0);
  const totalSelected = activities.filter((a) => a.isActive).length;

  return (
    <div className="space-y-4">
      {/* Overview stats badge */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex justify-between items-center text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-sky-500 rounded-full animate-pulse"></span>
          <span>Kegiatan hari ini:</span>
          <span className="font-bold text-slate-800 bg-sky-50 text-sky-700 px-2 py-0.5 rounded">
            {totalSelected} Kegiatan
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Total Akumulasi Jam:</span>
          <span className="font-bold text-slate-800 bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
            {totalHours} Jam
          </span>
        </div>
      </div>

      {/* Accordion / Tab structure for components */}
      <div className="space-y-4">
        {componentsList.map((comp, compIdx) => {
          const compActivities = activities.filter((a) => a.component === comp);
          const activeInComp = compActivities.filter((a) => a.isActive).length;

          return (
            <div key={compIdx} className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase">
                    KOMPONEN KEGIATAN {compIdx + 1}
                  </span>
                  <h3 className="font-semibold text-xs text-slate-700 font-display">
                    {comp}
                  </h3>
                </div>
                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold shrink-0">
                  {activeInComp} / {compActivities.length} Terpilih
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {compActivities.map((act) => {
                  return (
                    <div
                      key={act.id}
                      className={`p-4 transition-all duration-200 ${
                        act.isActive ? 'bg-sky-50/30' : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleActive(act.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                            act.isActive
                              ? 'bg-sky-100 border-sky-400 text-sky-700 shadow-xs'
                              : 'bg-white border-slate-300 text-transparent hover:border-sky-400'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        <div className="flex-1 min-w-0">
                          {/* Label info */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              No. {act.no}
                            </span>
                            {act.isActive && (
                              <span className="text-[10px] bg-sky-50 text-sky-700 px-2 rounded font-semibold flex items-center gap-1 animate-pulse border border-sky-100">
                                Aktif Hari Ini
                              </span>
                            )}
                          </div>
                          <p onClick={() => handleToggleActive(act.id)} className="text-xs font-semibold text-slate-700 leading-relaxed cursor-pointer hover:text-sky-700">
                            {act.activityName}
                          </p>

                          {/* Extended Section for Active activities */}
                          {act.isActive && (
                            <div className="mt-3.5 pt-3 border-t border-slate-150 space-y-4 animate-fade-in text-xs">
                              {/* Duration Input */}
                              <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                                {/* Akumulasi Jam Counter */}
                                <div className="space-y-1">
                                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                                    Akumulasi Jam Kerja (Jam Kinerja)
                                  </span>
                                  <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-3xs shrink-0 h-8">
                                      <button
                                        type="button"
                                        onClick={() => handleDurationChange(act.id, Math.max(0, act.duration - 0.25))}
                                        className="px-2.5 h-full text-slate-505 hover:bg-slate-50 font-bold border-r border-slate-200 cursor-pointer flex items-center justify-center text-sm"
                                        title="Kurangi 0,25 Jam"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        value={act.duration}
                                        step="0.25"
                                        min="0"
                                        onChange={(e) => handleDurationChange(act.id, parseFloat(e.target.value) || 0)}
                                        className="w-12 h-full text-center text-xs font-bold text-slate-700 bg-transparent focus:outline-none focus:ring-0 select-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        placeholder="0"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleDurationChange(act.id, act.duration + 0.25)}
                                        className="px-2.5 h-full text-slate-505 hover:bg-slate-50 font-bold border-l border-slate-200 cursor-pointer flex items-center justify-center text-sm"
                                        title="Tambah 0,25 Jam"
                                      >
                                        +
                                      </button>
                                    </div>
                                    
                                    <span className="text-[11px] font-bold text-sky-850 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                                      {(() => {
                                        const h = Math.floor(act.duration);
                                        const m = Math.round((act.duration - h) * 60);
                                        if (h === 0 && m > 0) return `${m} Menit`;
                                        if (h > 0 && m > 0) return `${h} Jam ${m} Menit`;
                                        return `${h} Jam`;
                                      })()}
                                    </span>

                                    <div className="flex flex-wrap items-center gap-1">
                                      {[0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6].map((hrs) => (
                                        <button
                                          key={hrs}
                                          type="button"
                                          onClick={() => handleDurationChange(act.id, hrs)}
                                          className={`px-2 py-1 rounded text-[9.5px] font-bold border transition-all cursor-pointer ${
                                            act.duration === hrs
                                              ? 'bg-sky-600 text-white border-sky-600 shadow-3xs'
                                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-950'
                                          }`}
                                        >
                                          {hrs === 0.25 ? '15m' : hrs === 0.5 ? '30m' : hrs === 0.75 ? '45m' : `${hrs} J`}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Photo Uploader Section */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                    <Camera className="w-3.5 h-3.5 text-slate-400" />
                                    Unggah Foto Bukti Fisik / Dokumentasi (Maks 10):
                                  </label>
                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    {act.photos.length} / 10 Terunggah
                                  </span>
                                </div>

                                {/* Upload drop container */}
                                {act.photos.length < 10 && (
                                  <div className="border border-dashed border-slate-200 rounded-lg hover:border-sky-500 bg-white hover:bg-sky-50/10 transition-colors p-3.5 text-center cursor-pointer relative group">
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      onChange={(e) => handlePhotoUpload(act.id, e.target.files)}
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    <div className="flex flex-col items-center gap-1.5">
                                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                                      <p className="text-xs text-slate-500 font-medium group-hover:text-sky-700">
                                        Seret foto ke sini atau <span className="text-sky-600 font-bold underline">pilih dari gawai Anda</span>
                                      </p>
                                      <p className="text-[10px] text-slate-400">
                                        PNG, JPG, JPEG (Kompresi otomatis cerdas)
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Thumbnail previews and Caption Inputs */}
                                {act.photos.length > 0 && (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
                                    {act.photos.map((photo, pIdx) => {
                                      return (
                                        <div
                                          key={pIdx}
                                          className="flex flex-col border border-slate-200 bg-slate-50 rounded-lg overflow-hidden relative group shadow-2xs"
                                        >
                                          {/* Delete overlay */}
                                          <button
                                            type="button"
                                            onClick={() => handleRemovePhoto(act.id, pIdx)}
                                            className="absolute top-1 right-1 bg-red-600/95 hover:bg-red-700 text-white rounded-full p-1 opacity-90 group-hover:opacity-100 transition-opacity shadow-xs z-10"
                                            title="Hapus foto"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>

                                          {/* Embedded compressed image */}
                                          <div className="h-28 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
                                            <img
                                              src={photo}
                                              alt={`Bukti ${pIdx + 1}`}
                                              referrerPolicy="no-referrer"
                                              className="h-full w-full object-cover"
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
