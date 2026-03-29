# State Management Comparison: Zustand vs useReducer

## Option 1: Zustand

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LauncherState {
  open: boolean;
  query: string;
  selectedCategory: string | null;
  navigationStack: NavigationLevel[];
  recents: string[];
  favorites: string[];
}

interface LauncherActions {
  setOpen: (open: boolean) => void;
  setQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  selectItem: (item: LauncherItem) => void;
  goBack: () => void;
  reset: () => void;
  toggleFavorite: (id: string) => void;
}

export const useLauncherStore = create<LauncherState & LauncherActions>()(
  persist(
    (set, get) => ({
      // State
      open: false,
      query: '',
      selectedCategory: null,
      navigationStack: [{ item: null, results: manifest }],
      recents: [],
      favorites: [],

      // Actions — all transitions in one place
      setOpen: (open) => set({ open }),
      setQuery: (query) => set({ query }),
      setSelectedCategory: (category) => {
        // Reset to root when changing category
        set({
          selectedCategory: category,
          navigationStack: [{ item: null, results: manifest }],
          query: '',
        });
      },

      selectItem: (item) => {
        const { recents } = get();
        const newRecents = [item.id, ...recents.filter(id => id !== item.id)].slice(0, 20);

        if (item.children) {
          set({
            navigationStack: buildNavigationPath(item),
            query: '',
            selectedCategory: null,
            recents: newRecents,
          });
        } else if (item.url) {
          window.open(item.url, '_blank');
          set({ open: false, recents: newRecents });
        }
      },

      goBack: () => {
        const { navigationStack } = get();
        if (navigationStack.length > 1) {
          set({ navigationStack: navigationStack.slice(0, -1), query: '' });
        } else {
          set({ open: false });
        }
      },

      reset: () => set({
        navigationStack: [{ item: null, results: manifest }],
        query: '',
        selectedCategory: null,
      }),

      toggleFavorite: (id) => set(state => ({
        favorites: state.favorites.includes(id)
          ? state.favorites.filter(f => f !== id)
          : [...state.favorites, id],
      })),
    }),
    {
      name: 'launcher-storage',
      partialize: (state) => ({
        recents: state.recents,
        favorites: state.favorites,
      }),
    }
  )
);

// Components just use the store directly — no Provider needed
function LauncherSidebar() {
  const selectedCategory = useLauncherStore(s => s.selectedCategory);
  const setSelectedCategory = useLauncherStore(s => s.setSelectedCategory);
  // Only re-renders when selectedCategory changes
}

function LauncherResults() {
  const navigationStack = useLauncherStore(s => s.navigationStack);
  const query = useLauncherStore(s => s.query);
  // Derived in component via useMemo
}
```

### Pros
- **No Provider** — components subscribe directly, no wrapper tree
- **Selective re-renders** — sidebar doesn't re-render when query changes
- **persist middleware** — localStorage handled automatically, zero manual code
- **Atomic updates** — `set({ query: '', selectedCategory: null, navigationStack: [...] })` in one call
- **Testable** — `useLauncherStore.getState()` and `useLauncherStore.setState()` outside React
- **DevTools** — zustand/devtools middleware for free
- **Simpler component code** — no context consumption boilerplate

### Cons
- **Extra dependency** — ~1.1KB gzipped, but still a dep
- **Not the shadcn pattern** — every shadcn component uses Context + hooks, not external stores
- **Adoption friction** — users installing your component also install zustand
- **Global store** — harder to have multiple independent launcher instances on one page
- **SSR** — persist middleware needs hydration handling in Next.js

---

## Option 2: useReducer + Context

```ts
type LauncherAction =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SET_QUERY'; query: string }
  | { type: 'SET_CATEGORY'; category: string | null }
  | { type: 'SELECT_ITEM'; item: LauncherItem }
  | { type: 'GO_BACK' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_FAVORITE'; id: string }
  | { type: 'SYNC_STORAGE'; recents: string[]; favorites: string[] };

interface LauncherState {
  open: boolean;
  query: string;
  selectedCategory: string | null;
  navigationStack: NavigationLevel[];
  recents: Set<string>;
  favorites: Set<string>;
}

function launcherReducer(state: LauncherState, action: LauncherAction): LauncherState {
  switch (action.type) {
    case 'OPEN':
      return { ...state, open: true };

    case 'CLOSE':
      return { ...state, open: false };

    case 'SET_QUERY':
      return { ...state, query: action.query };

    case 'SET_CATEGORY':
      return {
        ...state,
        selectedCategory: action.category,
        navigationStack: [{ item: null, results: manifest }],
        query: '',
      };

    case 'SELECT_ITEM': {
      const newRecents = new Set([action.item.id, ...state.recents]);

      if (action.item.children) {
        return {
          ...state,
          navigationStack: buildNavigationPath(action.item),
          query: '',
          selectedCategory: null,
          recents: newRecents,
        };
      }
      // URL/action items close the launcher
      return { ...state, open: false, recents: newRecents };
    }

    case 'GO_BACK':
      if (state.navigationStack.length > 1) {
        return {
          ...state,
          navigationStack: state.navigationStack.slice(0, -1),
          query: '',
        };
      }
      return { ...state, open: false };

    case 'RESET':
      return {
        ...state,
        navigationStack: [{ item: null, results: manifest }],
        query: '',
        selectedCategory: null,
      };

    case 'TOGGLE_FAVORITE': {
      const next = new Set(state.favorites);
      next.has(action.id) ? next.delete(action.id) : next.add(action.id);
      return { ...state, favorites: next };
    }

    case 'SYNC_STORAGE':
      return {
        ...state,
        recents: new Set(action.recents),
        favorites: new Set(action.favorites),
      };

    default:
      return state;
  }
}

// Provider wraps the app
function LauncherProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(launcherReducer, undefined, () => ({
    open: false,
    query: '',
    selectedCategory: null,
    navigationStack: [{ item: null, results: manifest }],
    recents: new Set(getRecents()),
    favorites: new Set(getFavorites()),
  }));

  // Derived state
  const breadcrumbs = useMemo(() =>
    state.navigationStack.filter(l => l.item).map(l => l.item!.name),
    [state.navigationStack]
  );

  const displayResults = useMemo(() =>
    computeDisplayResults(state),
    [state.navigationStack, state.query, state.selectedCategory, state.recents, state.favorites]
  );

  // Side effects for localStorage
  useEffect(() => {
    persistRecents(Array.from(state.recents));
  }, [state.recents]);

  useEffect(() => {
    persistFavorites(Array.from(state.favorites));
  }, [state.favorites]);

  return (
    <LauncherContext.Provider value={{ state, dispatch, breadcrumbs, displayResults }}>
      {children}
    </LauncherContext.Provider>
  );
}

// Components dispatch actions
function LauncherSidebar() {
  const { state, dispatch } = useLauncher();
  // <button onClick={() => dispatch({ type: 'SET_CATEGORY', category: 'NFL' })}>
}
```

### Pros
- **Zero dependencies** — pure React, same pattern as every shadcn component
- **Explicit state machine** — every transition is a case in the reducer, easy to reason about
- **Multiple instances** — each Provider is independent, works for multi-launcher pages
- **Testable reducer** — pure function, test without React: `launcherReducer(state, action)`
- **Controlled mode natural** — parent can pass state/dispatch from their own reducer
- **SSR safe** — no hydration issues, no middleware
- **Familiar** — anyone who knows React knows useReducer

### Cons
- **Provider required** — must wrap component tree, one more layer
- **All-or-nothing re-renders** — Context re-renders all consumers on any state change
- **Manual localStorage** — need useEffect side effects for persistence
- **More boilerplate** — action types, switch cases, context creation
- **No selector optimization** — without `use(context)` selectors, every consumer re-renders (fixable with split contexts or useSyncExternalStore)

---

## Recommendation

| Criteria | Zustand | useReducer |
|----------|---------|------------|
| Bundle impact | +1.1KB | 0 |
| Re-render perf | ✅ Selective | ❌ All consumers |
| localStorage | ✅ Built-in persist | ❌ Manual useEffect |
| Multiple instances | ❌ Global store | ✅ Per-provider |
| Testability | ✅ getState/setState | ✅ Pure reducer |
| shadcn alignment | ❌ Different pattern | ✅ Same pattern |
| Adoption friction | ❌ Extra install | ✅ Zero deps |
| Controlled mode | ⚠️ Possible but awkward | ✅ Natural |
| SSR | ⚠️ Hydration care needed | ✅ No issues |
| DX | ✅ Less boilerplate | ❌ More boilerplate |

**If this is a standalone product:** Zustand. Cleaner, faster, better DX.

**If this is a portable shadcn composition:** useReducer. Zero deps, same patterns, multiple instances, controlled mode for free.
