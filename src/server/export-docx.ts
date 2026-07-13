import {
  AlignmentType,
  BorderStyle,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import type { Resume } from "@/domain/resume";
import { contactLine, dateRange, entryLine, resumeLabels } from "@/domain/resume-content";

const BLACK = "111827";
const RULE = { style: BorderStyle.SINGLE, size: 6, color: BLACK, space: 1 };

export async function createResumeDocx(resume: Resume) {
  const labels = resumeLabels[resume.language];
  const children: Paragraph[] = [
    new Paragraph({
      style: "ResumeTitle",
      border: { bottom: RULE },
      children: [new TextRun(resume.contact.fullName || "Nama Lengkap")],
    }),
  ];

  if (resume.targetRole.trim()) children.push(bodyParagraph(resume.targetRole, { bold: true, after: 40 }));
  const contacts = contactLine(resume);
  if (contacts) children.push(bodyParagraph(contacts, { size: 19, after: 160 }));

  addTextSection(children, labels.summary, resume.summary);
  addTextSection(children, labels.skills, resume.skills);

  const experiences = resume.experiences.filter((item) => item.role.trim() || item.company.trim() || item.bullets.some((bullet) => bullet.text.trim()));
  if (experiences.length) {
    children.push(sectionHeading(labels.experience));
    for (const item of experiences) {
      children.push(entryParagraph(entryLine(item.role, item.company, dateRange(item.startDate, item.endDate, labels.present))));
      if (item.location.trim()) children.push(bodyParagraph(item.location, { italics: true, color: "374151", after: 40 }));
      children.push(...bulletParagraphs(item.bullets.map((bullet) => bullet.text)));
    }
  }

  const education = resume.education.filter((item) => item.degree.trim() || item.institution.trim());
  if (education.length) {
    children.push(sectionHeading(labels.education));
    for (const item of education) {
      children.push(entryParagraph(entryLine(item.degree, item.institution, item.graduationDate)));
      if (item.location.trim()) children.push(bodyParagraph(item.location, { italics: true, color: "374151", after: 80 }));
    }
  }

  const projects = resume.projects.filter((item) => item.name.trim() || item.technologies.trim() || item.bullets.some((bullet) => bullet.text.trim()));
  if (projects.length) {
    children.push(sectionHeading(labels.projects));
    for (const item of projects) {
      children.push(entryParagraph(entryLine(item.name, item.technologies, item.date)));
      children.push(...bulletParagraphs(item.bullets.map((bullet) => bullet.text)));
    }
  }

  addTextSection(children, labels.certifications, resume.certifications);

  const document = new Document({
    creator: "ResumeMaker",
    title: `${resume.contact.fullName || "Resume"} - ${resume.targetRole || "Resume"}`,
    description: "ATS-safe single-column resume",
    styles: {
      default: { document: { run: { font: "Arial", size: 22, color: BLACK } } },
      paragraphStyles: [
        {
          id: "ResumeTitle",
          name: "Resume Title",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Arial", size: 40, bold: true, color: BLACK, allCaps: true },
          paragraph: { spacing: { after: 100 }, keepNext: true },
        },
        {
          id: "ResumeSection",
          name: "Resume Section",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: "Arial", size: 26, bold: true, color: BLACK, allCaps: true },
          paragraph: { spacing: { before: 220, after: 100 }, keepNext: true, outlineLevel: 1 },
        },
      ],
    },
    numbering: {
      config: [{
        reference: "resume-bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 180 } } },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      children,
    }],
  });

  return Packer.toBuffer(document);
}

function sectionHeading(title: string) {
  return new Paragraph({ style: "ResumeSection", border: { bottom: { ...RULE, color: "4B5563", size: 4 } }, children: [new TextRun(title)] });
}

function bodyParagraph(text: string, options: { bold?: boolean; italics?: boolean; color?: string; size?: number; after?: number } = {}) {
  return new Paragraph({
    spacing: { after: options.after ?? 0, line: 280 },
    children: [new TextRun({ text, bold: options.bold, italics: options.italics, color: options.color, size: options.size })],
  });
}

function entryParagraph(text: string) {
  return new Paragraph({ spacing: { before: 40, after: 40 }, keepNext: true, children: [new TextRun({ text, bold: true })] });
}

function bulletParagraphs(values: string[]) {
  return values.filter((value) => value.trim()).map((value) => new Paragraph({
    numbering: { reference: "resume-bullets", level: 0 },
    spacing: { after: 40, line: 280 },
    children: [new TextRun(value.trim())],
  }));
}

function addTextSection(children: Paragraph[], title: string, value: string) {
  if (!value.trim()) return;
  children.push(sectionHeading(title), bodyParagraph(value.trim()));
}
