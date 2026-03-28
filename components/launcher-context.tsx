"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { LauncherItem, NavigationLevel } from "@/lib/types";
import { manifest } from "@/lib/manifest";
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
  
  // Current state
  currentLevel: NavigationLevel;
  breadcrumbs: LauncherItem[];
  displayResults: LauncherItem[];
}

const LauncherContext = createContext<LauncherContextValue | null>(null);

export function useLauncher() {
  const context = useContext(LauncherContext);
  if (!context) {
    throw new Error("useLauncher must be used within LauncherProvider");
  }
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
  
  // Navigation stack - starts with root level
  const [navigationStack, setNavigationStack] = useState<NavigationLevel[]>([
    {
      item: null, // null = root level
      results: manifest,
    },
  ]);

  // Refresh storage
  const refreshStorage = useCallback(() => {
    setRecents(getRecents());
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    refreshStorage();
  }, [refreshStorage]);

  // Current level is top of stack
  const currentLevel = navigationStack[navigationStack.length - 1];
  
  // Breadcrumbs from stack (excluding root)
  const breadcrumbs = navigationStack
    .filter((level) => level.item !== null)
    .map((level) => level.item as LauncherItem);

  // Compute display results based on current level and query
  const displayResults = React.useMemo(() => {
    const currentItems = currentLevel.results;
    
    if (!query.trim()) {
      // No query - show all items at current level
      // Or recents if at root
      if (currentLevel.item === null && recents.length > 0) {
        const recentItems = recents
          .map((id) => currentItems.find((item) => item.id === id))
          .filter(Boolean) as LauncherItem[];
        return recentItems.slice(0, 8);
      }
      return currentItems;
    }
    
    // Search within current level
    return searchItems(query, currentItems, recents, favorites);
  }, [currentLevel, query, recents, favorites]);

  // Drill into an item
  const drillInto = useCallback((item: LauncherItem) => {
    if (!item.children || item.children.length === 0) {
      // No children - this is a final action
      return;
    }
    
    // Push new level onto stack
    setNavigationStack((stack) => [
      ...stack,
      {
        item,
        results: item.children || [],
      },
    ]);
    
    // Reset state
    setQuery("");
    setSelectedIndex(0);
    setActivePrefix(null);
  }, []);

  // Go back one level
  const goBack = useCallback(() => {
    if (navigationStack.length > 1) {
      setNavigationStack((stack) => stack.slice(0, -1));
      setQuery("");
      setSelectedIndex(0);
      setActivePrefix(null);
    } else {
      // At root - close launcher
      setOpen(false);
    }
  }, [navigationStack.length]);

  // Jump to root
  const goToRoot = useCallback(() => {
    setNavigationStack([
      {
        item: null,
        results: manifest,
      },
    ]);
    setQuery("");
    setSelectedIndex(0);
    setActivePrefix(null);
  }, []);

  // Select/activate an item
  const selectItem = useCallback(
    (item: LauncherItem) => {
      if (item.children && item.children.length > 0) {
        // Has children - drill in
        drillInto(item);
      } else {
        // Final action
        addRecent(item.id);
        refreshStorage();
        
        if (item.url) {
          window.open(item.url, "_blank");
        } else if (item.action) {
          item.action();
        } else {
          console.log("Selected:", item.name);
        }
        
        // Close launcher after action
        setOpen(false);
        
        // Reset state
        setTimeout(() => {
          goToRoot();
        }, 200);
      }
    },
    [drillInto, refreshStorage, goToRoot]
  );

  // Reset when closing
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        goToRoot();
      }, 200);
    }
  }, [open, goToRoot]);

  const value: LauncherContextValue = {
    open,
    setOpen,
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    activePrefix,
    setActivePrefix,
    navigationStack,
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
  };

  return (
    <LauncherContext.Provider value={value}>
      {children}
    </LauncherContext.Provider>
  );
}
