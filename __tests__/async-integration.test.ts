import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "@/lib/msw-handlers";
import { searchAsync, searchGithub, searchNpm, searchMovies } from "@/lib/async-search";

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("searchGithub", () => {
  it("transforms API response into LauncherItems", async () => {
    const result = await searchGithub("react");

    expect(result.source).toBe("GitHub API");
    expect(result.timing).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);

    const first = result.items[0];
    expect(first.id).toMatch(/^gh-/);
    expect(first.category).toBe("GitHub");
    expect(first.tags).toContain("github");
    expect(first.url).toBeDefined();
  });

  it("includes star count in description", async () => {
    const result = await searchGithub("react");
    const react = result.items.find((i) => i.name === "facebook/react");
    expect(react?.description).toContain("⭐");
    expect(react?.description).toContain("k");
  });
});

describe("searchNpm", () => {
  it("transforms API response into LauncherItems", async () => {
    const result = await searchNpm("zustand");

    expect(result.source).toBe("npm Registry");
    expect(result.timing).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);

    const zustand = result.items.find((i) => i.name === "zustand");
    expect(zustand).toBeDefined();
    expect(zustand!.id).toBe("npm-zustand");
    expect(zustand!.category).toBe("npm");
    expect(zustand!.url).toContain("npmjs.com");
  });

  it("formats download counts in description", async () => {
    const result = await searchNpm("react");
    const react = result.items.find((i) => i.name === "react");
    expect(react?.description).toContain("M");
    expect(react?.description).toContain("/wk");
  });
});

describe("searchMovies", () => {
  it("transforms API response into LauncherItems", async () => {
    const result = await searchMovies("nolan");

    expect(result.source).toBe("Movies API");
    expect(result.timing).toBeGreaterThan(0);
    expect(result.items.length).toBeGreaterThan(0);

    const inception = result.items.find((i) => i.name === "Inception");
    expect(inception).toBeDefined();
    expect(inception!.id).toBe("movie-3");
    expect(inception!.category).toBe("Movies");
  });

  it("includes year, genre, and rating in description", async () => {
    const result = await searchMovies("inception");
    const inception = result.items.find((i) => i.name === "Inception");
    expect(inception?.description).toContain("2010");
    expect(inception?.description).toContain("Sci-Fi");
    expect(inception?.description).toContain("8.8");
    expect(inception?.description).toContain("Christopher Nolan");
  });

  it("movies don't have URLs (not external links)", async () => {
    const result = await searchMovies("nolan");
    result.items.forEach((item) => {
      expect(item.url).toBeUndefined();
    });
  });
});

describe("searchAsync router", () => {
  it("routes gh prefix to GitHub search", async () => {
    const result = await searchAsync("gh", "react");
    expect(result.source).toBe("GitHub API");
  });

  it("routes npm prefix to npm search", async () => {
    const result = await searchAsync("npm", "zustand");
    expect(result.source).toBe("npm Registry");
  });

  it("routes movies prefix to movie search", async () => {
    const result = await searchAsync("movies", "nolan");
    expect(result.source).toBe("Movies API");
  });

  it("all sources return valid LauncherItem shapes", async () => {
    const gh = await searchAsync("gh", "next");
    const npm = await searchAsync("npm", "next");
    const movies = await searchAsync("movies", "dark");

    [gh, npm, movies].forEach((result) => {
      result.items.forEach((item) => {
        expect(item.id).toBeDefined();
        expect(item.name).toBeDefined();
        expect(item.icon).toBeDefined();
        expect(item.category).toBeDefined();
        expect(item.tags).toBeInstanceOf(Array);
      });
    });
  });
});
