import "@testing-library/jest-dom/vitest";

// Polyfill ResizeObserver for jsdom (required by cmdk)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Polyfill scrollIntoView for jsdom (required by cmdk)
Element.prototype.scrollIntoView = function () {};

// Polyfill HTMLDialogElement for jsdom (required by base-ui dialog)
if (typeof HTMLDialogElement === "undefined") {
  (global as any).HTMLDialogElement = class HTMLDialogElement extends HTMLElement {};
}

// Mock localStorage
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    Object.keys(store).forEach((key) => delete store[key]);
  },
  get length() {
    return Object.keys(store).length;
  },
  key: (index: number) => Object.keys(store)[index] ?? null,
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Reset localStorage and Zustand store between tests
beforeEach(() => {
  localStorageMock.clear();
});

afterEach(() => {
  // Reset Zustand store to initial state
  try {
    const { useLauncherStore } = require("@/lib/launcher-store");
    useLauncherStore.setState({
      open: false,
      query: "",
      selectedCategory: null,
      navigationStack: [{ item: null, results: require("@/lib/manifest").manifest }],
      recents: [],
      favorites: [],
    });
  } catch {
    // Store may not be loaded yet
  }
});
