"use client";

import React, { useMemo } from "react";
import { useLauncherStore } from "@/lib/launcher-store";
import { CommandInput } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Diamond } from "@phosphor-icons/react";

export function LauncherInput() {
  const query = useLauncherStore((s) => s.query);
  const setQuery = useLauncherStore((s) => s.setQuery);
  const resetNavigation = useLauncherStore((s) => s.resetNavigation);
  const popNavigation = useLauncherStore((s) => s.popNavigation);
  const setNavigationStack = useLauncherStore((s) => s.setNavigationStack);
  const navigationStack = useLauncherStore((s) => s.navigationStack);
  const breadcrumbs = useMemo(
    () => navigationStack.filter((l) => l.item).map((l) => l.item!.name),
    [navigationStack]
  );

  const navigateToBreadcrumb = (index: number) => {
    setNavigationStack((stack) => stack.slice(0, index + 2));
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
      {/* Branding + breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
        <button
          onClick={resetNavigation}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Diamond size={12} weight="fill" className="text-primary/40" />
          <span>sports</span>
        </button>

        {breadcrumbs.map((name, index) => (
          <div key={index} className="flex items-center gap-1">
            <span className="text-muted-foreground">/</span>
            <Badge
              variant="secondary"
              className="cursor-pointer text-xs px-1.5 py-0 font-mono hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => navigateToBreadcrumb(index)}
            >
              {name}
            </Badge>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex-1 min-w-0">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={
            breadcrumbs.length > 0
              ? `Search ${breadcrumbs[breadcrumbs.length - 1]}...`
              : "Search leagues, teams, players..."
          }
          onKeyDown={(e) => {
            if (
              e.key === "Backspace" &&
              query === "" &&
              breadcrumbs.length > 0
            ) {
              e.preventDefault();
              popNavigation();
            }
          }}
          className="h-8 border-0 shadow-none focus-visible:ring-0"
        />
      </div>

      {/* Shortcut hints */}
      <div className="flex items-center gap-1.5 shrink-0">
        <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-muted text-muted-foreground border border-border">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}
