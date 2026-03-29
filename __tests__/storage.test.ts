import { describe, it, expect, beforeEach } from "vitest";
import { getRecents, addRecent, getFavorites, toggleFavorite } from "@/lib/storage";

describe("recents", () => {
  it("returns empty array initially", () => {
    expect(getRecents()).toEqual([]);
  });

  it("adds an item to recents", () => {
    addRecent("nfl");
    expect(getRecents()).toEqual(["nfl"]);
  });

  it("moves repeated item to front", () => {
    addRecent("nfl");
    addRecent("nba");
    addRecent("nfl");
    const recents = getRecents();
    expect(recents[0]).toBe("nfl");
    expect(recents).toHaveLength(2);
  });

  it("limits to 20 items", () => {
    for (let i = 0; i < 25; i++) {
      addRecent(`item-${i}`);
    }
    expect(getRecents()).toHaveLength(20);
    // Most recent should be first
    expect(getRecents()[0]).toBe("item-24");
  });
});

describe("favorites", () => {
  it("returns empty array initially", () => {
    expect(getFavorites()).toEqual([]);
  });

  it("toggles a favorite on", () => {
    toggleFavorite("nfl");
    expect(getFavorites()).toContain("nfl");
  });

  it("toggles a favorite off", () => {
    toggleFavorite("nfl");
    toggleFavorite("nfl");
    expect(getFavorites()).not.toContain("nfl");
  });

  it("handles multiple favorites", () => {
    toggleFavorite("nfl");
    toggleFavorite("nba");
    toggleFavorite("mlb");
    const favs = getFavorites();
    expect(favs).toContain("nfl");
    expect(favs).toContain("nba");
    expect(favs).toContain("mlb");
  });
});
