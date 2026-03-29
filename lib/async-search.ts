import type { LauncherItem } from "./types";
import { GithubLogo, Package, FilmSlate } from "@phosphor-icons/react";

export type AsyncPrefix = "gh" | "npm" | "movies";

export interface AsyncSearchResult {
  items: LauncherItem[];
  source: string;
  timing: number;
}

const prefixConfig: Record<AsyncPrefix, { label: string; placeholder: string }> = {
  gh: { label: "GitHub", placeholder: "Search repositories..." },
  npm: { label: "npm", placeholder: "Search packages..." },
  movies: { label: "Movies", placeholder: "Search movies..." },
};

export function parseAsyncPrefix(query: string): { prefix: AsyncPrefix | null; search: string } {
  const match = query.match(/^(gh|npm|movies):(.*)$/i);
  if (!match) return { prefix: null, search: query };
  return {
    prefix: match[1].toLowerCase() as AsyncPrefix,
    search: match[2].trimStart(),
  };
}

export function getPrefixConfig(prefix: AsyncPrefix) {
  return prefixConfig[prefix];
}

export async function searchGithub(query: string): Promise<AsyncSearchResult> {
  const start = performance.now();
  const res = await fetch(`/api/github/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  const timing = performance.now() - start;

  const items: LauncherItem[] = data.items.map((repo: { id: number; full_name: string; description: string; stargazers_count: number; language: string; html_url: string }) => ({
    id: `gh-${repo.id}`,
    name: repo.full_name,
    description: `⭐ ${(repo.stargazers_count / 1000).toFixed(0)}k · ${repo.language} — ${repo.description}`,
    icon: GithubLogo,
    category: "GitHub",
    tags: ["github", "repo"],
    url: repo.html_url,
  }));

  return { items, source: "GitHub API", timing };
}

export async function searchNpm(query: string): Promise<AsyncSearchResult> {
  const start = performance.now();
  const res = await fetch(`/api/npm/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  const timing = performance.now() - start;

  const items: LauncherItem[] = data.objects.map((pkg: { name: string; description: string; version: string; downloads: number }) => ({
    id: `npm-${pkg.name}`,
    name: pkg.name,
    description: `v${pkg.version} · ${formatDownloads(pkg.downloads)}/wk — ${pkg.description}`,
    icon: Package,
    category: "npm",
    tags: ["npm", "package"],
    url: `https://npmjs.com/package/${pkg.name}`,
  }));

  return { items, source: "npm Registry", timing };
}

export async function searchMovies(query: string): Promise<AsyncSearchResult> {
  const start = performance.now();
  const res = await fetch(`/api/movies/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  const timing = performance.now() - start;

  const items: LauncherItem[] = data.results.map((movie: { id: number; title: string; year: number; genre: string; rating: number; director: string }) => ({
    id: `movie-${movie.id}`,
    name: movie.title,
    description: `${movie.year} · ${movie.genre} · ★ ${movie.rating} — dir. ${movie.director}`,
    icon: FilmSlate,
    category: "Movies",
    tags: ["movie", "film"],
  }));

  return { items, source: "Movies API", timing };
}

export async function searchAsync(prefix: AsyncPrefix, query: string): Promise<AsyncSearchResult> {
  switch (prefix) {
    case "gh": return searchGithub(query);
    case "npm": return searchNpm(query);
    case "movies": return searchMovies(query);
  }
}

function formatDownloads(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}
