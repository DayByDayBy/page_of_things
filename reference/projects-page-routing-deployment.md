# Projects Page Routing + Deployment Notes

## Why this question matters
Adding a classic React route like `/projects` is straightforward in code, but **static hosting needs to serve `index.html` for non-file paths**.

If the host doesn’t rewrite requests like `/projects` -> `/index.html`, then:
- Clicking an in-app link works (client-side navigation)
- Refreshing the page on `/projects` (or opening the URL directly) can 404

## Options

## Option 1: `BrowserRouter` (clean URLs like `/projects`)
**Code complexity:** low

**Deployment requirement:** host must support SPA rewrites.

**Behavior:**
- `https://yoursite.com/projects` works if rewrites are configured.

**When to pick it:**
- You want clean URLs and don’t mind adding a rewrite rule.

## Option 2: `HashRouter` (URLs like `/#/projects`)
**Code complexity:** low

**Deployment requirement:** typically none.

**Behavior:**
- Server always serves `/` (no 404 on refresh), routing happens after `#` in the browser.

**When to pick it:**
- You want shareable links but don’t want to deal with rewrites.

## Option 3: No router (view swap)
**Code complexity:** very low

**Deployment requirement:** none.

**Behavior:**
- No separate URL; can still behave like a “page” visually.

**When to pick it:**
- You don’t care about shareable deep links.

## Notes for common deployments

## Vercel
Vercel supports SPA rewrites, but it depends on how the project is configured.
- If you use `BrowserRouter`, you typically add a rewrite so that all paths serve `index.html`.

### Typical `vercel.json` SPA fallback
Create a `vercel.json` at the repo root:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Notes:
- Static files still win (Vercel gives precedence to the filesystem before applying rewrites), so `/static/...` continues to work.
- This is what prevents 404s when you refresh `/projects` or paste the URL into a new tab.

## GitHub Pages
GH Pages is static.
- `BrowserRouter` requires workarounds/rewrites (or 404.html tricks).
- `HashRouter` is commonly used because it avoids the refresh 404 problem.

## Practical recommendation for this repo
Given:
- CRA app
- `homepage` currently points at a Vercel URL

The lowest-risk choice for a “classic route” feel is:
- Prefer `BrowserRouter` if you confirm/accept adding rewrites
- Otherwise use `HashRouter` to guarantee deep links work without extra deployment steps
