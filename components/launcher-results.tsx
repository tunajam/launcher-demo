"use client";

import { useLauncher } from "./launcher-context";
import { LauncherItem as LauncherItemComponent } from "./launcher-item";
import { useEffect, useRef } from "react";

export function LauncherResults() {
  const { displayResults, selectedIndex, selectItem, setSelectedIndex } = useLauncher();
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem) {
      selectedItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  if (displayResults.length === 0) {
    return (
      <div className="p-8 text-center text-green-700">
        <p className="text-sm">No results found</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="overflow-y-auto max-h-[380px] launcher-results">
      <div className="p-2">
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
