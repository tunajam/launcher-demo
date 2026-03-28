"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { LauncherItem, NavigationLevel } from "@/lib/types";
import { manifest, getAllItems } from "@/lib/manifest";
import { searchItems } from "@/lib/search";
import { getRecents, getFavorites, addRecent } from "@/lib/storage";

interface LauncherContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  activePrefix: string | null;
  setActivePrefix: (prefix: string | null) => void;
  navigationStack: NavigationLevel[];
  setNavigationStack: React.Dispatch<React.SetStateAction<NavigationLevel[]>>;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  recents: string[];
  favorites: string[];
  refreshStorage: () => void;

  // Navigation actions
  drillInto: (item: LauncherItem) => void;
  goBack: () => void;
  goToRoot: () => void;
  selectItem: (item: LauncherItem) => void;

  // Derived
  currentLevel: NavigationLevel;
  breadcrumbs: LauncherItem[];
  displayResults: LauncherItem[];
}

const LauncherContext = createContext<LauncherContextValue | null>(null);

export function useLauncher() {
  const context = useContext(LauncherContext);
  if (!context)
    throw new Error("useLauncher must be used within LauncherProvider");
  return context;
}

export function LauncherProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePrefix, setActivePrefix] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recents, setRecents] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [navigationStack, setNavigationStack] = useState<NavigationLevel[]>([
    { item: null, results: manifest },
  ]);

  const refreshStorage = useCallback(() => {
    setRecents(getRecents());
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    refreshStorage();
  }, [refreshStorage]);

  const currentLevel = navigationStack[navigationStack.length - 1];

  const breadcrumbs = navigationStack
    .filter((l) => l.item !== null)
    .map((l) => l.item as LauncherItem);

  // Compute display results
  const displayResults = React.useMemo(() => {
    const allFlat = getAllItems();

    // Handle special sidebar categories
    if (selectedCategory === "__recent") {
      return recents
        .map((id) => allFlat.find((i) => i.id === id))
        .filter(Boolean) as LauncherItem[];
    }
    if (selectedCategory === "__favorites") {
      return favorites
        .map((id) => allFlat.find((i) => i.id === id))
        .filter(Boolean) as LauncherItem[];
    }

    // Get items for current navigation level
    let items = currentLevel.results;

    // Filter by sidebar category if set and at root level
    if (selectedCategory && currentLevel.item === null) {
      items = items.filter((i) => i.category === selectedCategory);
    }

    // Apply search
    if (query.trim()) {
      // Check for prefix filter
      const prefixMatch = query.match(/^(\w+):\s*(.*)/);
      if (prefixMatch) {
        const prefix = prefixMatch[1].toLowerCase();
        const searchQuery = prefixMatch[2];
        // Find matching items by prefix
        const prefixItems = allFlat.filter((item) =>
          item.prefixes?.some((p) => p.toLowerCase().startsWith(prefix + ":"))
        );
        if (prefixItems.length > 0) {
          // Get children of matched prefix items
          const scopedItems = prefixItems.flatMap(
            (i) => i.children || [i]
          );
          return searchQuery
            ? searchItems(searchQuery, scopedItems, recents, favorites)
            : scopedItems;
        }
      }

      // Global search when at root, scoped search when drilled down
      const searchSpace =
        currentLevel.item === null ? allFlat : items;
      return searchItems(query, searchSpace, recents, favorites);
    }

    // No query - show current level items
    // At root with no category filter, show featured
    if (currentLevel.item === null && !selectedCategory) {
      return items;
    }

    return items;
  }, [currentLevel, query, selectedCategory, recents, favorites]);

  const drillInto = useCallback(
    (item: LauncherItem) => {
      if (!item.children?.length) return;
      setNavigationStack((s) => [...s, { item, results: item.children! }]);
      setQuery("");
      setSelectedIndex(0);
      setSelectedCategory(null);
    },
    []
  );

  const goBack = useCallback(() => {
    if (navigationStack.length > 1) {
      setNavigationStack((s) => s.slice(0, -1));
      setQuery("");
      setSelectedIndex(0);
    } else {
      setOpen(false);
    }
  }, [navigationStack.length]);

  const goToRoot = useCallback(() => {
    setNavigationStack([{ item: null, results: manifest }]);
    setQuery("");
    setSelectedIndex(0);
    setSelectedCategory(null);
  }, []);

  const selectItem = useCallback(
    (item: LauncherItem) => {
      if (item.children?.length) {
        drillInto(item);
      } else {
        addRecent(item.id);
        refreshStorage();
        if (item.url) {
          window.open(item.url, "_blank");
        } else if (item.action) {
          item.action();
        }
        setOpen(false);
        setTimeout(goToRoot, 200);
      }
    },
    [drillInto, refreshStorage, goToRoot]
  );

  // Reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(goToRoot, 200);
      return () => clearTimeout(t);
    }
  }, [open, goToRoot]);

  return (
    <LauncherContext.Provider
      value={{
        open,
        setOpen,
        query,
        setQuery,
        selectedCategory,
        setSelectedCategory,
        activePrefix,
        setActivePrefix,
        navigationStack,
        setNavigationStack,
        selectedIndex,
        setSelectedIndex,
        recents,
        favorites,
        refreshStorage,
        drillInto,
        goBack,
        goToRoot,
        selectItem,
        currentLevel,
        breadcrumbs,
        displayResults,
      }}
    >
      {children}
    </LauncherContext.Provider>
  );
}
