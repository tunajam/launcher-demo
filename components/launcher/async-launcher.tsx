"use client";

import React, { useEffect, useState, useCallback } from "react";
import { CommandDialog, Command, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandInput } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useAsyncSearch } from "@/lib/use-async-search";
import type { LauncherItem } from "@/lib/types";
import {
  Diamond,
  GithubLogo,
  Package,
  FilmSlate,
  Lightning,
  ArrowSquareOut,
  Spinner,
  WarningCircle,
  MagnifyingGlass,
  Timer,
} from "@phosphor-icons/react";

const prefixTags = [
  { prefix: "gh:", label: "GitHub", icon: GithubLogo, color: "text-white" },
  { prefix: "npm:", label: "npm", icon: Package, color: "text-red-400" },
  { prefix: "movies:", label: "Movies", icon: FilmSlate, color: "text-amber-400" },
];

export function AsyncLauncher() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cmdkValue, setCmdkValue] = useState("");
  const asyncState = useAsyncSearch(query);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (asyncState.results.length > 0) {
      setCmdkValue(asyncState.results[0].id);
    }
  }, [asyncState.results]);

  const handleSelect = useCallback((item: LauncherItem) => {
    if (item.url) window.open(item.url, "_blank");
    setOpen(false);
    setQuery("");
  }, []);

  const handlePrefixClick = useCallback((prefix: string) => {
    setQuery(prefix);
    setTimeout(() => {
      const input = document.querySelector("[cmdk-input]") as HTMLInputElement;
      input?.focus();
    }, 50);
  }, []);

  const activePrefix = prefixTags.find((p) => query.toLowerCase().startsWith(p.prefix));

  return (
    <CommandDialog
      open={open}
      onOpenChange={(v) => { setOpen(v); if (!v) setQuery(""); }}
      className="top-[15%] max-h-[70vh] sm:max-w-[640px]"
    >
      <Command
        shouldFilter={false}
        value={cmdkValue}
        onValueChange={setCmdkValue}
        className="bg-popover border border-border flex flex-col max-h-[70vh]"
      >
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
          <div className="flex items-center gap-1.5 shrink-0">
            <Diamond size={12} weight="fill" className="text-primary/40" />
            <span className="text-xs font-mono text-muted-foreground">async</span>
            {activePrefix && (
              <>
                <span className="text-muted-foreground text-xs">/</span>
                <Badge variant="secondary" className="text-xs px-1.5 py-0 font-mono gap-1">
                  <activePrefix.icon size={10} />
                  {activePrefix.label}
                </Badge>
              </>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={asyncState.placeholder ?? "Type gh:, npm:, or movies: to search..."}
              className="h-8 border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {asyncState.loading && <Spinner size={14} className="text-primary animate-spin" />}
            <kbd className="px-1.5 py-0.5 text-[11px] font-mono bg-muted text-muted-foreground border border-border">⌘K</kbd>
          </div>
        </div>

        <CommandList className="flex-1 overflow-y-auto max-h-none min-h-0 px-1">
          {!asyncState.isAsync && query.trim() === "" && (
            <div className="px-3 py-6 space-y-4">
              <p className="text-sm text-muted-foreground text-center mb-4">Type a prefix to search an API source</p>
              <div className="grid gap-2">
                {prefixTags.map((tag) => (
                  <button
                    key={tag.prefix}
                    onClick={() => handlePrefixClick(tag.prefix)}
                    className="flex items-center gap-3 px-4 py-3 text-left border border-border/50 hover:border-border hover:bg-muted/50 transition-all group cursor-pointer"
                  >
                    <tag.icon size={18} className={tag.color} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        <code className="text-primary font-mono">{tag.prefix}</code>{" "}
                        <span className="text-muted-foreground font-normal">
                          {tag.label === "GitHub" && "Search repositories"}
                          {tag.label === "npm" && "Search packages"}
                          {tag.label === "Movies" && "Search movies"}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">try it →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!asyncState.isAsync && query.trim() !== "" && (
            <CommandEmpty className="py-12 text-center">
              <MagnifyingGlass size={28} weight="duotone" className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Prefix your query with <code className="text-primary">gh:</code>, <code className="text-primary">npm:</code>, or <code className="text-primary">movies:</code>
              </p>
            </CommandEmpty>
          )}

          {asyncState.isAsync && asyncState.searchQuery === "" && !asyncState.loading && (
            <div className="py-12 text-center">
              <MagnifyingGlass size={28} weight="duotone" className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Type to search {asyncState.sourceLabel}...</p>
            </div>
          )}

          {asyncState.error && (
            <div className="py-12 text-center">
              <WarningCircle size={28} weight="duotone" className="mx-auto mb-2 text-destructive" />
              <p className="text-sm text-destructive">{asyncState.error}</p>
            </div>
          )}

          {asyncState.isAsync && !asyncState.loading && !asyncState.error && asyncState.searchQuery !== "" && asyncState.results.length === 0 && (
            <CommandEmpty className="py-12 text-center">
              <MagnifyingGlass size={28} weight="duotone" className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No results for &quot;{asyncState.searchQuery}&quot; in {asyncState.sourceLabel}</p>
            </CommandEmpty>
          )}

          {asyncState.results.length > 0 && (
            <CommandGroup heading={asyncState.source ?? asyncState.sourceLabel ?? "Results"} className="mb-2">
              {asyncState.results.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center justify-between px-3 py-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Icon size={18} weight="regular" className="text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.name}</div>
                        {item.description && <div className="text-xs text-muted-foreground truncate">{item.description}</div>}
                      </div>
                    </div>
                    {item.url && <ArrowSquareOut size={14} className="text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>

        <div className="border-t border-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
            <span><kbd className="px-1.5 py-0.5 bg-muted text-muted-foreground border border-border mr-1">↑↓</kbd>Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-muted text-muted-foreground border border-border mr-1">↵</kbd>Open</span>
            <span><kbd className="px-1.5 py-0.5 bg-muted text-muted-foreground border border-border mr-1">⎋</kbd>Close</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground/40">
            {asyncState.timing !== null && (
              <span className="flex items-center gap-1 text-muted-foreground/60">
                <Timer size={10} />{asyncState.timing.toFixed(0)}ms
              </span>
            )}
            <Lightning size={10} weight="fill" />
            <span>async launcher</span>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}
