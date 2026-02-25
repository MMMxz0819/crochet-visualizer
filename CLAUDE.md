# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Crochet Pattern Visualizer** (钩针图解可视化网站) - a Next.js application that helps users:
- Convert abstract crochet pattern symbols/text into 3D visualizations
- Generate executable patterns from photos using AI
- Manage and share pattern collections
- Learn basic crochet stitches through a stitch dictionary

## Common Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Build & Production
npm run build        # Create production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint (configured with eslint-config-next)
npx prettier --write .   # Format all files
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.6 with App Router
- **React**: 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 (uses `@import "tailwindcss"` syntax)
- **UI Components**: shadcn/ui (New York style)
- **ORM**: Prisma with PostgreSQL
- **3D Rendering**: Three.js with React Three Fiber (planned)

### Project Structure

```
app/
├── page.tsx           # Homepage
├── layout.tsx         # Root layout with Geist font
├── globals.css        # Tailwind v4 CSS with CSS variables
└── api/               # API routes (to be implemented)

components/
└── ui/                # shadcn/ui components (Button, Card, Dialog, etc.)

lib/
└── utils.ts           # cn() utility for Tailwind class merging

prisma/
└── schema.prisma      # Database schema (User, Pattern, Category, etc.)
```

### Key Conventions

1. **Path Aliases**: Use `@/` prefix for imports (e.g., `@/components/ui/button`)
2. **shadcn/ui**: Components are installed via `npx shadcn add <component>`
3. **Styling**: Tailwind v4 uses `@import` syntax in globals.css, not `@tailwind` directives
4. **Font**: Geist Sans/Mono loaded via `next/font` in layout.tsx

### Database Schema (Prisma)

Core entities:
- **User**: Authentication and user data
- **Pattern**: Crochet patterns with JSON grid data, metadata, materials
- **Category**: Pattern categorization
- **PatternLike**: User favorites
- **Comment**: Pattern comments
- **Conversion**: AI image-to-pattern conversion jobs

Enums:
- `PatternType`: SYMBOL, TEXT, MIXED
- `ConversionStatus`: PENDING, PROCESSING, COMPLETED, FAILED

### Planned Architecture (from architecture.md)

The application is designed with these core modules:

1. **3D Visualization Module**: Parse pattern JSON → Generate 3D geometry → Render with Three.js
2. **Pattern Editor**: Grid-based editor with drag-and-drop stitch symbols
3. **AI Recognition Pipeline**: Image preprocessing → Grid detection → Symbol classification → Pattern reconstruction

See `architecture.md` for detailed technical specifications.

## Configuration Files

- `eslint.config.mjs`: ESLint flat config using eslint-config-next
- `postcss.config.mjs`: PostCSS with @tailwindcss/postcss plugin
- `components.json`: shadcn/ui configuration
- `.prettierrc`: Prettier config with prettier-plugin-tailwindcss
- `prisma/schema.prisma`: Database schema definition

## Environment Variables

The following environment variables are expected (for future development):

```
DATABASE_URL=postgresql://user:pass@localhost:5432/crochet
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```
