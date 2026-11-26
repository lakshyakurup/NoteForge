import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });
const metadataBase = new URL(
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
);

export const metadata: Metadata = {
  metadataBase,
  title: "NoteForge — Turn your notes into a study superpower",
  description:
    "Transform class notes into interactive quizzes, clear concept explanations, flashcards, and personalized revision materials with NoteForge.",
  applicationName: "NoteForge",
  openGraph: {
    title: "NoteForge — Turn your notes into a study superpower",
    description:
      "From lecture notes to real understanding. Create quizzes, concept breakdowns, and revision packs built around what you need to learn.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "NoteForge — Turn your notes into a study superpower",
    description: "Create quizzes, concept explanations, and personalized revision materials from your notes.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
