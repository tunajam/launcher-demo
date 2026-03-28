"use client";

import { useLauncher } from "./launcher-context";
import { useLauncherKeyboard } from "./use-launcher-keyboard";
import { LauncherInput } from "./launcher-input";
import { LauncherResults } from "./launcher-results";
import { LauncherFooter } from "./launcher-footer";
import { X } from "@phosphor-icons/react";

export function Launcher() {
  const { open, setOpen } = useLauncher();
  useLauncherKeyboard();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] launcher-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      }}
    >
      <div className="launcher-modal w-[680px] max-h-[520px] bg-green-950 border border-green-900/30 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative border-b border-green-900/30">
          <LauncherInput />
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-700 hover:text-green-500 transition-colors"
            aria-label="Close"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-hidden">
          <LauncherResults />
        </div>

        {/* Footer */}
        <LauncherFooter />
      </div>
    </div>
  );
}
