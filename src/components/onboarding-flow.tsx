"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, GraduationCap, Languages, ShieldCheck, UserRound } from "lucide-react";
import { createId, type Resume } from "@/domain/resume";

type Answers = {
  language: "id" | "en";
  persona: "fresh" | "professional";
  fullName: string;
  targetRole: string;
  email: string;
  phone: string;
  location: string;
  skills: string;
};

const initialAnswers: Answers = { language: "id", persona: "professional", fullName: "", targetRole: "", email: "", phone: "", location: "", skills: "" };

export function OnboardingFlow({ onComplete }: { onComplete: (resume: Resume) => void }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [answers, setAnswers] = useState(initialAnswers);
  const totalQuestions = 7;
  const progress = step === 0 ? 4 : Math.round((step / totalQuestions) * 100);
  const canContinue = useMemo(() => {
    if (step === 3) return answers.fullName.trim().length >= 2;
    if (step === 4) return answers.targetRole.trim().length >= 2;
    if (step === 5) return answers.email.includes("@") && answers.location.trim().length >= 2;
    if (step === 6) return answers.skills.trim().length >= 2;
    return true;
  }, [answers, step]);

  const next = () => { if (canContinue) { setDirection("forward"); setStep((current) => Math.min(totalQuestions, current + 1)); } };
  const back = () => { setDirection("back"); setStep((current) => Math.max(0, current - 1)); };
  const update = <K extends keyof Answers>(key: K, value: Answers[K]) => setAnswers((current) => ({ ...current, [key]: value }));
  const finish = () => {
    const now = new Date().toISOString();
    onComplete({
      schemaVersion: "1.0",
      id: createId(),
      title: `${answers.targetRole} Resume`,
      language: answers.language,
      targetRole: answers.targetRole.trim(),
      contact: { fullName: answers.fullName.trim(), email: answers.email.trim(), phone: answers.phone.trim(), location: answers.location.trim(), linkedin: "", portfolio: "" },
      summary: "",
      skills: answers.skills.trim(),
      experiences: [],
      education: [],
      projects: [],
      certifications: "",
      updatedAt: now,
    });
  };

  return <main className="onboarding-shell">
    <header className="onboarding-header"><a className="brand onboarding-brand" href="#onboarding"><span className="brand-mark">RM</span><span>ResumeMaker</span></a>{step > 0 ? <div className="onboarding-progress-label"><span>{Math.min(step, totalQuestions)} / {totalQuestions}</span><strong>{progress}%</strong></div> : <div className="privacy-pill"><ShieldCheck size={15} />Local save</div>}</header>
    <div className="onboarding-progress" role="progressbar" aria-label="Progres onboarding" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
    <section className="onboarding-stage" id="onboarding">
      <div key={step} className={`question-card question-${direction}`}>
        {step === 0 ? <Welcome onStart={next} /> : null}
        {step === 1 ? <ChoiceQuestion icon={<Languages />} eyebrow="Bahasa resume" title="Resume ini mau bicara dalam bahasa apa?" description="Bahasa aplikasi dan resume tetap bisa berbeda." options={[{ id: "id", title: "Bahasa Indonesia", detail: "Cocok untuk perusahaan lokal" }, { id: "en", title: "English", detail: "Untuk peluang regional dan global" }]} value={answers.language} onSelect={(value) => update("language", value as Answers["language"])} /> : null}
        {step === 2 ? <ChoiceQuestion icon={<UserRound />} eyebrow="Tentang kamu" title="Kamu sedang berada di tahap mana?" description="Kami akan menyesuaikan urutan dan pertanyaan berikutnya." options={[{ id: "fresh", title: "Fresh graduate", detail: "Fokus ke pendidikan, proyek, dan organisasi", icon: <GraduationCap /> }, { id: "professional", title: "Sudah berpengalaman", detail: "Fokus ke dampak dan pencapaian kerja", icon: <BriefcaseBusiness /> }]} value={answers.persona} onSelect={(value) => update("persona", value as Answers["persona"])} /> : null}
        {step === 3 ? <InputQuestion eyebrow="Perkenalan" title="Siapa nama yang akan recruiter ingat?" description="Gunakan nama lengkap seperti pada dokumen profesionalmu."><AnimatedField autoFocus label="Nama lengkap" autoComplete="name" value={answers.fullName} placeholder="Contoh: Ayu Pratama" onChange={(value) => update("fullName", value)} /></InputQuestion> : null}
        {step === 4 ? <InputQuestion eyebrow="Tujuan" title="Pekerjaan apa yang sedang kamu incar?" description="Satu target role membuat isi resume jauh lebih fokus."><AnimatedField autoFocus label="Target role" value={answers.targetRole} placeholder="Contoh: Frontend Engineer" onChange={(value) => update("targetRole", value)} /><div className="suggestion-row"><span>Coba:</span>{["Software Engineer", "Product Designer", "Data Analyst"].map((role) => <button type="button" key={role} onClick={() => update("targetRole", role)}>{role}</button>)}</div></InputQuestion> : null}
        {step === 5 ? <InputQuestion eyebrow="Kontak" title="Bagaimana recruiter bisa menghubungimu?" description="Nomor telepon opsional. Email dan lokasi diperlukan untuk resume."><div className="onboarding-field-grid"><AnimatedField autoFocus type="email" autoComplete="email" label="Email profesional" value={answers.email} placeholder="nama@email.com" onChange={(value) => update("email", value)} /><AnimatedField type="tel" autoComplete="tel" label="Nomor telepon (opsional)" value={answers.phone} placeholder="+62 812…" onChange={(value) => update("phone", value)} /><div className="full-field"><AnimatedField autoComplete="address-level2" label="Kota / negara" value={answers.location} placeholder="Jakarta, Indonesia" onChange={(value) => update("location", value)} /></div></div></InputQuestion> : null}
        {step === 6 ? <InputQuestion eyebrow="Kekuatanmu" title="Skill apa yang benar-benar kamu kuasai?" description="Tulis dengan koma. AI hanya boleh memakai skill yang kamu berikan."><label className="animated-field"><span>Keahlian utama</span><textarea autoFocus rows={4} value={answers.skills} placeholder="TypeScript, React, Figma, SQL…" onChange={(event) => update("skills", event.target.value)} /></label></InputQuestion> : null}
        {step === 7 ? <Ready answers={answers} onFinish={finish} /> : null}
        {step > 0 && step < totalQuestions ? <div className="onboarding-actions"><button className="back-button" type="button" onClick={back}><ArrowLeft size={18} />Kembali</button><button className="onboarding-next" type="button" disabled={!canContinue} onClick={next}>Lanjut<ArrowRight size={18} /></button></div> : null}
        {step === totalQuestions ? <button className="back-button ready-back" type="button" onClick={back}><ArrowLeft size={18} />Periksa lagi</button> : null}
      </div>
    </section>
    <footer className="onboarding-footer"><span>ResumeMaker / 2026</span><span className="footer-dot" /><span>ATS-safe editor</span></footer>
  </main>;
}

function Welcome({ onStart }: { onStart: () => void }) { return <div className="welcome-content"><span className="question-eyebrow">Resume builder / 2026</span><h1>BUAT RESUME.<br />JELAS. RELEVAN.<br /><em>SIAP DIKIRIM.</em></h1><div className="editorial-rule" /><p>Jawab tujuh pertanyaan. Kami susun draft ATS-friendly yang bisa langsung kamu edit.</p><button className="onboarding-next hero-next" type="button" onClick={onStart}>Mulai<ArrowRight size={19} /></button><small>± 3 menit</small></div>; }
function ChoiceQuestion({ icon, eyebrow, title, description, options, value, onSelect }: { icon: React.ReactNode; eyebrow: string; title: string; description: string; options: Array<{ id: string; title: string; detail: string; icon?: React.ReactNode }>; value: string; onSelect: (value: string) => void }) { return <div><div className="question-icon">{icon}</div><span className="question-eyebrow">{eyebrow}</span><h1>{title}</h1><p className="question-description">{description}</p><div className="choice-grid">{options.map((option) => <button type="button" key={option.id} className={`choice-card ${value === option.id ? "selected" : ""}`} aria-pressed={value === option.id} onClick={() => onSelect(option.id)}><span className="choice-icon">{option.icon ?? <Languages />}</span><span><strong>{option.title}</strong><small>{option.detail}</small></span><span className="choice-check">{value === option.id ? <Check size={16} /> : null}</span></button>)}</div></div>; }
function InputQuestion({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: React.ReactNode }) { return <div><span className="question-eyebrow">{eyebrow}</span><h1>{title}</h1><p className="question-description">{description}</p><div className="question-fields">{children}</div></div>; }
function AnimatedField({ label, value, onChange, placeholder, type = "text", autoComplete, autoFocus }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; autoComplete?: string; autoFocus?: boolean }) { return <label className="animated-field"><span>{label}</span><input autoFocus={autoFocus} type={type} autoComplete={autoComplete} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>; }
function Ready({ answers, onFinish }: { answers: Answers; onFinish: () => void }) { return <div className="ready-content"><div className="ready-check"><Check size={28} /></div><span className="question-eyebrow">Draft siap</span><h1>{answers.fullName.split(" ")[0]}, lanjutkan di editor.</h1><p>Target: <strong>{answers.targetRole}</strong>. Tambahkan pengalaman, proyek, dan hasil kerja yang relevan.</p><div className="ready-summary"><span><small>Target</small><strong>{answers.targetRole}</strong></span><span><small>Fokus</small><strong>{answers.persona === "fresh" ? "Fresh graduate" : "Professional"}</strong></span><span><small>Skill awal</small><strong>{answers.skills.split(",").filter(Boolean).length} skill</strong></span></div><button className="onboarding-next hero-next" type="button" onClick={onFinish}>Buka editor<ArrowRight size={19} /></button></div>; }
