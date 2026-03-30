export interface GithubRepo {
  id: number;
  full_name: string;
  description: string;
  stargazers_count: number;
  language: string;
  html_url: string;
  owner: { avatar_url: string };
}

export interface NpmPackage {
  name: string;
  description: string;
  version: string;
  downloads: number;
  keywords: string[];
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  rating: number;
  director: string;
}

export const githubRepos: GithubRepo[] = [
  { id: 1, full_name: "vercel/next.js", description: "The React framework for the web", stargazers_count: 128000, language: "TypeScript", html_url: "https://github.com/vercel/next.js", owner: { avatar_url: "" } },
  { id: 2, full_name: "facebook/react", description: "A declarative, efficient, and flexible JavaScript library for building user interfaces", stargazers_count: 225000, language: "JavaScript", html_url: "https://github.com/facebook/react", owner: { avatar_url: "" } },
  { id: 3, full_name: "microsoft/typescript", description: "TypeScript is a superset of JavaScript that compiles to clean JavaScript output", stargazers_count: 100000, language: "TypeScript", html_url: "https://github.com/microsoft/typescript", owner: { avatar_url: "" } },
  { id: 4, full_name: "tailwindlabs/tailwindcss", description: "A utility-first CSS framework for rapid UI development", stargazers_count: 82000, language: "TypeScript", html_url: "https://github.com/tailwindlabs/tailwindcss", owner: { avatar_url: "" } },
  { id: 5, full_name: "shadcn-ui/ui", description: "Beautifully designed components built with Radix UI and Tailwind CSS", stargazers_count: 72000, language: "TypeScript", html_url: "https://github.com/shadcn-ui/ui", owner: { avatar_url: "" } },
  { id: 6, full_name: "pmndrs/zustand", description: "Bear necessities for state management in React", stargazers_count: 47000, language: "TypeScript", html_url: "https://github.com/pmndrs/zustand", owner: { avatar_url: "" } },
  { id: 7, full_name: "krisk/fuse", description: "Lightweight fuzzy-search in JavaScript", stargazers_count: 18000, language: "TypeScript", html_url: "https://github.com/krisk/fuse", owner: { avatar_url: "" } },
  { id: 8, full_name: "pacocoursey/cmdk", description: "Fast, unstyled command menu React component", stargazers_count: 9500, language: "TypeScript", html_url: "https://github.com/pacocoursey/cmdk", owner: { avatar_url: "" } },
  { id: 9, full_name: "denoland/deno", description: "A modern runtime for JavaScript and TypeScript", stargazers_count: 95000, language: "Rust", html_url: "https://github.com/denoland/deno", owner: { avatar_url: "" } },
  { id: 10, full_name: "sveltejs/svelte", description: "Cybernetically enhanced web apps", stargazers_count: 79000, language: "JavaScript", html_url: "https://github.com/sveltejs/svelte", owner: { avatar_url: "" } },
  { id: 11, full_name: "vitejs/vite", description: "Next generation frontend tooling", stargazers_count: 68000, language: "TypeScript", html_url: "https://github.com/vitejs/vite", owner: { avatar_url: "" } },
  { id: 12, full_name: "remix-run/remix", description: "Build better websites with Remix", stargazers_count: 29000, language: "TypeScript", html_url: "https://github.com/remix-run/remix", owner: { avatar_url: "" } },
  { id: 13, full_name: "trpc/trpc", description: "End-to-end typesafe APIs made easy", stargazers_count: 34000, language: "TypeScript", html_url: "https://github.com/trpc/trpc", owner: { avatar_url: "" } },
  { id: 14, full_name: "drizzle-team/drizzle-orm", description: "Headless TypeScript ORM with a head", stargazers_count: 24000, language: "TypeScript", html_url: "https://github.com/drizzle-team/drizzle-orm", owner: { avatar_url: "" } },
  { id: 15, full_name: "oven-sh/bun", description: "Incredibly fast JavaScript runtime, bundler, test runner, and package manager", stargazers_count: 73000, language: "Zig", html_url: "https://github.com/oven-sh/bun", owner: { avatar_url: "" } },
];

export const npmPackages: NpmPackage[] = [
  { name: "react", description: "A JavaScript library for building user interfaces", version: "19.1.0", downloads: 25000000, keywords: ["react", "ui", "frontend"] },
  { name: "next", description: "The React framework for production", version: "15.3.0", downloads: 8500000, keywords: ["react", "framework", "ssr"] },
  { name: "typescript", description: "TypeScript is a language for application scale JavaScript development", version: "5.8.0", downloads: 18000000, keywords: ["typescript", "compiler", "types"] },
  { name: "tailwindcss", description: "A utility-first CSS framework", version: "4.2.0", downloads: 12000000, keywords: ["css", "utility", "framework"] },
  { name: "zustand", description: "Bear necessities for state management", version: "5.0.4", downloads: 4200000, keywords: ["react", "state", "store"] },
  { name: "cmdk", description: "Fast, unstyled command menu for React", version: "1.1.1", downloads: 580000, keywords: ["react", "command", "menu", "palette"] },
  { name: "fuse.js", description: "Lightweight fuzzy-search in JavaScript", version: "7.1.0", downloads: 3200000, keywords: ["search", "fuzzy", "filter"] },
  { name: "zod", description: "TypeScript-first schema validation with static type inference", version: "3.24.0", downloads: 15000000, keywords: ["schema", "validation", "typescript"] },
  { name: "msw", description: "Industry standard API mocking for JavaScript", version: "2.12.0", downloads: 3800000, keywords: ["mock", "api", "testing", "service-worker"] },
  { name: "vitest", description: "Next generation testing framework powered by Vite", version: "4.1.0", downloads: 7500000, keywords: ["testing", "vite", "runner"] },
  { name: "playwright", description: "A framework for browser automation and testing", version: "1.58.0", downloads: 5200000, keywords: ["testing", "browser", "e2e", "automation"] },
  { name: "prisma", description: "Next-generation ORM for Node.js and TypeScript", version: "6.5.0", downloads: 4800000, keywords: ["database", "orm", "typescript"] },
  { name: "drizzle-orm", description: "Headless TypeScript ORM with a head", version: "0.40.0", downloads: 1200000, keywords: ["database", "orm", "sql"] },
  { name: "shadcn", description: "CLI for adding shadcn/ui components to your project", version: "4.1.0", downloads: 920000, keywords: ["ui", "components", "shadcn"] },
  { name: "hono", description: "Web framework built on Web Standards", version: "4.8.0", downloads: 2100000, keywords: ["web", "framework", "edge"] },
];

export const movies: Movie[] = [
  { id: 1, title: "The Shawshank Redemption", year: 1994, genre: "Drama", rating: 9.3, director: "Frank Darabont" },
  { id: 2, title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0, director: "Christopher Nolan" },
  { id: 3, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 8.8, director: "Christopher Nolan" },
  { id: 4, title: "Pulp Fiction", year: 1994, genre: "Crime", rating: 8.9, director: "Quentin Tarantino" },
  { id: 5, title: "The Matrix", year: 1999, genre: "Sci-Fi", rating: 8.7, director: "The Wachowskis" },
  { id: 6, title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: 8.7, director: "Christopher Nolan" },
  { id: 7, title: "Fight Club", year: 1999, genre: "Drama", rating: 8.8, director: "David Fincher" },
  { id: 8, title: "Goodfellas", year: 1990, genre: "Crime", rating: 8.7, director: "Martin Scorsese" },
  { id: 9, title: "The Social Network", year: 2010, genre: "Drama", rating: 7.8, director: "David Fincher" },
  { id: 10, title: "Parasite", year: 2019, genre: "Thriller", rating: 8.5, director: "Bong Joon-ho" },
  { id: 11, title: "Whiplash", year: 2014, genre: "Drama", rating: 8.5, director: "Damien Chazelle" },
  { id: 12, title: "Mad Max: Fury Road", year: 2015, genre: "Action", rating: 8.1, director: "George Miller" },
  { id: 13, title: "Everything Everywhere All at Once", year: 2022, genre: "Sci-Fi", rating: 7.8, director: "Daniel Kwan" },
  { id: 14, title: "No Country for Old Men", year: 2007, genre: "Thriller", rating: 8.2, director: "Coen Brothers" },
  { id: 15, title: "Dune", year: 2021, genre: "Sci-Fi", rating: 8.0, director: "Denis Villeneuve" },
];
