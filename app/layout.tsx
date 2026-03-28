import type { Metadata } from "next";
import "./globals.css";
import { LauncherProvider } from "@/components/launcher-context";
import { Launcher } from "@/components/launcher";

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
    <html lang="en">
      <body>
        <LauncherProvider>
          {children}
          <Launcher />
        </LauncherProvider>
      </body>
    </html>
  );
}
