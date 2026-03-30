"use client";

import { useLauncherStore } from "@/lib/launcher-store";
import { Button } from "@/components/ui/button";
import {
  Command as CommandIcon,
  Terminal,
  TreeStructure,
  MagnifyingGlass,
  Star,
  Clock,
  Keyboard,
  Package,
  ArrowRight,
  GitBranch,
  Copy,
  Check,
  GithubLogo,
} from "@phosphor-icons/react";
import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute right-3 top-3 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof CommandIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative p-6 border border-border/50 bg-card/30 hover:bg-card/60 hover:border-border transition-all">
      <div className="flex items-start gap-4">
        <div className="shrink-0 p-2 bg-primary/10 text-primary">
          <Icon size={20} weight="duotone" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const setOpen = useLauncherStore((s) => s.setOpen);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative px-6 pt-24 pb-20 max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-border/60 text-xs font-mono text-muted-foreground">
            <Package size={12} />
            shadcn registry component
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            ⌘K Launcher with
            <br />
            <span className="text-primary/80">hierarchical drill-down</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            A Raycast-style command palette built on shadcn primitives. Nested
            navigation, fuzzy search, keyboard-first UX. Drop it into any
            project.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => setOpen(true)}
              className="gap-2.5 font-medium"
            >
              Try the demo
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-primary-foreground/20 border border-primary-foreground/30">
                ⌘K
              </kbd>
            </Button>
            <a href="/async">
              <Button variant="outline" size="lg" className="gap-2">
                <ArrowRight size={16} />
                Async Demo
              </Button>
            </a>
            <a
              href="https://github.com/tunajam/launcher-demo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="gap-2">
                <GithubLogo size={16} />
                Source
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="px-6 pb-16 max-w-3xl mx-auto">
        <div className="relative">
          <div className="bg-card border border-border p-4 font-mono text-sm">
            <CopyButton text="npx shadcn add https://launcher.tunajam.com/r/launcher.json" />
            <span className="text-muted-foreground select-none">$ </span>
            <span className="text-foreground">
              npx shadcn add https://launcher.tunajam.com/r/launcher.json
            </span>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-3">
          <FeatureCard
            icon={TreeStructure}
            title="Hierarchical navigation"
            description="Unlimited drill-down depth with breadcrumb trail. Navigate leagues → teams → stats. Escape pops back one level."
          />
          <FeatureCard
            icon={MagnifyingGlass}
            title="Fuzzy search"
            description="Weighted search across name, aliases, keywords, tags, and description via fuse.js. Prefix filters for scoping."
          />
          <FeatureCard
            icon={Star}
            title="Favorites & recents"
            description="Pin frequently-used items. Recents track your navigation history. Both persist to localStorage."
          />
          <FeatureCard
            icon={Keyboard}
            title="Full keyboard control"
            description="Arrow keys navigate, Enter selects, Escape goes back. Tab moves between sidebar and results. No mouse required."
          />
          <FeatureCard
            icon={CommandIcon}
            title="Pure shadcn primitives"
            description="Built on Command, Dialog, Badge, and Separator. Inherits your theme tokens — zero hardcoded colors."
          />
          <FeatureCard
            icon={GitBranch}
            title="Store as factory"
            description="createLauncherStore({ manifest }) — consumers own their data. Zustand under the hood. No provider wrapping needed."
          />
        </div>
      </section>

      {/* Usage code */}
      <section className="px-6 pb-20 max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Quick start</h2>
        <div className="relative bg-card border border-border p-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
          <pre className="text-muted-foreground">
            <span className="text-foreground/60">{"// Define your manifest"}</span>
            {"\n"}
            <span className="text-blue-400">const</span>{" "}
            <span className="text-foreground">manifest</span>
            <span className="text-muted-foreground">{": LauncherItem[] = ["}</span>
            {"\n  "}
            <span className="text-muted-foreground">{"{"}</span>
            {"\n    "}
            <span className="text-emerald-400">id</span>
            <span className="text-muted-foreground">{': "teams",'}</span>
            {"\n    "}
            <span className="text-emerald-400">name</span>
            <span className="text-muted-foreground">{': "Teams",'}</span>
            {"\n    "}
            <span className="text-emerald-400">icon</span>
            <span className="text-muted-foreground">{": Users,"}</span>
            {"\n    "}
            <span className="text-emerald-400">children</span>
            <span className="text-muted-foreground">{": [...]"}</span>
            {"\n  "}
            <span className="text-muted-foreground">{"}"}</span>
            {"\n"}
            <span className="text-muted-foreground">{"];"}</span>
            {"\n\n"}
            <span className="text-foreground/60">{"// Create store + render"}</span>
            {"\n"}
            <span className="text-blue-400">const</span>{" "}
            <span className="text-foreground">store</span>{" "}
            <span className="text-muted-foreground">{"="}</span>{" "}
            <span className="text-amber-400">createLauncherStore</span>
            <span className="text-muted-foreground">{"({ manifest });"}</span>
            {"\n"}
            <span className="text-muted-foreground">{"<"}</span>
            <span className="text-blue-400">Launcher</span>{" "}
            <span className="text-emerald-400">store</span>
            <span className="text-muted-foreground">{"={store} />"}</span>
          </pre>
        </div>
      </section>

      {/* Hard parts */}
      <section className="px-6 pb-20 max-w-3xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">
          The hard parts
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          cmdk doesn&apos;t do hierarchy out of the box. Here&apos;s what it
          took to make it work.
        </p>

        <div className="space-y-4">
          {[
            {
              title: "cmdk loses selection on drill-down",
              body: "When children swap out, cmdk forgets what\u2019s selected. Fixed with controlled value + auto-selecting the first result whenever displayResults change.",
            },
            {
              title: "Dialog eats Escape",
              body: "Needed Escape to mean \u201Cgo back\u201D when drilled in, \u201Cclose\u201D at root. Capture-phase event handler reads state from Zustand (always fresh) instead of stale closures.",
            },
            {
              title: "Sidebar steals keyboard focus",
              body: "cmdk treats all CommandItems as navigable \u2014 sidebar categories were intercepting arrow keys. Solution: plain buttons in a nav element, not CommandItems.",
            },
            {
              title: "Favorites break navigation context",
              body: "Selecting \u2018Panthers\u2019 from favorites shouldn\u2019t append to your current path. buildNavigationPath() walks the manifest tree and reconstructs root \u2192 NFL \u2192 Panthers every time.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border-l-2 border-primary/30 pl-4 space-y-1"
            >
              <h3 className="text-sm font-medium text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="px-6 pb-20 max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {[
            "shadcn/ui",
            "cmdk",
            "Zustand",
            "fuse.js",
            "Phosphor Icons",
            "Next.js",
            "Tailwind v4",
            "Vitest",
            "Playwright",
          ].map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-xs font-mono border border-border/60 text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-12 max-w-3xl mx-auto border-t border-border/30 pt-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <Terminal size={12} />
            <span className="font-mono">
              Built by{" "}
              <a
                href="https://linkedin.com/in/hsbacot"
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hunter Bacot
              </a>
            </span>
          </div>
          <span className="font-mono">46 tests passing</span>
        </div>
      </footer>
    </main>
  );
}
