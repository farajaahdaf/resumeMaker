import { z } from "zod";

export const bulletSchema = z.object({ id: z.string(), text: z.string().max(600) });

export const experienceSchema = z.object({
  id: z.string(),
  role: z.string().max(120),
  company: z.string().max(120),
  location: z.string().max(120),
  startDate: z.string().max(20),
  endDate: z.string().max(20),
  bullets: z.array(bulletSchema).max(8),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().max(160),
  institution: z.string().max(160),
  location: z.string().max(120),
  graduationDate: z.string().max(20),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().max(160),
  technologies: z.string().max(240),
  date: z.string().max(20),
  bullets: z.array(bulletSchema).max(6),
});

export const resumeSchema = z.object({
  schemaVersion: z.literal("1.0"),
  id: z.string(),
  title: z.string().max(120),
  language: z.enum(["id", "en"]),
  targetRole: z.string().max(120),
  contact: z.object({
    fullName: z.string().max(160),
    email: z.string().max(200),
    phone: z.string().max(60),
    location: z.string().max(160),
    linkedin: z.string().max(240),
    portfolio: z.string().max(240),
  }),
  summary: z.string().max(1000),
  skills: z.string().max(1000),
  experiences: z.array(experienceSchema).max(20),
  education: z.array(educationSchema).max(12),
  projects: z.array(projectSchema).max(16),
  certifications: z.string().max(1000),
  updatedAt: z.string(),
});

export type Resume = z.infer<typeof resumeSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;

export const createId = () => crypto.randomUUID();

export const sampleResume: Resume = {
  schemaVersion: "1.0",
  id: "resume-demo",
  title: "Resume Utama",
  language: "id",
  targetRole: "Software Engineer",
  contact: {
    fullName: "Faraja Ahdaf",
    email: "faraja@example.com",
    phone: "+62 812 3456 7890",
    location: "Jakarta, Indonesia",
    linkedin: "linkedin.com/in/faraja",
    portfolio: "github.com/faraja",
  },
  summary: "Software engineer yang berfokus pada pengembangan aplikasi web yang cepat, mudah digunakan, dan dapat dipelihara.",
  skills: "TypeScript, React, Next.js, Node.js, PostgreSQL, Git",
  experiences: [
    {
      id: "exp-demo",
      role: "Frontend Developer",
      company: "Nusantara Digital",
      location: "Jakarta",
      startDate: "Jan 2024",
      endDate: "Sekarang",
      bullets: [
        { id: "bullet-demo-1", text: "Mengembangkan antarmuka dashboard menggunakan React dan TypeScript untuk tim operasional." },
        { id: "bullet-demo-2", text: "Berkolaborasi dengan tim produk untuk menyederhanakan alur kerja pengguna." },
      ],
    },
  ],
  education: [{ id: "edu-demo", degree: "S1 Teknik Informatika", institution: "Universitas Indonesia", location: "Depok", graduationDate: "2023" }],
  projects: [{ id: "project-demo", name: "ResumeMaker", technologies: "Next.js, TypeScript", date: "2026", bullets: [{ id: "project-bullet-demo", text: "Membangun resume builder bilingual dengan preview ATS-safe." }] }],
  certifications: "",
  updatedAt: new Date(0).toISOString(),
};
