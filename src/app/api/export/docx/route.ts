import { NextResponse } from "next/server";
import { resumeSchema } from "@/domain/resume";
import { createResumeDocx } from "@/server/export-docx";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = resumeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Data resume tidak valid." }, { status: 400 });
  const buffer = await createResumeDocx(parsed.data);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": "attachment; filename=resume.docx",
      "Cache-Control": "no-store",
    },
  });
}
