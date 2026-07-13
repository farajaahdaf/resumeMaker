import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./ats-overrides.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "ResumeMaker — Resume ATS-friendly dengan AI",
  description: "Buat resume bilingual yang jujur, relevan, dan ATS-friendly.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body className={geist.variable}>{children}</body></html>;
}
