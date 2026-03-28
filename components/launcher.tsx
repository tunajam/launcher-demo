"use client";

import { useEffect, useRef } from "react";
import { useLauncher } from "./launcher-context";
import { useLauncherKeyboard } from "./use-launcher-keyboard";
import { LauncherInput } from "./launcher-input";
import { LauncherSidebar } from "./launcher-sidebar";
import { LauncherResults } from "./launcher-results";
import { LauncherFooter } from "./launcher-footer";

export function Launcher() {
  const { open, setOpen } = useLauncher();
  const modalRef = useRef<HTMLDivElement>(null);
  useLauncherKeyboard();

  // Focus trap
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="launcher-backdrop fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={modalRef}
        className="launcher-modal w-[680px] max-h-[520px] bg-[#010f0a] border border-[#0a2e1f] flex flex-col overflow-hidden"
      >
        {/* Search header */}
        <LauncherInput />

        {/* Two-column body */}
        <div className="flex flex-1 min-h-0 border-t border-[#0a2e1f]">
          {/* Sidebar */}
          <LauncherSidebar />

          {/* Results */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <LauncherResults />
          </div>
        </div>

        {/* Footer */}
        <LauncherFooter />
      </div>
    </div>
  );
}
