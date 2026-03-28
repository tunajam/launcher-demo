"use client";

import { Diamond } from "@phosphor-icons/react";

export function LauncherFooter() {
  return (
    <div className="border-t border-green-900/30 px-4 py-2 flex items-center justify-between bg-green-950/50">
      {/* Keyboard hints */}
      <div className="flex items-center gap-4 text-xs font-mono text-green-700">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-green-900/30 border border-green-800/30">↑↓</kbd>
          <span>Navigate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-green-900/30 border border-green-800/30">↵</kbd>
          <span>Open</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-green-900/30 border border-green-800/30">⎋</kbd>
          <span>Back</span>
        </div>
      </div>

      {/* Branding */}
      <div className="flex items-center gap-1.5 text-xs font-mono text-green-800">
        <Diamond size={12} weight="fill" />
        <span>sports launcher</span>
      </div>
    </div>
  );
}
