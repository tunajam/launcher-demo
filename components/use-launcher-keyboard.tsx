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

  // Global ⌘K toggle
  useEffect(() => {
    function handleGlobal(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    }
    window.addEventListener("keydown", handleGlobal);
    return () => window.removeEventListener("keydown", handleGlobal);
  }, [open, setOpen]);

  // Launcher-specific keys when open
  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          goBack();
          break;

        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < displayResults.length - 1 ? prev + 1 : 0
          );
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : displayResults.length - 1
          );
          break;

        case "Enter":
          e.preventDefault();
          if (displayResults[selectedIndex]) {
            selectItem(displayResults[selectedIndex]);
          }
          break;

        case "Tab":
          e.preventDefault();
          // Could implement prefix autocomplete here
          break;
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, displayResults, selectedIndex, setSelectedIndex, selectItem, goBack, query]);

  // Reset index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [displayResults.length, setSelectedIndex]);
}
