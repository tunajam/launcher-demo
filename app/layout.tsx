import type { Metadata } from "next";
import "./globals.css";
import { Launcher } from "@/components/launcher/launcher";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "⌘K Launcher — shadcn Registry Component",
  description:
    "A Raycast-style command launcher with hierarchical drill-down, fuzzy search, and keyboard-first UX. Built on shadcn primitives. Drop it into any project.",
  openGraph: {
    title: "⌘K Launcher — shadcn Registry Component",
    description:
      "Hierarchical command palette built on shadcn. Drill-down navigation, fuzzy search, favorites, keyboard-first.",
    url: "https://launcher.tunajam.com",
    siteName: "Launcher",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "⌘K Launcher — shadcn Registry Component",
    description:
      "Raycast-style command palette for any project. Built on shadcn + Zustand + cmdk.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body>
        {children}
        <Launcher />
      </body>
    </html>
  );
}
