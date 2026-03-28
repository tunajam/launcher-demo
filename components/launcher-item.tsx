"use client";

import { LauncherItem as LauncherItemType } from "@/lib/types";
import { CaretRight, Star } from "@phosphor-icons/react";
import { useLauncher } from "./launcher-context";
import { toggleFavorite } from "@/lib/storage";

interface LauncherItemProps {
  item: LauncherItemType;
  selected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

export function LauncherItem({
  item,
  selected,
  onClick,
  onMouseEnter,
}: LauncherItemProps) {
  const { favorites, refreshStorage } = useLauncher();
  const Icon = item.icon;
  const isFavorite = favorites.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
    refreshStorage();
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        w-full h-12 px-3 flex items-center gap-3 group
        transition-colors cursor-pointer
        ${selected ? "bg-carolina/20 text-white" : "text-green-300 hover:bg-green-900/20"}
      `}
    >
      {/* Icon */}
      <div
        className={`
        flex-shrink-0 w-8 h-8 flex items-center justify-center
        ${selected ? "text-carolina" : "text-green-600"}
      `}
      >
        <Icon size={24} weight="regular" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-start justify-center min-w-0">
        <div className="text-sm font-medium truncate w-full text-left">
          {item.name}
        </div>
        {item.description && (
          <div className="text-xs text-green-700 truncate w-full text-left">
            {item.description}
          </div>
        )}
      </div>

      {/* Right side - favorite + drill indicator */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Favorite star */}
        <button
          onClick={handleFavoriteClick}
          className={`
            p-1 transition-colors
            ${isFavorite ? "text-purple-500" : "text-green-700 opacity-0 group-hover:opacity-100"}
            hover:text-purple-400
          `}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star size={16} weight={isFavorite ? "fill" : "regular"} />
        </button>

        {/* Drill-in indicator */}
        {hasChildren && (
          <div className={`${selected ? "text-carolina" : "text-green-700"}`}>
            <CaretRight size={16} weight="bold" />
          </div>
        )}
      </div>
    </button>
  );
}
