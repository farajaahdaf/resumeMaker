import type { Resume } from "@/domain/resume";

export const resumeLabels = {
  id: { summary: "Ringkasan Profesional", skills: "Keahlian", experience: "Pengalaman Kerja", education: "Pendidikan", projects: "Proyek", certifications: "Sertifikasi", present: "Sekarang" },
  en: { summary: "Professional Summary", skills: "Skills", experience: "Work Experience", education: "Education", projects: "Projects", certifications: "Certifications", present: "Present" },
};

export function contactLine(resume: Resume) {
  return [resume.contact.location, resume.contact.phone, resume.contact.email, resume.contact.linkedin, resume.contact.portfolio].filter(Boolean).join(" | ");
}

export function dateRange(startDate: string, endDate: string, presentLabel: string) {
  return [startDate, endDate || presentLabel].filter(Boolean).join(" - ");
}

export function entryLine(title: string, organization: string, date: string) {
  return [title, organization, date].filter(Boolean).join(" | ");
}

export function resumePlainText(resume: Resume) {
  const labels = resumeLabels[resume.language];
  const lines = [resume.contact.fullName, resume.targetRole, contactLine(resume)];
  const addSection = (title: string, body: string[]) => {
    if (!body.some((line) => line.trim())) return;
    lines.push(title, ...body.filter((line) => line.trim()));
  };

  addSection(labels.summary, [resume.summary]);
  addSection(labels.skills, [resume.skills]);
  addSection(labels.experience, resume.experiences.flatMap((item) => [
    entryLine(item.role, item.company, dateRange(item.startDate, item.endDate, labels.present)),
    item.location,
    ...item.bullets.map((bullet) => bullet.text),
  ]));
  addSection(labels.education, resume.education.flatMap((item) => [entryLine(item.degree, item.institution, item.graduationDate), item.location]));
  addSection(labels.projects, resume.projects.flatMap((item) => [entryLine(item.name, item.technologies, item.date), ...item.bullets.map((bullet) => bullet.text)]));
  addSection(labels.certifications, [resume.certifications]);
  return lines.filter((line) => line.trim()).join("\n");
}
