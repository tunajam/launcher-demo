"use client";

import { useLauncherStore } from "@/lib/launcher-store";
import { Button } from "@/components/ui/button";
import { Diamond } from "@phosphor-icons/react";

export default function Home() {
  const setOpen = useLauncherStore((s) => s.setOpen);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8">
      <div className="text-center space-y-8 max-w-xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Diamond size={36} weight="fill" className="text-primary/60" />
          <h1 className="text-5xl font-bold tracking-tight">
            Sports Launcher
          </h1>
        </div>

        <p className="text-muted-foreground text-lg leading-relaxed">
          A Raycast-style command launcher built with Next.js, shadcn/ui, and
          cmdk. Drill into leagues, teams, and stats with keyboard-first
          navigation.
        </p>

        <Button
          variant="outline"
          size="lg"
          onClick={() => setOpen(true)}
          className="gap-3"
        >
          Open Launcher
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-muted text-muted-foreground border border-border">
            ⌘K
          </kbd>
        </Button>

        <div className="pt-8 grid grid-cols-2 gap-6 text-left text-sm text-muted-foreground">
          <div className="space-y-2">
            <p className="text-foreground font-medium text-xs uppercase tracking-wider">
              Navigation
            </p>
            <p>▸ Drill into leagues → teams → stats</p>
            <p>▸ Breadcrumb trail with click-back</p>
            <p>▸ Escape pops back one level</p>
          </div>
          <div className="space-y-2">
            <p className="text-foreground font-medium text-xs uppercase tracking-wider">
              Search
            </p>
            <p>▸ Fuzzy weighted search across all data</p>
            <p>▸ Prefix filters — type &quot;nfl:&quot; to scope</p>
            <p>▸ Recents &amp; favorites persist locally</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-xs font-mono text-muted-foreground/40">
        Built by Tunajam — shadcn composition demo
      </div>
    </main>
  );
}
