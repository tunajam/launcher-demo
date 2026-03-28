"use client";

import { useLauncher } from "./launcher-context";
import {
  Star,
  ClockCounterClockwise,
  Football,
  Basketball,
  Baseball,
  Hockey,
  SoccerBall,
  GraduationCap,
  FlagPennant,
  GlobeHemisphereWest,
  SquaresFour,
} from "@phosphor-icons/react";

const sidebarItems = [
  { id: null, name: "All", icon: SquaresFour },
  { id: "__recent", name: "Recent", icon: ClockCounterClockwise },
  { id: "__favorites", name: "Favorites", icon: Star },
  { id: "__divider_1", name: "", isDivider: true },
  { id: "NFL", name: "NFL", icon: Football },
  { id: "NBA", name: "NBA", icon: Basketball },
  { id: "MLB", name: "MLB", icon: Baseball },
  { id: "NHL", name: "NHL", icon: Hockey },
  { id: "MLS", name: "MLS", icon: SoccerBall },
  { id: "College", name: "College", icon: GraduationCap },
  { id: "Golf", name: "Golf", icon: FlagPennant },
  { id: "__divider_2", name: "", isDivider: true },
  { id: "External", name: "External", icon: GlobeHemisphereWest },
] as const;

export function LauncherSidebar() {
  const { selectedCategory, setSelectedCategory, setSelectedIndex, goToRoot, navigationStack } =
    useLauncher();

  return (
    <div className="w-[160px] flex-shrink-0 border-r border-[#0a2e1f] overflow-y-auto launcher-scroll py-1.5">
      {sidebarItems.map((item, i) => {
        if (item.isDivider) {
          return (
            <div
              key={`div-${i}`}
              className="my-1.5 mx-3 border-t border-[#0a2e1f]"
            />
          );
        }

        const isActive = selectedCategory === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.name}
            onClick={() => {
              // Reset to root if drilled in, then apply category filter
              if (navigationStack.length > 1) {
                goToRoot();
              }
              setSelectedCategory(item.id ?? null);
              setSelectedIndex(0);
            }}
            className={`
              w-full px-3 py-1.5 flex items-center gap-2.5 text-left text-[13px] transition-colors cursor-pointer
              ${
                isActive
                  ? "bg-accent/15 text-accent"
                  : "text-[#5b8a9e] hover:text-[#bae6fd] hover:bg-[#021a13]"
              }
            `}
          >
            {Icon && (
              <Icon
                size={15}
                weight={isActive ? "fill" : "regular"}
                className="flex-shrink-0"
              />
            )}
            <span className="truncate">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}
