"use client";

import { useLauncher } from "./launcher-context";
import { Diamond, CaretRight } from "@phosphor-icons/react";

export function LauncherInput() {
  const { query, setQuery, breadcrumbs, goToRoot } = useLauncher();

  return (
    <div className="p-4 flex items-center gap-3">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-sm font-mono text-green-700">
        <button
          onClick={goToRoot}
          className="flex items-center gap-1.5 hover:text-carolina transition-colors"
        >
          <Diamond size={14} weight="fill" />
          <span>sports</span>
        </button>
        
        {breadcrumbs.map((item, index) => (
          <div key={item.id} className="flex items-center gap-1.5">
            <CaretRight size={12} weight="bold" />
            <button
              onClick={() => {
                // TODO: Navigate to this level
                console.log("Navigate to:", item.name);
              }}
              className="hover:text-carolina transition-colors"
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={breadcrumbs.length === 0 ? "Search..." : `Search in ${breadcrumbs[breadcrumbs.length - 1]?.name || ""}...`}
        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-green-700 font-sans"
        autoFocus
      />

      {/* Shortcuts hint */}
      <div className="flex items-center gap-2 text-xs font-mono text-green-700">
        <kbd className="px-1.5 py-0.5 bg-green-900/30 border border-green-800/30">⌘K</kbd>
        <kbd className="px-1.5 py-0.5 bg-green-900/30 border border-green-800/30">⎋</kbd>
      </div>
    </div>
  );
}
