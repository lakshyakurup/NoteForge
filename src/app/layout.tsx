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
  title: "Horizon — The Global Hackathon",
  description:
    "One planet. A million perspectives. Join the interest list for Horizon, an international hackathon for people building a more useful future.",
  applicationName: "Horizon Hackathon",
  openGraph: {
    title: "Horizon — The Global Hackathon",
    description:
      "A new international hackathon for curious builders. Dates and event details announced soon.",
    type: "website",
    images: [{ url: "/hackathon-orbit.png", width: 1536, height: 1024, alt: "A luminous globe crossed by orbital light" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Horizon — The Global Hackathon",
    description: "Build what’s next, together. Dates announced soon.",
    images: ["/hackathon-orbit.png"],
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
