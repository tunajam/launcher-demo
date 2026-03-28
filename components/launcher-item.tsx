"use client";

import { LauncherItem as LauncherItemType } from "@/lib/types";
import { CaretRight, Star, ArrowSquareOut } from "@phosphor-icons/react";
import { useLauncher } from "./launcher-context";
import { toggleFavorite } from "@/lib/storage";

interface LauncherItemProps {
  item: LauncherItemType;
  selected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

export function LauncherItem({ item, selected, onClick, onMouseEnter }: LauncherItemProps) {
  const { favorites, refreshStorage } = useLauncher();
  const Icon = item.icon;
  const isFavorite = favorites.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;
  const isExternal = !!item.url;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
    refreshStorage();
  };

  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        w-full h-11 px-3 flex items-center gap-3 group transition-all duration-75 cursor-pointer
        ${selected
          ? "bg-carolina/12 text-[#e0f2fe]"
          : "text-[#7dd3fc] hover:bg-[#021a13]"
        }
      `}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-7 h-7 flex items-center justify-center ${selected ? "text-carolina" : "text-[#3d7a6e]"}`}>
        <Icon size={20} weight={selected ? "fill" : "regular"} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-start justify-center min-w-0">
        <div className={`text-[13px] font-medium truncate w-full text-left ${selected ? "text-[#e0f2fe]" : ""}`}>
          {item.name}
        </div>
        {item.description && (
          <div className="text-[11px] text-[#3d7a6e] truncate w-full text-left">
            {item.description}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Favorite */}
        <button
          onClick={handleFavoriteClick}
          className={`
            p-0.5 transition-all
            ${isFavorite
              ? "text-accent"
              : "text-[#3d7a6e] opacity-0 group-hover:opacity-60 hover:!opacity-100"
            }
          `}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star size={14} weight={isFavorite ? "fill" : "regular"} />
        </button>

        {/* Drill-in or external indicator */}
        {hasChildren && (
          <CaretRight
            size={14}
            weight="bold"
            className={selected ? "text-carolina" : "text-[#3d7a6e]"}
          />
        )}
        {isExternal && (
          <ArrowSquareOut
            size={14}
            className={selected ? "text-carolina" : "text-[#3d7a6e]"}
          />
        )}
      </div>
    </div>
  );
}
