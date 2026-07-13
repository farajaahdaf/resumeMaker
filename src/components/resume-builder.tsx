"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { AlertCircle, Bot, Check, CheckCircle2, ChevronRight, Download, FileText, Gauge, LoaderCircle, PanelRight, Printer, ShieldCheck, Sparkles, Undo2, Wand2 } from "lucide-react";
import { type AiOutput, type AiRecommendation } from "@/domain/ai";
import { calculateCompletionScore, calculateKeywordMatch, type JobKeyword, type KeywordMatch } from "@/domain/ats";
import { evaluateResume } from "@/domain/quality";
import { resumeSchema, sampleResume, type Resume } from "@/domain/resume";
import { ContentEditor, ProfileEditor } from "@/components/editor-sections";
import { ResumePreview } from "@/components/resume-preview";
import { OnboardingFlow } from "@/components/onboarding-flow";

const STORAGE_KEY = "resumemaker:v1:active-resume";
const ONBOARDING_KEY = "resumemaker:v1:onboarded";
type Tab = "profile" | "content" | "tailor" | "quality";
type AiMode = "match" | "clarity" | "shorten" | "detail";

export function ResumeBuilder() {
  const [resume, setResume] = useState<Resume>(sampleResume);
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<Tab>("profile");
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [saveState, setSaveState] = useState<"saved" | "saving" | "failed">("saved");
  const [aiMode, setAiMode] = useState<AiMode>("match");
  const [jobDescription, setJobDescription] = useState("");
  const [aiResult, setAiResult] = useState<AiOutput | null>(null);
  const [jobKeywords, setJobKeywords] = useState<JobKeyword[]>([]);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [aiState, setAiState] = useState<"idle" | "loading" | "error">("idle");
  const [aiError, setAiError] = useState("");
  const [notice, setNotice] = useState("");
  const [history, setHistory] = useState<Resume[]>([]);
  const [exportState, setExportState] = useState<"idle" | "docx" | "pdf">("idle");
  const issues = useMemo(() => evaluateResume(resume, { keywords: jobKeywords }), [resume, jobKeywords]);
  const completionScore = calculateCompletionScore(resume);
  const keywordMatch = useMemo(() => calculateKeywordMatch(resume, jobKeywords), [resume, jobKeywords]);
  const assistantHint = useMemo(() => getAssistantHint(resume, issues.length), [resume, issues.length]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setResume(resumeSchema.parse(JSON.parse(stored)));
        setOnboarded(localStorage.getItem(ONBOARDING_KEY) === "true");
      } catch { setSaveState("failed"); }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timeout = window.setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...resume, updatedAt: new Date().toISOString() })); setSaveState("saved"); }
      catch { setSaveState("failed"); }
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [hydrated, resume]);

  const updateResume = (next: Resume) => setResume({ ...next, updatedAt: new Date().toISOString() });
  const completeOnboarding = (next: Resume) => {
    setResume(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    localStorage.setItem(ONBOARDING_KEY, "true");
    setOnboarded(true);
  };
  const analyze = async () => {
    setAiState("loading"); setAiError("");
    try {
      const response = await fetch("/api/ai/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume, jobDescription, mode: aiMode }) });
      const data = await response.json() as AiOutput & { message?: string };
      if (!response.ok) throw new Error(data.message || "Analisis gagal.");
      setAiResult(data);
      if (aiMode === "match") setJobKeywords(data.keywords);
      setRecommendations(data.recommendations.map((item) => ({ ...item, status: "pending" })));
      setAiState("idle");
    } catch (error) { setAiState("error"); setAiError(error instanceof Error ? error.message : "Analisis gagal."); }
  };

  const focusAi = (targetId: string) => { setAiMode("match"); setTab("tailor"); setNotice(`AI Tools akan membuat saran untuk ${targetLabel(targetId, resume)}.`); };
  const updateAiInput = (value: string) => {
    setJobDescription(value);
    setAiResult(null);
    setRecommendations([]);
    if (aiMode === "match") setJobKeywords([]);
  };
  const applyRecommendation = (item: AiRecommendation, editedText?: string) => {
    if (item.unsupportedClaims.length) return;
    const proposedText = editedText ?? item.proposedText;
    setHistory((current) => [...current.slice(-9), resume]);
    const next = applyRecommendationToResume(resume, item, proposedText);
    setResume(next);
    setRecommendations((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: editedText ? "edited" : "accepted" } : entry));
    setNotice(`Saran AI sudah diterapkan ke ${targetLabel(item.targetId, resume)}.`);
  };
  const applySafeRecommendations = () => {
    const safeItems = recommendations.filter((item) => item.status === "pending" && item.operation !== "none" && !item.unsupportedClaims.length);
    if (!safeItems.length) return;
    setHistory((current) => [...current.slice(-9), resume]);
    const next = safeItems.reduce((current, item) => applyRecommendationToResume(current, item, item.proposedText), resume);
    setResume(next);
    setRecommendations((current) => current.map((entry) => safeItems.some((item) => item.id === entry.id) ? { ...entry, status: "accepted" } : entry));
    setNotice(`${safeItems.length} saran AI sudah diterapkan ke resume.`);
  };

  const undo = () => { const previous = history.at(-1); if (previous) { setResume(previous); setHistory((current) => current.slice(0, -1)); } };
  const exportResume = async (format: "docx" | "pdf") => {
    setExportState(format);
    try {
      await downloadResume(resume, format);
      setNotice(`${format === "docx" ? "DOCX" : "PDF"} ATS-safe berhasil dibuat.`);
    } catch {
      setNotice("File gagal dibuat. Coba lagi beberapa saat.");
    } finally {
      setExportState("idle");
    }
  };
  const exportWord = () => void exportResume("docx");
  const exportPdf = () => void exportResume("pdf");

  if (!hydrated) return <div className="onboarding-loading" aria-label="Memuat ResumeMaker"><span className="brand-mark">R</span><div className="typing-dots"><span /><span /><span /></div></div>;
  if (!onboarded) return <OnboardingFlow onComplete={completeOnboarding} />;

  return <main className="app-shell">
    <header className="app-header no-print">
      <a className="brand" href="#top" aria-label="ResumeMaker home"><span className="brand-mark">R</span><span>ResumeMaker</span></a>
      <div className="header-actions"><span className={`save-state ${saveState}`} aria-live="polite">{saveState === "saving" ? <LoaderCircle size={14} className="spin" /> : saveState === "saved" ? <Check size={14} /> : <AlertCircle size={14} />}{saveState === "saving" ? "Menyimpan" : saveState === "saved" ? "Tersimpan lokal" : "Gagal menyimpan"}</span><button className="icon-button" type="button" aria-label="Undo perubahan terakhir" disabled={!history.length} onClick={undo}><Undo2 size={18} /></button><button className="secondary-button ai-tools-button" type="button" onClick={() => setTab("tailor")}><Wand2 size={17} />AI Tools</button><button className="secondary-button" type="button" disabled={exportState !== "idle"} onClick={exportWord}>{exportState === "docx" ? <LoaderCircle className="spin" size={17} /> : <FileText size={17} />}Export DOCX</button><button className="primary-button" type="button" disabled={exportState !== "idle"} onClick={exportPdf}>{exportState === "pdf" ? <LoaderCircle className="spin" size={17} /> : <Printer size={17} />}Export PDF</button></div>
    </header>
    <section className="workspace" id="top">
      <aside className="rail no-print" aria-label="Tahapan editor"><div className="progress-card score-card"><div className="score-ring" style={{ "--score": `${completionScore}%` } as CSSProperties}><span>{completionScore}</span></div><div><span className="eyebrow">Kelengkapan profil</span><strong>{resume.title}</strong><small>{issues.length ? `${issues.length} hal perlu ditinjau` : "Siap diekspor"}</small></div></div><nav>{([['profile', 'Profil'], ['content', 'Konten'], ['tailor', 'AI Tools'], ['quality', 'Quality Check']] as [Tab, string][]).map(([id, label], index) => <button key={id} type="button" className={tab === id ? "active" : ""} onClick={() => setTab(id)}><span>{index + 1}</span>{label}<ChevronRight size={16} /></button>)}</nav><div className="assistant-card"><Bot size={20} /><div><strong>{assistantHint.title}</strong><p>{assistantHint.body}</p><button type="button" onClick={() => setTab(assistantHint.tab)}>{assistantHint.action}<ChevronRight size={14} /></button></div></div></aside>
      <section className={`editor-panel no-print ${mobileView === "preview" ? "mobile-hidden" : ""}`}>
        <div className="panel-heading"><div><span className="eyebrow">Langkah {tab === "profile" ? "1" : tab === "content" ? "2" : tab === "tailor" ? "3" : "4"}</span><h1>{tab === "profile" ? "Informasi utama" : tab === "content" ? "Susun pengalaman Anda" : tab === "tailor" ? "Sesuaikan dengan lowongan" : "Periksa sebelum ekspor"}</h1></div><label className="language-select">Bahasa resume<select value={resume.language} onChange={(event) => setResume({ ...resume, language: event.target.value as "id" | "en" })}><option value="id">Indonesia</option><option value="en">English</option></select></label></div>
        {notice ? <div className="notice" role="status">{notice}<button type="button" onClick={() => setNotice("")} aria-label="Tutup pemberitahuan">×</button></div> : null}
        {tab === "profile" ? <ProfileEditor resume={resume} onChange={updateResume} /> : null}
        {tab === "content" ? <ContentEditor resume={resume} onChange={updateResume} onImprove={focusAi} /> : null}
        {tab === "tailor" ? <TailorPanel mode={aiMode} setMode={setAiMode} jobDescription={jobDescription} setJobDescription={updateAiInput} onAnalyze={analyze} state={aiState} error={aiError} result={aiResult} keywordMatch={keywordMatch} recommendations={recommendations} onAccept={applyRecommendation} onAcceptAll={applySafeRecommendations} onReject={(item) => setRecommendations((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: "rejected" } : entry))} /> : null}
        {tab === "quality" ? <QualityPanel issues={issues} resume={resume} keywordMatch={keywordMatch} exportState={exportState} onExportWord={exportWord} onExportPdf={exportPdf} /> : null}
      </section>
      <section className={`preview-panel ${mobileView === "editor" ? "mobile-hidden" : ""}`}><div className="preview-toolbar no-print"><div><PanelRight size={17} />Editable preview</div><span>Klik teks untuk edit · ATS-safe · A4</span></div><div className="preview-stage"><ResumePreview resume={resume} onChange={updateResume} /></div></section>
    </section>
    <div className="mobile-switch no-print"><button className={mobileView === "editor" ? "active" : ""} onClick={() => setMobileView("editor")}>Editor</button><button className={mobileView === "preview" ? "active" : ""} onClick={() => setMobileView("preview")}>Preview</button></div>
  </main>;
}

function TailorPanel({ mode, setMode, jobDescription, setJobDescription, onAnalyze, state, error, result, keywordMatch, recommendations, onAccept, onAcceptAll, onReject }: { mode: AiMode; setMode: (mode: AiMode) => void; jobDescription: string; setJobDescription: (value: string) => void; onAnalyze: () => void; state: string; error: string; result: AiOutput | null; keywordMatch: KeywordMatch | null; recommendations: AiRecommendation[]; onAccept: (item: AiRecommendation, edited?: string) => void; onAcceptAll: () => void; onReject: (item: AiRecommendation) => void }) {
  const safeCount = recommendations.filter((item) => item.status === "pending" && item.operation !== "none" && !item.unsupportedClaims.length).length;
  const tools: Array<{ id: AiMode; title: string; body: string }> = [
    { id: "match", title: "Match job", body: "Cocokkan resume dengan lowongan." },
    { id: "clarity", title: "Improve clarity", body: "Rapikan kalimat yang terlalu lemah." },
    { id: "shorten", title: "Shorten", body: "Ringkas tanpa mengubah makna." },
    { id: "detail", title: "Add detail", body: "Tambah detail yang sudah terbukti." },
  ];
  const inputLabel = mode === "match" ? "Deskripsi pekerjaan" : "Instruksi tambahan";
  const helper = mode === "match" ? "Tempel minimal 80 karakter." : "Contoh: fokus ke ringkasan dan bullet pengalaman.";
  const minLength = mode === "match" ? 80 : 10;
  return <div className="editor-stack"><div className="ai-disclosure"><Sparkles size={20} /><div><strong>AI Tools</strong><p>Pilih mode, lihat saran, lalu terapkan langsung ke resume.</p></div></div><div className="ai-tool-grid">{tools.map((tool) => <button key={tool.id} type="button" className={mode === tool.id ? "active" : ""} onClick={() => setMode(tool.id)}><Wand2 size={17} /><strong>{tool.title}</strong><small>{tool.body}</small></button>)}</div><label className="field"><span>{inputLabel}</span><small>{helper}</small><textarea rows={mode === "match" ? 8 : 4} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder={mode === "match" ? "Tempel job description di sini..." : "Tulis instruksi singkat untuk AI..."} /></label><button className="primary-button wide" type="button" disabled={jobDescription.trim().length < minLength || state === "loading"} onClick={onAnalyze}>{state === "loading" ? <><LoaderCircle className="spin" size={17} />Menganalisis...</> : <><Gauge size={17} />Jalankan AI Tool</>}</button>{error ? <div className="error-message" role="alert"><AlertCircle size={18} />{error}</div> : null}{mode === "match" && keywordMatch ? <MatchScore match={keywordMatch} /> : null}{result ? <div className="keyword-block"><div className="section-row"><h3>{mode === "match" ? "Keyword lowongan" : "Fokus AI"}</h3><small>{result.detectedLanguage.toUpperCase()}</small></div><div className="chips">{result.keywords.map((keyword) => <span key={`${keyword.category}-${keyword.term}`} className={keyword.required ? "required" : ""}>{keyword.term}</span>)}</div></div> : null}{recommendations.length ? <div className="suggestion-toolbar"><strong>{safeCount} saran aman bisa diterapkan</strong><button className="secondary-button compact" type="button" disabled={!safeCount} onClick={onAcceptAll}><Download size={15} />Terapkan semua</button></div> : null}<div className="recommendation-list">{recommendations.map((item) => <RecommendationCard item={item} key={item.id} onAccept={onAccept} onReject={onReject} />)}</div></div>;
}

function MatchScore({ match }: { match: KeywordMatch }) {
  return <section className="match-score" aria-label="Kecocokan keyword"><div className="match-score-number"><strong>{match.score}%</strong><span>Kecocokan keyword</span></div><div><p>{match.matched.length} cocok · {match.missing.length} belum ditemukan</p><small>Indikator relevansi isi, bukan probabilitas lolos ATS.</small></div></section>;
}

function RecommendationCard({ item, onAccept, onReject }: { item: AiRecommendation; onAccept: (item: AiRecommendation, edited?: string) => void; onReject: (item: AiRecommendation) => void }) {
  const [edited, setEdited] = useState(item.proposedText); const done = item.status !== "pending";
  return <article className={`recommendation-card ${done ? "resolved" : ""}`}><div className="recommendation-head"><span><Sparkles size={16} />Saran untuk {item.targetId}</span>{done ? <strong>{item.status}</strong> : null}</div><p className="reason">{item.reason}</p>{item.operation !== "none" ? <><div className="diff"><div><small>Sebelum</small><p>{item.originalText || "—"}</p></div><div><small>Sesudah</small><textarea aria-label="Edit teks saran" rows={4} value={edited} disabled={done} onChange={(event) => setEdited(event.target.value)} /></div></div>{item.relatedKeywords.length ? <p className="related">Keyword: {item.relatedKeywords.join(", ")}</p> : null}{item.unsupportedClaims.length ? <div className="warning-inline"><AlertCircle size={16} />Tidak dapat diterapkan: klaim baru {item.unsupportedClaims.join(", ")}</div> : null}<div className="card-actions"><button className="secondary-button" type="button" disabled={done} onClick={() => onReject(item)}>Tolak</button><button className="primary-button" type="button" disabled={done || !!item.unsupportedClaims.length} onClick={() => onAccept(item, edited === item.proposedText ? undefined : edited)}><Check size={16} />{edited === item.proposedText ? "Terima" : "Simpan edit"}</button></div></> : <div className="warning-inline"><AlertCircle size={16} />Bukti pada profil belum cukup untuk membuat perubahan.</div>}</article>;
}

function QualityPanel({ issues, resume, keywordMatch, exportState, onExportWord, onExportPdf }: { issues: ReturnType<typeof evaluateResume>; resume: Resume; keywordMatch: KeywordMatch | null; exportState: "idle" | "docx" | "pdf"; onExportWord: () => void; onExportPdf: () => void }) {
  return <div className="editor-stack">{keywordMatch ? <MatchScore match={keywordMatch} /> : <div className="quality-note"><Gauge size={18} /><div><strong>Belum ada skor kecocokan</strong><p>Jalankan Match job di AI Tools untuk membandingkan keyword lowongan.</p></div></div>}{issues.length ? <div className="issue-list">{issues.map((issue) => <article key={issue.id} className={`issue ${issue.severity}`}>{issue.severity === "suggestion" ? <CheckCircle2 size={19} /> : <AlertCircle size={19} />}<div><strong>{issue.title}</strong><p>{issue.detail}</p></div></article>)}</div> : <div className="success-state"><CheckCircle2 size={32} /><h3>Resume siap diekspor</h3><p>Tidak ada masalah format atau kelengkapan yang ditemukan.</p></div>}<div className="export-card"><h3>File ATS-safe</h3><p>DOCX native untuk sistem yang meminta Word. PDF berisi teks asli dengan urutan satu kolom.</p><div className="export-actions"><button className="primary-button" disabled={exportState !== "idle"} onClick={onExportWord}>{exportState === "docx" ? <LoaderCircle className="spin" size={17} /> : <FileText size={17} />}Export DOCX</button><button className="secondary-button" disabled={exportState !== "idle"} onClick={onExportPdf}>{exportState === "pdf" ? <LoaderCircle className="spin" size={17} /> : <Printer size={17} />}Export PDF</button></div><small>Nama file: {safeName(resume.contact.fullName || "resume")}.docx / .pdf</small></div></div>;
}

function getAssistantHint(resume: Resume, issueCount: number): { title: string; body: string; action: string; tab: Tab } {
  if (!resume.contact.email.trim() || !resume.contact.fullName.trim()) return { title: "Lengkapi profil", body: "Nama dan email membuat resume siap dikirim.", action: "Buka profil", tab: "profile" };
  if (!resume.summary.trim() || !resume.skills.trim()) return { title: "Isi konten inti", body: "Ringkasan dan skills biasanya dibaca paling awal.", action: "Buka konten", tab: "content" };
  if (issueCount) return { title: "Ada yang perlu dicek", body: "Quality check menemukan hal kecil sebelum export.", action: "Cek kualitas", tab: "quality" };
  return { title: "Siap ditailor", body: "Gunakan AI Tools untuk mencocokkan resume ke lowongan.", action: "Buka AI Tools", tab: "tailor" };
}

function safeName(value: string) { return value.trim().replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_|_$/g, "") || "resume"; }

function targetLabel(targetId: string, resume: Resume) {
  if (targetId === "summary") return "ringkasan";
  if (targetId === "skills") return "keahlian";
  const experienceIndex = resume.experiences.findIndex((item) => item.bullets.some((bullet) => bullet.id === targetId));
  if (experienceIndex >= 0) return `bullet pengalaman ${experienceIndex + 1}`;
  const projectIndex = resume.projects.findIndex((item) => item.bullets.some((bullet) => bullet.id === targetId));
  return projectIndex >= 0 ? `bullet proyek ${projectIndex + 1}` : "bagian ini";
}

function applyRecommendationToResume(resume: Resume, item: AiRecommendation, proposedText: string) {
  if (item.targetId === "summary") return { ...resume, summary: proposedText, updatedAt: new Date().toISOString() };
  if (item.targetId === "skills") return { ...resume, skills: item.operation === "append" ? [resume.skills, proposedText].filter(Boolean).join(", ") : proposedText, updatedAt: new Date().toISOString() };
  return {
    ...resume,
    updatedAt: new Date().toISOString(),
    experiences: resume.experiences.map((experience) => ({ ...experience, bullets: experience.bullets.map((bullet) => bullet.id === item.targetId ? { ...bullet, text: proposedText } : bullet) })),
    projects: resume.projects.map((project) => ({ ...project, bullets: project.bullets.map((bullet) => bullet.id === item.targetId ? { ...bullet, text: proposedText } : bullet) })),
  };
}

async function downloadResume(resume: Resume, format: "docx" | "pdf") {
  const response = await fetch(`/api/export/${format}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });
  if (!response.ok) throw new Error("Export failed");
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${safeName(resume.contact.fullName || "resume")}.${format}`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
