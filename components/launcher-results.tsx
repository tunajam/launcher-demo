"use client";

import { useLauncher } from "./launcher-context";
import { LauncherItem as LauncherItemComponent } from "./launcher-item";
import { useEffect, useRef } from "react";
import { ClockCounterClockwise, Star, Sparkle } from "@phosphor-icons/react";

export function LauncherResults() {
  const { displayResults, selectedIndex, selectItem, setSelectedIndex, breadcrumbs, recents, favorites } =
    useLauncher();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll selected item into view
  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedIndex]);

  if (displayResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-[#3d7a6e]">
        <Sparkle size={32} weight="duotone" className="mb-3 opacity-50" />
        <p className="text-sm">No results found</p>
        <p className="text-xs mt-1 opacity-60">Try a different search term</p>
      </div>
    );
  }

  // Determine section label
  let sectionLabel = "";
  if (breadcrumbs.length === 0 && recents.length > 0) {
    // At root with recents showing
  } else if (breadcrumbs.length > 0) {
    sectionLabel = breadcrumbs[breadcrumbs.length - 1].name;
  }

  return (
    <div ref={containerRef} className="overflow-y-auto h-full launcher-scroll">
      {/* Section header when drilling down */}
      {sectionLabel && (
        <div className="px-3 pt-2.5 pb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#3d7a6e]">
            {sectionLabel}
          </span>
        </div>
      )}

      <div className="py-1">
        {displayResults.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            <LauncherItemComponent
              item={item}
              selected={index === selectedIndex}
              onClick={() => selectItem(item)}
              onMouseEnter={() => setSelectedIndex(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
