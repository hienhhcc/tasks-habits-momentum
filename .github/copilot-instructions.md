# Repo-specific instructions for AI coding agents

This file gives concise, actionable guidance to quickly contribute to this Next.js + Drizzle project.

1) Big picture
- Framework: Next.js (App Router). UI lives under `app/` (server components by default). Client components are named with `Client` suffix (examples: `app/tasks/TasksPageClient.tsx`, `app/habits/HabitsPageClient.tsx`).
- Backend/DB: Drizzle ORM + `postgres` used via `db/index.ts` which exports `db` and the schema from `db/schema.ts`.
- Server actions: colocated in `app/actions/*.ts`. They use `"use server"`, import `@/db`, call Drizzle queries and then `revalidatePath()` to refresh routes.

2) Key files and patterns (read these before changing behavior)
- `db/schema.ts` — canonical schema and types (use these types for DB-bound code).
- `db/index.ts` — creates Drizzle instance from `process.env.DATABASE_URL`. Always ensure `DATABASE_URL` is available when running server or migrations.
- `app/actions/*.ts` — mutation + query entrypoints for the app. They call `await connection()` from `next/server` at top of queries, and always call `revalidatePath()` after writes.
- `app/components/` — shared UI primitives. `*Card.tsx`, `*Form.tsx`, and `*ListClient.tsx` show component naming conventions and client-only interactions.

3) Runtime & infra notes
- Database: Postgres. Local convenience: `docker-compose.yml` spins up a `postgres:16-alpine` service. The DB container exposes `${POSTGRES_PORT:-5432}`.
- Env: `DATABASE_URL` must point to the Postgres instance. The Drizzle config (`drizzle.config.ts`) uses `process.env.DATABASE_URL`.
- Drizzle commands (see `package.json` scripts):
  - `npm run db:generate` — generate schema artifacts
  - `npm run db:migrate` — run migrations
  - `npm run db:push` — push schema
  - `npm run db:studio` — run Drizzle studio

4) Dev / build / debug commands
- Run development server: `npm run dev` (Next dev). Ensure Postgres is reachable first (e.g. `docker-compose up -d` or point `DATABASE_URL` to your DB).
- Build: `npm run build` then `npm run start` for production-like run.
- Lint: `npm run lint`.

5) Important code conventions to follow
- Server vs Client: If a component interacts with browser-only APIs or hooks (useState/useEffect), it should be a client component and named `*Client.tsx`. Otherwise prefer server components for data fetching.
- Server actions: use `"use server"` at top, import `@/db`, call `await connection()` where present in examples, and revalidate relevant paths with `revalidatePath()` after mutations.
- Date handling: `app/actions/tasks.ts` uses local-time parsing via helper `parseDueDate()` — prefer that helper logic when adding task due-date UX.
- Streaks & completions: Habit completion is recorded in `habit_completions` table and toggled in `app/actions/habits.ts`. Deleting/completing affects `habits.streak` via SQL expressions — be careful when changing logic.
- Database types: Use `Task`, `NewTask`, `Habit`, `NewHabit` exported from `db/schema.ts` for type-safety.

6) Merging and migrations guidance
- If schema changes: update `db/schema.ts`, then run `npm run db:generate` and `npm run db:migrate` (or `db:push` for dev). Ensure `DATABASE_URL` points at a dev DB (do NOT run migrate against production here unless intended).

7) Where to look for examples
- Query + mutation examples: `app/actions/tasks.ts` and `app/actions/habits.ts`.
- Revalidation pattern: search for `revalidatePath(` across `app/actions`.
- DB connection pattern: `db/index.ts` and `drizzle.config.ts`.

8) Quick checklist for PRs touching data or server actions
- Update `db/schema.ts` types and migrations.
- Run migrations locally against a dev DB started with `docker-compose up -d`.
- Ensure `revalidatePath()` calls cover pages that should refresh.
- Preserve server/client boundaries: prefer server components for simple rendering and client components for interactivity.

If anything in this doc is unclear or you want more examples from specific files, tell me which area to expand.
