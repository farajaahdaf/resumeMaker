import { NextResponse } from "next/server";
import { z } from "zod";
import { resumeSchema } from "@/domain/resume";
import { analyzeWithDeepSeek } from "@/server/deepseek";

const requestSchema = z.object({
  resume: resumeSchema,
  mode: z.enum(["match", "clarity", "shorten", "detail"]).default("match"),
  jobDescription: z.string().trim().max(30000),
}).superRefine((value, context) => {
  if (value.mode === "match" && value.jobDescription.length < 80) context.addIssue({ code: "custom", path: ["jobDescription"], message: "Job description minimal 80 karakter." });
  if (value.mode !== "match" && value.jobDescription.length < 10) context.addIssue({ code: "custom", path: ["jobDescription"], message: "Instruksi terlalu pendek." });
});

function mapError(error: unknown) {
  const message = error instanceof Error ? error.message : "UNKNOWN";
  if (message === "AI_NOT_CONFIGURED") return { status: 503, code: "AI_NOT_CONFIGURED", message: "DeepSeek belum dikonfigurasi. Tambahkan DEEPSEEK_API_KEY pada environment server." };
  if (message.includes("429")) return { status: 429, code: "RATE_LIMITED", message: "Layanan AI sedang sibuk. Coba lagi sebentar lagi." };
  if (message.includes("401")) return { status: 503, code: "AUTH_FAILED", message: "Konfigurasi layanan AI tidak valid." };
  if (message.includes("402")) return { status: 503, code: "INSUFFICIENT_BALANCE", message: "Saldo layanan AI tidak mencukupi." };
  if (message.includes("OUTPUT") || message.includes("TARGET") || message.includes("FACT") || error instanceof z.ZodError || error instanceof SyntaxError) return { status: 502, code: "INVALID_OUTPUT", message: "Hasil AI tidak dapat divalidasi. Resume Anda tidak berubah." };
  return { status: 503, code: "PROVIDER_UNAVAILABLE", message: "Layanan AI belum dapat merespons. Resume Anda tetap aman." };
}

export async function POST(request: Request) {
  try {
    const payload = requestSchema.parse(await request.json());
    const timeout = AbortSignal.timeout(Number(process.env.DEEPSEEK_TIMEOUT_MS || 45000));
    const result = await analyzeWithDeepSeek(payload, timeout);
    return NextResponse.json({ requestId: crypto.randomUUID(), ...result });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ code: "INVALID_REQUEST", message: "Data analisis tidak valid atau deskripsi pekerjaan terlalu pendek." }, { status: 400 });
    const mapped = mapError(error);
    return NextResponse.json({ code: mapped.code, message: mapped.message }, { status: mapped.status });
  }
}
