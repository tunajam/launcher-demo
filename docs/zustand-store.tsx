import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LauncherItem, NavigationLevel } from "@/lib/types";
import { manifest, getAllItems } from "@/lib/manifest";
import { searchItems } from "@/lib/search";

// Pure function — testable independently
function buildNavigationPath(targetItem: LauncherItem): NavigationLevel[] {
  const path: NavigationLevel[] = [{ item: null, results: manifest }];
  function findPath(items: LauncherItem[], target: string): LauncherItem[] | null {
    for (const item of items) {
      if (item.id === target) return [item];
      if (item.children) {
        const sub = findPath(item.children, target);
        if (sub) return [item, ...sub];
      }
    }
    return null;
  }
  const ancestry = findPath(manifest, targetItem.id);
  if (ancestry) {
    for (const ancestor of ancestry) {
      if (ancestor.children) path.push({ item: ancestor, results: ancestor.children });
    }
  }
  return path;
}

interface LauncherStore {
  // State
  open: boolean;
  query: string;
  selectedCategory: string | null;
  navigationStack: NavigationLevel[];
  recents: string[];
  favorites: string[];

  // Actions
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setCategory: (category: string | null) => void;
  selectItem: (item: LauncherItem) => void;
  goBack: () => void;
  reset: () => void;
  toggleFavorite: (id: string) => void;

  // Derived (computed in store for convenience)
  getBreadcrumbs: () => string[];
  getDisplayResults: () => LauncherItem[];
}

export const useLauncherStore = create<LauncherStore>()(
  persist(
    (set, get) => ({
      open: false,
      query: "",
      selectedCategory: null,
      navigationStack: [{ item: null, results: manifest }],
      recents: [],
      favorites: [],

      setOpen: (open) => set({ open }),
      setQuery: (query) => set({ query }),

      setCategory: (category) =>
        set({
          selectedCategory: category,
          navigationStack: [{ item: null, results: manifest }],
          query: "",
        }),

      selectItem: (item) => {
        const { recents } = get();
        const newRecents = [item.id, ...recents.filter((id) => id !== item.id)].slice(0, 20);

        if (item.children) {
          set({
            navigationStack: buildNavigationPath(item),
            query: "",
            selectedCategory: null,
            recents: newRecents,
          });
        } else {
          if (item.url) window.open(item.url, "_blank");
          if (item.action) item.action();
          set({ open: false, recents: newRecents });
        }
      },

      goBack: () => {
        const { navigationStack } = get();
        if (navigationStack.length > 1) {
          set({ navigationStack: navigationStack.slice(0, -1), query: "" });
        } else {
          set({ open: false });
        }
      },

      reset: () =>
        set({
          navigationStack: [{ item: null, results: manifest }],
          query: "",
          selectedCategory: null,
        }),

      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),

      getBreadcrumbs: () =>
        get()
          .navigationStack.filter((l) => l.item)
          .map((l) => l.item!.name),

      getDisplayResults: () => {
        const { navigationStack, query, selectedCategory, recents, favorites } = get();
        const currentLevel = navigationStack[navigationStack.length - 1];
        const baseResults = currentLevel.results;
        const allItems = getAllItems();

        if (selectedCategory === "__recent")
          return recents.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as LauncherItem[];
        if (selectedCategory === "__favorites")
          return favorites.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as LauncherItem[];
        if (query.trim()) return searchItems(query, baseResults);
        if (selectedCategory && currentLevel.item === null)
          return baseResults.filter((i) => i.category === selectedCategory);
        return baseResults;
      },
    }),
    {
      name: "launcher-storage",
      partialize: (s) => ({ recents: s.recents, favorites: s.favorites }),
    }
  )
);
