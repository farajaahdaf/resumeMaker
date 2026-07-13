// @vitest-environment node
import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import mammoth from "mammoth";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { sampleResume } from "@/domain/resume";
import { createResumeDocx } from "@/server/export-docx";
import { createResumePdf } from "@/server/export-pdf";

const expectedOrder = [
  sampleResume.contact.fullName,
  sampleResume.targetRole,
  "Ringkasan Profesional",
  "Keahlian",
  "Pengalaman Kerja",
  "Frontend Developer",
  "Nusantara Digital",
  "Jan 2024 - Sekarang",
  "Pendidikan",
  "S1 Teknik Informatika",
  "Universitas Indonesia",
  "2023",
  "Proyek",
];

describe("ATS-safe exports", () => {
  it("creates a native DOCX without layout tables and preserves text order", async () => {
    const buffer = await createResumeDocx(sampleResume);
    expect(buffer.subarray(0, 2).toString()).toBe("PK");

    const archive = await JSZip.loadAsync(buffer);
    expect(archive.file("[Content_Types].xml")).toBeTruthy();
    expect(archive.file("word/document.xml")).toBeTruthy();
    const xml = await archive.file("word/document.xml")!.async("string");
    expect(xml).not.toContain("<w:tbl");
    expect(xml).not.toContain("<w:drawing");

    const extracted = (await mammoth.extractRawText({ buffer })).value.replace(/\s+/g, " ");
    expectInOrder(extracted, expectedOrder);
  });

  it("creates a text PDF and preserves the same linear reading order", async () => {
    const buffer = await createResumePdf(sampleResume);
    expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");

    const pdf = await getDocument({ data: new Uint8Array(buffer), useSystemFonts: true }).promise;
    expect(pdf.numPages).toBe(1);
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => "str" in item ? item.str : "").join(" "));
    }
    expectInOrder(pages.join(" ").replace(/\s+/g, " "), expectedOrder);
  });
});

function expectInOrder(text: string, values: string[]) {
  const normalizedText = text.toLocaleLowerCase().replace(/\s+/g, "");
  let cursor = -1;
  for (const value of values) {
    const normalizedValue = value.toLocaleLowerCase().replace(/\s+/g, "");
    const next = normalizedText.indexOf(normalizedValue, cursor + 1);
    expect(next, `Expected “${value}” after index ${cursor}`).toBeGreaterThan(cursor);
    cursor = next;
  }
}
