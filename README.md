# Launcher

**A Raycast-style ⌘K command launcher for complex ecosystems.**

Built on shadcn primitives (Command, Dialog, Badge, Separator) with Zustand state management.

![Launcher Demo](https://launcher.tunajam.com/og-image.png)

## Features

✨ **Hierarchical Navigation** — Unlimited drill-down with breadcrumbs  
🔍 **Fuzzy Search** — Weighted search across name, aliases, keywords, tags, and description  
🏷️ **Prefix Filters** — Type `nfl:` to scope search to a category. Deep search spans all descendants  
📌 **Favorites & Recents** — Quick access to frequently used items  
⌨️ **Full Keyboard Control** — Arrow navigation, Enter to select, Escape to go back  
🎨 **Themeable** — Pure shadcn tokens, inherits your design system  
🧪 **Tested** — 19 unit + 23 E2E tests  
📦 **Zero Config** — Drop in and go

## Live Demo

**https://launcher.tunajam.com**

Press `⌘K` to see it in action.

## Installation

```bash
npx shadcn add https://launcher.tunajam.com/r/launcher.json
```

This installs:
- All launcher components
- Store factory
- Search utilities
- Type definitions

### Dependencies

```bash
bun add zustand fuse.js @phosphor-icons/react
```

Shadcn components (auto-installed if missing):
- `command`
- `dialog`
- `badge`
- `separator`

## Quick Start

```tsx
import { Launcher, createLauncherStore, type LauncherItem } from "@/registry/new-york/launcher/launcher";
import { Users, User } from "@phosphor-icons/react";

// 1. Define your data
const manifest: LauncherItem[] = [
  {
    id: "teams",
    name: "Teams",
    description: "Manage your teams",
    icon: Users,
    category: "Apps",
    tags: ["people", "teams"],
    children: [
      {
        id: "teams-my",
        name: "My Teams",
        icon: User,
        category: "Apps",
        tags: ["my"],
      },
    ],
  },
];

// 2. Create the store
const useLauncherStore = createLauncherStore({ manifest });

// 3. Add to your layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Launcher store={useLauncherStore} />
      </body>
    </html>
  );
}
```

Press `⌘K` (or `Ctrl+K`) and start typing!

## API Reference

### `LauncherItem`

```ts
interface LauncherItem {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description?: string;          // Subtitle
  icon: PhosphorIcon;            // @phosphor-icons/react icon
  category: string;              // Group label
  tags: string[];                // Search tags
  aliases?: string[];            // Alternative names
  keywords?: string[];           // Related search terms
  prefixes?: string[];           // Command prefixes (e.g., "/edit")
  children?: LauncherItem[];     // Nested items
  action?: () => void;           // Callback (closes launcher)
  url?: string;                  // External link (opens new tab)
}
```

### `createLauncherStore(config)`

```ts
interface LauncherConfig {
  manifest: LauncherItem[];      // Root-level items
  searchWeights?: SearchWeights; // Fuse.js field weights
  persistKey?: string;           // localStorage key (default: "launcher-storage")
}

const useLauncherStore = createLauncherStore(config);
```

### `<Launcher />`

```tsx
interface LauncherProps {
  store: ReturnType<typeof createLauncherStore>;
  categories?: Category[];
  branding?: {
    icon?: React.ReactNode;
    label?: string;
  };
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `⌘K` / `Ctrl+K` | Toggle launcher |
| `↑` `↓` | Navigate results |
| `Enter` | Select / drill into |
| `Escape` | Go back / close |
| `Backspace` (empty input) | Pop breadcrumb level |

## Customization

### Custom Categories

```tsx
import { SquaresFour, Folder, Settings, Star, ClockCounterClockwise } from "@phosphor-icons/react";

const categories: Category[] = [
  { id: "all", name: "All", icon: SquaresFour },
  { id: "__recent", name: "Recent", icon: ClockCounterClockwise },
  { id: "__favorites", name: "Favorites", icon: Star },
  { isDivider: true },
  { id: "Files", name: "Files", icon: Folder },
  { id: "Settings", name: "Settings", icon: Settings },
];

<Launcher store={useLauncherStore} categories={categories} />
```

### Custom Search Weights

```tsx
const useLauncherStore = createLauncherStore({
  manifest,
  searchWeights: {
    name: 4.0,       // Exact matches
    aliases: 3.0,    // Alternative names
    keywords: 2.0,   // Related terms
    tags: 1.5,       // Categories
    description: 0.3 // Full text
  },
});
```

### Custom Branding

```tsx
import { Rocket } from "@phosphor-icons/react";

const branding = {
  icon: <Rocket size={12} weight="fill" className="text-primary/40" />,
  label: "my-app",
};

<Launcher store={useLauncherStore} branding={branding} />
```

### Styling

All components use shadcn tokens. Override via Tailwind or CSS variables:

```css
/* Scrollbar */
.launcher-scroll::-webkit-scrollbar {
  width: 6px;
}

.launcher-scroll::-webkit-scrollbar-thumb {
  background: hsl(var(--muted));
  border-radius: 3px;
}
```

## Advanced

### Programmatic Control

```tsx
// Open programmatically
useLauncherStore.getState().setOpen(true);

// Navigate to item
const settingsItem = manifest.find(i => i.id === "settings");
useLauncherStore.getState().selectItem(settingsItem);

// Add to favorites
useLauncherStore.getState().toggleFavorite("item-id");
```

### Dynamic Manifest

```tsx
"use client";

import { useState, useEffect } from "react";
import { Launcher, createLauncherStore } from "@/registry/new-york/launcher/launcher";

export function DynamicLauncher() {
  const [manifest, setManifest] = useState([]);
  
  useEffect(() => {
    fetch("/api/launcher-data")
      .then(res => res.json())
      .then(setManifest);
  }, []);

  const useLauncherStore = createLauncherStore({ manifest });
  
  return <Launcher store={useLauncherStore} />;
}
```

## Testing

The project includes 46 tests (Vitest + Playwright).

```bash
# Unit tests
bun test

# E2E tests
npx playwright test
```

The store automatically disables localStorage persistence when `NODE_ENV === "test"` for deterministic testing.

### Example Test

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Launcher, createLauncherStore } from "@/registry/new-york/launcher/launcher";

test("opens on ⌘K", () => {
  const useLauncherStore = createLauncherStore({ manifest: [] });
  render(<Launcher store={useLauncherStore} />);
  
  fireEvent.keyDown(document, { key: "k", metaKey: true });
  
  expect(screen.getByRole("dialog")).toBeVisible();
});
```

## Architecture

```
<Launcher>                    # Root
  <CommandDialog>             # shadcn Dialog
    <Command>                 # shadcn Command (cmdk)
      <LauncherInput>         # Search + breadcrumbs
      <LauncherSidebar>       # Category filters
      <LauncherResults>       # Item list
      <LauncherFooter>        # Keyboard hints
```

**State management:** Zustand with persist middleware  
**Search:** Fuse.js with configurable weights  
**UI:** shadcn Command + Dialog  
**Icons:** @phosphor-icons/react  
**Styling:** Tailwind CSS with shadcn tokens

## Use Cases

- **SaaS dashboards** — Navigate features, settings, and workflows
- **Documentation sites** — Jump to pages, sections, and APIs
- **Design tools** — Access components, templates, and assets
- **Admin panels** — Quick access to entities and actions
- **Developer tools** — Command palette for CLI-style interactions

## LLM Context

For AI-assisted development, see:
- **llms.txt** — Quick reference for LLMs
- **llms-full.txt** — Complete API documentation for LLMs

Both available at `https://launcher.tunajam.com/llms.txt` and `https://launcher.tunajam.com/llms-full.txt`.

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build registry
bun run registry:build

# Run tests
bun test
npx playwright test
```

## License

MIT

## Credits

Built with ❤️ by [Tunajam](https://tunajam.com)

Inspired by:
- [Raycast](https://raycast.com)
- [Linear](https://linear.app) command palette
- [Vercel](https://vercel.com) search

Powered by:
- [shadcn/ui](https://ui.shadcn.com)
- [cmdk](https://cmdk.paco.me)
- [Zustand](https://zustand-demo.pmnd.rs)
- [Fuse.js](https://fusejs.io)
