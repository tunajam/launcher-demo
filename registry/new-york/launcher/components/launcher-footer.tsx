import type { LauncherStore } from "../lib/launcher-store";
"use client";

import { useMemo } from "react";
import { Diamond } from "@phosphor-icons/react";

interface LauncherFooterProps {
  store: LauncherStore;
  branding?: {
    icon?: React.ReactNode;
    label?: string;
  };
}

export function LauncherFooter({ store, branding }: LauncherFooterProps) {
  const navigationStack = store((s) => s.navigationStack);
  const breadcrumbs = useMemo(
    () => navigationStack.filter((l) => l.item).map((l) => l.item!.name),
    [navigationStack]
  );

  const defaultBranding = {
    icon: <Diamond size={10} weight="fill" />,
    label: "launcher",
  };

  const activeBranding = branding || defaultBranding;

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
        {activeBranding.icon}
        <span>{activeBranding.label}</span>
      </div>
    </div>
  );
}
