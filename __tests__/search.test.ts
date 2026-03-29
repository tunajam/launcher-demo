import { describe, it, expect } from "vitest";
import { searchItems } from "@/lib/search";
import { manifest, getAllItems } from "@/lib/manifest";

describe("searchItems", () => {
  const allItems = getAllItems();

  it("returns all items when query is empty", () => {
    const results = searchItems("", allItems);
    expect(results.length).toBeGreaterThan(0);
  });

  it("finds NFL by exact name", () => {
    const results = searchItems("NFL", allItems);
    expect(results[0].name).toBe("NFL");
  });

  it("finds teams by partial name", () => {
    const results = searchItems("Panthers", allItems);
    const names = results.map((r) => r.name);
    expect(names).toContain("Carolina Panthers");
  });

  it("finds items by keyword", () => {
    const results = searchItems("mahomes", allItems);
    const names = results.map((r) => r.name);
    expect(names).toContain("Kansas City Chiefs");
  });

  it("finds items by tag", () => {
    const results = searchItems("nfc-south", allItems);
    const names = results.map((r) => r.name);
    expect(names).toContain("Carolina Panthers");
  });

  it("ranks exact matches highest", () => {
    const results = searchItems("NBA", allItems);
    expect(results[0].name).toBe("NBA");
  });

  it("returns empty array for nonsense query", () => {
    const results = searchItems("xyzxyzxyz", allItems);
    expect(results).toHaveLength(0);
  });

  it("finds Michigan Wolverines via alias", () => {
    const results = searchItems("go blue", allItems);
    const names = results.map((r) => r.name);
    expect(names).toContain("Michigan Wolverines");
  });

  it("finds external links", () => {
    const results = searchItems("ESPN", allItems);
    expect(results[0].name).toBe("ESPN");
    expect(results[0].url).toBe("https://espn.com");
  });
});

describe("manifest", () => {
  it("has top-level leagues", () => {
    const names = manifest.map((m) => m.name);
    expect(names).toContain("NFL");
    expect(names).toContain("NBA");
    expect(names).toContain("MLB");
    expect(names).toContain("NHL");
    expect(names).toContain("MLS");
    expect(names).toContain("College Sports");
    expect(names).toContain("Golf (PGA Tour)");
  });

  it("NFL has teams as children", () => {
    const nfl = manifest.find((m) => m.id === "nfl");
    expect(nfl?.children).toBeDefined();
    expect(nfl!.children!.length).toBeGreaterThanOrEqual(5);
  });

  it("teams have stat pages as children", () => {
    const nfl = manifest.find((m) => m.id === "nfl");
    const panthers = nfl?.children?.find((c) => c.id === "nfl-panthers");
    expect(panthers?.children).toBeDefined();
    const pageNames = panthers!.children!.map((p) => p.name);
    expect(pageNames).toContain("Schedule");
    expect(pageNames).toContain("Roster");
    expect(pageNames).toContain("Stats");
  });

  it("getAllItems flattens the full tree", () => {
    const all = getAllItems();
    // Should have leagues + teams + stat pages
    expect(all.length).toBeGreaterThan(50);
    // Should include deeply nested items
    const ids = all.map((i) => i.id);
    expect(ids).toContain("nfl"); // top level
    expect(ids).toContain("nfl-panthers"); // team
    expect(ids).toContain("nfl-panthers-schedule"); // stat page
  });

  it("external links have urls", () => {
    const externals = manifest.filter((m) => m.url);
    expect(externals.length).toBeGreaterThanOrEqual(3);
    externals.forEach((ext) => {
      expect(ext.url).toMatch(/^https?:\/\//);
    });
  });

  // Prefix filter tests
  it("filters by prefix 'nfl:' to show NFL teams", () => {
    const results = searchItems("nfl:", manifest);
    // Should return NFL children (teams)
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => {
      expect(r.category).toBe("NFL");
    });
  });

  it("filters and searches with prefix 'nfl:panthers'", () => {
    const results = searchItems("nfl:panthers", manifest);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("Carolina Panthers");
  });

  it("prefix 'nba:' scopes to NBA teams", () => {
    const results = searchItems("nba:", manifest);
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => {
      expect(r.category).toBe("NBA");
    });
  });

  it("unknown prefix falls back to regular search", () => {
    const results = searchItems("xyz:test", manifest);
    // Should not crash, just search normally
    expect(Array.isArray(results)).toBe(true);
  });

  it("college teams have sport sub-categories", () => {
    const college = manifest.find((m) => m.id === "college");
    const michigan = college?.children?.find((c) => c.id === "college-michigan");
    expect(michigan?.children).toBeDefined();
    const sportNames = michigan!.children!.map((s) => s.name);
    expect(sportNames).toContain("Football");
    expect(sportNames).toContain("Basketball");
    expect(sportNames).toContain("Hockey");
  });
});
