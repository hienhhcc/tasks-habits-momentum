# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Momentum is a full-stack task and habit tracking dashboard built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and PostgreSQL via Drizzle ORM.

## Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
docker-compose up -d     # Start PostgreSQL container
npm run db:generate      # Generate Drizzle schema artifacts
npm run db:migrate       # Run migrations
npm run db:push          # Push schema directly to database
npm run db:studio        # Launch Drizzle Studio UI
```

## Architecture

**Pattern:** Server-driven Next.js App Router with server components as default

### Key Directories

- `app/actions/` - Server actions for all database operations (tasks.ts, habits.ts, stats.ts)
- `app/components/` - Shared UI components
- `db/` - Drizzle schema (`schema.ts`) and database instance (`index.ts`)
- `drizzle/` - Generated migrations

### Database Schema (3 tables)

- `tasks` - Task items with title, description, priority, dueDate, completed status
- `habits` - Habit definitions with name, icon, color, streak counter
- `habit_completions` - Daily completion records linked to habits

### Component Naming Convention

- **Server components:** Default, used for data fetching (e.g., `Dashboard.tsx`, `page.tsx`)
- **Client components:** Suffixed with `Client` for interactivity (e.g., `TaskListClient.tsx`, `HabitFormClient.tsx`)

## Code Patterns

### Server Actions

All mutations use server actions with `"use server"` directive:
```typescript
"use server";
import { db, tasks } from "@/db";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";

export async function getTasks() {
  await connection();
  return await db.select().from(tasks).orderBy(tasks.createdAt);
}
```

Always call `revalidatePath()` after mutations to refresh UI.

### Date Handling

Use `parseDueDate()` helper from `app/actions/tasks.ts` for local timezone parsing. Supports: "Today", "Tomorrow", "This Week", "Next Week", "In X days", "YYYY-MM-DD".

### Habit Streaks

Streak updates use SQL expressions:
- Increment: `sql\`${habits.streak} + 1\``
- Decrement: `sql\`GREATEST(${habits.streak} - 1, 0)\`` (prevents negatives)

### Type Safety

Import types from `db/schema.ts`: `Task`, `NewTask`, `Habit`, `NewHabit`, `HabitCompletion`, `NewHabitCompletion`

## Environment Setup

Copy `.env.example` to `.env` and configure:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/tasks_habits
```

Database runs on PostgreSQL 16-alpine via Docker.
