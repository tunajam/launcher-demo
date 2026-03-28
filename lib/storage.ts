// localStorage persistence for recents and favorites

const RECENTS_KEY = "launcher-recents";
const FAVORITES_KEY = "launcher-favorites";
const MAX_RECENTS = 20;

export function getRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RECENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecent(itemId: string) {
  if (typeof window === "undefined") return;
  try {
    const recents = getRecents();
    // Remove if exists, add to front
    const filtered = recents.filter((id) => id !== itemId);
    const updated = [itemId, ...filtered].slice(0, MAX_RECENTS);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save recent:", error);
  }
}

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(itemId: string) {
  if (typeof window === "undefined") return;
  try {
    const favorites = getFavorites();
    const updated = favorites.includes(itemId)
      ? favorites.filter((id) => id !== itemId)
      : [...favorites, itemId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
  }
}
