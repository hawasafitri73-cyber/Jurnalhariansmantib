import React from 'react';
import { TeacherProfile, ActivityItem, PrintSettings } from '../types';
import { Printer, AlertCircle } from 'lucide-react';

interface ReportPreviewProps {
  profile: TeacherProfile;
  activities: ActivityItem[];
  settings: PrintSettings;
}

export default function ReportPreview({ profile, activities, settings }: ReportPreviewProps) {
  const [sultraLogo, setSultraLogo] = React.useState('https://i.ibb.co.com/rfpjy3SH/Coat-of-arms-of-Southeast-Sulawesi-svg.png');
  const [smantibLogo, setSmantibLogo] = React.useState('https://i.ibb.co.com/Z6S51KLc/logo-smantib-fix.png');

  const activeActivities = activities.filter((act) => act.isActive);
  const totalHours = activeActivities.reduce((sum, act) => sum + act.duration, 0);

  // Format date to beautiful Indonesian format
  const formatTanggalIndonesian = (dateStr: string): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const hariArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const hari = hariArr[date.getDay()];
    return `${hari}, ${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getSignatureDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const bulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatDurationIndonesian = (dur: number): string => {
    if (dur === 0) return '-';
    const hours = Math.floor(dur);
    const minutes = Math.round((dur - hours) * 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours} Jam ${minutes} Menit`;
    } else if (hours === 0 && minutes > 0) {
      return `${minutes} Menit`;
    } else {
      return `${hours} Jam`;
    }
  };

  // Track orientations for dynamic aspect ratios (portrait vs landscape)
  const [photoOrientations, setPhotoOrientations] = React.useState<Record<string, 'portrait' | 'landscape'>>({});

  const handleImageLoad = (url: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const isPortrait = img.naturalHeight > img.naturalWidth;
      const orientation = isPortrait ? 'portrait' : 'landscape';
      if (photoOrientations[url] !== orientation) {
        setPhotoOrientations(prev => {
          if (prev[url] === orientation) return prev;
          return { ...prev, [url]: orientation };
        });
      }
    }
  };

  // Compile all uploaded photos across active activities
  interface PhotoDoc {
    photoUrl: string;
    caption: string;
    activityNo: string;
    activityName: string;
  }

  const allPhotos: PhotoDoc[] = [];
  activeActivities.forEach((act) => {
    act.photos.forEach((photoUrl, pIdx) => {
      allPhotos.push({
        photoUrl,
        caption: act.photoCaptions[pIdx] || `Foto ${pIdx + 1}: Kegiatan ${act.activityName}`,
        activityNo: act.no,
        activityName: act.activityName,
      });
    });
  });

  // Sort photos: group landscapes together and portraits together (landscape first, portrait after)
  const sortedPhotos = [...allPhotos].sort((a, b) => {
    const orientA = photoOrientations[a.photoUrl] || 'landscape';
    const orientB = photoOrientations[b.photoUrl] || 'landscape';
    if (orientA === orientB) return 0;
    return orientA === 'landscape' ? -1 : 1;
  });

  // Calculate pages of photos based on grid parameters (e.g. 2 cols x 3 rows = 6 photos max per page)
  const photosPerPage = settings.gridCols * settings.gridRows;
  const photoPages: PhotoDoc[][] = [];
  for (let i = 0; i < sortedPhotos.length; i += photosPerPage) {
    photoPages.push(sortedPhotos.slice(i, i + photosPerPage));
  }

  const handlePrint = () => {
    window.print();
  };

  // Decide which activities to display in the main report table
  const activitiesToDisplay = settings.showOnlyActive ? activeActivities : activities;

  return (
    <div className="space-y-6">
      {/* Dynamic Action Print Trigger Bar */}
      <div className="bg-sky-900 text-white rounded-xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 no-print border border-sky-950">
        <div className="flex gap-3 items-center">
          <div className="bg-sky-800 p-2 rounded-lg">
            <Printer className="w-5 h-5 text-sky-100" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white">Laporan Siap Dicetak!</h3>
            <p className="text-[11px] text-sky-200 mt-0.5">
              Tekan cetak untuk menyimpan hasil laporan guru beserta lampiran foto ke file PDF.
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto bg-white hover:bg-slate-50 text-sky-950 font-bold px-6 py-2.5 rounded-lg text-xs tracking-wide shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 border border-sky-300"
        >
          <Printer className="w-4 h-4 shrink-0" />
          <span>CETAK KE PDF / PRINT</span>
        </button>
      </div>

      {/* Helpful Instruction Tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 no-print flex gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold mb-1">💡 Tips Penting Cetak PDF agar Rapih:</h4>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
            <li>Di jendela cetak browser Anda, pilih Tujuan / Printer: <strong>Simpan sebagai PDF (Save as PDF)</strong>.</li>
            <li>Buka menu "Pengaturan Lebih Lanjut" / "More Settings" di samping.</li>
            <li>Pastikan centang opsi <strong>"Grafik Latar Belakang" (Background Graphics)</strong> agar warna tabel & layout muncul.</li>
            <li><em>Otomatis Bersih:</em> Tanggal, jam akses, dan alamat link website di bagian atas-bawah kertas sudah <strong>disembunyikan secara otomatis</strong> oleh sistem kustomizer ini.</li>
          </ol>
        </div>
      </div>

      {/* RENDER PAGES LIST (Live on Web, Page Break on Print) */}
      <div className="print-area space-y-8 print:space-y-0">
        
        {/* ======================================= */}
        {/* HALAMAN 1: LEMBAR LAPORAN UTAMA        */}
        {/* ======================================= */}
        <div id="school-daily-report-main-page" className="paper-page bg-white relative text-[12px] text-slate-800 animate-fade-in print:m-0 print:border-none print:shadow-none">
          
          {/* Header Lembaga / KOP Surat Resmi SMA NEGERI 03 BOMBANA */}
          <div className="flex items-center justify-between pb-2 border-b-4 border-double border-slate-950 gap-4 mb-3">
            {/* Left Image: Logo Provinsi Sultra */}
            <div className="w-[104px] shrink-0 text-left flex items-center justify-start">
              <img
                src={sultraLogo}
                onError={() => setSultraLogo('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Coats_of_arms_of_Southeast_Sulawesi.svg/512px-Coats_of_arms_of_Southeast_Sulawesi.svg.png')}
                alt="Logo Provinsi Sulawesi Tenggara"
                referrerPolicy="no-referrer"
                className="w-24 h-28 object-contain"
              />
            </div>

            {/* Middle Section: Kop Text */}
            <div className="flex-1 text-center text-slate-900 leading-tight">
              <h4 className="text-[13px] font-bold tracking-wide uppercase select-none leading-none">
                PEMERINTAH PROVINSI SULAWESI TENGGARA
              </h4>
              <h4 className="text-[12px] font-bold tracking-wider uppercase select-none leading-none mt-1">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h4>
              <h2 className="text-[18px] font-extrabold tracking-neutral uppercase select-all leading-none mt-1.5 mb-1 text-slate-950">
                SMA NEGERI 03 BOMBANA
              </h2>
              <p className="text-[10px] font-normal leading-tight italic text-slate-600 select-all">
                Jalan Tina Orima No. 4  Kabupaten Bombana, Sulawesi Tenggara 93771
              </p>
              <p className="text-[9px] font-normal leading-tight text-slate-600 select-all mt-0.5">
                Telepon (0401) 3087433, Website: <span className="underline text-sky-900">https://www.sman03bombana.sch.id/</span>
              </p>
            </div>

            {/* Right Image: Logo SMANTIB */}
            <div className="w-[104px] shrink-0 text-right flex items-center justify-end">
              <img
                src={smantibLogo}
                onError={() => setSmantibLogo('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Logo_of_the_Ministry_of_Education_and_Culture_of_the_Republic_of_Indonesia.svg/512px-Logo_of_the_Ministry_of_Education_and_Culture_of_the_Republic_of_Indonesia.svg.png')}
                alt="Logo SMAN 03 Bombana"
                referrerPolicy="no-referrer"
                className="w-24 h-28 object-contain"
              />
            </div>
          </div>

          {/* Title of Document below Kop and double line */}
          <div className="text-center space-y-0.5 my-2">
            <h3 className="text-[14px] font-bold text-slate-950 uppercase tracking-widest leading-none underline select-none">
              LAPORAN KINERJA HARIAN GURU (LKH)
            </h3>
            <p className="text-[9.5px] text-slate-600 font-medium tracking-wide">
              Berdasarkan Permendikdasmen RI No. 11 Tahun 2025 tentang Pemenuhan Beban Kerja Guru &middot; BK Terintegrasi
            </p>
          </div>

          {/* Profil Identitas Tabel */}
          <div className="my-2.5 grid grid-cols-2 gap-x-8 gap-y-1 pb-2 border-b border-dashed border-slate-200">
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Nama Guru</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="font-bold text-slate-900 select-all">{profile.namaGuru || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">{profile.nipType || 'NIP'}</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="text-slate-800 select-all">{profile.nip || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Pangkat / Gol.</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="text-slate-700">{profile.jabatan || '-'}</span>
              </div>
              {profile.waliKelas && (
                <div className="flex">
                  <span className="w-28 text-slate-500 font-medium">Wali Kelas</span>
                  <span className="w-3 text-slate-400">:</span>
                  <span className="text-slate-900 font-semibold select-all">{profile.waliKelas}</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Hari / Tanggal</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="font-bold text-slate-900">
                  {formatTanggalIndonesian(profile.tanggal)}
                </span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Mata Pelajaran</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="text-slate-700">{profile.mataPelajaran || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-medium">Beban Kerja</span>
                <span className="w-3 text-slate-400">:</span>
                <span className="text-slate-700 select-all font-medium">{profile.bebanKerja || '-'}</span>
              </div>
              {profile.guruWali && (
                <div className="flex">
                  <span className="w-28 text-slate-500 font-medium">Guru Wali</span>
                  <span className="w-3 text-slate-400">:</span>
                  <span className="text-slate-900 font-semibold select-all">{profile.guruWali}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabel Utama Penilaian Kegiatan Harian */}
          <div className="overflow-x-auto my-3">
            <table className="w-full border-collapse border border-slate-400 leading-normal text-[12px]">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-extrabold uppercase tracking-wide border-b border-slate-400 text-center">
                  <th className="border border-slate-400 py-1.5 px-2 w-[4%] text-center">
                    NO
                  </th>
                  <th className="border border-slate-400 py-1.5 px-2 w-[22%] text-left">
                    KOMPONEN PENILAIAN
                  </th>
                  <th className="border border-slate-400 py-1.5 px-2 w-[48%] text-left">
                    URAIAN KEGIATAN HARIAN
                  </th>
                  <th className="border border-slate-400 py-1.5 px-2 w-[12%] text-center">
                    AKUMULASI JAM
                  </th>
                  <th className="border border-slate-400 py-1.5 px-2 w-[14%] text-center">
                    BUKTI FISIK / DOKUMENTASI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-400">
                {activitiesToDisplay.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                      Tidak ada kegiatan yang dicentang hari ini. Silakan centang kegiatan dari panel kontrol kiri terlebih dahulu!
                    </td>
                  </tr>
                ) : (
                  activitiesToDisplay.map((act, index) => {
                    const rowIsActive = act.isActive;
                    const displayNo = settings.showOnlyActive ? (index + 1) : act.no;

                    return (
                      <tr
                        key={act.id}
                        className={`border-b border-slate-400 ${
                          rowIsActive && settings.showOnlyActive
                            ? 'bg-white'
                            : rowIsActive
                            ? 'bg-slate-50/70 font-semibold'
                            : 'bg-white text-slate-400'
                        }`}
                      >
                        {/* NO */}
                        <td className="border border-slate-400 py-1.5 px-1 text-center font-bold">
                          {displayNo}
                        </td>
                        {/* KOMPONEN PENILAIAN */}
                        <td className="border border-slate-400 py-1.5 px-2 text-left font-medium leading-relaxed">
                          {act.component}
                        </td>
                        {/* URAIAN KEGIATAN */}
                        <td className="border border-slate-400 py-1.5 px-2.5 text-left leading-relaxed">
                          {act.activityName}
                        </td>
                        {/* DURASI WAKTU / AKUMULASI JAM */}
                        <td className="border border-slate-400 py-1.5 px-1.5 text-center font-bold text-slate-900 whitespace-nowrap">
                          {rowIsActive ? formatDurationIndonesian(act.duration) : '-'}
                        </td>
                        {/* DOKUMENTASI / BUKTI FISIK */}
                        <td className="border border-slate-400 py-1.5 px-1.5 text-center text-slate-800 font-semibold">
                          {rowIsActive ? (
                            <span className="text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 print:bg-transparent print:border-none print:p-0">
                              Terlampir
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
                
                {/* Total Durasi Row */}
                <tr className="bg-slate-50 font-bold border-t border-slate-400">
                  <td colSpan={3} className="border border-slate-400 py-1.5 px-3 text-right text-slate-900 uppercase tracking-wide">
                    TOTAL AKUMULASI JAM KINERJA
                  </td>
                  <td className="border border-slate-400 py-1.5 px-1.5 text-center text-sky-850 text-xs font-black">
                    {totalHours} Jam
                  </td>
                  <td className="border border-slate-400 py-1.5 px-1.5 text-center bg-slate-100">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legal Compliance Footnote based on Permendikdasmen No. 11/2025 */}
          <div className="mt-3.5 px-3 py-2 bg-slate-50/75 border border-slate-300 rounded-lg text-[9.5px] text-slate-600 leading-normal mb-3 print:bg-slate-50/20">
            <span className="font-extrabold text-slate-800 uppercase tracking-wider block mb-1 text-[8.5px]">
              Landasan & Rincian Hukum Kinerja Guru (Permendikdasmen No. 11/2025):
            </span>
            <span>
              Format LKH Mandiri ini sepenuhnya disusun dan dinilai absah merujuk pada regulasi resmi <strong>Peraturan Menteri Pendidikan Dasar dan Menengah RI Nomor 11 Tahun 2025 tentang Pemenuhan Beban Kerja Guru</strong>, dengan ketentuan utama:
            </span>
            <ul className="list-disc list-inside mt-1 space-y-0.5 pl-1 italic font-medium">
              <li><strong>Pasal 2 & 3 (Beban Kerja Baku):</strong> Akumulasi jam kerja wajib guru sebesar 37 Jam 30 Menit dalam 1 minggu (di luar jam istirahat) yang terbagi utuh ke dalam 5 kegiatan pokok terintegrasi termasuk Bimbingan Konseling (BK).</li>
              <li><strong>Pasal 9 & 14 (Tugas Guru Wali):</strong> Pelaksanaan pendampingan, karakter, soft skills orisinal, dan rekam jejak psikososial murid oleh Guru Wali akademik dinilai setara / diekuivalensikan dengan <strong>2 Jam Tatap Muka per minggu</strong>.</li>
              <li><strong>Pasal 10, 11 & 16 (Tugas Tambahan Lain):</strong> Ekuivalensi tugas seperti Wali Kelas (2 jam), Pembina OSIS (2 jam), Pembina Ekstrakurikuler (2 jam), Guru Piket (1 jam), TPPK (2 jam), dan Koordinator Projek P5 (2 jam per Rombel) diakumulasikan resmi maksimal hingga <strong>6 Jam Tatap Muka per minggu</strong>.</li>
            </ul>
          </div>

          {/* Penandatanganan / Signatures Section */}
          <table className="w-full mt-4 text-[12px] text-slate-900 border-none print:w-full select-none signature-section" style={{ borderCollapse: 'collapse', border: 'none', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <tbody>
              <tr style={{ border: 'none' }}>
                <td className="w-1/2 text-left pl-4 pb-8 align-top" style={{ border: 'none', paddingBottom: '38px' }}>
                  <div className="space-y-1">
                    <p className="text-[11px] text-transparent select-none">
                      &nbsp;
                    </p>
                    <p className="font-bold text-slate-900">
                      {(() => {
                        if (profile.waliKelas && profile.guruWali) {
                          return `Wali Kelas ${profile.waliKelas} / Guru Wali ${profile.guruWali}`;
                        }
                        if (profile.waliKelas) {
                          return `Wali Kelas ${profile.waliKelas}`;
                        }
                        if (profile.guruWali) {
                          return `Guru Wali ${profile.guruWali}`;
                        }
                        return 'Guru Mata Pelajaran';
                      })()}
                    </p>
                  </div>
                </td>
                <td className="w-1/2 text-left pl-4 pb-8 align-top" style={{ border: 'none', paddingBottom: '38px' }}>
                  <div className="space-y-1">
                    <p className="text-[11.5px] text-slate-650 font-bold">
                      {profile.kotaTandaTangan || 'Rumbia'}, {getSignatureDate(profile.tanggal)}
                    </p>
                    <p className="font-bold text-slate-900">
                      Mengetahui,<br />
                      Kepala {profile.namaSekolah || 'Sekolah'}
                    </p>
                  </div>
                </td>
              </tr>
              <tr style={{ border: 'none' }}>
                <td className="w-1/2 text-left pl-4 align-top" style={{ border: 'none' }}>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-950 underline">
                      {profile.namaGuru || '-'}
                    </p>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      {profile.nipType || 'NIP'}. {profile.nip || '-'}
                    </p>
                  </div>
                </td>
                <td className="w-1/2 text-left pl-4 align-top" style={{ border: 'none' }}>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-955 underline">
                      {profile.namaKepalaSekolah || '-'}
                    </p>
                    {profile.jabatanKepalaSekolah && (
                      <p className="text-[11px] text-slate-600 leading-normal font-medium">
                        {profile.jabatanKepalaSekolah}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-600 leading-normal">
                      NIP. {profile.nipKepalaSekolah || '-'}
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </div>

        {/* ======================================= */}
        {/* HALAMAN 2+: LAMPIRAN DOKUMENTASI FOTO   */}
        {/* ======================================= */}
        {photoPages.length === 0 ? (
          /* Empty / fallback preview page when no pictures yet */
          <div className="paper-page bg-white relative text-[12px] text-slate-800 flex flex-col justify-between p-15 no-print animate-fade-in">
            <div>
              {/* Header */}
              <div className="border-b border-slate-350 pb-2.5 text-slate-950 text-center uppercase font-bold tracking-wide">
                <h3 className="text-[13px]">LAMPIRAN DOKUMENTASI KEGIATAN HARIAN GURU</h3>
                <p className="text-[11px] font-medium text-slate-500 mt-1">
                  Tanggal: {formatTanggalIndonesian(profile.tanggal)} &middot; Guru: {profile.namaGuru}
                </p>
              </div>
              
              <div className="mt-28 flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-slate-400">
                <p className="text-sm font-bold">Belum Ada Lampiran Foto</p>
                <p className="text-xs max-w-sm mt-1.5 leading-relaxed">
                  Centang beberapa kegiatan di sebelah kiri dan unggah foto bukti kegiatan (maksimal 3 foto per kegiatan) 
                  untuk memunculkan lembar lampiran halaman foto secara otomatis di sini.
                </p>
              </div>
            </div>
          </div>
        ) : (
          photoPages.map((pagePhotos, pageIdx) => {
            const gridColsClass = settings.gridCols === 1
              ? 'grid-cols-1'
              : settings.gridCols === 2
              ? 'grid-cols-2'
              : 'grid-cols-3';

            return (
              <div
                key={pageIdx}
                className="paper-page bg-white relative text-[12px] text-slate-800 flex flex-col justify-between animate-fade-in print:m-0 print:border-none print:shadow-none"
              >
                {/* Main page content container */}
                <div className="space-y-6">
                  {/* Page header */}
                  <div className="border-b-2 border-slate-900 pb-3 text-slate-950 text-center uppercase font-black tracking-wide">
                    <h3 className="text-[13px]">LAMPIRAN DOKUMENTASI KEGIATAN HARIAN GURU</h3>
                    <p className="text-[11px] font-bold text-slate-600 mt-1 select-all">
                      Hari/Tanggal: {formatTanggalIndonesian(profile.tanggal)} &nbsp;|&nbsp; Guru: {profile.namaGuru} &nbsp;|&nbsp; {profile.namaSekolah}
                    </p>
                  </div>

                  {/* Responsive grid of pictures */}
                  <div className={`grid ${gridColsClass} gap-y-7 gap-x-5 my-2`}>
                    {pagePhotos.map((photoDoc, pIdx) => {
                      return (
                        <div
                          key={pIdx}
                          className="grid-item flex flex-col items-center border border-slate-300 rounded p-2.5 bg-slate-50/50 break-inside-avoid print:break-inside-avoid"
                        >
                          {/* Picture Box */}
                          <div className="h-44 w-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 rounded">
                            <img
                              src={photoDoc.photoUrl}
                              alt="Dokumentasi guru"
                              onLoad={(e) => handleImageLoad(photoDoc.photoUrl, e)}
                              referrerPolicy="no-referrer"
                              className={`max-h-full max-w-full select-none ${
                                photoOrientations[photoDoc.photoUrl] === 'portrait'
                                  ? 'h-full w-auto object-contain'
                                  : 'h-full w-full object-cover'
                              }`}
                            />
                          </div>

                          {/* Captions */}
                          <div className="w-full text-left mt-2 px-1">
                            <p className="text-[10.5px] text-slate-700 italic leading-snug whitespace-normal break-words font-semibold">
                              Ref Kegiatan No: {photoDoc.activityNo} - {photoDoc.activityName}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}

      </div>
    </div>
  );
}
