"use client";

import { MSWProvider } from "@/components/msw-provider";
import { AsyncLauncher } from "@/components/launcher/async-launcher";
import { Button } from "@/components/ui/button";
import {
  Lightning,
  GithubLogo,
  Package,
  FilmSlate,
  ArrowLeft,
  Copy,
  Check,
  Terminal,
  Plugs,
  CloudArrowDown,
  ShieldCheck,
  Timer,
} from "@phosphor-icons/react";
import { useState, useCallback } from "react";
import Link from "next/link";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute right-3 top-3 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: typeof Lightning; title: string; description: string }) {
  return (
    <div className="group relative p-6 border border-border/50 bg-card/30 hover:bg-card/60 hover:border-border transition-all">
      <div className="flex items-start gap-4">
        <div className="shrink-0 p-2 bg-primary/10 text-primary"><Icon size={20} weight="duotone" /></div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function LauncherOpener() {
  const openLauncher = useCallback(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));
  }, []);

  return (
    <Button size="lg" onClick={openLauncher} className="gap-2.5 font-medium">
      Try it live
      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/20 border border-primary-foreground/30">⌘K</kbd>
    </Button>
  );
}

export default function AsyncDemoPage() {
  return (
    <MSWProvider>
      <main className="min-h-screen">
        <div className="px-6 pt-6 max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={12} />back to main demo
          </Link>
        </div>

        <section className="relative px-6 pt-12 pb-20 max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-border/60 text-xs font-mono text-muted-foreground">
              <Lightning size={12} weight="fill" />async data source demo
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
              ⌘K Launcher with<br /><span className="text-primary/80">async data sources</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Prefix-based routing to real API endpoints. Type{" "}
              <code className="text-primary font-mono text-base">gh:</code>,{" "}
              <code className="text-primary font-mono text-base">npm:</code>, or{" "}
              <code className="text-primary font-mono text-base">movies:</code>{" "}
              to hit different backends. Debounced, abortable, with loading + error states.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <LauncherOpener />
              <a href="https://github.com/tunajam/launcher-demo" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="gap-2"><GithubLogo size={16} />Source</Button>
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 pb-16 max-w-3xl mx-auto">
          <div className="border border-border/60 bg-card/30 p-6 space-y-4">
            <h2 className="text-base font-semibold">Try these queries</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { prefix: "gh:", example: "gh:react", icon: GithubLogo, desc: "Search GitHub repos" },
                { prefix: "npm:", example: "npm:zustand", icon: Package, desc: "Search npm packages" },
                { prefix: "movies:", example: "movies:nolan", icon: FilmSlate, desc: "Search movies" },
              ].map((item) => (
                <div key={item.prefix} className="p-4 border border-border/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <item.icon size={16} className="text-muted-foreground" />
                    <code className="text-sm font-mono text-primary">{item.example}</code>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 max-w-3xl mx-auto space-y-8">
          <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <FeatureCard icon={Plugs} title="Prefix-based routing" description="The query parser detects gh:, npm:, or movies: prefixes and routes to the correct API handler. Easy to add new sources — just register a prefix + fetch function." />
            <FeatureCard icon={Timer} title="Debounced search" description="250ms debounce prevents hammering the API. Short queries (≤2 chars) fire immediately for responsiveness. Each keystroke cancels the previous timer." />
            <FeatureCard icon={ShieldCheck} title="Request cancellation" description="AbortController cancels in-flight requests when the query changes. No stale results, no race conditions. Old responses are silently discarded." />
            <FeatureCard icon={CloudArrowDown} title="MSW mock layer" description="Service Worker intercepts fetch calls with realistic latency (200-700ms). Swap the MSW handlers for real API URLs — zero component changes needed." />
          </div>

          <div className="border border-border p-5 bg-card/30 font-mono text-[13px] leading-relaxed">
            <pre className="text-muted-foreground overflow-x-auto">
{`  ┌──────────────────┐
  │  Input: "gh:react"     │
  └──────────┬───────┘
             │ parseAsyncPrefix()
             ▼
  ┌──────────────────┐
  │  prefix: "gh"          │
  │  search: "react"       │
  └──────────┬───────┘
             │ debounce 250ms
             ▼
  ┌──────────────────┐
  │  fetch /api/github/    │◄── MSW intercepts
  │  search?q=react        │    (swap for real URL)
  └──────────┬───────┘
             │ transform → LauncherItem[]
             ▼
  ┌──────────────────┐
  │  Render results        │
  │  with timing badge     │
  └──────────────────┘`}
            </pre>
          </div>
        </section>

        <section className="px-6 pb-20 max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">Integration pattern</h2>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">1. Define your async source</h3>
            <div className="relative bg-card border border-border p-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
              <CopyButton text={`export async function searchGithub(query: string) {\n  const res = await fetch(\`/api/github/search?q=\${query}\`);\n  const data = await res.json();\n  return data.items.map((repo) => ({\n    id: \`gh-\${repo.id}\`,\n    name: repo.full_name,\n    icon: GithubLogo,\n    url: repo.html_url,\n  }));\n}`} />
              <pre className="text-muted-foreground">
<span className="text-blue-400">export async function</span> <span className="text-amber-400">searchGithub</span>(query: string) {"{"}{"\n"}
{"  "}<span className="text-blue-400">const</span> res = <span className="text-blue-400">await</span> <span className="text-amber-400">fetch</span>(<span className="text-emerald-400">{"`/api/github/search?q=${query}`"}</span>);{"\n"}
{"  "}<span className="text-blue-400">const</span> data = <span className="text-blue-400">await</span> res.<span className="text-amber-400">json</span>();{"\n"}
{"  "}<span className="text-blue-400">return</span> data.items.<span className="text-amber-400">map</span>((repo) {"=> ({"}{"\n"}
{"    "}<span className="text-emerald-400">id</span>: <span className="text-emerald-400">{"`gh-${repo.id}`"}</span>,{"\n"}
{"    "}<span className="text-emerald-400">name</span>: repo.full_name,{"\n"}
{"    "}<span className="text-emerald-400">icon</span>: GithubLogo,{"\n"}
{"    "}<span className="text-emerald-400">url</span>: repo.html_url,{"\n"}
{"  "}{"}))"};{"\n"}
{"}"}</pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">2. Use the async hook</h3>
            <div className="relative bg-card border border-border p-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
              <CopyButton text={`const asyncState = useAsyncSearch(query);\n// isAsync, loading, error, results, timing, source`} />
              <pre className="text-muted-foreground">
<span className="text-blue-400">const</span> asyncState = <span className="text-amber-400">useAsyncSearch</span>(query);{"\n\n"}
<span className="text-foreground/60">{"// asyncState gives you:"}</span>{"\n"}
<span className="text-foreground/60">{"// - isAsync: boolean    (prefix detected?)"}</span>{"\n"}
<span className="text-foreground/60">{"// - loading: boolean"}</span>{"\n"}
<span className="text-foreground/60">{"// - results: LauncherItem[]"}</span>{"\n"}
<span className="text-foreground/60">{"// - timing: number | null (ms)"}</span></pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">3. Swap MSW for real APIs</h3>
            <div className="relative bg-card border border-border p-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
              <CopyButton text={`// Just change the fetch URL:\nconst res = await fetch(\n  \`https://api.github.com/search/repositories?q=\${query}\`,\n  { headers: { Authorization: \`Bearer \${token}\` } }\n);`} />
              <pre className="text-muted-foreground">
<span className="text-foreground/60">{"// Just change the fetch URL:"}</span>{"\n"}
<span className="text-blue-400">const</span> res = <span className="text-blue-400">await</span> <span className="text-amber-400">fetch</span>({"\n"}
{"  "}<span className="text-emerald-400">{"`https://api.github.com/search/repositories?q=${query}`"}</span>,{"\n"}
{"  "}{"{"} <span className="text-emerald-400">headers</span>: {"{"} <span className="text-emerald-400">Authorization</span>: <span className="text-emerald-400">{"`Bearer ${token}`"}</span> {"}"} {"}"}{"\n"}
);</pre>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">The hard parts</h2>
          <div className="space-y-4">
            {[
              { title: "Race conditions on fast typing", body: "User types \"re\", then \"rea\", then \"reac\" — three requests fire. AbortController ensures only the latest response renders. Without this, stale results from \"re\" could overwrite fresh results from \"reac\"." },
              { title: "Debounce vs responsiveness", body: "250ms debounce is the sweet spot: fast enough to feel instant, slow enough to avoid hammering the API. For very short queries (≤2 chars), we skip the debounce entirely since those are typically intentional." },
              { title: "Loading states that don't flicker", body: "Showing a spinner for 50ms is worse than no spinner. The spinner only appears after the debounce fires, so short-lived requests never trigger a loading flash." },
              { title: "MSW in Next.js App Router", body: "Service workers need to be initialized client-side before any fetches happen. The MSWProvider component handles the async setup and shows a loading state until the worker is registered." },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-primary/30 pl-4 space-y-1">
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pb-20 max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {["shadcn/ui", "cmdk", "MSW", "AbortController", "Phosphor Icons", "Next.js", "Tailwind v4"].map((t) => (
              <span key={t} className="px-2.5 py-1 text-xs font-mono border border-border/60 text-muted-foreground">{t}</span>
            ))}
          </div>
        </section>

        <footer className="px-6 pb-12 max-w-3xl mx-auto border-t border-border/30 pt-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground/60">
            <div className="flex items-center gap-1.5">
              <Terminal size={12} />
              <span className="font-mono">Built by{" "}
                <a href="https://linkedin.com/in/hsbacot" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">Hunter Bacot</a>
              </span>
            </div>
            <Link href="/" className="font-mono hover:text-foreground transition-colors">← main demo</Link>
          </div>
        </footer>
      </main>
      <AsyncLauncher />
    </MSWProvider>
  );
}
