import { NextResponse } from "next/server";
import { resumeSchema } from "@/domain/resume";
import { createResumePdf } from "@/server/export-pdf";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const parsed = resumeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Data resume tidak valid." }, { status: 400 });
  const buffer = await createResumePdf(parsed.data);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Cache-Control": "no-store",
    },
  });
}
