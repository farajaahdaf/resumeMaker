import { describe, expect, it } from "vitest";
import { detectUnsupportedClaims, detectUnsupportedKeywords } from "@/domain/ai";

describe("detectUnsupportedClaims", () => {
  it("allows metrics grounded in source facts", () => {
    expect(detectUnsupportedClaims("Menghemat 6 jam per minggu", ["Otomasi menghemat 6 jam per minggu"])).toEqual([]);
  });

  it("flags invented numeric claims", () => {
    expect(detectUnsupportedClaims("Meningkatkan konversi 35%", ["Meningkatkan konversi landing page"])).toEqual(["35%"]);
  });
});

describe("detectUnsupportedKeywords", () => {
  it("flags job keywords that are not grounded in selected source facts", () => {
    expect(detectUnsupportedKeywords(["React", "accessibility"], ["Built a dashboard with React and TypeScript"])).toEqual(["accessibility"]);
  });
});
