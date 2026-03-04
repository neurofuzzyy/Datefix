# CLAUDE.md

You are working on a project by Adam Fadi. Read this file fully before doing anything.

---

## How to Think

Reference `ROUNDTABLE.md` before making architecture decisions, choosing between approaches, or planning features. Scale the depth to the decision (see the scaling table in that file). For trivial stuff, just do it.

When stuck, decompose the problem before asking for help. Most "I'm stuck" moments are actually "I haven't broken this down small enough" moments.

---

## How to Work

- **Don't ask permission on small stuff.** Naming, formatting, file organization, small refactors — just do it and explain what you did.
- **Ask before big stuff.** Architecture changes, new dependencies, data model changes, deleting files — check first.
- **Ship rough over plan perfect.** A working thing I can see teaches more than a plan I can read.
- **Small files, clear separation.** One concern per file. If a file does two things, split it. This is non-negotiable.
- **Log significant decisions.** When you make an architecture choice, a technology choice, or a tradeoff decision, add it to `DECISIONS.md` with the date and a one-line rationale.

---

## Stack Preferences

These are the defaults. Deviate only with good reason and log the reason in DECISIONS.md.

| Layer | Default |
|-------|---------|
| Language | TypeScript, always |
| Mobile | React Native + Expo |
| Web | Next.js |
| Backend | Supabase (PostgreSQL, Auth, Edge Functions, Storage) |
| Vector search | pgvector extension |
| Styling | Tailwind CSS |
| Components | Functional components only, no classes |
| State | React hooks, Zustand if needed |
| Structure | Monorepo when multiple apps, flat when single |

---

## Code Style

- **Descriptive names.** No abbreviations. `processVideoTranscript` not `procVidTx`. If the name is long, that's fine.
- **Types over comments.** If the type signature explains the function, you don't need a comment. Add comments only for *why*, never for *what*.
- **Small functions.** If a function is longer than ~30 lines, it's probably doing too much.
- **Error handling is not optional.** Every async operation gets a try/catch or .catch. Every error state gets a UI. No silent failures.
- **No magic numbers or strings.** Constants get named. Configs get centralized.

---

## Project Files

| File | Purpose |
|------|---------|
| `ROUNDTABLE.md` | Thinking framework. Read before architecture decisions. |
| `CLAUDE.md` | This file. Project rules and preferences. |
| `DECISIONS.md` | Living log of architectural decisions. You write to this. |
| `ROADMAP.md` | Project roadmap and version plan. Reference for scope. |
| `README.md` | Project description. Keep updated. |

---

## When You're Unsure

If you're unsure about an approach, run it through the roundtable at the appropriate depth. If you're still unsure after that, present me with two options: what you'd recommend and the alternative. Keep it brief. I'll pick.

Don't spin. Don't overthink. Build, show, iterate.
