# Product Requirements Document — ResumeMaker

| Metadata | Value |
|---|---|
| Product | ResumeMaker |
| Document status | Draft v1.1 — DeepSeek integration defined |
| Primary market | Pencari kerja berbahasa Indonesia dan Inggris |
| Platforms | Responsive web application |
| Product language | Bahasa Indonesia dan English |
| Primary output | ATS-friendly resume dalam PDF dan DOCX |
| Related specification | [`docs/ATS_FRIENDLY_RESUME_SPEC.md`](docs/ATS_FRIENDLY_RESUME_SPEC.md) |
| AI specification | [`docs/DEEPSEEK_AI_INTEGRATION_SPEC.md`](docs/DEEPSEEK_AI_INTEGRATION_SPEC.md) |

## 1. Ringkasan produk

ResumeMaker adalah aplikasi web untuk membuat, menyesuaikan, memeriksa, dan mengekspor resume yang mudah dibaca manusia serta relatif aman diproses Applicant Tracking System (ATS).

Pengguna memasukkan data secara terstruktur, memilih bahasa resume, memilih template ATS-safe, lalu dapat menyesuaikan isi terhadap job description. Produk menghasilkan resume berbasis teks dalam PDF dan DOCX serta menyimpan data terstruktur agar resume dapat diedit atau digunakan kembali.

ResumeMaker mendukung **Bahasa Indonesia dan English** untuk:

1. bahasa antarmuka aplikasi;
2. label dan helper text pada form;
3. heading serta konten resume;
4. suggestion dan pemeriksaan tulisan;
5. analisis job description.

Bahasa antarmuka dan bahasa resume merupakan dua pengaturan terpisah. Pengguna dapat memakai antarmuka Bahasa Indonesia untuk membuat resume English, atau sebaliknya.

## 2. Latar belakang masalah

Pencari kerja sering menghadapi masalah berikut:

- template resume visual menggunakan tabel, sidebar, ikon, atau elemen yang berisiko salah dibaca ATS;
- informasi yang sama harus diketik ulang untuk setiap lamaran;
- pengguna kesulitan menyesuaikan pengalaman dengan kebutuhan lowongan;
- alat yang tersedia sering berfokus pada English dan kurang nyaman untuk pengguna Indonesia;
- penerjemahan resume dapat mengubah nama perusahaan, nama produk, angka, atau istilah teknis;
- klaim “ATS score” sering tidak transparan dan dapat memberi rasa aman palsu;
- hasil PDF terkadang berupa layout yang bagus secara visual tetapi urutan ekstraksi teksnya rusak.

## 3. Visi

Menjadi resume builder bilingual yang membantu pengguna menghasilkan resume yang jujur, relevan, mudah diedit, mudah dibaca recruiter, dan dapat diverifikasi secara teknis sebelum dikirim ke perusahaan.

## 4. Tujuan produk

### 4.1 Tujuan utama

1. Memungkinkan pengguna membuat resume lengkap tanpa harus memahami format ATS.
2. Mendukung alur kerja penuh dalam Bahasa Indonesia maupun English.
3. Memisahkan bahasa UI dari bahasa dokumen agar pengguna memiliki kontrol penuh.
4. Menghasilkan PDF dan DOCX berbasis teks dengan urutan baca linear.
5. Membantu pengguna menyesuaikan resume dengan job description tanpa mengarang kualifikasi.
6. Menyimpan satu profil utama yang dapat digunakan untuk membuat beberapa versi resume.
7. Menjelaskan setiap warning dan recommendation secara transparan.

### 4.2 Sasaran kualitas MVP

- Pengguna baru dapat menyelesaikan resume pertama tanpa tutorial eksternal.
- Seluruh alur inti dapat digunakan pada viewport desktop dan mobile.
- Bahasa dapat diganti tanpa kehilangan data yang sedang diedit.
- Resume hasil ekspor dapat diekstrak menjadi teks dengan urutan yang sama seperti preview.
- Pengguna dapat membuat resume Indonesia dan English dari profil yang sama tanpa menimpa versi lain.
- Tidak ada pengalaman, skill, angka, atau sertifikasi yang ditambahkan tanpa persetujuan pengguna.

## 5. Non-goals MVP

Hal berikut tidak termasuk MVP:

- menjamin resume lolos ATS atau diterima perusahaan;
- mengirim lamaran langsung ke portal pekerjaan;
- menyimulasikan parser milik setiap vendor ATS;
- membuat academic CV, cover letter, portfolio website, atau surat lamaran;
- menyediakan marketplace recruiter;
- mendukung bahasa selain Indonesia dan English;
- collaborative editing real-time;
- template infografis atau desain multi-kolom pada mode ATS;
- mengarang isi resume berdasarkan informasi yang tidak diberikan pengguna.

## 6. Target pengguna

### Persona A — Mahasiswa/fresh graduate Indonesia

- Belum banyak pengalaman kerja formal.
- Membutuhkan bantuan menonjolkan pendidikan, organisasi, proyek, dan magang.
- Dapat mengisi data dalam Bahasa Indonesia tetapi melamar ke lowongan berbahasa Inggris.
- Membutuhkan contoh dan helper text yang sederhana.

### Persona B — Profesional Indonesia

- Memiliki beberapa pengalaman kerja.
- Membutuhkan versi resume berbeda untuk beberapa target role.
- Ingin mengubah bahasa resume tanpa mengubah data utama.
- Membutuhkan bullet yang lebih ringkas dan berorientasi hasil.

### Persona C — Pengguna bilingual/internasional

- Nyaman memakai English atau Bahasa Indonesia.
- Membutuhkan kontrol eksplisit atas bahasa UI, heading, tanggal, dan hasil suggestion.
- Melamar ke perusahaan lokal maupun global.

## 7. Prinsip produk

1. **Truth over optimization** — jangan meningkatkan skor dengan informasi yang tidak benar.
2. **User remains in control** — setiap perubahan isi harus dapat dilihat, diterima, atau ditolak.
3. **Text first** — struktur semantik dan urutan baca lebih penting daripada dekorasi.
4. **Bilingual, not mixed by accident** — bahasa campuran harus menjadi pilihan pengguna, bukan hasil sistem yang tidak konsisten.
5. **One profile, many resumes** — data dasar dapat dipakai kembali tanpa mengikat semua resume ke konten yang sama.
6. **Explain recommendations** — tampilkan alasan, sumber, dan lokasi penggunaan keyword.
7. **No false guarantees** — hasil analisis disebut relevance/match, bukan probabilitas lolos ATS.

## 8. Ruang lingkup MVP

### P0 — wajib tersedia

- UI bilingual Indonesia/English.
- Pemilihan bahasa resume Indonesia/English.
- Form profil dan section resume terstruktur.
- Multiple resume dari satu profil.
- Live preview ATS-safe satu kolom.
- Template Classic ATS.
- Reorder, hide, dan show section.
- Input job description dan ekstraksi keyword.
- Recommendation yang membutuhkan persetujuan pengguna.
- Basic quality checks dan ATS-safe checks.
- Export PDF berbasis teks.
- Export/import JSON.
- Autosave lokal atau ke akun, sesuai arsitektur yang dipilih.
- DeepSeek dipanggil hanya dari server; API key tidak pernah dikirim ke browser.
- Output AI tervalidasi sebagai data terstruktur dan selalu ditampilkan sebagai proposed change.
- Pemeriksaan klaim baru sebelum recommendation ditampilkan atau diterapkan.

### P1 — setelah alur inti stabil

- Export DOCX.
- Terjemahan terkontrol Indonesia ↔ English.
- Template Modern ATS, Technical ATS, Fresh Graduate ATS, dan Experienced Professional ATS.
- Duplicate resume.
- Version history sederhana.
- Authentication dan sinkronisasi lintas perangkat.
- Shareable read-only preview.

### P2 — pengembangan lanjutan

- Import resume PDF/DOCX ke data terstruktur.
- Cover letter builder.
- Additional languages.
- Integrasi job board.
- Kolaborasi dengan mentor/career coach.
- Analytics lanjutan yang tetap menjaga privasi.

## 9. Model bahasa produk

ResumeMaker menggunakan tiga konsep bahasa yang berbeda.

### 9.1 UI language (`uiLocale`)

Mengatur:

- navigation;
- tombol;
- label form;
- helper text;
- validation message;
- dialog;
- onboarding;
- notification.

Nilai MVP:

```text
id-ID
en-US
```

Pergantian `uiLocale` tidak boleh menerjemahkan atau mengubah konten resume.

### 9.2 Resume language (`resumeLanguage`)

Mengatur:

- heading section;
- placeholder contoh;
- format tanggal default;
- pemeriksaan ejaan dan grammar;
- bahasa suggestion;
- bahasa hasil terjemahan;
- label section pada hasil ekspor.

Nilai MVP:

```text
id
 en
```

Pergantian `resumeLanguage` tidak boleh menerjemahkan konten secara diam-diam. Sistem harus menawarkan pilihan:

1. hanya ubah heading dan format bawaan;
2. buat salinan resume lalu terjemahkan konten;
3. batalkan.

### 9.3 Job description language (`jobLanguage`)

- Dideteksi otomatis jika memungkinkan.
- Pengguna dapat mengganti hasil deteksi.
- Keyword asli tetap dipertahankan.
- Suggestion ditulis dalam `resumeLanguage`, tetapi istilah teknis penting dari lowongan dapat dipertahankan jika relevan.

### 9.4 Perilaku saat bahasa bercampur

Sistem menampilkan warning apabila satu resume berisi campuran bahasa yang tidak disengaja. Warning tidak boleh muncul hanya karena terdapat:

- nama perusahaan;
- nama produk;
- jabatan resmi;
- nama teknologi;
- sertifikasi;
- istilah industri yang lazim dipakai dalam bentuk aslinya.

Pengguna dapat menandai istilah sebagai “keep original” agar tidak diterjemahkan.

## 10. User journeys

### 10.1 Membuat resume pertama

1. Pengguna membuka aplikasi.
2. Sistem memilih bahasa UI berdasarkan browser dan menyediakan switch yang terlihat.
3. Pengguna memilih bahasa resume: Indonesia atau English.
4. Pengguna memilih target profile: Fresh Graduate, Professional, atau Technical.
5. Pengguna mengisi informasi personal dan section yang relevan.
6. Preview diperbarui secara langsung.
7. Sistem menjalankan quality checks.
8. Pengguna memperbaiki warning atau mengabaikannya dengan sadar.
9. Pengguna mengekspor PDF atau menyimpan draft.

### 10.2 Membuat resume English dari profil Indonesia

1. Pengguna membuka profil yang sudah berisi data Indonesia.
2. Pengguna membuat resume baru dengan `resumeLanguage = en`.
3. Sistem menawarkan untuk mulai kosong, menyalin konten asli, atau menyalin dan menerjemahkan.
4. Jika memilih terjemahan, sistem menampilkan perubahan per section.
5. Nama perusahaan, nama produk, angka, URL, dan istilah bertanda `keepOriginal` tidak diubah.
6. Pengguna menerima atau menolak perubahan.
7. Versi Indonesia tetap tersimpan tanpa perubahan.

### 10.3 Tailoring berdasarkan job description

1. Pengguna menempel job description atau teks lowongan.
2. Sistem mendeteksi bahasa dan menampilkan hasil deteksi.
3. Sistem mengelompokkan requirement, skill, tool, job title, dan keyword.
4. Sistem membandingkan requirement dengan data profil/resume.
5. Sistem menampilkan:
   - keyword sudah ada;
   - keyword relevan tetapi belum digunakan;
   - requirement yang belum memiliki bukti;
   - keyword yang tidak boleh otomatis ditambahkan.
6. Pengguna memilih recommendation.
7. Sistem menampilkan proposed edit sebelum diterapkan.
8. Setelah disetujui, preview dan relevance score diperbarui.

### 10.4 Mengganti bahasa UI saat mengedit

1. Pengguna mengubah UI dari Indonesia ke English atau sebaliknya.
2. Semua label dan pesan UI berubah.
3. Nilai form, urutan section, preview, dan bahasa resume tidak berubah.
4. Draft tetap tersimpan.

## 11. Information architecture

### Halaman publik

- Landing page
- Features
- ATS-friendly explanation
- Privacy
- Terms

### Halaman aplikasi

- Dashboard / My Resumes
- Master Profile
- Resume Editor
- Job Tailoring
- Export
- Settings

### Struktur Resume Editor

- Top bar: nama resume, save status, UI language, resume language, preview mode, export.
- Left/editor pane: form section terstruktur.
- Right/preview pane: live document preview pada desktop.
- Mobile: editor dan preview menggunakan tab atau segmented control.
- Quality panel: issue, severity, explanation, dan action.

## 12. Functional requirements

### FR-001 — UI language switch

**Requirement:** Pengguna dapat memilih Bahasa Indonesia atau English dari seluruh halaman aplikasi.

**Acceptance criteria:**

- Switch tersedia tanpa harus membuka editor resume.
- Perubahan berlaku tanpa reload penuh jika arsitektur memungkinkan.
- Data input tidak berubah.
- Pilihan disimpan untuk kunjungan berikutnya.
- Seluruh string UI berasal dari translation resources, bukan hard-coded per component.
- Jika translation key hilang, fallback ke English dan error dicatat untuk developer.

### FR-002 — Resume language selection

**Requirement:** Setiap resume mempunyai bahasa dokumen sendiri.

**Acceptance criteria:**

- Bahasa dipilih ketika membuat resume.
- Bahasa dapat diubah setelah resume dibuat.
- Heading dan placeholder mengikuti bahasa resume.
- Perubahan bahasa tidak menerjemahkan isi tanpa konfirmasi.
- Resume Indonesia dan English dapat hidup berdampingan.

### FR-003 — Master profile

**Requirement:** Pengguna dapat menyimpan sumber data utama yang dapat digunakan ulang.

**Data minimum:**

- nama lengkap;
- email;
- telepon;
- lokasi;
- LinkedIn;
- portfolio/GitHub;
- experience;
- education;
- skills;
- projects;
- certifications;
- awards/organizations.

**Acceptance criteria:**

- Field opsional dapat dikosongkan.
- Data master tidak berubah ketika pengguna mengedit salinan khusus pada resume, kecuali pengguna memilih “update master profile”.
- Informasi sensitif tidak ditampilkan pada resume jika section/field dinonaktifkan.

### FR-004 — Resume management

**Requirement:** Pengguna dapat membuat dan mengelola beberapa resume.

**Acceptance criteria:**

- Create, rename, duplicate, archive/delete.
- Setiap resume menyimpan target role, bahasa, template, urutan section, dan konten override.
- Penghapusan meminta konfirmasi dan menyediakan recovery period jika backend mendukung.
- Duplicate mempertahankan resume asal tanpa membuat reference yang menyebabkan perubahan silang.

### FR-005 — Structured editor

**Requirement:** Form menyediakan section terstruktur dan repeatable entries.

**Acceptance criteria:**

- Add, edit, delete, dan reorder entry.
- Add, hide, show, dan reorder section.
- Section kosong tidak dicetak pada hasil akhir.
- Validasi tidak menghalangi draft untuk disimpan.
- Required field untuk export dibedakan dari optional field.
- Input menerima karakter Unicode Indonesia dan nama internasional.

### FR-006 — Live preview

**Requirement:** Preview mencerminkan hasil ekspor sedekat mungkin.

**Acceptance criteria:**

- Perubahan form terlihat pada preview tanpa kehilangan focus input.
- Preview memakai ukuran halaman target.
- Page break terlihat.
- Overflow, text clipping, dan orphan heading diberi warning.
- Preview tidak menggunakan layout yang berbeda secara semantik dari renderer export.

### FR-007 — ATS-safe templates

**Requirement:** MVP menyediakan Classic ATS dan fondasi untuk template tambahan.

**Acceptance criteria:**

- Satu kolom.
- Tidak memakai tabel layout, text box, gambar, atau decorative icon.
- Informasi kontak berada di document flow.
- Body font minimum 10 pt.
- Heading menggunakan label standar berdasarkan bahasa resume.
- Perbedaan template tidak mengubah struktur data.
- Aturan detail mengikuti `docs/ATS_FRIENDLY_RESUME_SPEC.md`.

### FR-008 — Job description analysis

**Requirement:** Sistem menganalisis teks lowongan untuk membantu tailoring.

**Acceptance criteria:**

- Menerima plain text.
- Menampilkan dan mengizinkan koreksi bahasa hasil deteksi.
- Mengelompokkan keyword menjadi role, hard skill, tool, domain, education/certification, responsibility, dan optional preference.
- Menandai keyword yang sudah ada pada resume.
- Tidak otomatis menyatakan pengguna mempunyai skill yang tidak ada pada profil.
- Analisis yang gagal tidak merusak resume atau menghapus input pengguna.

### FR-009 — Recommendation review

**Requirement:** Semua perubahan konten yang disarankan harus melewati review pengguna.

**Acceptance criteria:**

- Tampilkan before/after atau proposed text.
- Tampilkan alasan recommendation dan keyword terkait.
- Sediakan Accept, Edit, dan Reject.
- Accept hanya mengubah lokasi yang ditampilkan.
- Undo tersedia setidaknya untuk perubahan terakhir.
- Sistem tidak membuat angka pencapaian baru.

### FR-010 — Translation workflow

**Requirement:** Pengguna dapat membuat versi Indonesia atau English tanpa merusak versi sumber.

**Acceptance criteria:**

- Translation dilakukan pada salinan atau setelah konfirmasi eksplisit.
- Pengguna dapat review per section.
- Nama orang, perusahaan, produk, URL, email, angka, kode, dan item `keepOriginal` dipertahankan.
- Tanggal mengikuti locale target tanpa mengubah nilai tanggal.
- Tidak ada perubahan yang diterapkan jika proses translation gagal di tengah jalan.
- Sistem memperingatkan bagian yang ambigu dan tidak menerjemahkannya dengan kepastian palsu.

### FR-011 — Quality checks

**Requirement:** Sistem memeriksa kelengkapan, keterbacaan, konsistensi, dan risiko ATS.

**Minimum checks:**

- kontak minimum belum lengkap;
- heading tidak standar;
- format tanggal tidak konsisten;
- body font terlalu kecil;
- section kosong;
- bullet terlalu panjang;
- kemungkinan typo;
- campuran bahasa yang tidak disengaja;
- keyword stuffing;
- informasi kritis berada di header/footer;
- elemen terlarang dalam template;
- PDF berpotensi lebih dari target halaman;
- requirement lowongan tidak mempunyai bukti pada profil.

**Acceptance criteria:**

- Issue memiliki severity: `error`, `warning`, atau `suggestion`.
- Setiap issue menjelaskan alasan dan tindakan yang mungkin dilakukan.
- Warning dapat diabaikan; error export hanya digunakan untuk kegagalan teknis yang menghasilkan file rusak/tidak valid.

### FR-012 — Relevance score

**Requirement:** Produk dapat menampilkan indikator kecocokan resume dengan job description.

**Acceptance criteria:**

- Disebut `Relevance Score`/`Match Score`, bukan `ATS Pass Score`.
- Metode penilaian dijelaskan secara ringkas.
- Tidak ada klaim bahwa skor berasal dari ATS perusahaan.
- Score tidak naik karena hidden text atau pengulangan keyword yang tidak natural.
- Pengguna tetap dapat melanjutkan tanpa mengejar score tertentu.

### FR-013 — PDF export

**Requirement:** Sistem menghasilkan PDF berbasis teks yang ATS-safe.

**Acceptance criteria:**

- Teks dapat dipilih, dicari, dan disalin.
- Urutan ekstraksi sesuai urutan visual.
- PDF tidak berupa image-only dan tidak dienkripsi.
- Tidak ada clipping atau overlap.
- Nama file profesional dapat diedit pengguna.
- Heading dan tanggal mengikuti bahasa resume.
- Export diuji otomatis menggunakan text extraction.

### FR-014 — DOCX export

**Priority:** P1.

**Acceptance criteria:**

- Struktur tetap satu kolom.
- Tidak ada tabel layout atau text box.
- Kontak tidak disimpan sebagai Word header/footer.
- Isi dapat diekstrak ke plain text dalam urutan yang benar.
- Hasil dapat dibuka oleh aplikasi office umum tanpa corruption warning.

### FR-015 — JSON import/export

**Requirement:** Pengguna dapat mengekspor dan mengimpor data terstruktur.

**Acceptance criteria:**

- File mengandung `schemaVersion`.
- Import memvalidasi schema sebelum mengubah data aktif.
- Import lama dimigrasikan bila versi didukung.
- Field tidak dikenal tidak menyebabkan aplikasi crash.
- Pengguna melihat preview ringkas sebelum overwrite/merge.
- File JSON tidak menyimpan secret aplikasi.

### FR-016 — Save and recovery

**Requirement:** Pekerjaan pengguna tidak mudah hilang.

**Acceptance criteria:**

- Autosave memiliki indikator `Saving`, `Saved`, atau `Failed`.
- Navigasi tidak menghapus perubahan yang belum tersimpan tanpa peringatan.
- Kegagalan jaringan tidak langsung menghilangkan draft lokal.
- Konflik data tidak diselesaikan dengan overwrite diam-diam.

### FR-017 — Accessibility

**Requirement:** Alur utama dapat digunakan dengan keyboard dan assistive technology.

**Acceptance criteria:**

- Semantic labels untuk semua input.
- Focus state terlihat.
- Navigasi keyboard memiliki urutan logis.
- Error terhubung ke field terkait.
- Kontras memenuhi WCAG AA.
- Pemilihan bahasa mempunyai accessible name yang jelas.
- Drag-and-drop memiliki alternatif tombol move up/down.

### FR-018 — DeepSeek AI gateway

**Requirement:** Semua fitur AI mengakses DeepSeek melalui satu lapisan server yang terkontrol dan dapat diganti konfigurasinya tanpa mengubah editor atau renderer.

**Acceptance criteria:**

- `DEEPSEEK_API_KEY` hanya tersedia di environment server.
- Base URL, model, timeout, dan batas output dapat dikonfigurasi melalui environment atau konfigurasi server.
- Nama model tidak di-hard-code pada component UI.
- Request hanya mengirim field yang diperlukan untuk tugas tersebut; kontak pribadi dikeluarkan jika tidak relevan.
- Setiap request memiliki `requestId`, `taskType`, `promptVersion`, dan schema version untuk observability tanpa merekam isi resume.
- Respons mentah provider tidak pernah langsung mengubah `MasterProfile` atau `Resume`.
- Detail kontrak, retry, dan validasi mengikuti `docs/DEEPSEEK_AI_INTEGRATION_SPEC.md`.

### FR-019 — Structured AI output dan claim validation

**Requirement:** Hasil AI harus dapat divalidasi secara sintaksis dan faktual sebelum ditampilkan sebagai recommendation.

**Acceptance criteria:**

- Output menggunakan JSON mode atau strict function/tool schema bila didukung model yang dikonfigurasi.
- Backend tetap melakukan schema validation; keberhasilan parsing JSON bukan bukti kebenaran isi.
- Respons dengan output terpotong, schema tidak valid, target tidak dikenal, atau operasi tidak diizinkan ditolak tanpa mengubah draft.
- Sistem membandingkan nama perusahaan, pendidikan, sertifikasi, skill, tanggal, dan angka pada suggestion terhadap fakta sumber.
- Klaim yang tidak didukung tidak diterapkan dan ditampilkan sebagai warning yang jelas jika hasil lainnya masih aman digunakan.
- Recommendation menyimpan `sourceFactIds` dan `relatedKeywordIds` agar alasan perubahan dapat ditelusuri.
- AI tidak boleh menghasilkan relevance score final; score dihitung oleh kode aplikasi dengan metode yang berversi.

### FR-020 — AI consent, disclosure, dan recovery

**Requirement:** Pengguna memahami kapan data dikirim ke provider eksternal dan dapat pulih dari kegagalan proses AI.

**Acceptance criteria:**

- Sebelum penggunaan AI pertama, UI menjelaskan bahwa konten yang dipilih akan dikirim ke DeepSeek untuk diproses.
- Pengguna dapat membatalkan proses tanpa kehilangan isi editor.
- Timeout, rate limit, saldo provider habis, respons invalid, moderation/content filter, dan provider unavailable memiliki pesan berbeda yang dapat ditindaklanjuti.
- Retry memakai exponential backoff dengan jitter hanya untuk error sementara dan memiliki batas percobaan.
- Error autentikasi, saldo, request invalid, dan schema invalid tidak di-retry otomatis tanpa perubahan kondisi/input.
- Kegagalan AI tidak menghalangi editing manual, preview, penyimpanan, atau export.

## 13. Data model konseptual

```ts
type UiLocale = "id-ID" | "en-US";
type ResumeLanguage = "id" | "en";

type UserPreferences = {
  uiLocale: UiLocale;
  defaultResumeLanguage: ResumeLanguage;
  dateFormat?: "MMM_YYYY" | "MM_YYYY";
};

type LocalizedText = {
  sourceLanguage?: ResumeLanguage;
  value: string;
  keepOriginal?: boolean;
};

type MasterProfile = {
  id: string;
  contact: ContactInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  organizations: Organization[];
  updatedAt: string;
};

type Resume = {
  id: string;
  title: string;
  resumeLanguage: ResumeLanguage;
  targetRole?: string;
  templateId: string;
  sourceProfileId: string;
  sectionOrder: SectionType[];
  hiddenSections: SectionType[];
  content: ResumeContent;
  jobAnalysisId?: string;
  createdAt: string;
  updatedAt: string;
};

type JobAnalysis = {
  id: string;
  rawText: string;
  detectedLanguage?: ResumeLanguage;
  selectedLanguage: ResumeLanguage;
  keywords: JobKeyword[];
  recommendations: Recommendation[];
  methodVersion: string;
};

type AiRun = {
  id: string;
  taskType:
    | "job_analysis"
    | "summary"
    | "bullet_rewrite"
    | "resume_tailoring"
    | "translation";
  provider: "deepseek";
  model: string;
  promptVersion: string;
  outputSchemaVersion: string;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled";
  inputFactIds: string[];
  createdAt: string;
  completedAt?: string;
  errorCode?: string;
};

type Recommendation = {
  id: string;
  aiRunId: string;
  targetId: string;
  operation: "replace" | "append" | "none";
  originalText: string;
  proposedText: string;
  reason: string;
  sourceFactIds: string[];
  relatedKeywordIds: string[];
  unsupportedClaims: string[];
  status: "pending" | "accepted" | "edited" | "rejected";
};
```

Model implementasi final dapat berubah, tetapi harus mempertahankan pemisahan `uiLocale`, `resumeLanguage`, dan bahasa job description.

## 14. Content design dan terminology

### Istilah UI utama

| English | Bahasa Indonesia |
|---|---|
| Resume | Resume/CV |
| My Resumes | Resume Saya |
| Master Profile | Profil Utama |
| Work Experience | Pengalaman Kerja |
| Education | Pendidikan |
| Skills | Keahlian |
| Projects | Proyek |
| Certifications | Sertifikasi |
| Professional Summary | Ringkasan Profesional |
| Job Description | Deskripsi Pekerjaan |
| Relevance Score | Skor Relevansi |
| Suggestion | Saran |
| Export | Ekspor |
| Preview | Pratinjau |

Terjemahan harus natural dan konsisten. “CV” dapat dipakai dalam copy pemasaran Indonesia karena lebih umum, tetapi struktur internal produk tetap disebut `resume` agar tidak bercampur dengan academic CV.

### Tone

- jelas dan profesional;
- tidak menghakimi;
- tidak menjanjikan hasil rekrutmen;
- menjelaskan istilah ATS saat pertama digunakan;
- recommendation menggunakan bahasa kemungkinan, bukan kepastian.

Contoh:

- Benar: “Keyword ini ada pada lowongan tetapi belum terlihat di resume Anda.”
- Salah: “Tambahkan keyword ini agar pasti lolos ATS.”

## 15. UX requirements

- Bahasa UI dapat diganti dari global navigation dan Settings.
- Bahasa resume terlihat jelas di editor agar pengguna tidak salah mengedit versi.
- Save status selalu terlihat.
- Editor membedakan data profil utama dan override khusus resume.
- Recommendation tidak diterapkan dengan satu klik tanpa preview perubahan.
- Quality panel dapat memfilter error, warning, dan suggestion.
- Preview menyediakan zoom tetapi zoom tidak mengubah ukuran hasil ekspor.
- Empty state memberikan contoh berbeda untuk mahasiswa dan profesional.
- Konfirmasi diperlukan sebelum menerjemahkan seluruh resume, mengganti bahasa dokumen, overwrite import, atau menghapus resume.

## 16. Non-functional requirements

### 16.1 Performance

- Interaksi form dan perpindahan section terasa responsif.
- Preview menggunakan debounce agar pengetikan tidak tersendat.
- Proses analisis dan export menampilkan progress serta dapat gagal dengan pesan yang dapat ditindaklanjuti.
- Aplikasi tidak memuat model/asset berat sebelum dibutuhkan.

### 16.2 Reliability

- Draft tidak hilang karena refresh atau koneksi sementara terputus.
- Export bersifat deterministic untuk data, template, dan version renderer yang sama.
- Gagal menganalisis job description tidak boleh mengubah isi resume.
- Perubahan schema memiliki migration strategy.
- Semua operasi AI bersifat non-destructive dan idempotent berdasarkan `requestId` selama jendela retry.
- Renderer PDF/DOCX tidak bergantung pada ketersediaan provider AI.

### 16.3 Security dan privacy

- Resume dianggap data pribadi.
- Data dikirim melalui HTTPS pada deployment produksi.
- Password tidak disimpan dalam plain text jika authentication ditambahkan.
- Jangan memasukkan resume atau job description ke training dataset tanpa consent eksplisit.
- Jelaskan bila suggestion/translation menggunakan third-party AI provider.
- Pengguna dapat menghapus data dan export salinannya.
- Logging tidak boleh menyimpan isi resume penuh, email, nomor telepon, atau job description secara default.
- API key provider hanya disimpan di secret/environment server dan tidak boleh masuk source control, analytics, client bundle, atau pesan error.
- Identifier yang dikirim sebagai `user_id` harus pseudonymous dan tidak mengandung email, telepon, nama, atau data pribadi lainnya.
- Tetapkan dan publikasikan kebijakan retention aplikasi sebelum penyimpanan respons AI diaktifkan pada production.

### 16.4 Internationalization

- Semua string UI menggunakan translation key.
- Locale tidak ditentukan dari string yang tersebar di component.
- Format tanggal dan angka memakai locale-aware formatter.
- Layout tetap benar saat panjang string English dan Indonesia berbeda.
- Tes UI mencakup missing key dan text expansion.

### 16.5 Browser dan responsive support

Target awal:

- versi stabil terbaru Chrome, Edge, Firefox, dan Safari;
- desktop, tablet, dan mobile;
- editor desktop split view;
- editor mobile memakai mode form/preview bergantian.

## 17. Analytics dan success metrics

Analytics harus menghindari isi resume. Event yang diperbolehkan berupa metadata produk, misalnya:

- resume creation started/completed;
- selected UI language;
- selected resume language;
- template selected;
- job analysis started/completed/failed;
- recommendation accepted/edited/rejected;
- export type and success/failure;
- validation category count tanpa isi field.

Metrik produk yang dipantau:

1. completion rate resume pertama;
2. successful export rate;
3. export failure rate;
4. persentase pengguna yang membuat versi bahasa kedua;
5. jumlah resume per active user;
6. recommendation acceptance vs edit vs rejection;
7. recovery rate setelah autosave/network error;
8. persentase export yang lolos automated text extraction check.

Target numerik ditentukan setelah baseline MVP tersedia; jangan membuat target tanpa data awal.

## 18. Error states

Produk minimal menangani:

- autosave gagal;
- storage penuh;
- job description kosong atau terlalu pendek;
- bahasa tidak dapat dideteksi;
- analysis timeout;
- translation gagal sebagian;
- PDF export gagal;
- DOCX export gagal;
- JSON tidak valid atau schema terlalu baru;
- font tidak tersedia;
- content overflow;
- session expired;
- network offline.

Setiap error harus menjelaskan:

1. apa yang gagal;
2. apakah data aman;
3. tindakan yang dapat dilakukan;
4. cara retry tanpa mengulang seluruh pekerjaan.

## 19. Testing strategy

### 19.1 Unit tests

- locale selection dan fallback;
- heading mapping Indonesia/English;
- date formatting;
- resume language switch behavior;
- JSON schema validation dan migration;
- keyword normalization;
- `keepOriginal` behavior;
- quality rule evaluation.
- AI output schema validation;
- unsupported-claim detection untuk angka, skill, perusahaan, pendidikan, dan sertifikasi;
- klasifikasi error retryable vs non-retryable;
- prompt dan output schema version mapping.

### 19.2 Integration tests

- master profile → resume copy/override;
- UI language switch tanpa mengubah data;
- resume language change dengan pilihan heading-only;
- translation review dan partial accept/reject;
- job analysis → recommendation → applied edit;
- autosave dan recovery;
- PDF/DOCX generation.
- DeepSeek response valid → recommendation pending, bukan perubahan langsung;
- JSON invalid/output terpotong → draft tidak berubah;
- timeout/429/5xx → retry terbatas dan editor tetap dapat digunakan;
- accept/edit/reject hanya memodifikasi `targetId` yang ditampilkan;
- data kontak tidak ikut dikirim untuk task yang tidak membutuhkannya.

### 19.3 End-to-end tests

- membuat resume Indonesia sampai export;
- membuat resume English sampai export;
- UI Indonesia + resume English;
- UI English + resume Indonesia;
- membuat versi English dari resume Indonesia tanpa mengubah sumber;
- tailoring dari job description Indonesia;
- tailoring dari job description English;
- mobile create/edit/preview/export flow.

### 19.4 Export verification

Untuk setiap fixture:

- ekstrak PDF dengan `pdftotext`;
- bandingkan urutan teks dengan expected snapshot;
- pastikan nama, email, jabatan, perusahaan, pendidikan, dan skill dapat ditemukan;
- pastikan PDF bukan image-only;
- pastikan tidak ada clipping atau overlap melalui visual regression;
- konversi DOCX ke plain text dan bandingkan struktur;
- uji dokumen 1 halaman, 2 halaman, Unicode, URL panjang, dan entry tanpa end date.

## 20. Definition of Done MVP

MVP dinyatakan selesai ketika:

- [ ] seluruh P0 functional requirement selesai;
- [ ] UI dapat digunakan penuh dalam Bahasa Indonesia dan English;
- [ ] UI language dan resume language terpisah dan teruji;
- [ ] pengguna dapat membuat minimal dua resume dari satu master profile;
- [ ] template Classic ATS memenuhi spesifikasi ATS-safe;
- [ ] job description Indonesia dan English dapat dianalisis;
- [ ] suggestion tidak pernah diterapkan tanpa persetujuan;
- [ ] PDF text-based dapat diekstrak dalam urutan yang benar;
- [ ] JSON export/import tervalidasi;
- [ ] autosave dan recovery diuji;
- [ ] seluruh critical accessibility issue ditutup;
- [ ] tidak ada blocker/critical defect pada alur create, edit, save, analyze, preview, dan export;
- [ ] privacy copy dan disclosure AI tersedia bila provider eksternal digunakan.
- [ ] API key DeepSeek tidak terdapat pada browser bundle atau log;
- [ ] seluruh output AI lolos schema dan claim validation sebelum ditampilkan;
- [ ] kegagalan DeepSeek tidak menghalangi alur manual dan export.

## 21. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| ATS berbeda-beda | Hasil tidak universal | Gunakan format konservatif dan hindari klaim jaminan |
| Translation mengubah fakta | Resume menjadi tidak akurat | Review per section, preserve entities, dan explicit confirmation |
| AI mengarang skill/angka | Kepercayaan pengguna turun | Grounding ke profil, prohibit invention, approval before apply |
| PDF terlihat benar tetapi parsing salah | Data hilang di ATS | Automated `pdftotext` test dan snapshot urutan teks |
| Terjemahan UI tidak lengkap | Pengalaman bilingual tidak konsisten | Translation keys, fallback, missing-key test |
| Resume terlalu padat | Sulit dibaca recruiter | Density warning, page preview, jangan paksa 1 halaman |
| Autosave overwrite data | Kehilangan pekerjaan | Versioning/conflict detection dan local recovery |
| Data pribadi masuk log/provider | Risiko privasi | Redacted logs, consent/disclosure, retention policy |
| Match score dianggap jaminan | Ekspektasi salah | Gunakan istilah relevance dan jelaskan metodologi |

## 22. Dependensi dan keputusan teknis

PRD ini tidak mengunci framework atau vendor. Implementasi perlu menentukan:

- frontend framework;
- state management dan form library;
- persistence lokal vs backend database;
- authentication strategy;
- PDF renderer;
- DOCX renderer;
- i18n library;
- schema validation library;
- AI provider: DeepSeek melalui server-side gateway; model spesifik dikonfigurasi, bukan di-hard-code;
- metode entity preservation saat translation;
- observability tanpa merekam data pribadi;
- deployment platform.

Keputusan tersebut harus dievaluasi berdasarkan fidelity export, privacy, biaya, latency, dan kemudahan pengujian—not hanya kecepatan implementasi awal.

## 23. Open questions

1. Apakah MVP perlu akun, atau cukup local-first tanpa login?
2. Apakah DOCX wajib pada MVP atau tetap P1?
3. Berapa lama input/output AI disimpan oleh aplikasi, dan apakah pengguna dapat memilih mode tanpa penyimpanan respons?
4. Apakah job description dapat dimasukkan melalui URL, atau hanya paste text pada MVP?
5. Apakah master profile menyimpan satu bahasa sumber atau localized variants per field?
6. Apakah pengguna dapat menambahkan custom section pada MVP?
7. Berapa batas ukuran job description dan jumlah resume pada paket gratis?
8. Apakah export diberi watermark pada paket gratis?
9. Apakah shareable preview termasuk MVP?
10. Apakah data pengguna disimpan di region tertentu?

## 24. Dokumen terkait

- [`IDEA.md`](IDEA.md) — ringkasan konsep produk.
- [`docs/ATS_FRIENDLY_RESUME_SPEC.md`](docs/ATS_FRIENDLY_RESUME_SPEC.md) — hasil riset dan aturan format ATS-safe.
- [`docs/DEEPSEEK_AI_INTEGRATION_SPEC.md`](docs/DEEPSEEK_AI_INTEGRATION_SPEC.md) — kontrak provider, structured output, grounding, privacy, dan failure handling.

## 25. Ringkasan keputusan bilingual

Keputusan inti bilingual untuk implementasi:

1. `uiLocale`, `resumeLanguage`, dan `jobLanguage` harus disimpan secara terpisah.
2. Mengganti bahasa UI tidak pernah mengubah isi resume.
3. Mengganti bahasa resume hanya mengubah heading/default formatting sampai pengguna menyetujui translation.
4. Translation dilakukan pada salinan atau melalui review eksplisit.
5. Versi Indonesia dan English dapat dibuat dari profil yang sama tanpa saling menimpa.
6. Nama, perusahaan, produk, teknologi, URL, angka, dan istilah `keepOriginal` dipertahankan.
7. Suggestion mengikuti bahasa resume sambil mempertahankan keyword lowongan yang relevan.
8. Heading tersedia dalam padanan standar Indonesia dan English.
9. Quality checker mendeteksi campuran bahasa yang tidak disengaja.
10. Semua output tetap mengikuti spesifikasi ATS-safe yang sama.
