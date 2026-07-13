import { z } from "zod";

export const recommendationSchema = z.object({
  id: z.string().min(1),
  targetId: z.string().min(1),
  operation: z.enum(["replace", "append", "none"]),
  originalText: z.string(),
  proposedText: z.string().max(1200),
  reason: z.string().max(600),
  sourceFactIds: z.array(z.string()).max(30),
  relatedKeywords: z.array(z.string()).max(30),
  unsupportedClaims: z.array(z.string()).max(30),
});

export const aiOutputSchema = z.object({
  detectedLanguage: z.enum(["id", "en"]),
  keywords: z.array(z.object({ term: z.string(), category: z.enum(["role", "skill", "tool", "domain", "education", "responsibility", "preference"]), required: z.boolean() })).max(50),
  recommendations: z.array(recommendationSchema).max(12),
});

export type AiOutput = z.infer<typeof aiOutputSchema>;
export type AiRecommendation = z.infer<typeof recommendationSchema> & { status: "pending" | "accepted" | "edited" | "rejected" };

export const numericClaimPattern = /(?:\b\d+(?:[.,]\d+)?\s?(?:%|x|jam|hours?|hari|days?|minggu|weeks?|bulan|months?|tahun|years?)(?=\s|[.,;:!?)]|$)|(?:Rp|\$|USD)\s?\d+)/gi;

export function detectUnsupportedClaims(proposed: string, sources: string[]): string[] {
  const sourceText = sources.join(" ").toLowerCase();
  const claims = proposed.match(numericClaimPattern) ?? [];
  return [...new Set(claims.filter((claim) => !sourceText.includes(claim.toLowerCase())))];
}

export function detectUnsupportedKeywords(keywords: string[], sources: string[]): string[] {
  const sourceText = sources.join(" ").toLowerCase();
  return [...new Set(keywords.filter((keyword) => {
    const normalized = keyword.trim().toLowerCase();
    return normalized.length > 1 && !sourceText.includes(normalized);
  }))];
}
