"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  SquaresFour,
  ClockCounterClockwise,
  Star,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { Category } from "../lib/launcher-types";

interface LauncherSidebarProps {
  store: any; // Zustand store from createLauncherStore
  categories?: Category[];
}

const defaultCategories: Category[] = [
  { id: "all", name: "All", icon: SquaresFour },
  { id: "__recent", name: "Recent", icon: ClockCounterClockwise },
  { id: "__favorites", name: "Favorites", icon: Star },
];

export function LauncherSidebar({ store, categories = defaultCategories }: LauncherSidebarProps) {
  const selectedCategory = store((s: any) => s.selectedCategory);
  const setSelectedCategory = store((s: any) => s.setSelectedCategory);

  return (
    <nav
      aria-label="Categories"
      className="w-[160px] border-r border-border py-1.5 overflow-y-auto launcher-scroll shrink-0"
    >
      {categories.map((cat, index) => {
        if (cat.isDivider) {
          return <Separator key={`div-${index}`} className="my-1.5 mx-3" />;
        }

        const Icon = cat.icon;
        const isActive =
          (cat.id === "all" && selectedCategory === null) ||
          selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() =>
              setSelectedCategory(cat.id === "all" ? null : cat.id!)
            }
            className={`
              w-full px-3 py-1.5 flex items-center gap-2.5 text-left text-[13px] transition-colors cursor-pointer
              ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }
            `}
          >
            {Icon && (
              <Icon
                size={15}
                weight={isActive ? "fill" : "regular"}
                className="shrink-0"
              />
            )}
            <span className="truncate">{cat.name}</span>
          </button>
        );
      })}
    </nav>
  );
}
