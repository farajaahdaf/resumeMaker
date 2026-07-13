import type { AiOutput } from "@/domain/ai";
import type { Resume } from "@/domain/resume";

export type JobKeyword = AiOutput["keywords"][number];

export type KeywordMatch = {
  score: number;
  matched: JobKeyword[];
  missing: JobKeyword[];
};

export function calculateCompletionScore(resume: Resume) {
  const checks = [
    Boolean(resume.contact.fullName.trim()),
    Boolean(resume.contact.email.trim()),
    Boolean(resume.contact.phone.trim()),
    Boolean(resume.targetRole.trim()),
    Boolean(resume.summary.trim()),
    Boolean(resume.skills.trim()),
    resume.experiences.some((item) => item.role.trim() && item.company.trim() && item.bullets.some((bullet) => bullet.text.trim())),
    resume.education.some((item) => item.degree.trim() && item.institution.trim()),
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function calculateKeywordMatch(resume: Resume, keywords: JobKeyword[]): KeywordMatch | null {
  if (!keywords.length) return null;
  const haystack = normalizeForMatch(resumeToSearchText(resume));
  const matched: JobKeyword[] = [];
  const missing: JobKeyword[] = [];

  for (const keyword of keywords) {
    const normalizedKeyword = normalizeForMatch(keyword.term);
    if (normalizedKeyword && haystack.includes(normalizedKeyword)) matched.push(keyword);
    else missing.push(keyword);
  }

  const totalWeight = keywords.reduce((total, keyword) => total + (keyword.required ? 2 : 1), 0);
  const matchedWeight = matched.reduce((total, keyword) => total + (keyword.required ? 2 : 1), 0);

  return {
    score: totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0,
    matched,
    missing,
  };
}

export function resumeToSearchText(resume: Resume) {
  return [
    resume.targetRole,
    resume.summary,
    resume.skills,
    ...resume.experiences.flatMap((item) => [item.role, item.company, ...item.bullets.map((bullet) => bullet.text)]),
    ...resume.education.flatMap((item) => [item.degree, item.institution]),
    ...resume.projects.flatMap((item) => [item.name, item.technologies, ...item.bullets.map((bullet) => bullet.text)]),
    resume.certifications,
  ].join(" ");
}

function normalizeForMatch(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
