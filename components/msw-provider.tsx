"use client";

import { useEffect, useState, type ReactNode } from "react";

export function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (typeof window !== "undefined") {
        const { worker } = await import("@/lib/msw-browser");
        await worker.start({ onUnhandledRequest: "bypass", quiet: true });
        setReady(true);
      }
    }
    init();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary/40 border-t-primary animate-spin rounded-full" />
          <span className="text-sm font-mono">Starting mock service worker...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
