import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import type { LauncherItem, NavigationLevel } from "./launcher-types";
import { searchItems, defaultWeights, type SearchWeights } from "./launcher-search";

interface LauncherConfig {
  manifest: LauncherItem[];
  searchWeights?: SearchWeights;
  persistKey?: string;
}

function getAllItems(items: LauncherItem[]): LauncherItem[] {
  const result: LauncherItem[] = [];
  function traverse(items: LauncherItem[]) {
    items.forEach((item) => {
      result.push(item);
      if (item.children) traverse(item.children);
    });
  }
  traverse(items);
  return result;
}

function buildNavigationPath(
  targetItem: LauncherItem,
  manifest: LauncherItem[]
): NavigationLevel[] {
  const path: NavigationLevel[] = [{ item: null, results: manifest }];

  function findPath(
    items: LauncherItem[],
    target: string
  ): LauncherItem[] | null {
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
      if (ancestor.children) {
        path.push({ item: ancestor, results: ancestor.children });
      }
    }
  }

  return path;
}

interface LauncherState {
  open: boolean;
  query: string;
  selectedCategory: string | null;
  navigationStack: NavigationLevel[];
  recents: string[];
  favorites: string[];

  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  selectItem: (item: LauncherItem) => void;
  pushNavigation: (item: LauncherItem) => void;
  popNavigation: () => void;
  resetNavigation: () => void;
  toggleFavorite: (id: string) => void;
  setNavigationStack: (
    updater:
      | NavigationLevel[]
      | ((prev: NavigationLevel[]) => NavigationLevel[])
  ) => void;

  getBreadcrumbs: () => string[];
  getDisplayResults: () => LauncherItem[];
}

export function createLauncherStore(config: LauncherConfig) {
  const { manifest, searchWeights = defaultWeights, persistKey = "launcher-storage" } = config;

  const storeDefinition: StateCreator<LauncherState, [], []> = (set, get) => ({
    open: false,
    query: "",
    selectedCategory: null,
    navigationStack: [{ item: null, results: manifest }],
    recents: [],
    favorites: [],

    setOpen: (open) => set({ open }),
    setQuery: (query) => set({ query }),

    setSelectedCategory: (category) =>
      set({
        selectedCategory: category,
        navigationStack: [{ item: null, results: manifest }],
        query: "",
      }),

    selectItem: (item) => {
      const { recents } = get();
      const newRecents = [
        item.id,
        ...recents.filter((id) => id !== item.id),
      ].slice(0, 20);

      if (item.children) {
        set({
          navigationStack: buildNavigationPath(item, manifest),
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

    pushNavigation: (item) => {
      if (!item.children) return;
      set((state) => ({
        navigationStack: [
          ...state.navigationStack,
          { item, results: item.children! },
        ],
        query: "",
      }));
    },

    popNavigation: () => {
      const { navigationStack } = get();
      if (navigationStack.length > 1) {
        set({ navigationStack: navigationStack.slice(0, -1), query: "" });
      } else {
        set({ open: false });
      }
    },

    resetNavigation: () =>
      set({
        navigationStack: [{ item: null, results: manifest }],
        query: "",
        selectedCategory: null,
      }),

    toggleFavorite: (id) =>
      set((state) => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter((f) => f !== id)
          : [...state.favorites, id],
      })),

    setNavigationStack: (updater) =>
      set((state) => ({
        navigationStack:
          typeof updater === "function"
            ? updater(state.navigationStack)
            : updater,
        query: "",
      })),

    getBreadcrumbs: () =>
      get()
        .navigationStack.filter((l) => l.item)
        .map((l) => l.item!.name),

    getDisplayResults: () => {
      const { navigationStack, query, selectedCategory, recents, favorites } =
        get();
      const currentLevel = navigationStack[navigationStack.length - 1];
      const baseResults = currentLevel.results;

      if (selectedCategory === "__recent") {
        const allItems = getAllItems(manifest);
        return recents
          .map((id) => allItems.find((i) => i.id === id))
          .filter(Boolean) as LauncherItem[];
      }
      if (selectedCategory === "__favorites") {
        const allItems = getAllItems(manifest);
        return favorites
          .map((id) => allItems.find((i) => i.id === id))
          .filter(Boolean) as LauncherItem[];
      }
      if (query.trim()) return searchItems(query, baseResults, recents, favorites, searchWeights);
      if (selectedCategory && currentLevel.item === null)
        return baseResults.filter((i) => i.category === selectedCategory);
      return baseResults;
    },
  });

  // Persist middleware wraps the store for localStorage — disabled in test
  const isTest =
    typeof process !== "undefined" && process.env.NODE_ENV === "test";

  return isTest
    ? create<LauncherState>()(storeDefinition)
    : create<LauncherState>()(
        persist(storeDefinition, {
          name: persistKey,
          partialize: (state) => ({
            recents: state.recents,
            favorites: state.favorites,
          }),
        })
      );
}
