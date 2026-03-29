import type { LauncherStore } from "../lib/launcher-store";
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { CommandDialog, Command } from "@/components/ui/command";
import { LauncherInput } from "./launcher-input";
import { LauncherSidebar } from "./launcher-sidebar";
import { LauncherResults } from "./launcher-results";
import { LauncherFooter } from "./launcher-footer";
import type { Category } from "../lib/launcher-types";

interface LauncherProps {
  store: LauncherStore;
  categories?: Category[];
  branding?: {
    icon?: React.ReactNode;
    label?: string;
  };
}

export function Launcher({ store, categories, branding }: LauncherProps) {
  const open = store((s) => s.open);
  const setOpen = store((s) => s.setOpen);
  const popNavigation = store((s) => s.popNavigation);
  const navigationStack = store((s) => s.navigationStack);
  const query = store((s) => s.query);
  const selectedCategory = store((s) => s.selectedCategory);
  const recents = store((s) => s.recents);
  const favorites = store((s) => s.favorites);

  const breadcrumbs = useMemo(
    () => navigationStack.filter((l) => l.item).map((l) => l.item!.name),
    [navigationStack]
  );

  const displayResults = useMemo(
    () => store.getState().getDisplayResults(),
    [store, navigationStack, query, selectedCategory, recents, favorites]
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
        const currentOpen = store.getState().open;
        setOpen(!currentOpen);
        return;
      }

      const currentOpen = store.getState().open;
      if (!currentOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        const currentBreadcrumbs = store.getState().getBreadcrumbs();
        if (currentBreadcrumbs.length > 0) {
          store.getState().popNavigation();
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
  }, [store, setOpen]);

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
        <LauncherInput store={store} branding={branding} />

        <div className="flex flex-1 min-h-0">
          <LauncherSidebar store={store} categories={categories} />
          <div
            role="region"
            aria-label="Results"
            className="flex-1 min-w-0 overflow-hidden"
          >
            <LauncherResults store={store} />
          </div>
        </div>

        <LauncherFooter store={store} branding={branding} />
      </Command>
    </CommandDialog>
  );
}
