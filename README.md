# ResumeMaker

Resume builder bilingual dengan editor terstruktur, preview Classic ATS satu kolom, autosave lokal, quality checks, DOCX/PDF native, dan tailoring berbasis DeepSeek.

## Menjalankan aplikasi

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

Editor, preview, autosave, quality checks, serta export DOCX/PDF tetap dapat digunakan tanpa API key. Untuk fitur AI, isi `DEEPSEEK_API_KEY` di `.env.local`. Jangan memakai prefix `NEXT_PUBLIC_` untuk secret ini.

## Perintah pemeriksaan

```bash
npm run test
npm run lint
npm run build
```

## Export ATS-safe

- **Export DOCX** membuat dokumen Word native satu kolom, tanpa tabel layout, header/footer, text box, atau gambar.
- **Export PDF** membuat PDF A4 berbasis teks dengan urutan baca linear.
- Tes export mengekstrak kembali teks DOCX dan PDF untuk memeriksa urutan section.

## Batas MVP

- Penyimpanan masih local-first pada browser, tanpa akun atau sinkronisasi.
- Skor kelengkapan dipisahkan dari skor kecocokan keyword. Keduanya bukan probabilitas lolos ATS.
- Translation penuh dan sinkronisasi akun belum tersedia.
- Model DeepSeek dapat berubah melalui `DEEPSEEK_MODEL` tanpa mengubah source UI.

## Dokumen produk

- [PRD](PRD.md)
- [Spesifikasi ATS](docs/ATS_FRIENDLY_RESUME_SPEC.md)
- [Spesifikasi integrasi DeepSeek](docs/DEEPSEEK_AI_INTEGRATION_SPEC.md)
