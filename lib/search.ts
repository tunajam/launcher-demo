import Fuse from "fuse.js";
import { LauncherItem } from "./types";
import { getAllItems } from "./manifest";

/**
 * Flatten an item tree into a flat list (all descendants).
 */
export function flattenItems(items: LauncherItem[]): LauncherItem[] {
  const result: LauncherItem[] = [];
  for (const item of items) {
    result.push(item);
    if (item.children) {
      result.push(...flattenItems(item.children));
    }
  }
  return result;
}

export interface SearchWeights {
  name: number;
  aliases: number;
  keywords: number;
  tags: number;
  description: number;
}

export const defaultWeights: SearchWeights = {
  name: 3.0,
  aliases: 2.0,
  keywords: 1.5,
  tags: 1.0,
  description: 0.5,
};

export function createFuseInstance(items: LauncherItem[]) {
  return new Fuse(items, {
    keys: [
      { name: "name", weight: defaultWeights.name },
      { name: "aliases", weight: defaultWeights.aliases },
      { name: "keywords", weight: defaultWeights.keywords },
      { name: "tags", weight: defaultWeights.tags },
      { name: "description", weight: defaultWeights.description },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
  });
}

/**
 * Parse prefix filters from query. E.g. "nfl:panthers" → { prefix: "nfl:", query: "panthers" }
 * Matches against item.prefixes in the given items (or their parents).
 */
function parsePrefixFilter(
  query: string,
  allItems: LauncherItem[]
): { filteredItems: LauncherItem[] | null; cleanQuery: string } {
  const colonIdx = query.indexOf(":");
  if (colonIdx < 1 || colonIdx > 10) return { filteredItems: null, cleanQuery: query };

  const prefix = query.slice(0, colonIdx + 1).toLowerCase();
  const cleanQuery = query.slice(colonIdx + 1).trim();

  // Find parent items whose prefixes match
  for (const item of allItems) {
    if (item.prefixes?.some((p) => p.toLowerCase() === prefix)) {
      // Return the children (or the item itself if no children)
      return {
        filteredItems: item.children ?? [item],
        cleanQuery,
      };
    }
  }

  return { filteredItems: null, cleanQuery: query };
}

export function searchItems(
  query: string,
  items: LauncherItem[],
  recents: string[] = [],
  favorites: string[] = []
): LauncherItem[] {
  if (!query.trim()) {
    // Return recents + favorites when no query
    const recentItems = recents
      .map((id) => items.find((item) => item.id === id))
      .filter(Boolean) as LauncherItem[];
    
    const favoriteItems = favorites
      .map((id) => items.find((item) => item.id === id))
      .filter(Boolean) as LauncherItem[];
    
    // Combine and dedupe
    const seen = new Set<string>();
    const combined: LauncherItem[] = [];
    
    [...recentItems, ...favoriteItems].forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    });
    
    return combined.length > 0 ? combined : items.slice(0, 10);
  }

  // Check for prefix filter (e.g. "nfl:panthers")
  const { filteredItems, cleanQuery } = parsePrefixFilter(query, items);
  const searchPool = filteredItems ?? items;
  const searchQuery = filteredItems ? cleanQuery : query;

  // If prefix matched but no remaining query, return all items in that scope
  if (filteredItems && !searchQuery.trim()) {
    return searchPool;
  }

  const fuse = createFuseInstance(searchPool);
  const results = fuse.search(searchQuery || query);

  // Sort by exact match > starts with > fuzzy score
  return results
    .map((result) => {
      const item = result.item;
      const lowerQuery = query.toLowerCase();
      const lowerName = item.name.toLowerCase();

      let priority = 0;

      // Exact match
      if (lowerName === lowerQuery) {
        priority = 1000;
      }
      // Starts with
      else if (lowerName.startsWith(lowerQuery)) {
        priority = 500;
      }
      // Fuzzy score (inverse - lower is better)
      else {
        priority = 100 - (result.score || 0) * 100;
      }

      // Boost for recents
      if (recents.includes(item.id)) {
        priority += 50;
      }

      // Boost for favorites
      if (favorites.includes(item.id)) {
        priority += 100;
      }

      return { item, priority };
    })
    .sort((a, b) => b.priority - a.priority)
    .map((result) => result.item);
}
