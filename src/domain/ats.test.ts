import { describe, expect, it } from "vitest";
import { calculateCompletionScore, calculateKeywordMatch } from "@/domain/ats";
import { sampleResume } from "@/domain/resume";

describe("ATS indicators", () => {
  it("keeps completion separate from keyword relevance", () => {
    expect(calculateCompletionScore(sampleResume)).toBe(100);
    const match = calculateKeywordMatch(sampleResume, [
      { term: "TypeScript", category: "skill", required: true },
      { term: "Kubernetes", category: "tool", required: true },
      { term: "React", category: "skill", required: false },
    ]);
    expect(match?.matched.map((item) => item.term)).toEqual(["TypeScript", "React"]);
    expect(match?.missing.map((item) => item.term)).toEqual(["Kubernetes"]);
    expect(match?.score).toBe(60);
  });
});
