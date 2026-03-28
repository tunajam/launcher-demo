import { Icon } from "@phosphor-icons/react";

export interface LauncherItem {
  id: string;
  name: string;
  description?: string;
  icon: Icon;
  category: string;
  tags: string[];
  aliases?: string[];
  keywords?: string[];
  prefixes?: string[];
  children?: LauncherItem[];
  action?: () => void;
  url?: string;
}

export interface NavigationLevel {
  item: LauncherItem | null; // null for root level
  results: LauncherItem[];
}

export interface LauncherState {
  open: boolean;
  query: string;
  selectedCategory: string | null;
  activePrefix: string | null;
  navigationStack: NavigationLevel[];
  selectedIndex: number;
  recents: string[]; // item ids
  favorites: string[]; // item ids
}

export type Category = {
  id: string;
  name: string;
  isDivider?: boolean;
};
