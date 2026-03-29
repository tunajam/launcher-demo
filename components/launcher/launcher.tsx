"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLauncherStore } from "@/lib/launcher-store";
import { CommandDialog, Command } from "@/components/ui/command";
import { LauncherInput } from "./launcher-input";
import { LauncherSidebar } from "./launcher-sidebar";
import { LauncherResults } from "./launcher-results";
import { LauncherFooter } from "./launcher-footer";

export function Launcher() {
  const open = useLauncherStore((s) => s.open);
  const setOpen = useLauncherStore((s) => s.setOpen);
  const popNavigation = useLauncherStore((s) => s.popNavigation);
  const navigationStack = useLauncherStore((s) => s.navigationStack);
  const query = useLauncherStore((s) => s.query);
  const selectedCategory = useLauncherStore((s) => s.selectedCategory);
  const recents = useLauncherStore((s) => s.recents);
  const favorites = useLauncherStore((s) => s.favorites);

  const breadcrumbs = useMemo(
    () => navigationStack.filter((l) => l.item).map((l) => l.item!.name),
    [navigationStack]
  );

  const displayResults = useMemo(
    () => useLauncherStore.getState().getDisplayResults(),
    [navigationStack, query, selectedCategory, recents, favorites]
  );

  const depth = navigationStack.length;

  const [cmdkValue, setCmdkValue] = useState("");

  // Auto-select first item when results change
  useEffect(() => {
    if (displayResults.length > 0) {
      setCmdkValue(`${depth}-${displayResults[0].id}-${displayResults[0].name}`);
    }
  }, [displayResults, depth]);

  // Refocus cmdk input after navigation changes
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      const input = document.querySelector("[cmdk-input]") as HTMLInputElement;
      input?.focus();
    });
  }, [navigationStack, open]);

  // ⌘K global shortcut + Escape/Enter override
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const currentOpen = useLauncherStore.getState().open;
        setOpen(!currentOpen);
        return;
      }

      const currentOpen = useLauncherStore.getState().open;
      if (!currentOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        const currentBreadcrumbs = useLauncherStore.getState().getBreadcrumbs();
        if (currentBreadcrumbs.length > 0) {
          useLauncherStore.getState().popNavigation();
        } else {
          setOpen(false);
        }
        return;
      }

      if (e.key === "Enter") {
        const selected = document.querySelector(
          '[cmdk-item][data-selected="true"]'
        ) as HTMLElement;
        if (selected) {
          e.preventDefault();
          selected.click();
        }
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [setOpen]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="top-[15%] max-h-[70vh] sm:max-w-[680px]"
    >
      <Command
        shouldFilter={false}
        value={cmdkValue}
        onValueChange={setCmdkValue}
        className="bg-popover border border-border flex flex-col max-h-[70vh]"
      >
        <LauncherInput />

        <div className="flex flex-1 min-h-0">
          <LauncherSidebar />
          <div
            role="region"
            aria-label="Results"
            className="flex-1 min-w-0 overflow-hidden"
          >
            <LauncherResults />
          </div>
        </div>

        <LauncherFooter />
      </Command>
    </CommandDialog>
  );
}
