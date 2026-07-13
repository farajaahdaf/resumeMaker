import PDFDocument from "pdfkit";
import type { Resume } from "@/domain/resume";
import { contactLine, dateRange, entryLine, resumeLabels } from "@/domain/resume-content";

const PAGE = { size: "A4" as const, margin: 54 };

export function createResumePdf(resume: Resume): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const document = new PDFDocument({ ...PAGE, info: { Title: `${resume.contact.fullName || "Resume"} - ${resume.targetRole || "Resume"}`, Author: resume.contact.fullName || "ResumeMaker", Subject: "ATS-safe single-column resume" } });
    const chunks: Buffer[] = [];
    document.on("data", (chunk: Buffer) => chunks.push(chunk));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    const labels = resumeLabels[resume.language];
    document.fillColor("#111827").font("Helvetica-Bold").fontSize(20).text((resume.contact.fullName || "Nama Lengkap").toUpperCase(), { features: [] });
    document.moveDown(0.2).strokeColor("#111827").lineWidth(0.75).moveTo(document.page.margins.left, document.y).lineTo(document.page.width - document.page.margins.right, document.y).stroke();
    document.moveDown(0.35);
    if (resume.targetRole.trim()) document.font("Helvetica-Bold").fontSize(11).text(resume.targetRole, { features: [] });
    const contacts = contactLine(resume);
    if (contacts) document.font("Helvetica").fontSize(9.5).text(contacts, { features: [] });

    addTextSection(document, labels.summary, resume.summary);
    addTextSection(document, labels.skills, resume.skills);

    const experiences = resume.experiences.filter((item) => item.role.trim() || item.company.trim() || item.bullets.some((bullet) => bullet.text.trim()));
    if (experiences.length) {
      sectionHeading(document, labels.experience);
      for (const item of experiences) {
        entry(document, entryLine(item.role, item.company, dateRange(item.startDate, item.endDate, labels.present)), item.location, item.bullets.map((bullet) => bullet.text));
      }
    }

    const education = resume.education.filter((item) => item.degree.trim() || item.institution.trim());
    if (education.length) {
      sectionHeading(document, labels.education);
      for (const item of education) entry(document, entryLine(item.degree, item.institution, item.graduationDate), item.location, []);
    }

    const projects = resume.projects.filter((item) => item.name.trim() || item.technologies.trim() || item.bullets.some((bullet) => bullet.text.trim()));
    if (projects.length) {
      sectionHeading(document, labels.projects);
      for (const item of projects) entry(document, entryLine(item.name, item.technologies, item.date), "", item.bullets.map((bullet) => bullet.text));
    }

    addTextSection(document, labels.certifications, resume.certifications);
    document.end();
  });
}

function ensureSpace(document: PDFKit.PDFDocument, height: number) {
  if (document.y + height > document.page.height - document.page.margins.bottom) document.addPage(PAGE);
}

function sectionHeading(document: PDFKit.PDFDocument, title: string) {
  ensureSpace(document, 38);
  document.moveDown(0.7).font("Helvetica-Bold").fontSize(13).fillColor("#111827").text(title.toUpperCase(), { features: [] });
  document.moveDown(0.25).strokeColor("#4B5563").lineWidth(0.5).moveTo(document.page.margins.left, document.y).lineTo(document.page.width - document.page.margins.right, document.y).stroke();
  document.moveDown(0.35);
}

function addTextSection(document: PDFKit.PDFDocument, title: string, value: string) {
  if (!value.trim()) return;
  sectionHeading(document, title);
  document.font("Helvetica").fontSize(11).fillColor("#111827").text(value.trim(), { lineGap: 1.5, features: [] });
}

function entry(document: PDFKit.PDFDocument, heading: string, location: string, bullets: string[]) {
  ensureSpace(document, 44);
  document.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(heading, { lineGap: 1, features: [] });
  if (location.trim()) document.font("Helvetica-Oblique").fillColor("#374151").text(location.trim(), { features: [] });
  document.font("Helvetica").fillColor("#111827");
  const cleanBullets = bullets.map((value) => value.trim()).filter(Boolean);
  if (cleanBullets.length) document.list(cleanBullets, { bulletRadius: 1.8, bulletIndent: 4, textIndent: 12, paragraphGap: 2, lineGap: 1, features: [] });
  document.moveDown(0.35);
}
