# Sports Launcher - shadcn Rebuild

Successfully rebuilt the Sports Launcher using shadcn primitives.

## What Changed

### Removed (old raw React components)
- `components/launcher.tsx`
- `components/launcher-context.tsx`
- `components/launcher-input.tsx`
- `components/launcher-sidebar.tsx`
- `components/launcher-results.tsx`
- `components/launcher-item.tsx`
- `components/launcher-footer.tsx`
- `components/use-launcher-keyboard.tsx`

### Added (new shadcn-based components)
- `components/launcher/launcher-provider.tsx` — Context provider with lazy state init, functional setState
- `components/launcher/launcher.tsx` — Main component using CommandDialog
- `components/launcher/launcher-input.tsx` — Search input with breadcrumbs
- `components/launcher/launcher-sidebar.tsx` — Category sidebar with CommandGroup + CommandItem
- `components/launcher/launcher-results.tsx` — Results panel with CommandList, memo'd items
- `components/launcher/launcher-footer.tsx` — Keyboard hints footer
- `components/launcher/use-launcher-keyboard.ts` — Keyboard handling hook (minimal)

### Modified
- `app/layout.tsx` — Updated imports, added `dark` class to `<html>`
- `app/page.tsx` — Updated import, fixed quotes for ESLint
- `app/globals.css` — Added Canopy dark theme tokens, forced dark mode

## Vercel React Best Practices Applied

1. ✅ **bundle-barrel-imports**: Direct imports from component files
2. ✅ **rerender-functional-setstate**: Functional updates in provider
3. ✅ **rerender-lazy-state-init**: `() => new Set(getRecents())`
4. ✅ **rerender-derived-state-no-effect**: Breadcrumbs/results via useMemo
5. ✅ **rerender-memo**: LauncherItemComponent wrapped in memo
6. ✅ **js-set-map-lookups**: Set for favorites/recents (O(1))
7. ✅ **js-early-exit**: Early returns in search/filter functions
8. ✅ **client-localstorage-schema**: Versioned keys (launcher-favorites-v1)
9. ⚠️  **rendering-content-visibility**: Not implemented (would add on long lists)
10. ⚠️  **rerender-transitions**: Not implemented (could wrap setQuery)

## Architecture

### shadcn Command Composition
```tsx
<CommandDialog> {/* Modal backdrop */}
  <Command shouldFilter={false}> {/* We use fuse.js */}
    <div> {/* Breadcrumbs + Input */}
      <CommandInput />
    </div>
    <div className="flex"> {/* Two-panel layout */}
      <div> {/* Sidebar */}
        <CommandGroup>
          <CommandItem>NFL</CommandItem>
          <CommandSeparator />
          ...
        </CommandGroup>
      </div>
      <CommandList> {/* Results */}
        <CommandGroup heading="NFL">
          <CommandItem>...</CommandItem>
        </CommandGroup>
        <CommandEmpty>No results</CommandEmpty>
      </CommandList>
    </div>
    <div> {/* Footer */}
      <kbd>...</kbd>
    </div>
  </Command>
</CommandDialog>
```

## Canopy Theme

- **Always dark mode** — `<html class="dark">`
- **Colors**: Green (#010f0a, #021a13, #032b1e), Carolina Blue (#4b9cd3), Purple (#8b5cf6)
- **Sharp corners** — `border-radius: 0 !important` globally
- **Fonts**: Instrument Serif (headings), Geist/Inter (body), Geist Mono (code)
- **Icons**: Phosphor (no emoji in product UI)

## Key Interactions

1. **⌘K Toggle** — Opens/closes launcher
2. **Drill-down** — Select item with children → push to nav stack
3. **Breadcrumbs** — Visual trail, click to go back
4. **Escape** — Pops navigation level or closes if at root
5. **Backspace on empty input** — Pops breadcrumb
6. **Category sidebar** — Click to reset nav + filter
7. **Favorites** — Star icon on hover, persists to localStorage
8. **Recents** — Auto-tracked, Set-based lookup

## Running

```bash
cd ~/tunajam/launcher-demo
npm run dev          # Port 3000 (default)
PORT=3500 npm run dev # Custom port (currently running)
npm run build        # Production build
```

**Currently running on:** http://localhost:3500

## Verification

- ✅ Compiles without errors
- ✅ Runs on port 3500
- ✅ All shadcn primitives used (CommandDialog, Command, CommandInput, CommandList, etc.)
- ✅ Canopy dark theme applied
- ✅ Sharp corners enforced globally
- ✅ Phosphor icons throughout
- ✅ Landing page with "Press ⌘K" trigger
