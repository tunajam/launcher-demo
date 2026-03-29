import React, { createContext, useContext, useReducer, useMemo, useEffect } from "react";
import type { LauncherItem, NavigationLevel } from "@/lib/types";
import { manifest, getAllItems } from "@/lib/manifest";
import { searchItems } from "@/lib/search";
import { getRecents, getFavorites, addRecent } from "@/lib/storage";

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

// ── State ──
interface LauncherState {
  open: boolean;
  query: string;
  selectedCategory: string | null;
  navigationStack: NavigationLevel[];
  recents: Set<string>;
  favorites: Set<string>;
}

const initialState: LauncherState = {
  open: false,
  query: "",
  selectedCategory: null,
  navigationStack: [{ item: null, results: manifest }],
  recents: new Set(),
  favorites: new Set(),
};

// ── Actions ──
type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_QUERY"; query: string }
  | { type: "SET_CATEGORY"; category: string | null }
  | { type: "SELECT_ITEM"; item: LauncherItem }
  | { type: "GO_BACK" }
  | { type: "RESET" }
  | { type: "TOGGLE_FAVORITE"; id: string };

// ── Reducer — pure function, fully testable ──
export function launcherReducer(state: LauncherState, action: Action): LauncherState {
  switch (action.type) {
    case "OPEN":
      return { ...state, open: true };

    case "CLOSE":
      return { ...state, open: false };

    case "SET_QUERY":
      return { ...state, query: action.query };

    case "SET_CATEGORY":
      return {
        ...state,
        selectedCategory: action.category,
        navigationStack: [{ item: null, results: manifest }],
        query: "",
      };

    case "SELECT_ITEM": {
      const newRecents = new Set([action.item.id, ...state.recents]);
      if (action.item.children) {
        return {
          ...state,
          navigationStack: buildNavigationPath(action.item),
          query: "",
          selectedCategory: null,
          recents: newRecents,
        };
      }
      return { ...state, open: false, recents: newRecents };
    }

    case "GO_BACK":
      if (state.navigationStack.length > 1) {
        return { ...state, navigationStack: state.navigationStack.slice(0, -1), query: "" };
      }
      return { ...state, open: false };

    case "RESET":
      return {
        ...state,
        navigationStack: [{ item: null, results: manifest }],
        query: "",
        selectedCategory: null,
      };

    case "TOGGLE_FAVORITE": {
      const next = new Set(state.favorites);
      next.has(action.id) ? next.delete(action.id) : next.add(action.id);
      return { ...state, favorites: next };
    }

    default:
      return state;
  }
}

// ── Derived state — pure function, testable ──
export function computeDisplayResults(state: LauncherState): LauncherItem[] {
  const currentLevel = state.navigationStack[state.navigationStack.length - 1];
  const baseResults = currentLevel.results;
  const allItems = getAllItems();

  if (state.selectedCategory === "__recent")
    return Array.from(state.recents).map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as LauncherItem[];
  if (state.selectedCategory === "__favorites")
    return Array.from(state.favorites).map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as LauncherItem[];
  if (state.query.trim()) return searchItems(state.query, baseResults);
  if (state.selectedCategory && currentLevel.item === null)
    return baseResults.filter((i) => i.category === state.selectedCategory);
  return baseResults;
}

// ── Context ──
interface LauncherContextValue {
  state: LauncherState;
  dispatch: React.Dispatch<Action>;
  breadcrumbs: string[];
  displayResults: LauncherItem[];
}

const LauncherContext = createContext<LauncherContextValue | undefined>(undefined);

export function useLauncher() {
  const ctx = useContext(LauncherContext);
  if (!ctx) throw new Error("useLauncher must be used within LauncherProvider");
  return ctx;
}

export function LauncherProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(launcherReducer, undefined, () => ({
    ...initialState,
    recents: new Set(getRecents()),
    favorites: new Set(getFavorites()),
  }));

  const breadcrumbs = useMemo(
    () => state.navigationStack.filter((l) => l.item).map((l) => l.item!.name),
    [state.navigationStack]
  );

  const displayResults = useMemo(() => computeDisplayResults(state), [state]);

  // Sync to localStorage on changes
  useEffect(() => {
    localStorage.setItem("launcher-recents-v1", JSON.stringify(Array.from(state.recents)));
  }, [state.recents]);

  useEffect(() => {
    localStorage.setItem("launcher-favorites-v1", JSON.stringify(Array.from(state.favorites)));
  }, [state.favorites]);

  return (
    <LauncherContext.Provider value={{ state, dispatch, breadcrumbs, displayResults }}>
      {children}
    </LauncherContext.Provider>
  );
}
