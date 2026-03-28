# Sports Launcher Demo

A production-grade Raycast-style ⌘K command launcher built as a portfolio piece demonstrating complex hierarchical navigation and search.

## Features

- **Hierarchical Drill-Down Navigation** — Navigate through leagues → teams → stats with full breadcrumb support
- **Keyboard-First UX** — Arrow keys, Enter, Escape, Tab with perfect keyboard handling
- **Fuzzy Search** — Weighted search with boost for recents and favorites
- **Stack-Based Navigation** — Escape goes back one level, maintains state
- **localStorage Persistence** — Tracks recents (last 20) and favorites
- **Canopy Design System** — Dark theme with Carolina Blue + Purple on deep green, sharp corners
- **Phosphor Icons** — Consistent icon library throughout
- **Zero Radius** — `border-radius: 0` everywhere for sharp aesthetic

## Tech Stack

- **Next.js 15** with App Router
- **React 19** with hooks
- **Tailwind CSS v4** (CSS-first)
- **cmdk** for command palette primitives
- **Fuse.js** for fuzzy search
- **Phosphor Icons** for all iconography
- **TypeScript** throughout

## Project Structure

```
launcher-demo/
├── app/
│   ├── layout.tsx         # Root layout with LauncherProvider
│   ├── page.tsx           # Demo landing page
│   └── globals.css        # Tailwind + custom styles
├── components/
│   ├── launcher.tsx              # Main modal component
│   ├── launcher-context.tsx      # State management + navigation stack
│   ├── launcher-input.tsx        # Search input + breadcrumbs
│   ├── launcher-results.tsx      # Results list
│   ├── launcher-item.tsx         # Individual result item
│   ├── launcher-footer.tsx       # Keyboard hints + branding
│   └── use-launcher-keyboard.tsx # Keyboard event handling
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── manifest.ts        # Sports data (leagues, teams, stats)
│   ├── search.ts          # Fuzzy search with Fuse.js
│   └── storage.ts         # localStorage helpers
└── README.md
```

## Data Model

The launcher uses a hierarchical manifest structure:

```typescript
LauncherItem {
  id: string;
  name: string;
  description?: string;
  icon: PhosphorIcon;
  category: string;
  tags: string[];
  aliases?: string[];
  keywords?: string[];
  prefixes?: string[];      // e.g., ["nfl:", "n:"]
  children?: LauncherItem[]; // Nested items
  action?: () => void;
  url?: string;
}
```

### Example Hierarchy

```
NFL (league)
├── Carolina Panthers (team)
│   ├── Schedule (page)
│   ├── Roster (page)
│   ├── Stats (page)
│   ├── News (page)
│   └── Standings (page)
├── Kansas City Chiefs (team)
└── Buffalo Bills (team)
```

## Navigation Pattern

1. **Root level** — Shows all leagues + recents
2. **Select NFL** → Drills into NFL teams list
3. **Select Panthers** → Drills into Panthers sub-menu (Schedule, Roster, etc.)
4. **Select Schedule** → Final action (would navigate in real app)
5. **Escape** → Goes back to Panthers level
6. **Escape** → Goes back to NFL teams
7. **Escape** → Goes back to root
8. **Escape** → Closes launcher

## Keyboard Shortcuts

- `⌘K` — Toggle launcher open/close
- `↑` / `↓` — Navigate results
- `↵` — Select item (drill in or take action)
- `⎋` — Go back one level (or close if at root)
- `Tab` — Autocomplete prefix (planned)
- `⌘` + Click — Open in new tab (planned)

## Search Algorithm

Weighted fuzzy search with Fuse.js:

- **Name**: 3.0x weight
- **Aliases**: 2.0x weight
- **Keywords**: 1.5x weight
- **Tags**: 1.0x weight
- **Description**: 0.5x weight

Results sorted by:
1. Exact match
2. Starts with query
3. Fuzzy score
4. Recents boost (+50)
5. Favorites boost (+100)

## Design System (Canopy)

### Colors

- **Green-950**: `#010f0a` to `#022c22` (background gradient)
- **Carolina Blue**: `#4B9CD3` (primary interaction, selected state)
- **Purple**: `#5B21B6` to `#8B5CF6` (accent, favorites)
- **Green-700/800**: Muted text and borders

### Typography

- **Display/Logo**: Instrument Serif
- **Body**: Inter
- **Monospace**: Geist Mono (shortcuts, footer)

### Layout

- **Width**: 680px
- **Max height**: 520px
- **Results height**: ~380px (scrollable)
- **Item height**: 48px
- **Border radius**: 0 everywhere

### Animation

```css
@keyframes launcher-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

150ms ease-out, subtle scale + fade.

## Development

```bash
# Install
bun install

# Dev server
bun dev

# Build
bun run build

# Start production
bun start
```

## Deployment

Ready to deploy to Vercel:

```bash
vercel
```

Environment: None required (all client-side).

## TODO / Future Enhancements

- [ ] Prefix autocomplete (Tab to complete "nfl:")
- [ ] Active prefix pill in input with backspace to remove
- [ ] Category sidebar for filtering
- [ ] Arrow left/right to navigate sidebar
- [ ] ⌘ + Click to open in new tab
- [ ] Recent searches (separate from recent items)
- [ ] Action history / undo
- [ ] Keyboard shortcut customization
- [ ] Export/import favorites
- [ ] Dark → Light theme toggle (against Canopy spec but maybe useful)

## Credits

Built by **Tunajam** as a portfolio demonstration of:

- Complex React state management
- Hierarchical navigation patterns
- Keyboard-first UX design
- Production-grade component architecture
- Fuzzy search implementation
- Design system adherence (Canopy)

## License

MIT — Free to use for learning and portfolio purposes.
