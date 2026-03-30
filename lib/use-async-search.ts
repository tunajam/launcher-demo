"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { parseAsyncPrefix, searchAsync, getPrefixConfig, type AsyncPrefix, type AsyncSearchResult } from "./async-search";
import type { LauncherItem } from "./types";

interface AsyncSearchState {
  isAsync: boolean;
  prefix: AsyncPrefix | null;
  sourceLabel: string | null;
  placeholder: string | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  results: LauncherItem[];
  timing: number | null;
  source: string | null;
}

const DEBOUNCE_MS = 250;

export function useAsyncSearch(query: string): AsyncSearchState {
  const [state, setState] = useState<AsyncSearchState>({
    isAsync: false,
    prefix: null,
    sourceLabel: null,
    placeholder: null,
    searchQuery: "",
    loading: false,
    error: null,
    results: [],
    timing: null,
    source: null,
  });

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (prefix: AsyncPrefix, search: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await searchAsync(prefix, search);
      if (controller.signal.aborted) return;

      setState((prev) => ({
        ...prev,
        loading: false,
        results: result.items,
        timing: result.timing,
        source: result.source,
        error: null,
      }));
    } catch (err) {
      if (controller.signal.aborted) return;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Search failed",
        results: [],
      }));
    }
  }, []);

  useEffect(() => {
    const { prefix, search } = parseAsyncPrefix(query);

    if (!prefix) {
      setState({
        isAsync: false,
        prefix: null,
        sourceLabel: null,
        placeholder: null,
        searchQuery: "",
        loading: false,
        error: null,
        results: [],
        timing: null,
        source: null,
      });
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      return;
    }

    const config = getPrefixConfig(prefix);
    setState((prev) => ({
      ...prev,
      isAsync: true,
      prefix,
      sourceLabel: config.label,
      placeholder: config.placeholder,
      searchQuery: search,
    }));

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (search.length === 0) {
      setState((prev) => ({
        ...prev,
        loading: false,
        results: [],
        timing: null,
        source: null,
        error: null,
      }));
      return;
    }

    if (search.length <= 2) {
      doSearch(prefix, search);
      return;
    }

    debounceRef.current = setTimeout(() => {
      doSearch(prefix, search);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  return state;
}
