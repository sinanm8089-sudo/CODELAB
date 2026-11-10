import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CODELAB IDE — Universal Multi-Language IDE & DSA Learning Ecosystem",
  description:
    "Universal Multi-Language IDE, Interactive Data Structures & Algorithms Visualizer, AI Teaching Assistant, and Coding Practice Platform architected by Sinan Mohammed.",
  authors: [{ name: "Sinan Mohammed" }],
  keywords: [
    "CODELAB IDE",
    "Sinan Mohammed",
    "Universal IDE",
    "Data Structures",
    "Algorithms Visualizer",
    "Online Compiler",
    "AI Code Tutor",
    "Programming Education"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090E] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
