import { describe, expect, it } from "vitest";
import { sampleResume } from "@/domain/resume";
import { evaluateResume } from "@/domain/quality";

describe("evaluateResume", () => {
  it("accepts the complete sample without blocking errors", () => {
    expect(evaluateResume(sampleResume).filter((issue) => issue.severity === "error")).toEqual([]);
  });

  it("reports missing required contact details", () => {
    const issues = evaluateResume({ ...sampleResume, contact: { ...sampleResume.contact, fullName: "", email: "" } });
    expect(issues.map((issue) => issue.id)).toEqual(expect.arrayContaining(["name", "email"]));
  });

  it("checks contact syntax, duplicate skills, and reverse dates", () => {
    const issues = evaluateResume({
      ...sampleResume,
      contact: { ...sampleResume.contact, email: "invalid", linkedin: "not a url" },
      skills: "React, TypeScript, react",
      experiences: [{ ...sampleResume.experiences[0], startDate: "Jan 2026", endDate: "Jan 2024" }],
    });
    expect(issues.map((issue) => issue.id)).toEqual(expect.arrayContaining(["email-format", "linkedin-format", "duplicate-skills", "date-order"]));
  });

  it("reports required job keywords that are not present", () => {
    const issues = evaluateResume(sampleResume, { keywords: [{ term: "Kubernetes", category: "tool", required: true }] });
    expect(issues.map((issue) => issue.id)).toContain("missing-keywords");
  });
});
