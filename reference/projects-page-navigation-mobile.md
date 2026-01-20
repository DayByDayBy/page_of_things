# Projects Page: Navigation + Mobile Real Estate Notes

## What exists today
- The “home” content is inside `.page-content` and is intentionally minimal.
- Navigation is currently just icon links (`NavBar.jsx`) inside the content area.
- Layout is a grid with a controls column and a main content column (`App.jsx` + `App.css`).
- Mobile breakpoint stacks content and controls at `max-width: 700px`.

## The core question
Do you want “Projects” to have a shareable URL?
- If **yes**, prefer a router option.
- If **no**, prefer a state/section option to keep changes minimal.

## Navigation patterns (minimal-change first)

### 1) Add a Projects icon alongside existing icons (recommended starting point)
**How it feels:** consistent with current site (icon-only nav).

**Pros**
- Smallest UI footprint.
- Doesn’t introduce a whole header/nav system.
- Easy to make mobile-friendly (3 icons still fits).

**Cons**
- Icon meaning needs a good `alt`/label.

**Works best with**
- View swap (no router) or modal overlay.

### 2) Tiny text links under the name (Home | Projects)
**Pros**
- Very clear.
- Still minimal.

**Cons**
- Slightly changes the visual hierarchy.

### 3) Drawer / “more” menu on mobile
**Pros**
- Scales if you add more sections later (Writing, About, etc.).

**Cons**
- More UI code than necessary for a single new destination.

## Page/URL patterns

### A) Single-page section (anchor/scroll)
**Best when:** you want the simplest thing and don’t need a separate URL.

**Mobile note:** long scroll is fine if you keep each project entry compact.

### B) View swap / modal overlay (no router)
**Best when:** you want “feels like a page” but want to avoid router + deployment considerations.

**Mobile note:** a full-height overlay with a clear close/back affordance can be very comfortable.

### C) HashRouter route (shareable URL, minimal hosting risk)
**Best when:** you want a real link you can share, without needing server rewrites.

**Tradeoff:** URL is `/#/projects` rather than `/projects`.

### D) BrowserRouter route (clean URL)
**Best when:** you really want `/projects`.

**Tradeoff:** requires deployment rewrite rules on refresh.

## “Total redesign” is probably not necessary
What will likely be needed is a **small responsive/layout adjustment**, not a full redesign:
- allow the main content area to be wider for list reading
- ensure projects list items have comfortable tap targets
- keep navigation minimal (icon or tiny text)

## Accessibility considerations

All navigation patterns MUST implement:

### Universal requirements (all patterns)
- **Keyboard navigation**: Full Tab/Enter/Escape support
- **Logical focus order**: Sequential, predictable tabbing
- **Screen reader announcements**: View/page changes announced to screen readers
- **Skip navigation links**: Provide jump-to-content functionality

### Pattern-specific guidance

#### Icon navigation (Navigation pattern 1)
- **aria-label**: Descriptive labels for all icons
- **aria-current**: Indicate active page/state
- **Visible focus indicators**: Clear focus/hover states

#### Modal/drawer patterns (Navigation pattern 3)
- **Focus trap**: Tab cycles within modal, escape closes
- **Return focus**: Focus returns to trigger element on close
- **aria-modal/role**: Proper semantic attributes

#### Router-based patterns (Page/URL patterns C-D)
- **Semantic navigation**: Use `<nav>` and `<a>` elements appropriately
- **Browser back-button**: Ensure expected browser behavior works
- **Page titles**: Update document.title on route changes

## Recommendation to start
- Decide whether you want a shareable URL.
- If not: implement a view swap (Home vs Projects) driven by state.
- If yes: use `HashRouter` for easiest deployment.
- In both cases: add a single Projects icon/link to the existing NavBar.
