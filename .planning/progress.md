# Progress Report — Projects Page

**Last updated:** 2025-12-14

---

## Sprint 1 Retrospective

### Completed
| Task | Files | Notes |
|------|-------|-------|
| Vercel SPA rewrite | `vercel.json` | Enables `/projects` refresh without 404 |
| React Router setup | `package.json`, `src/index.jsx`, `src/App.jsx` | `BrowserRouter` wraps app; `Routes` in `.page-content` |
| Navigation links | `src/components/NavBar.jsx` | Added `home` / `projects` Links above existing icons |
| Data model | `src/data/projects.js` | Simple array with `id`, `title`, `summary`, `links`, `tags`, `type`, `pinned` |
| Projects UI | `src/pages/ProjectsPage.jsx` | Renders list from data; reuses `.name`, `NavBar`, `.nav` styles |
| Test fix | `src/App.test.js` | Wrapped in `MemoryRouter`; asserts heading renders |

### Blockers Encountered
1. **Test parse error (false alarm)** — Initial `pnpm test` run showed Babel parse errors. Re-running with `CI=true` revealed tests actually pass; errors were React Router v7 deprecation *warnings*, not failures.

### Decisions
- **Deferred tag filtering** — Adds JS complexity; not needed for MVP.
- **No new CSS file** — Reused existing `.nav`, `.name` classes to keep diff minimal.
- **Inline `style={{ padding: 0 }}` on `<ul>`** — Quick fix; should be moved to CSS in Sprint 2.

---

## Code Quality Assessment

### Strengths
- Routing is minimal and idiomatic (single `BrowserRouter`, two `Route` elements).
- Data model is extensible (adding a project is one object).
- No new dependencies beyond `react-router-dom`.

### Opportunities for Improvement
| Issue | Location | Suggested Fix |
|-------|----------|---------------|
| Inline style on `<ul>` | `ProjectsPage.jsx:15` | Move to `.projects-list` class |
| `.main-column` very narrow (`max-width: 24vw`) | `App.css:53` | Widen to ~`36vw` or use `clamp()` |
| External links missing `rel="noreferrer"` | `ProjectsPage.jsx:22` | Add attribute |
| Hardcoded heading in `ProjectsPage` duplicates `PageContainer` | `ProjectsPage.jsx:7-9` | Extract shared `<Header />` component (optional, low priority) |

---

## Friction Points (UX / Layout)

1. **Narrow content column** — `.main-column { max-width: 24vw }` squeezes text on desktop; Projects list is cramped.
2. **Link spacing** — Multiple links per project run together without separators.
3. **Mobile breakpoint** — Works but `max-width: 25vw` on mobile is oddly narrow; could use `90vw` or similar.

---

## Open Questions
- Should we show tags visually (chips) or keep them data-only for now?
- Is a "pinned" badge worthwhile, or just sort pinned items first?
- Do we want a shared header component, or is duplication acceptable?

---

## Sprint 2 Retrospective

**Completed:** 2025-12-14

### Tasks Completed
| Task | Files Changed | Diff Size |
|------|---------------|-----------|
| Widen `.main-column` | `App.css:52-56, 160-165` | 6 lines |
| Add `rel="noreferrer"` | `ProjectsPage.jsx:24` | 1 attr |
| Replace inline style | `App.css:113-115`, `ProjectsPage.jsx:15` | 4 lines |
| Add link separators | `ProjectsPage.jsx:21-28` | 7 lines |

### Changes Summary
- **Desktop:** `.main-column` now uses `clamp(280px, 50vw, 600px)` — readable without being too wide
- **Mobile:** `.main-column` expands to `90vw` for full-width content
- **Links:** External links have `rel="noreferrer"`; multiple links separated by ` · `
- **Code hygiene:** No inline styles; new `.projects-list` class in CSS

### Blockers
None.

---

## Next Steps (Future Sprints)

**Low priority — defer unless needed:**
- Extract shared `<Header />` component (reduces duplication between `PageContainer` and `ProjectsPage`)
- Add tag chips (visual display of `tags` array)
- Sort pinned items to top
- Add more projects to `src/data/projects.js`
