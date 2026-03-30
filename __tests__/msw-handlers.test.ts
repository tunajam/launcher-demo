import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "@/lib/msw-handlers";

const BASE = "https://test.local";
const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("GitHub API handler", () => {
  it("returns repos matching query by name", async () => {
    const res = await fetch(`${BASE}/api/github/search?q=react`);
    const data = await res.json();

    expect(res.ok).toBe(true);
    expect(data.items).toBeDefined();
    expect(data.total_count).toBeGreaterThan(0);

    const names = data.items.map((r: { full_name: string }) => r.full_name);
    expect(names).toContain("facebook/react");
  });

  it("filters by language", async () => {
    const res = await fetch(`${BASE}/api/github/search?q=rust`);
    const data = await res.json();

    const names = data.items.map((r: { full_name: string }) => r.full_name);
    expect(names).toContain("denoland/deno");
  });

  it("returns empty array for no matches", async () => {
    const res = await fetch(`${BASE}/api/github/search?q=xyznonexistent`);
    const data = await res.json();

    expect(data.items).toHaveLength(0);
    expect(data.total_count).toBe(0);
  });

  it("returns all repos when query is empty", async () => {
    const res = await fetch(`${BASE}/api/github/search?q=`);
    const data = await res.json();

    expect(data.items.length).toBeGreaterThan(10);
  });

  it("matches against description", async () => {
    const res = await fetch(`${BASE}/api/github/search?q=runtime`);
    const data = await res.json();

    const names = data.items.map((r: { full_name: string }) => r.full_name);
    expect(names).toContain("oven-sh/bun");
  });
});

describe("npm API handler", () => {
  it("returns packages matching query", async () => {
    const res = await fetch(`${BASE}/api/npm/search?q=zustand`);
    const data = await res.json();

    expect(res.ok).toBe(true);
    expect(data.objects).toBeDefined();
    expect(data.total).toBeGreaterThan(0);

    const names = data.objects.map((p: { name: string }) => p.name);
    expect(names).toContain("zustand");
  });

  it("searches by keyword", async () => {
    const res = await fetch(`${BASE}/api/npm/search?q=testing`);
    const data = await res.json();

    const names = data.objects.map((p: { name: string }) => p.name);
    expect(names).toContain("vitest");
  });

  it("returns empty for no matches", async () => {
    const res = await fetch(`${BASE}/api/npm/search?q=xyznonexistent`);
    const data = await res.json();

    expect(data.objects).toHaveLength(0);
    expect(data.total).toBe(0);
  });

  it("includes version and downloads in response", async () => {
    const res = await fetch(`${BASE}/api/npm/search?q=react`);
    const data = await res.json();

    const react = data.objects.find((p: { name: string }) => p.name === "react");
    expect(react).toBeDefined();
    expect(react.version).toBeDefined();
    expect(react.downloads).toBeGreaterThan(0);
  });
});

describe("Movies API handler", () => {
  it("returns movies matching title", async () => {
    const res = await fetch(`${BASE}/api/movies/search?q=dark+knight`);
    const data = await res.json();

    expect(res.ok).toBe(true);
    expect(data.results).toBeDefined();
    expect(data.total_results).toBeGreaterThan(0);

    const titles = data.results.map((m: { title: string }) => m.title);
    expect(titles).toContain("The Dark Knight");
  });

  it("searches by director", async () => {
    const res = await fetch(`${BASE}/api/movies/search?q=nolan`);
    const data = await res.json();

    const titles = data.results.map((m: { title: string }) => m.title);
    expect(titles).toContain("Inception");
    expect(titles).toContain("Interstellar");
    expect(titles).toContain("The Dark Knight");
  });

  it("searches by genre", async () => {
    const res = await fetch(`${BASE}/api/movies/search?q=sci-fi`);
    const data = await res.json();

    expect(data.results.length).toBeGreaterThan(2);
    data.results.forEach((m: { genre: string }) => {
      expect(m.genre).toBe("Sci-Fi");
    });
  });

  it("returns empty for no matches", async () => {
    const res = await fetch(`${BASE}/api/movies/search?q=xyznonexistent`);
    const data = await res.json();

    expect(data.results).toHaveLength(0);
    expect(data.total_results).toBe(0);
  });

  it("includes year and rating in response", async () => {
    const res = await fetch(`${BASE}/api/movies/search?q=inception`);
    const data = await res.json();

    const inception = data.results.find((m: { title: string }) => m.title === "Inception");
    expect(inception).toBeDefined();
    expect(inception.year).toBe(2010);
    expect(inception.rating).toBe(8.8);
    expect(inception.director).toBe("Christopher Nolan");
  });
});
