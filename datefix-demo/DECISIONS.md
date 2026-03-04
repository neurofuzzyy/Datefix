# DECISIONS.md

A living log of significant architectural and design decisions. Newest entries at the top.

When making a decision worth logging, add an entry with the date, what was decided, and why in one line.

---

## 2026-02-19
**Built layered compositing system for product showcase.** Each FlavorScene composites transparent PNGs at different z-indices with per-layer parallax multipliers and idle float. "Top" ingredient layers (top-date, top-cinnamon) sit above the packet (z:10 vs z:5) to create depth. Packet positioning is configurable per flavor via offset/scale in config.

**Added indigo (#1d1644) as primary brand color.** Used for the logo wordmark and dark text. Available as `text-datefix-indigo`, `bg-datefix-indigo`.

**Used raw `<img>` instead of `next/image` for scene layers.** Needed pixel-exact overlap of 1440x1440 transparent PNGs without layout shift or dimension rounding from Next.js Image optimization.

**Animation architecture: idle + magnetic + entrance.** Three separate hooks with clean lifecycle: `useIdleAnimation` (looping float per layer), `useMagneticFloat` (cursor-reactive parallax with rAF throttle), `useEntranceAnimation` (staggered fade-in via timeline). All use anime.js `.revert()` for cleanup.

**Scaffolded Next.js 16 with TypeScript, Tailwind CSS v4, and App Router.** Matches the stack defaults in CLAUDE.md. Using `src/` directory and `@/*` import alias.

**Chose shadcn/ui (new-york style) for component library.** Gives us accessible, composable primitives that work natively with Tailwind. Components are copied into the project — no runtime dependency, full control.

**Added anime.js v4 for animations.** Lightweight, TypeScript-native animation library. Chosen over Framer Motion for smaller bundle size and more granular control over complex sequenced animations.

**Defined DateFix brand colors as CSS custom properties and Tailwind theme tokens.** Original (#94b8f2), Cinnamon (#d684cc), Turmeric (#e0a958), Ginger (#a0c75d). Available as `text-datefix-original`, `bg-datefix-cinnamon`, etc. throughout the project.
