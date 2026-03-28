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
  item: LauncherItem | null; // null for root
  results: LauncherItem[];
}

export interface Category {
  id: string;
  name: string;
  icon?: Icon;
  isDivider?: boolean;
}
