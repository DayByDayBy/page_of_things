---
type: execution-plan
created: 2025-12-14T01:45:00Z
source: "Sprint 2: Polish Projects page (layout, accessibility, code hygiene)"
strategy: segmented
estimated_tasks: 5
estimated_time: 30-60 min
---

<objective>
Refine the Projects page with minimal, high-impact changes: widen the content column, improve accessibility, and clean up code hygiene issues identified in Sprint 1.
</objective>

<context>
Sprint 1 delivered a functional `/projects` route with basic UI. This sprint addresses:
- Layout friction (narrow `.main-column`)
- Accessibility gaps (`rel="noreferrer"` on external links)
- Code hygiene (inline styles, link spacing)

Guiding principles:
- Smallest diff that solves the problem
- No new dependencies
- No major refactors
</context>

<tasks>

<task id="01" type="auto">
  <title>Widen `.main-column` for better readability</title>
  <description>
  The current `max-width: 24vw` is too narrow for text-heavy content like the Projects list. Use `clamp()` to set a responsive width that works on both desktop and mobile.
  </description>
  <requirements>
  - Desktop: content column ~500-600px wide
  - Mobile: column expands to fill available space
  - No horizontal overflow
  </requirements>
  <files>
  - `src/App.css` (lines ~52-56 and ~160-166)
  </files>
  <verification>
  - Projects list is comfortably readable on desktop
  - No horizontal scrolling on mobile
  </verification>
</task>

<task id="02" type="auto">
  <title>Add `rel="noreferrer"` to external links</title>
  <description>
  External links in `ProjectsPage.jsx` should include `rel="noreferrer"` for security and privacy best practices.
  </description>
  <requirements>
  - All `<a href="https://...">` elements have `rel="noreferrer"`
  </requirements>
  <files>
  - `src/pages/ProjectsPage.jsx`
  </files>
  <verification>
  - Inspect rendered links; `rel` attribute is present
  </verification>
</task>

<task id="03" type="auto">
  <title>Replace inline style with CSS class</title>
  <description>
  Move `style={{ padding: 0 }}` from the `<ul>` element to a proper CSS class for consistency.
  </description>
  <requirements>
  - Add `.projects-list` class to `App.css`
  - Remove inline style from JSX
  </requirements>
  <files>
  - `src/App.css`
  - `src/pages/ProjectsPage.jsx`
  </files>
  <verification>
  - No inline styles on list element
  - Styling unchanged visually
  </verification>
</task>

<task id="04" type="auto">
  <title>Add separator between project links</title>
  <description>
  Multiple links per project currently run together. Add a visual separator (` · `) between links for clarity.
  </description>
  <requirements>
  - Separator appears between links, not after the last one
  - Keep markup minimal
  </requirements>
  <files>
  - `src/pages/ProjectsPage.jsx`
  </files>
  <verification>
  - Links display as: `repo · site` instead of `reposite`
  </verification>
</task>

<task id="05" type="checkpoint:human-verify">
  <title>Checkpoint: Visual verification (desktop + mobile)</title>
  <description>
  Quick UX check after polish tasks are complete.
  </description>
  <verification_question>
  Does the Projects page look polished and feel consistent with the home page on both desktop and mobile viewports?
  </verification_question>
  <verification_criteria>
  - Content is readable without horizontal scrolling
  - Tap targets are comfortable on mobile
  - No visual regressions
  </verification_criteria>
</task>

</tasks>

<verification>
Before marking Sprint 2 complete:
- `.main-column` uses responsive sizing
- External links have `rel="noreferrer"`
- No inline styles in JSX
- Link separators improve readability
</verification>

<success_criteria>
This sprint is successful when:
- The Projects page feels polished, not cramped
- Code hygiene issues from Sprint 1 are resolved
- No regressions in mobile usability
</success_criteria>
