# Spesifikasi CV/Resume ATS-Friendly untuk ResumeMaker

Dokumen ini merangkum hasil riset format resume yang relatif aman untuk **Applicant Tracking System (ATS)** sekaligus tetap mudah dibaca recruiter. Ini adalah acuan produk dan implementasi template, bukan janji bahwa resume pasti lolos: parser, konfigurasi, dan proses seleksi setiap perusahaan berbeda.

## 1. Ringkasan keputusan produk

ResumeMaker sebaiknya menghasilkan dokumen dengan karakteristik berikut:

1. **Satu kolom** dengan urutan baca linear dari atas ke bawah.
2. **Teks asli yang dapat dipilih/disalin**, bukan gambar atau hasil scan.
3. **Informasi kontak berada di badan dokumen paling atas**, bukan Word/PDF header atau footer.
4. **Heading standar**, misalnya `Summary`, `Work Experience`, `Education`, `Skills`, `Projects`, dan `Certifications`.
5. **Pengalaman disusun reverse chronological** (terbaru ke terlama).
6. **Font umum dan mudah dibaca**; baseline aman: Arial, Calibri, atau Times New Roman.
7. **Ukuran body 10–12 pt**, heading 14–16 pt, dan nama sekitar 18–22 pt.
8. **Margin 0,75–1 inci** (19,05–25,4 mm); default produk: 0,75 inci agar tetap lapang tetapi efisien.
9. **Bullet sederhana** (`•` atau `-`); jangan memakai ikon sebagai pengganti bullet.
10. **Tanpa tabel, text box, sidebar, grafik, foto, rating berbentuk bar/bintang, atau layout multi-kolom** pada mode ATS.
11. **Warna minimal dan kontras tinggi**; default paling aman: teks hitam di latar putih.
12. **Tanggal konsisten**, misalnya `Jun 2024 – Present` atau `06/2024 – Present`.
13. **Ekspor utama berupa PDF berbasis teks** dan sediakan **DOCX sebagai fallback**; selalu ikuti format yang diminta lowongan.
14. **Konten ditailor terhadap job description**, memakai istilah yang benar-benar relevan secara natural—bukan keyword stuffing.
15. Istilah penting dapat ditulis dalam bentuk panjang dan singkatan pertama kali, misalnya `Application Programming Interface (API)`.

## 2. Struktur resume yang direkomendasikan

Urutan default:

```text
FULL NAME
City, Province | Phone | Professional Email | LinkedIn | Portfolio/GitHub

PROFESSIONAL SUMMARY               (opsional)
2–4 baris: target role, pengalaman/keahlian utama, domain, dan nilai terukur.

SKILLS
Kelompok skill konkret yang relevan dengan lowongan.

WORK EXPERIENCE
Job Title | Company | City, Province | Mon YYYY – Mon YYYY
• Action + task/context + result/impact; sertakan angka jika benar dan relevan.
• Gunakan keyword yang sesuai dalam konteks pencapaian.

EDUCATION
Degree / Major | Institution | Graduation date

PROJECTS                           (penting untuk mahasiswa/tech)
Project Name | Technology | Date
• Masalah, kontribusi, teknologi, dan hasil.

CERTIFICATIONS / AWARDS / ORGANIZATIONS   (opsional dan relevan)
```

Urutan section harus dapat diubah sesuai profil:

- **Mahasiswa/fresh graduate:** Education dapat diletakkan sebelum Work Experience.
- **Profesional berpengalaman:** Work Experience biasanya sebelum Education.
- **Posisi teknis:** Skills dan Projects dapat dinaikkan, tetapi riwayat tetap mudah diikuti.
- **Academic CV:** merupakan mode berbeda; jangan dipaksa mengikuti batas ringkas resume profesional.

## 3. Aturan layout dan tipografi

### 3.1 Layout wajib untuk mode ATS

| Elemen | Keputusan |
|---|---|
| Kolom | Satu kolom |
| Alur baca | Atas ke bawah, kiri ke kanan |
| Alignment | Utamanya rata kiri |
| Margin | Default 0,75 inci; opsi 1 inci |
| Body font | Default Arial 11 pt |
| Heading | Arial 14 pt, bold |
| Nama | Arial 20 pt, bold |
| Line spacing | Sekitar 1,0–1,15; beri whitespace antar-section |
| Bullet | Bullet Unicode standar atau hyphen |
| Warna | Hitam/abu sangat gelap; aksen opsional berkontras tinggi |
| Pemisah | Spacing lebih aman; garis horizontal sederhana boleh sangat terbatas |

### 3.2 Elemen yang dilarang dalam template ATS-safe

- Dua kolom atau sidebar.
- Tabel untuk mengatur posisi teks.
- Text box, shape, floating element, dan layer bertumpuk.
- Foto, logo, infografik, grafik, QR code, dan decorative icon.
- Skill bar, progress bar, bintang, lingkaran, atau nilai visual tanpa teks.
- Informasi penting di header/footer dokumen.
- Font dekoratif atau font yang harus di-embed secara tidak umum.
- Bullet simbol khusus yang dapat berubah menjadi karakter aneh.
- Teks putih/tersembunyi untuk memasukkan keyword.
- PDF berupa image/scan.

> Catatan: beberapa ATS modern mampu membaca sebagian tabel, kolom, atau PDF kompleks. Namun, karena pengguna tidak mengetahui parser tujuan, desain paling konservatif adalah satu kolom dengan struktur teks linear.

## 4. Heading dan bahasa

Gunakan label section yang konvensional. Hindari label kreatif seperti `My Journey`, `What I Know`, atau `Where I Learned`.

### Heading bahasa Inggris yang aman

- `Professional Summary` atau `Summary`
- `Skills` atau `Technical Skills`
- `Work Experience` atau `Professional Experience`
- `Education`
- `Projects`
- `Certifications`
- `Awards`
- `Organizations` atau `Leadership Experience`

### Untuk lowongan berbahasa Indonesia

ResumeMaker dapat menawarkan padanan `Ringkasan Profesional`, `Keahlian`, `Pengalaman Kerja`, `Pendidikan`, `Proyek`, dan `Sertifikasi`. Namun, bahasa heading dan isi sebaiknya mengikuti bahasa lowongan. Untuk perusahaan multinasional atau portal global, versi Inggris sering menjadi pilihan yang lebih konservatif. Produk harus memberi pengguna pilihan bahasa, bukan mencampur heading secara acak.

## 5. Aturan konten dan keyword

### 5.1 Tailoring terhadap job description

Sistem dapat mengekstrak dan mengelompokkan:

- jabatan/target role;
- hard skills dan tools;
- kompetensi domain;
- sertifikasi atau pendidikan;
- action verbs dan tanggung jawab;
- requirement wajib vs preferensi;
- istilah lengkap dan singkatan.

Kemudian sistem hanya boleh merekomendasikan keyword yang:

1. ada atau tersirat kuat pada job description;
2. benar-benar dimiliki pengguna;
3. dapat ditempatkan secara natural dalam summary, skills, experience, atau projects;
4. bila perlu, didukung bukti pada bullet pengalaman/proyek.

Jangan menambahkan skill yang tidak dimiliki, mengulang keyword secara berlebihan, atau menyembunyikan keyword. Fitur skor harus dijelaskan sebagai **indikator kecocokan**, bukan probabilitas lolos ATS.

### 5.2 Pola bullet yang dianjurkan

Gunakan pola sederhana:

```text
Action verb + apa yang dilakukan + konteks/cakupan + hasil terukur
```

Contoh:

```text
• Automated weekly sales reporting with Python and SQL, reducing preparation time by 6 hours per week.
```

Aturan editor:

- mulai dengan action verb;
- fokus pada kontribusi dan hasil, bukan hanya daftar tugas;
- gunakan angka hanya jika benar;
- satu bullet idealnya 1–2 baris;
- hindari paragraf panjang;
- gunakan tense secara konsisten;
- lakukan pemeriksaan ejaan dan grammar.

## 6. Tanggal, singkatan, dan kontak

- Gunakan satu format tanggal di seluruh dokumen: `MMM YYYY` atau `MM/YYYY`.
- Jangan memendekkan tahun menjadi `'24`.
- Tulis bentuk panjang dan singkatan saat pertama muncul: `Search Engine Optimization (SEO)`.
- Informasi kontak minimum: nama lengkap, nomor telepon, email profesional, kota/provinsi atau kota/negara.
- LinkedIn, portfolio, dan GitHub bersifat opsional sesuai role.
- Alamat jalan lengkap biasanya tidak diperlukan.
- URL sebaiknya memiliki teks yang tetap bermakna jika hyperlink hilang saat parsing.

## 7. Format file dan ekspor

### PDF

PDF harus:

- mengandung text layer;
- memungkinkan select, copy, dan search;
- memakai urutan teks yang sama dengan urutan visual;
- tidak mengubah karakter menjadi outline/path;
- memiliki font yang aman/tertanam dengan benar;
- tidak memiliki password atau pembatasan ekstraksi;
- memakai nama file profesional, misalnya `Faraja_Ahdaf_Software_Engineer_Resume.pdf`.

### DOCX

Sediakan DOCX karena beberapa lowongan atau ATS secara eksplisit memintanya. DOCX juga harus bebas dari tabel layout, text box, dan informasi penting pada header/footer.

### Aturan pilihan format

1. Jika lowongan menyebut jenis file, ikuti instruksinya.
2. Jika tidak disebut, sediakan PDF text-based sebagai default dan DOCX sebagai alternatif.
3. Jangan menyatakan PDF atau DOCX selalu unggul untuk semua ATS—sumber karier berbeda memberi preferensi berbeda dan sistem ATS terus berubah.

## 8. Panjang resume

ATS pada dasarnya memproses teks dan tidak otomatis membuat satu halaman selalu lebih baik. Batas halaman terutama untuk keterbacaan manusia:

- mahasiswa/fresh graduate: target default 1 halaman;
- profesional dengan pengalaman relevan lebih banyak: 1–2 halaman;
- pengguna senior atau akademik: dapat lebih panjang sesuai kebutuhan;
- jangan mengecilkan font di bawah 10 pt hanya untuk mengejar satu halaman.

Produk sebaiknya memberi warning tentang kepadatan, bukan memotong konten secara otomatis.

## 9. Template yang layak dibuat

Perbedaan template ATS sebaiknya berupa tipografi, spacing, dan urutan section—bukan jumlah kolom.

1. **Classic ATS** — Arial, hitam-putih, divider minimal.
2. **Modern ATS** — Calibri/Arial, satu warna aksen gelap, tetap satu kolom.
3. **Technical ATS** — Skills dan Projects lebih menonjol, GitHub/portfolio tersedia.
4. **Fresh Graduate ATS** — Education dan Projects di atas Experience.
5. **Experienced Professional ATS** — Summary dan Work Experience menjadi fokus.

Semua template harus memakai renderer dan struktur semantik yang sama agar hasil parsing konsisten.

## 10. Acceptance criteria untuk ResumeMaker

### 10.1 Validasi struktur

- [ ] Tidak ada tabel layout, text box, floating element, gambar, atau multi-column pada mode ATS.
- [ ] Nama dan kontak berada di main document flow.
- [ ] Semua section memakai heading standar yang dipetakan secara semantik.
- [ ] Semua entry mempunyai urutan teks linear yang benar.
- [ ] Tanggal memakai format yang konsisten.
- [ ] Semua URL mempunyai nilai teks yang dapat dibaca.

### 10.2 Validasi hasil PDF/DOCX

- [ ] `pdftotext` dapat mengekstrak seluruh informasi dalam urutan yang benar.
- [ ] Pencarian nama, email, jabatan, perusahaan, skill, dan pendidikan berhasil pada PDF.
- [ ] Copy-paste seluruh PDF menghasilkan teks yang masuk akal.
- [ ] PDF bukan image-only dan tidak terenkripsi.
- [ ] DOCX dapat dikonversi ke plain text tanpa kehilangan section penting.
- [ ] Font body tidak kurang dari 10 pt.
- [ ] Tidak ada teks terpotong, overlap, orphan heading, atau bullet sendirian di halaman baru.
- [ ] Export tetap benar pada 1 dan 2 halaman.

### 10.3 Validasi keyword

- [ ] Keyword berasal dari job description yang diberikan.
- [ ] Sistem meminta konfirmasi sebelum menambahkan kompetensi yang belum ada pada profil pengguna.
- [ ] Bentuk lengkap dan singkatan dapat dideteksi/direkomendasikan.
- [ ] Tidak ada hidden text atau keyword stuffing.
- [ ] Skor diberi label `match score`/`relevance score`, bukan `ATS pass probability`.

### 10.4 Regression fixtures

Siapkan resume uji yang mencakup:

- nama dan kota dengan karakter non-ASCII;
- nomor telepon internasional;
- URL panjang;
- pekerjaan tanpa end date (`Present`);
- dua jabatan pada perusahaan yang sama;
- section tanpa isi (harus disembunyikan, bukan dicetak kosong);
- konten yang melampaui satu halaman;
- bullet dan keyword yang mengandung singkatan.

Bandingkan hasil ekstraksi teks terhadap snapshot expected pada setiap perubahan renderer.

## 11. Anti-pattern produk

ResumeMaker tidak boleh:

- mengklaim “100% pasti lolos ATS”;
- mengarang pengalaman, skill, angka pencapaian, pendidikan, atau sertifikasi;
- menampilkan skor seolah-olah berasal dari ATS perusahaan yang sebenarnya;
- menjejalkan semua keyword job description tanpa konteks;
- mengorbankan keterbacaan manusia demi optimasi mesin;
- memakai template visual kompleks lalu hanya memberi label “ATS-friendly”.

## 12. Sumber riset

Sumber universitas/career center diprioritaskan, kemudian sumber industri sebagai pelengkap.

1. Harvard FAS, Mignone Center for Career Success — **Harvard College Guide to Creating a Strong Resume**  
   https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/
2. Santa Clara University Career Center — **Common ATS Resume Formatting Mistakes**  
   https://www.scu.edu/careercenter/toolkit/job-scan-common-ats-resume-formatting-mistakes/
3. UC Santa Barbara Career Services — **Create Your Resume**  
   https://career.ucsb.edu/get-hired/resumes
4. UC Santa Barbara Career Services — **Build Sections**  
   https://career.ucsb.edu/get-hired/resumes/build-sections
5. UC Santa Barbara Career Services — **Polish the Writing**  
   https://career.ucsb.edu/get-hired/resumes/polish-the-writing
6. Yale Office of Career Strategy — **STEMConnect: Technical Resume Sample**  
   https://ocs.yale.edu/resources/stemconnect-technical-resume-sample/
7. University of Pennsylvania Career Services — **Write a Resume/CV**  
   https://careerservices.upenn.edu/channels/resume/
8. Ohio Northern University, Polar Careers — **A Guide to Adapting Your Resume for the Applicant Tracking System (ATS)** (PDF)  
   https://my.onu.edu/sites/default/files/applicant_tracking_system_resume_guide.pdf
9. Indeed Career Guide — **How To Write an ATS Resume**  
   https://www.indeed.com/career-advice/resumes-cover-letters/ats-resume-template
10. Jobscan — **Anatomy of an ATS-Friendly Resume Format**  
    https://www.jobscan.co/blog/20-ats-friendly-resume-templates/
11. Workable — **What is resume parsing and how an ATS reads a resume**  
    https://resources.workable.com/stories-and-insights/how-ATS-reads-resumes

## 13. Kesimpulan untuk desain proyek

Mode default ResumeMaker harus menjadi **ATS-safe, one-column, text-first renderer**. Template visual yang lebih kreatif boleh dibuat sebagai mode terpisah dan diberi peringatan bahwa tingkat kompatibilitas parser dapat lebih rendah. Nilai utama produk bukan dekorasi, melainkan:

- input terstruktur;
- tailoring berdasarkan job description;
- bullet berbasis bukti dan hasil;
- ekspor PDF/DOCX yang benar;
- pemeriksaan urutan ekstraksi teks;
- transparansi bahwa kecocokan ATS tidak dapat dijamin.
