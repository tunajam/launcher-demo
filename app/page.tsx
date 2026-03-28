"use client";

import { useLauncher } from "@/components/launcher-context";
import { Diamond } from "@phosphor-icons/react";

export default function Home() {
  const { setOpen } = useLauncher();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(75,156,211,0.4) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 max-w-xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Diamond size={40} weight="fill" className="text-carolina/60" />
          <h1 className="text-5xl font-serif text-[#e0f2fe]">
            Sports Launcher
          </h1>
        </div>

        <p className="text-[#5b8a9e] text-lg leading-relaxed">
          A Raycast-style command launcher built with Next.js, shadcn/ui, and cmdk.
          Drill into leagues, teams, and stats with keyboard-first navigation.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-3 px-6 py-3 bg-carolina/10 border border-carolina/20 text-carolina hover:bg-carolina/15 hover:border-carolina/30 transition-all cursor-pointer"
        >
          <span className="text-sm font-medium">Open Launcher</span>
          <kbd className="text-[11px] font-mono px-2 py-1 bg-carolina/10 border border-carolina/15 text-carolina/70">
            ⌘K
          </kbd>
        </button>

        <div className="pt-8 grid grid-cols-2 gap-4 text-left text-[13px] text-[#3d7a6e]">
          <div className="space-y-2">
            <p className="text-[#5b8a9e] font-medium text-xs uppercase tracking-wider">Navigation</p>
            <p>▸ Drill into leagues → teams → stats</p>
            <p>▸ Breadcrumb trail with click-back</p>
            <p>▸ Escape pops back one level</p>
          </div>
          <div className="space-y-2">
            <p className="text-[#5b8a9e] font-medium text-xs uppercase tracking-wider">Search</p>
            <p>▸ Fuzzy weighted search across all data</p>
            <p>▸ Prefix filters — type "nfl:" to scope</p>
            <p>▸ Recents & favorites persist locally</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-[11px] font-mono text-[#0a2e1f]">
        Built by Tunajam — shadcn composition demo
      </div>
    </main>
  );
}
