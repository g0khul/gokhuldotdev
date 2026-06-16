# gokhul.dev — Workspace Redesign

**Date:** 2026-06-16
**Status:** Approved design (foundation locked via interactive prototype)
**Stack:** React 19 + Vite + Tailwind CSS 4 (unchanged)

---

## 1. Character

The site is built around a single persona:

> **The quiet engineer who figures things out.** Calm, equipped, no wasted motion — *me, my laptop, the internet, and I'll move the earth.* Truth over hype, first-principles over convention. Not a salesman; the work and the thinking speak. The site itself is the proof — thoughtful, unconventional, unmistakably his — so a recruiter or future client lands and thinks *"this person is the real thing, I should reach out."*

The "figure it out" thesis is expressed **implicitly** — through the craft of the site and the trail of work — never stated as a boastful manifesto.

## 2. Goals

- **Short term:** stand out to recruiters / hiring managers as an exceptional engineer worth a large pay raise and a job switch.
- **Long term:** establish a personal brand that attracts freelance / part-time project work, enabling a move away from full-time employment.
- **Always:** be the central hub that ties together his professional presence (LinkedIn, X, Substack, GitHub, work profile) and leaves visitors confident in his ability.

## 3. Non-Goals

- No personal-life content. Purely professional perspective.
- No separate "opinions / takes" section — opinions live in his writing (Substack / LinkedIn), which the site links to.
- Not an e-commerce / business-template structure. This shows a *person*, not a company.
- No explicit self-congratulatory thesis statement.

## 4. Concept & Metaphor

An **explorable notes-app workspace** in the spirit of Obsidian — *not* a top-to-bottom scrolling landing page. Sections are "notes" you open and navigate between via links, a file tree, a command palette, and a connections graph. Aesthetic north stars: Obsidian's calm + Notion's minimalism + Nothing's guts.

## 5. Information Architecture

Content is modeled as interlinked **notes**:

| Note | Purpose | Source data (current repo) |
|------|---------|----------------------------|
| `now` | Landing / about / current status; the hub note | `personal.ts`, `experience.ts` (Synkcode) |
| `careerbytecode` | Current side project, deep-dive | `building.ts` |
| `writing` | Pointer to Substack + LinkedIn writing | new + `social.ts` |
| `projects` | Shipped projects | `projects.ts` |
| `killed` | Honest graveyard of stopped projects | `killed.ts` |
| `connect` | Contact + all social profiles | `social.ts`, `personal.ts` |

**Content priority order** (drives default sort / emphasis): current work → careerbytecode → writing → projects → killed → connect.

Notes reference each other with `[[wiki-links]]`. Backlinks are derived automatically (reverse of the links map). The DSA / LeetCode content (`dsa.ts`) and the work timeline (`experience.ts`) fold into the `now` note (or a linked sub-note) rather than getting top-level notes — to be finalized during implementation.

## 6. Layout & Responsive Behavior

Three-pane CSS grid shell:

- **Left — File Tree sidebar (~248px):** vault header (`gokhul.dev` + ⌘K), grouped note list (`workspace` / `archive` / `reach`), social links footer.
- **Center — Note view (flexible, max reading width ~660px, centered):** breadcrumb top bar with ⌘K affordance; the active note renders here with a subtle fade/slide transition on switch.
- **Right — Context rail (~300px):** the connections **graph**, then "linked from here" (outgoing) and "backlinks" lists.

**Breakpoints (all-screen friendly is a hard requirement):**

- `> 1100px` — full three panes.
- `760–1100px` — context rail hidden; two panes (sidebar + note).
- `< 760px` — single column; sidebar collapses into a `≡` hamburger with a fixed overlay scrim; note view full width.

> Implementation note / lesson from prototyping: the mobile overlay scrim must be `position: fixed` at the base level so it never occupies a grid cell on desktop.

## 7. Navigation & Interactions

- **File tree:** click a note to open it; active note highlighted with violet left-border + soft violet background.
- **Wiki-links:** inline `[[...]]` links inside note bodies navigate to the target note.
- **Command palette (⌘K / Ctrl+K):** fuzzy search across notes (and external links); arrow-key navigation, Enter to open, Esc to close.
- **Graph:** see §9.
- **Micro-animations:** tasteful only — note fade/slide on switch, hover states, graph settle. Plus a few small easter eggs (TBD during implementation; e.g. a console message, a hidden note).

## 8. Visual System

- **Palette:** pure black (`#000`) base, off-white text (`~#f4f4f2`), minimal gray hairlines (`~#161618` / `~#202023`). **Single accent: dark violet (`~#6e56cf`)**, used sparingly — active note, wiki-link hover, current graph node, a few status words. (Exact shade fine-tuned during implementation; "darker/muted violet, never blue.")
- **Typography:** sans-serif for reading; monospace for labels, metadata, breadcrumbs, wiki-links, and graph text — giving the "tool, not brochure" feel. Final font choices decided during implementation.
- **Density:** dense but calm — generous line-height, small uppercase mono labels with letter-spacing, thin separators.
- **Light/dark:** dark is the primary identity. A black/white invert toggle is optional (the existing `useTheme` hook can be retained or replaced); decide during implementation.

## 9. Graph View (firm requirement, built during implementation)

A real Obsidian-style **animated, force-directed graph**, not a static diagram:

- Nodes = notes, edges = `[[wiki-links]]` between them.
- **Force simulation:** nodes repel, edges act as springs, graph settles smoothly on load and re-layout.
- **Draggable nodes:** grab and fling a node; the simulation reacts (like Obsidian).
- **Current note** highlighted (violet, larger); edges touching it emphasized; hover highlights a node's connections.
- Click a node to open that note.
- Lives in the right rail (compact local graph). Optional stretch: a full-screen graph view.
- **Likely approach:** `d3-force` (or `react-force-graph` / a lightweight custom sim) rendered to SVG/canvas. Final library chosen during implementation; must stay small and performant.

## 10. Component Architecture (React)

```
src/
├── App.tsx                      # mounts WorkspaceShell
├── workspace/
│   ├── WorkspaceShell.tsx       # 3-pane grid + responsive state (active note, sidebar open)
│   ├── Sidebar.tsx              # file tree + vault header + social footer
│   ├── NoteView.tsx             # renders active note + transitions
│   ├── ContextRail.tsx          # composes Graph + link lists
│   ├── Graph.tsx                # force-directed animated graph (§9)
│   ├── CommandPalette.tsx       # ⌘K search + keyboard nav
│   └── useWorkspace.ts          # active-note state, navigation, derived backlinks
├── notes/                       # one module per note (content as TSX/MD-ish)
│   └── index.ts                 # note registry: id, title, group, body, links[]
├── data/                        # existing data files reused as sources
└── lib/wikilink.tsx             # parse/render [[wiki-links]] -> clickable nav
```

**Boundaries:**
- `useWorkspace` owns navigation state and derives the links/backlinks graph from the note registry — single source of truth.
- Each note's content is data; presentation (NoteView) is generic and renders any note.
- `Graph` consumes the same registry — graph and links never drift from content.

## 11. Data Model

A note registry (`notes/index.ts`):

```ts
interface Note {
  id: string;            // 'now', 'careerbytecode', ...
  title: string;
  group: 'workspace' | 'archive' | 'reach';
  icon?: string;
  links: string[];       // outgoing note ids ([[wiki-links]])
  body: ReactNode | data-driven render;
}
```

Backlinks and graph edges are computed from `links`. Existing `src/data/*.ts` files remain the content sources; notes compose them.

## 12. Migration / Content Mapping

The current scrolling sections (Hero, About, Timeline, Building, DSA, Projects, Killed, Contact) map onto notes as in §5. No content is lost; it is re-homed. The old section components are replaced by the workspace components. `@vercel/analytics` and `@vercel/speed-insights` are retained.

## 13. Accessibility & Quality Bar

- Keyboard-navigable: command palette, focusable notes/links, Esc to close overlays.
- Respect `prefers-reduced-motion` (disable graph float / transitions).
- Sufficient contrast (off-white on black; violet used where contrast holds).
- Semantic landmarks (`nav`, `main`, `aside`).

## 14. Open Items (fine-tune during implementation)

- Exact violet shade, fonts, spacing scale ("~80% there" per prototype review).
- Whether DSA + timeline get their own notes/sub-notes or fold into `now`.
- Graph library choice and full-screen graph stretch goal.
- Light/dark toggle: keep or drop.
- Specific easter eggs.

## 15. Prototype Reference

Interactive prototype validated during brainstorming (three-pane workspace, palette, navigation, graph placeholder) lives at `.superpowers/brainstorm/126-1781592310/content/workspace-proto-v3.html` (gitignored).
