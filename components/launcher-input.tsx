"use client";

import { useRef, useEffect } from "react";
import { useLauncher } from "./launcher-context";
import { Diamond, CaretRight, X, MagnifyingGlass } from "@phosphor-icons/react";

export function LauncherInput() {
  const { query, setQuery, breadcrumbs, goToRoot, goBack, navigationStack, setNavigationStack } = useLauncher();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when launcher opens or breadcrumbs change
    inputRef.current?.focus();
  }, [breadcrumbs]);

  const navigateToBreadcrumb = (index: number) => {
    // Navigate to a specific breadcrumb level
    // index 0 = first item after root, so we keep stack[0..index+1]
    setNavigationStack((stack: any[]) => stack.slice(0, index + 2));
    setQuery("");
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      {/* Branding / breadcrumbs */}
      <div className="flex items-center gap-1 text-[13px] font-mono flex-shrink-0">
        <button
          onClick={goToRoot}
          className="flex items-center gap-1.5 text-[#3d7a6e] hover:text-carolina transition-colors"
        >
          <Diamond size={12} weight="fill" className="text-canopy-500/40" />
          <span className="opacity-60">sports</span>
        </button>

        {breadcrumbs.map((item, index) => (
          <div key={item.id} className="flex items-center gap-1">
            <CaretRight size={10} className="text-[#3d7a6e]" />
            <button
              onClick={() => navigateToBreadcrumb(index)}
              className="text-[#5b8a9e] hover:text-carolina transition-colors truncate max-w-[120px]"
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>

      {/* Search input */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <MagnifyingGlass size={16} className="text-[#3d7a6e] flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && query === "" && breadcrumbs.length > 0) {
              e.preventDefault();
              goBack();
            }
          }}
          placeholder={
            breadcrumbs.length > 0
              ? `Search ${breadcrumbs[breadcrumbs.length - 1].name}...`
              : "Search leagues, teams, players..."
          }
          className="flex-1 bg-transparent border-none outline-none text-[#e0f2fe] placeholder:text-[#3d7a6e] text-sm min-w-0"
          autoFocus
        />
      </div>

      {/* Shortcut hints */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <kbd>⌘K</kbd>
        <kbd>⎋</kbd>
      </div>
    </div>
  );
}
