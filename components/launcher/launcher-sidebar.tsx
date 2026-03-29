"use client";

import React from "react";
import { useLauncherStore } from "@/lib/launcher-store";
import { Separator } from "@/components/ui/separator";
import {
  Football,
  Basketball,
  Baseball,
  Hockey,
  SoccerBall,
  GraduationCap,
  FlagPennant,
  ArrowSquareOut,
  SquaresFour,
  ClockCounterClockwise,
  Star,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface SidebarEntry {
  id?: string;
  name?: string;
  icon?: Icon;
  isDivider?: boolean;
}

const categories: SidebarEntry[] = [
  { id: "all", name: "All", icon: SquaresFour },
  { id: "__recent", name: "Recent", icon: ClockCounterClockwise },
  { id: "__favorites", name: "Favorites", icon: Star },
  { isDivider: true },
  { id: "NFL", name: "NFL", icon: Football },
  { id: "NBA", name: "NBA", icon: Basketball },
  { id: "MLB", name: "MLB", icon: Baseball },
  { id: "NHL", name: "NHL", icon: Hockey },
  { id: "MLS", name: "MLS", icon: SoccerBall },
  { isDivider: true },
  { id: "College", name: "College", icon: GraduationCap },
  { id: "Golf", name: "Golf", icon: FlagPennant },
  { isDivider: true },
  { id: "External", name: "External", icon: ArrowSquareOut },
];

export function LauncherSidebar() {
  const selectedCategory = useLauncherStore((s) => s.selectedCategory);
  const setSelectedCategory = useLauncherStore((s) => s.setSelectedCategory);

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
