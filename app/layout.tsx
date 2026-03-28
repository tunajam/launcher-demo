import type { Metadata } from "next";
import "./globals.css";
import { LauncherProvider } from "@/components/launcher-context";
import { Launcher } from "@/components/launcher";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Sports Launcher Demo",
  description: "Raycast-style command launcher for sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <LauncherProvider>
          {children}
          <Launcher />
        </LauncherProvider>
      </body>
    </html>
  );
}
