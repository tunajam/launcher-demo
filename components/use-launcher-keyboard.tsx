"use client";

import { useEffect } from "react";
import { useLauncher } from "./launcher-context";

export function useLauncherKeyboard() {
  const {
    open,
    setOpen,
    query,
    displayResults,
    selectedIndex,
    setSelectedIndex,
    selectItem,
    goBack,
  } = useLauncher();

  useEffect(() => {
    // Global ⌘K handler
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    }

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      // Escape - go back or close
      if (e.key === "Escape") {
        e.preventDefault();
        goBack();
        return;
      }

      // Arrow Down - next item
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayResults.length - 1 ? prev + 1 : 0
        );
        return;
      }

      // Arrow Up - previous item
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : displayResults.length - 1
        );
        return;
      }

      // Enter - select current item
      if (e.key === "Enter") {
        e.preventDefault();
        const currentItem = displayResults[selectedIndex];
        if (currentItem) {
          selectItem(currentItem);
        }
        return;
      }

      // Tab - autocomplete prefix (if applicable)
      if (e.key === "Tab") {
        e.preventDefault();
        // TODO: Implement prefix autocomplete
        return;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    open,
    displayResults,
    selectedIndex,
    setSelectedIndex,
    selectItem,
    goBack,
    query,
  ]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [displayResults, setSelectedIndex]);
}
