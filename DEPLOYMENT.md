# Deployment Guide

## Vercel (Recommended)

1. Push to GitHub:
   ```bash
   gh repo create launcher-demo --public --source=. --remote=origin
   git push -u origin main
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

   Or via Vercel dashboard:
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - Framework: Next.js
   - Build command: `bun run build` (or use default)
   - Output directory: `.next`
   - No environment variables needed

3. Done! Your launcher will be live at `https://launcher-demo.vercel.app`

## Manual Deployment

If you prefer other platforms:

### Build
```bash
bun run build
```

### Start
```bash
bun start
```

Runs on port 3000 by default.

### Docker (optional)

```dockerfile
FROM oven/bun:1 as builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["bun", "start"]
```

## Local Development

```bash
bun dev
```

Open http://localhost:3000

## Environment Variables

None required! Everything is client-side.
