import type { LauncherStore } from "../lib/launcher-store";
"use client";

import React, { memo } from "react";
import {
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import { CaretRight, ArrowSquareOut, Star, Sparkle } from "@phosphor-icons/react";
import type { LauncherItem } from "../lib/launcher-types";

const LauncherItemRow = memo(
  ({
    item,
    isFavorite,
    onSelect,
    onToggleFavorite,
    depth,
  }: {
    item: LauncherItem;
    isFavorite: boolean;
    onSelect: () => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
    depth: number;
  }) => {
    const Icon = item.icon;
    const hasChildren = Boolean(item.children?.length);
    const isExternal = Boolean(item.url);

    return (
      <CommandItem
        value={`${depth}-${item.id}-${item.name}`}
        onSelect={onSelect}
        className="flex items-center justify-between px-3 py-2.5 cursor-pointer group"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon
            size={18}
            weight="regular"
            className="text-muted-foreground shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{item.name}</div>
            {item.description && (
              <div className="text-xs text-muted-foreground truncate">
                {item.description}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleFavorite}
            className={`p-1 transition-opacity ${
              isFavorite
                ? "opacity-100 text-chart-4"
                : "opacity-0 group-hover:opacity-60 hover:!opacity-100 text-muted-foreground"
            }`}
          >
            <Star size={14} weight={isFavorite ? "fill" : "regular"} />
          </button>

          {hasChildren && (
            <CaretRight size={14} className="text-muted-foreground" />
          )}
          {isExternal && (
            <ArrowSquareOut size={14} className="text-muted-foreground" />
          )}
        </div>
      </CommandItem>
    );
  }
);

LauncherItemRow.displayName = "LauncherItemRow";

interface LauncherResultsProps {
  store: LauncherStore;
}

export function LauncherResults({ store }: LauncherResultsProps) {
  const navigationStack = store((s) => s.navigationStack);
  const favorites = store((s) => s.favorites);
  const selectItem = store((s) => s.selectItem);
  const toggleFavorite = store((s) => s.toggleFavorite);
  const query = store((s) => s.query);
  const selectedCategory = store((s) => s.selectedCategory);
  const recents = store((s) => s.recents);
  const displayResults = React.useMemo(
    () => store.getState().getDisplayResults(),
    [store, navigationStack, query, selectedCategory, favorites, recents]
  );

  const depth = navigationStack.length;
  const favoritesSet = new Set(favorites);

  // Group results by category
  const groupedResults = React.useMemo(() => {
    const groups = new Map<string, LauncherItem[]>();
    for (const item of displayResults) {
      const cat = item.category;
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push(item);
    }
    return groups;
  }, [displayResults]);

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <CommandList className="flex-1 overflow-y-auto launcher-scroll max-h-none px-1 min-h-0">
      {displayResults.length === 0 ? (
        <CommandEmpty className="py-12 text-center">
          <Sparkle
            size={28}
            weight="duotone"
            className="mx-auto mb-2 text-muted-foreground"
          />
          <p className="text-sm text-muted-foreground">No results found</p>
        </CommandEmpty>
      ) : (
        Array.from(groupedResults.entries()).map(([category, items]) => (
          <CommandGroup key={category} heading={category} className="mb-2">
            {items.map((item) => (
              <LauncherItemRow
                key={`${depth}-${item.id}`}
                item={item}
                isFavorite={favoritesSet.has(item.id)}
                onSelect={() => selectItem(item)}
                onToggleFavorite={(e) => handleToggleFavorite(e, item.id)}
                depth={depth}
              />
            ))}
          </CommandGroup>
        ))
      )}
    </CommandList>
  );
}
