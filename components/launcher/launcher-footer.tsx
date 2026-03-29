"use client";

import { useMemo } from "react";
import { Diamond } from "@phosphor-icons/react";
import { useLauncherStore } from "@/lib/launcher-store";

export function LauncherFooter() {
  const navigationStack = useLauncherStore((s) => s.navigationStack);
  const breadcrumbs = useMemo(
    () => navigationStack.filter((l) => l.item).map((l) => l.item!.name),
    [navigationStack]
  );

  return (
    <div className="border-t border-border px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted text-muted-foreground border border-border mr-1">
            ↑↓
          </kbd>
          Navigate
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted text-muted-foreground border border-border mr-1">
            ↵
          </kbd>
          {breadcrumbs.length > 0 ? "Drill in" : "Open"}
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 bg-muted text-muted-foreground border border-border mr-1">
            ⎋
          </kbd>
          {breadcrumbs.length > 0 ? "Back" : "Close"}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground/40">
        <Diamond size={10} weight="fill" />
        <span>sports launcher</span>
      </div>
    </div>
  );
}
