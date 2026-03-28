"use client";

import { useLauncher } from "@/components/launcher-context";
import { Diamond } from "@phosphor-icons/react";
import { useEffect } from "react";

export default function Home() {
  const { setOpen } = useLauncher();

  // Auto-open on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [setOpen]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(75, 156, 211, 0.15) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Diamond size={48} weight="fill" className="text-carolina" />
          <h1 className="text-6xl font-serif text-white">Sports Launcher</h1>
        </div>

        <p className="text-xl text-green-400 max-w-2xl mx-auto">
          A production-grade Raycast-style command launcher demo built with
          Next.js, Tailwind, shadcn/ui, and cmdk.
        </p>

        <div className="space-y-4 pt-8">
          <button
            onClick={() => setOpen(true)}
            className="group px-8 py-4 bg-carolina hover:bg-carolina/80 text-white font-medium transition-all inline-flex items-center gap-3"
          >
            <span>Press</span>
            <kbd className="px-3 py-1.5 bg-white/20 font-mono text-sm">⌘K</kbd>
            <span>to open</span>
          </button>

          <p className="text-sm text-green-700 font-mono">
            Navigate with arrows • Enter to select • Escape to close
          </p>
        </div>

        <div className="pt-12 space-y-4 text-left max-w-2xl mx-auto text-green-400">
          <h2 className="text-2xl font-serif text-white mb-4">Features</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-carolina">▸</span>
              <span>
                <strong>Hierarchical navigation</strong> — Drill into leagues →
                teams → stats with breadcrumb trail
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-carolina">▸</span>
              <span>
                <strong>Fuzzy search</strong> — Weighted search across names,
                tags, keywords, and descriptions
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-carolina">▸</span>
              <span>
                <strong>Keyboard-first</strong> — Arrow keys, Enter, Escape,
                Tab for autocomplete
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-carolina">▸</span>
              <span>
                <strong>Recents & favorites</strong> — localStorage persistence
                with star to favorite
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-carolina">▸</span>
              <span>
                <strong>Prefix filters</strong> — Type &ldquo;nfl:&rdquo; to scope search
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-carolina">▸</span>
              <span>
                <strong>Canopy design system</strong> — Carolina Blue + Purple
                on deep green, sharp corners
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer credit */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-green-800 font-mono">
        Built by Tunajam • Demo for portfolio
      </div>
    </main>
  );
}
