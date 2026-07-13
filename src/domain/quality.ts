import { calculateKeywordMatch, type JobKeyword } from "@/domain/ats";
import type { Resume } from "@/domain/resume";

export type QualityIssue = { id: string; severity: "error" | "warning" | "suggestion"; title: string; detail: string };
export type QualityOptions = { keywords?: JobKeyword[] };

const monthNames = "jan|january|feb|february|mar|march|apr|april|may|mei|jun|june|jul|july|aug|august|agu|agustus|sep|sept|september|oct|october|okt|oktober|nov|november|dec|december|des|desember";
const presentTerms = /^(present|current|now|sekarang|saat ini)$/i;
const monthYearPattern = new RegExp(`^(?:${monthNames})[ ./-]+(?:19|20)\\d{2}$`, "i");
const numericMonthYearPattern = /^(?:0?[1-9]|1[0-2])[\/-](?:19|20)\d{2}$/;
const yearPattern = /^(?:19|20)\d{2}$/;

export function evaluateResume(resume: Resume, options: QualityOptions = {}): QualityIssue[] {
  const issues: QualityIssue[] = [];
  const add = (issue: QualityIssue) => issues.push(issue);

  if (!resume.contact.fullName.trim()) add({ id: "name", severity: "error", title: "Nama belum diisi", detail: "Nama lengkap diperlukan sebelum ekspor." });
  if (!resume.contact.email.trim()) add({ id: "email", severity: "error", title: "Email belum diisi", detail: "Tambahkan email profesional yang dapat dihubungi." });
  else if (!isEmail(resume.contact.email)) add({ id: "email-format", severity: "error", title: "Format email belum valid", detail: "Gunakan format seperti nama@domain.com tanpa spasi." });

  if (!resume.contact.phone.trim()) add({ id: "phone", severity: "suggestion", title: "Nomor telepon masih kosong", detail: "Tambahkan nomor yang aktif agar recruiter mudah menghubungi Anda." });
  else if (!isPhone(resume.contact.phone)) add({ id: "phone-format", severity: "warning", title: "Periksa nomor telepon", detail: "Gunakan 7–15 digit dan sertakan kode negara bila melamar ke luar negeri." });

  for (const [id, label, value] of [
    ["linkedin-format", "LinkedIn", resume.contact.linkedin],
    ["portfolio-format", "Portfolio", resume.contact.portfolio],
  ] as const) {
    if (value.trim() && !isWebAddress(value)) add({ id, severity: "warning", title: `${label} belum berupa alamat valid`, detail: "Gunakan alamat lengkap seperti linkedin.com/in/nama atau https://domain.com." });
  }

  if (!resume.targetRole.trim()) add({ id: "target-role", severity: "warning", title: "Target role belum diisi", detail: "Target role membantu menjaga isi resume tetap relevan." });

  const summaryLength = wordCount(resume.summary);
  if (!resume.summary.trim()) add({ id: "summary", severity: "suggestion", title: "Ringkasan masih kosong", detail: "Tambahkan ringkasan 30–100 kata yang relevan dengan target role." });
  else if (summaryLength < 20) add({ id: "summary-short", severity: "suggestion", title: "Ringkasan terlalu singkat", detail: "Tambahkan konteks keahlian, pengalaman, dan nilai utama tanpa membuat klaim baru." });
  else if (summaryLength > 120) add({ id: "summary-long", severity: "warning", title: "Ringkasan terlalu panjang", detail: "Ringkas menjadi sekitar 30–100 kata agar mudah dipindai." });

  const skills = splitSkills(resume.skills);
  if (!skills.length) add({ id: "skills", severity: "warning", title: "Keahlian masih kosong", detail: "Cantumkan keahlian yang benar-benar Anda miliki." });
  const duplicates = duplicateValues(skills);
  if (duplicates.length) add({ id: "duplicate-skills", severity: "warning", title: "Ada keahlian berulang", detail: `Hapus duplikasi: ${duplicates.join(", ")}.` });

  const bullets = [...resume.experiences.flatMap((item) => item.bullets), ...resume.projects.flatMap((item) => item.bullets)].filter((bullet) => bullet.text.trim());
  if (bullets.some((bullet) => bullet.text.length > 260)) add({ id: "long-bullet", severity: "warning", title: "Bullet terlalu panjang", detail: "Usahakan satu bullet di bawah 260 karakter agar mudah dipindai recruiter." });
  if (bullets.some((bullet) => wordCount(bullet.text) < 5)) add({ id: "short-bullet", severity: "suggestion", title: "Ada bullet yang terlalu pendek", detail: "Jelaskan tindakan dan hasil secara ringkas, tanpa mengarang metrik." });
  const duplicateBullets = duplicateValues(bullets.map((bullet) => bullet.text));
  if (duplicateBullets.length) add({ id: "duplicate-bullets", severity: "warning", title: "Ada bullet berulang", detail: "Setiap bullet sebaiknya menyampaikan kontribusi yang berbeda." });

  if (resume.experiences.some((item) => !item.role.trim() || !item.company.trim())) add({ id: "experience", severity: "warning", title: "Pengalaman belum lengkap", detail: "Jabatan dan perusahaan membantu ATS memahami riwayat Anda." });
  if (resume.experiences.some((item) => !item.bullets.some((bullet) => bullet.text.trim()))) add({ id: "experience-bullets", severity: "warning", title: "Pengalaman belum memiliki bullet", detail: "Tambahkan kontribusi utama untuk setiap pengalaman kerja." });

  const experienceDates = resume.experiences.flatMap((item) => [item.startDate, item.endDate]).filter((value) => value.trim());
  if (resume.experiences.some((item) => !item.startDate.trim())) add({ id: "missing-date", severity: "warning", title: "Tanggal mulai belum lengkap", detail: "Cantumkan tanggal pengalaman dengan format konsisten, misalnya Jan 2024." });
  if (experienceDates.some((value) => !isResumeDate(value))) add({ id: "date-format", severity: "warning", title: "Format tanggal belum konsisten", detail: "Gunakan MMM YYYY, MM/YYYY, YYYY, atau Present/Sekarang." });
  const dateStyles = new Set(experienceDates.map(dateStyle).filter(Boolean));
  if (dateStyles.size > 1) add({ id: "date-consistency", severity: "suggestion", title: "Gaya tanggal bercampur", detail: "Gunakan satu gaya yang sama pada semua pengalaman, misalnya Jan 2024." });
  if (resume.experiences.some((item) => isReverseRange(item.startDate, item.endDate))) add({ id: "date-order", severity: "error", title: "Urutan tanggal tidak valid", detail: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai." });

  if (resume.education.some((item) => !item.degree.trim() || !item.institution.trim())) add({ id: "education", severity: "warning", title: "Pendidikan belum lengkap", detail: "Cantumkan gelar/jurusan dan institusi untuk setiap entri." });
  if (resume.education.some((item) => item.graduationDate.trim() && !isResumeDate(item.graduationDate))) add({ id: "education-date", severity: "suggestion", title: "Periksa tanggal pendidikan", detail: "Gunakan tahun atau bulan dan tahun yang konsisten." });
  if (resume.projects.some((item) => !item.name.trim() || !item.bullets.some((bullet) => bullet.text.trim()))) add({ id: "project", severity: "suggestion", title: "Proyek belum lengkap", detail: "Cantumkan nama dan setidaknya satu kontribusi untuk setiap proyek." });

  const match = calculateKeywordMatch(resume, options.keywords ?? []);
  if (match && match.missing.some((keyword) => keyword.required)) {
    const missing = match.missing.filter((keyword) => keyword.required).slice(0, 6).map((keyword) => keyword.term);
    add({ id: "missing-keywords", severity: "suggestion", title: "Keyword wajib belum ditemukan", detail: `Tinjau keyword ini dan tambahkan hanya jika benar Anda miliki: ${missing.join(", ")}.` });
  }

  return issues;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
}

function isPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15 && /^[+\d][\d\s().-]+$/.test(value.trim());
}

function isWebAddress(value: string) {
  try {
    const url = new URL(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`);
    return url.hostname.includes(".") && !url.hostname.includes(" ");
  } catch {
    return false;
  }
}

function splitSkills(value: string) {
  return value.split(/[,;\n]/).map((skill) => skill.trim()).filter(Boolean);
}

function duplicateValues(values: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    const normalized = value.toLocaleLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(normalized)) duplicates.add(value.trim());
    else seen.add(normalized);
  }
  return [...duplicates];
}

function wordCount(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

function isResumeDate(value: string) {
  const clean = value.trim();
  return presentTerms.test(clean) || yearPattern.test(clean) || monthYearPattern.test(clean) || numericMonthYearPattern.test(clean);
}

function dateStyle(value: string) {
  const clean = value.trim();
  if (presentTerms.test(clean)) return "";
  if (yearPattern.test(clean)) return "year";
  if (monthYearPattern.test(clean)) return "month-name";
  if (numericMonthYearPattern.test(clean)) return "month-number";
  return "invalid";
}

function isReverseRange(startDate: string, endDate: string) {
  if (!startDate.trim() || !endDate.trim() || presentTerms.test(endDate.trim())) return false;
  const start = dateValue(startDate);
  const end = dateValue(endDate);
  return start !== null && end !== null && end < start;
}

function dateValue(value: string) {
  const clean = value.trim().toLocaleLowerCase();
  if (yearPattern.test(clean)) return Number(clean) * 12;
  const numeric = clean.match(/^(\d{1,2})[\/-]((?:19|20)\d{2})$/);
  if (numeric) return Number(numeric[2]) * 12 + Number(numeric[1]);
  const named = clean.match(/^([a-z]+)[ .\/-]+((?:19|20)\d{2})$/);
  if (!named) return null;
  const aliases = ["jan", "feb", "mar", "apr", "may|mei", "jun", "jul", "aug|agu", "sep", "oct|okt", "nov", "dec|des"];
  const month = aliases.findIndex((alias) => new RegExp(`^(?:${alias})`).test(named[1]));
  return month >= 0 ? Number(named[2]) * 12 + month + 1 : null;
}
