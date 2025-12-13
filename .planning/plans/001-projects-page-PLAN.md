---
type: execution-plan
created: 2025-12-13T03:18:00Z
source: "Add a Projects page/view (simple list of repos/events/etc) that matches the current site and works well on mobile"
strategy: segmented
estimated_tasks: 7
estimated_time: 4-8 hours
---

<objective>
Add a “Projects” page/view to the existing React site that presents a simple, maintainable list of projects (repos, event pages, demos, writeups) while preserving the current look/feel and staying usable on mobile.
</objective>

<context>
Current codebase notes (for implementation later):
- React app (Create React App / `react-scripts`).
- Currently a single view: `App.jsx` renders the wave background + a grid containing wave controls and `PageContainer`.
- “Navigation” today is essentially icon links in `src/components/NavBar.jsx`.
- Primary look/feel comes from `src/App.css` and the `.page-content` container.
- Mobile breakpoint exists at `max-width: 700px`.

Key files likely involved (for later execution):
- `src/App.jsx`
- `src/App.css`
- `src/container/PageContainer.jsx`
- `src/components/NavBar.jsx`
</context>

<tasks>

<task id="01" type="auto">
  <title>Implement routing: `BrowserRouter` with `/projects` + SPA rewrite</title>
  <description>
  Decision locked: use `BrowserRouter` to provide clean URLs like `/projects`. Configure deployment rewrites so refresh/direct navigation serves `index.html` (see `reference/projects-page-routing-deployment.md`).
  </description>
  <requirements>
  - Add `react-router-dom`.
  - Define routes for `/` and `/projects`.
  - Add a navigation affordance to reach `/projects` and return home.
  - Add a hosting rewrite rule so `/*` serves `index.html`.
  </requirements>
  <files>
  - `package.json`
  - `src/index.jsx` and/or `src/App.jsx`
  - (If needed) `vercel.json` (or equivalent deploy config)
  - `reference/projects-page-routing-deployment.md`
  </files>
  <verification>
  - Navigating to `/projects` works.
  - Refreshing `/projects` does not 404 in production.
  </verification>
</task>

<task id="02" type="auto">
  <title>Define the Projects data model (fields + grouping)</title>
  <description>
  Define a small schema that can represent:
  - repos (GitHub)
  - events/talks (event pages)
  - demos/apps
  - writeups/posts

  Keep the schema flexible (links array, tags, optional dates) so the page can stay “just a list” but still scale.
  </description>
  <requirements>
  - Each project entry includes a `title` and at least one outbound link.
  - Optional fields support: `summary`, `tags`, `status`, `date`, `pinned`.
  - Grouping can be done via `type` (e.g. `project`, `talk`, `event`) or via tags.
  </requirements>
  <files>
  - (Option) `src/data/projects.js` (or `.json`) - source of truth for list content
  - `reference/projects-page-content-schema.md` - schema + examples
  </files>
  <verification>
  - Data model supports repos + event pages without awkward special cases.
  - Adding a new item is a one-line change.
  </verification>
</task>

<task id="03" type="auto">
  <title>Create Projects UI components that reuse the existing visual language</title>
  <description>
  Implement a “Projects” view that:
  - uses the same typography and container styling as the current home content
  - is content-first (a readable list) rather than a complex portfolio grid
  - remains easy to use on small screens

  The simplest UI is a vertical list of “cards” (title, 1–2 line summary, links row, tags row).
  </description>
  <requirements>
  - Accessible semantics: headings, list markup, and link labels.
  - External links use safe attributes (`rel="noreferrer"`, etc.).
  - Cards don’t rely on hover-only interactions.
  </requirements>
  <files>
  - (Option) `src/pages/ProjectsPage.jsx`
  - (Option) `src/components/ProjectCard.jsx`
  - `src/App.css` and/or a small dedicated CSS module/file
  </files>
  <verification>
  - Can render 10–30 items without feeling cramped.
  - Links are easily tappable on mobile.
  </verification>
</task>

<task id="04" type="auto">
  <title>Wire Projects into navigation with minimal mobile footprint</title>
  <description>
  Integrate Projects navigation in a way that matches the current site (very minimal chrome). Likely options:
  - Add a Projects icon/button alongside existing icons in `NavBar`.
  - Add a small text link row under the name/title.
  - Use a “more” icon that expands into a tiny menu on mobile.

  If routing was chosen, add router wiring at the top level. Otherwise, implement a simple state-based view toggle.
  </description>
  <requirements>
  - Navigation is obvious but doesn’t dominate the layout.
  - Mobile navigation doesn’t require a total redesign.
  </requirements>
  <files>
  - `src/components/NavBar.jsx`
  - `src/container/PageContainer.jsx` (or replacement)
  - `src/App.jsx` (if routing or view swapping)
  - `reference/projects-page-navigation-mobile.md`
  </files>
  <verification>
  - You can reach Projects from the home view in 1 tap/click.
  - You can get back to home just as easily.
  </verification>
</task>

<task id="05" type="auto">
  <title>Responsive layout pass for Projects content</title>
  <description>
  The existing `.main-column` sizing is tuned for a small amount of content. Projects will likely need slightly more width and more forgiving typography at different breakpoints.

  This should be a minimal CSS adjustment (not a redesign):
  - let the content container expand to a sensible max width
  - ensure line length remains readable
  - ensure the projects list scrolls naturally inside the existing page structure
  </description>
  <requirements>
  - No horizontal scrolling on mobile.
  - Tap targets are sized appropriately.
  - Typography remains consistent with the current style.
  </requirements>
  <files>
  - `src/App.css`
  </files>
  <verification>
  - iPhone-sized viewport: list is readable and navigable.
  - Desktop: list doesn’t feel overly narrow.
  </verification>
</task>

<task id="06" type="checkpoint:human-verify">
  <title>Checkpoint: UX verification (desktop + mobile)</title>
  <description>
  Pause for a quick UX check once Projects is wired in.
  </description>
  <verification_question>
  Have you verified navigation + readability on both desktop and a mobile viewport?
  </verification_question>
  <verification_criteria>
  - Navigation feels seamless (no “new site” vibe).
  - Projects list is readable without zooming.
  - Links are comfortably tappable.
  </verification_criteria>
</task>

<task id="07" type="auto">
  <title>Optional enhancements (only if desired)</title>
  <description>
  Keep these strictly optional to avoid scope creep:
  - Tag filtering (chips)
  - “Pinned” items at top
  - Collapsible grouping (Projects / Talks / Events)
  - Tiny search box
  </description>
  <requirements>
  - Enhancements must not add significant UI chrome or complexity.
  </requirements>
  <files>
  - Depends on chosen enhancement(s)
  </files>
  <verification>
  - Enhancements improve scanability without feeling like a new UI system.
  </verification>
</task>

</tasks>

<verification>
Before marking implementation complete:
- Projects content renders from a dedicated data source (not hardcoded JSX per item).
- Navigation is consistent with existing look and works with keyboard/touch.
- Mobile: no cramped layout; no accidental taps; no overflow.
</verification>

<success_criteria>
This plan is successful when:
- A Projects view exists and is reachable from the current home view.
- The Projects view visually feels like part of the same site.
- The solution does not require a “total redesign” to be usable on mobile.
</success_criteria>
