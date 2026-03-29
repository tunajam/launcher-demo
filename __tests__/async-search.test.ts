import { describe, it, expect } from "vitest";
import { parseAsyncPrefix, getPrefixConfig } from "@/lib/async-search";

describe("parseAsyncPrefix", () => {
  it("detects gh: prefix", () => {
    const result = parseAsyncPrefix("gh:react");
    expect(result.prefix).toBe("gh");
    expect(result.search).toBe("react");
  });

  it("detects npm: prefix", () => {
    const result = parseAsyncPrefix("npm:zustand");
    expect(result.prefix).toBe("npm");
    expect(result.search).toBe("zustand");
  });

  it("detects movies: prefix", () => {
    const result = parseAsyncPrefix("movies:nolan");
    expect(result.prefix).toBe("movies");
    expect(result.search).toBe("nolan");
  });

  it("is case-insensitive for prefix", () => {
    const result = parseAsyncPrefix("GH:React");
    expect(result.prefix).toBe("gh");
    expect(result.search).toBe("React");
  });

  it("returns null prefix for plain queries", () => {
    const result = parseAsyncPrefix("just a normal search");
    expect(result.prefix).toBeNull();
    expect(result.search).toBe("just a normal search");
  });

  it("returns null prefix for empty string", () => {
    const result = parseAsyncPrefix("");
    expect(result.prefix).toBeNull();
    expect(result.search).toBe("");
  });

  it("returns null prefix for unknown prefix", () => {
    const result = parseAsyncPrefix("xyz:something");
    expect(result.prefix).toBeNull();
    expect(result.search).toBe("xyz:something");
  });

  it("handles prefix with empty search", () => {
    const result = parseAsyncPrefix("gh:");
    expect(result.prefix).toBe("gh");
    expect(result.search).toBe("");
  });

  it("trims leading whitespace from search", () => {
    const result = parseAsyncPrefix("npm:  zustand");
    expect(result.prefix).toBe("npm");
    expect(result.search).toBe("zustand");
  });

  it("handles search with special characters", () => {
    const result = parseAsyncPrefix("gh:@scope/package");
    expect(result.prefix).toBe("gh");
    expect(result.search).toBe("@scope/package");
  });

  it("handles search with spaces", () => {
    const result = parseAsyncPrefix("movies:the dark knight");
    expect(result.prefix).toBe("movies");
    expect(result.search).toBe("the dark knight");
  });

  it("does not match colon in the middle of query", () => {
    const result = parseAsyncPrefix("search for file:test");
    expect(result.prefix).toBeNull();
  });
});

describe("getPrefixConfig", () => {
  it("returns GitHub config", () => {
    const config = getPrefixConfig("gh");
    expect(config.label).toBe("GitHub");
    expect(config.placeholder).toContain("repositories");
  });

  it("returns npm config", () => {
    const config = getPrefixConfig("npm");
    expect(config.label).toBe("npm");
    expect(config.placeholder).toContain("packages");
  });

  it("returns movies config", () => {
    const config = getPrefixConfig("movies");
    expect(config.label).toBe("Movies");
    expect(config.placeholder).toContain("movies");
  });
});
