export interface TeacherProfile {
  namaGuru: string;
  nip: string;
  nipType?: 'NIP' | 'NUPTK';
  jabatan: string;
  namaSekolah: string;
  kelas: string;
  waliKelas: string;
  guruWali: string;
  mataPelajaran: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  jabatanKepalaSekolah: string;
  kotaTandaTangan: string;
  tanggal: string;
  bebanKerja?: string;
}

export interface ActivityItem {
  id: string;
  no: string;
  component: string;
  activityName: string;
  duration: number; // in hours
  timeRange?: string; // e.g. "6.45- 7.30"
  isActive: boolean;
  photos: string[]; // array of base64 data URLs
  photoCaptions: string[]; // custom captions for each photo
}

export interface PrintSettings {
  showOnlyActive: boolean;
  gridCols: number;
  gridRows: number;
  mergePhotos?: boolean;
}
