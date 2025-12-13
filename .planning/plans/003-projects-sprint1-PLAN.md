---
type: execution-plan
created: 2025-12-13T17:17:00Z
source: "Sprint 1: Add Projects page (highest impact / smallest diff)"
strategy: segmented
estimated_tasks: 7
estimated_time: 1 sprint
---

<objective>
Deliver a first production-ready Projects page at `/projects` (React Router `BrowserRouter`), reachable from the existing UI, visually consistent with the current site, and safe to refresh/direct-link on Vercel (SPA rewrite).
</objective>

<execution_context>
Files to load before executing:
- `reference/projects-page-content-schema.md`
- `reference/projects-page-navigation-mobile.md`
- `reference/projects-page-routing-deployment.md`
</execution_context>

<context>
Implementation constraints / guiding principles:
- Prioritize **biggest impact / smallest diff**.
- Keep the current layout and aesthetic (reuse `.page-content`, current typography).
- Avoid refactors (no component re-architecture) unless required for routing.

Current structure notes:
- CRA app; root render in `src/index.jsx`.
- `App.jsx` owns the main layout and places `PageContainer` inside `.page-content`.
- Navigation currently lives in `src/components/NavBar.jsx` as icon links.
- Hosting target: Vercel.
</context>

<tasks>

<task id="01" type="auto">
  <title>Add Vercel SPA rewrite for `/projects` refresh safety</title>
  <description>
  Add the smallest possible deployment change to support client-side routing with clean URLs.
  </description>
  <requirements>
  - Create `vercel.json` at repo root.
  - Add an SPA fallback rewrite so unknown paths serve `index.html`.
  </requirements>
  <files>
  - `vercel.json` (new)
  - `reference/projects-page-routing-deployment.md` (already documents the snippet)
  </files>
  <verification>
  - A request to `/projects` in production will return `index.html` (not a Vercel 404).
  </verification>
</task>

<task id="02" type="auto">
  <title>Introduce React Router with minimal surface area</title>
  <description>
  Add `react-router-dom`, wrap the app with `BrowserRouter`, and define a `/projects` route.

  Minimal-diff approach:
  - Wrap `<App />` in `BrowserRouter` at `src/index.jsx`.
  - Replace the single `PageContainer` render inside `.page-content` with a `<Routes>` that renders:
    - `/` -> existing `PageContainer`
    - `/projects` -> new `ProjectsPage`
  </description>
  <requirements>
  - Use `BrowserRouter` (clean URLs).
  - `/projects` must render something obvious (even a placeholder) as soon as routing lands.
  </requirements>
  <files>
  - `package.json` (dependency)
  - `src/index.jsx`
  - `src/App.jsx`
  - `src/pages/ProjectsPage.jsx` (new)
  </files>
  <verification>
  - Local dev:
    - navigating to `/projects` works
    - refreshing `/projects` works
  </verification>
</task>

<task id="03" type="auto">
  <title>Add a minimal navigation affordance to reach Projects</title>
  <description>
  Make Projects discoverable with the smallest UI change that still feels native to the site.

  Lowest-diff option:
  - Add a simple `Link` (or small text link) in `NavBar.jsx` alongside existing icons.
  </description>
  <requirements>
  - Navigation to `/projects` is possible in 1 click/tap from the home page.
  - Add a clear way back to `/` from the Projects page.
  </requirements>
  <files>
  - `src/components/NavBar.jsx`
  - `src/pages/ProjectsPage.jsx`
  </files>
  <verification>
  - Home -> Projects -> Home roundtrip works without full page reload.
  </verification>
</task>

<task id="04" type="auto">
  <title>Create a data-driven Projects list (small schema, easy to edit)</title>
  <description>
  Add a single source-of-truth list for projects (repos, events, demos).
  </description>
  <requirements>
  - Follow `reference/projects-page-content-schema.md`.
  - Start with ~3–8 items (enough to validate layout).
  </requirements>
  <files>
  - `src/data/projects.js` (new)
  </files>
  <verification>
  - Adding an item is a small, obvious edit.
  </verification>
</task>

<task id="05" type="auto">
  <title>Implement Projects UI (match existing aesthetic, minimal CSS)</title>
  <description>
  Implement a clean list UI that lives inside the existing `.page-content` container.

  Prefer a simple vertical list:
  - title
  - short summary (optional)
  - links row
  - tags row (optional)
  </description>
  <requirements>
  - Use semantic markup (`h1/h2`, `ul/li`, etc.) and accessible link labels.
  - Keep styling changes minimal and local.
  </requirements>
  <files>
  - `src/pages/ProjectsPage.jsx`
  - `src/App.css` (if tiny tweaks are needed)
  - (Optional) `src/pages/ProjectsPage.css` (new, only if it avoids touching global styles)
  </files>
  <verification>
  - Desktop: list is readable (not overly narrow).
  - Mobile: tap targets are comfortable; no horizontal scrolling.
  </verification>
</task>

<task id="06" type="checkpoint:human-verify">
  <title>Checkpoint: “small diff / high impact” validation</title>
  <description>
  Pause after the first functional Projects page exists, before any optional enhancements.
  </description>
  <verification_question>
  Are you happy with:
  - routing behavior (`/projects` works + refresh works)
  - navigation placement (doesn’t clutter mobile)
  - overall visual integration (still feels like the same site)
  ?
  </verification_question>
  <verification_criteria>
  - `/projects` works locally.
  - `/projects` refresh works on a Vercel Preview deployment.
  - Projects list is readable on mobile.
  </verification_criteria>
</task>

<task id="07" type="auto">
  <title>Optional micro-improvement: widen main content slightly (only if needed)</title>
  <description>
  If the Projects list feels cramped, make the smallest CSS change that improves readability.

  Scope guardrails:
  - Adjust only sizing constraints (e.g. `.main-column` max-width) without redesigning layout.
  - Keep the wave/controls layout intact.
  </description>
  <requirements>
  - Change should improve readability across pages.
  - No layout regressions at the `max-width: 700px` breakpoint.
  </requirements>
  <files>
  - `src/App.css`
  </files>
  <verification>
  - Desktop: list no longer feels cramped.
  - Mobile: still no overflow.
  </verification>
</task>

</tasks>

<verification>
Before calling Sprint 1 complete:
- `/` and `/projects` both work.
- `/projects` refresh/direct-link works on Vercel (Preview is sufficient).
- Projects data is not hardcoded in JSX (comes from `src/data/projects.js`).
- Navigation to/from Projects is obvious and not visually heavy.
</verification>

<success_criteria>
This sprint is successful when:
- You can share `https://<site>/projects` and it loads reliably.
- The Projects page visually integrates with the existing site.
- The implementation is achieved with a small, easy-to-review diff.
</success_criteria>
