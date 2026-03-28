"use client";

import { Diamond } from "@phosphor-icons/react";
import { useLauncher } from "./launcher-context";

export function LauncherFooter() {
  const { displayResults, breadcrumbs } = useLauncher();

  return (
    <div className="border-t border-[#0a2e1f] px-4 py-2 flex items-center justify-between bg-[#010f0a]/80">
      {/* Keyboard hints */}
      <div className="flex items-center gap-3 text-[11px] font-mono text-[#3d7a6e]">
        <span><kbd>↑↓</kbd> Navigate</span>
        <span><kbd>↵</kbd> {breadcrumbs.length > 0 || displayResults.some(i => i.children?.length) ? "Drill in" : "Open"}</span>
        <span><kbd>⎋</kbd> {breadcrumbs.length > 0 ? "Back" : "Close"}</span>
        <span><kbd>⌫</kbd> Back</span>
      </div>

      {/* Branding */}
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#0a2e1f]">
        <Diamond size={10} weight="fill" />
        <span>sports launcher</span>
      </div>
    </div>
  );
}
