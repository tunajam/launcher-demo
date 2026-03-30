import { http, HttpResponse, delay } from "msw";
import { githubRepos, npmPackages, movies } from "./mock-data";

const IS_TEST = typeof process !== "undefined" && process.env.NODE_ENV === "test";

function realisticDelay(minMs: number, maxMs: number) {
  if (IS_TEST) return Promise.resolve();
  return delay(minMs + Math.random() * (maxMs - minMs));
}

export const handlers = [
  http.get("*/api/github/search", async ({ request }) => {
    await realisticDelay(300, 700);
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() ?? "";
    const results = githubRepos.filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q)
    );
    return HttpResponse.json({ items: results, total_count: results.length });
  }),

  http.get("*/api/npm/search", async ({ request }) => {
    await realisticDelay(200, 500);
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() ?? "";
    const results = npmPackages.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.includes(q))
    );
    return HttpResponse.json({ objects: results, total: results.length });
  }),

  http.get("*/api/movies/search", async ({ request }) => {
    await realisticDelay(250, 600);
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() ?? "";
    const results = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q)
    );
    return HttpResponse.json({ results, total_results: results.length });
  }),
];
