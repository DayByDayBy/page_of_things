# Projects Page Content Schema

## Goals
- Keep content entry simple.
- Support multiple “things” (repos, events, demos, writeups) without needing different UI for each.
- Make it easy to sort/group later.

## Recommended minimal schema
Represent each item as a plain object.

### Required
- `id` (string)
- `title` (string)
- `links` (array of link objects; must contain at least 1)

### Optional
- `summary` (string)
- `type` (string; e.g. `project`, `event`, `talk`, `writeup`, `tool`, `experiment`)
- `tags` (string[])
- `status` (string; e.g. `active`, `paused`, `archived`)
- `date` (string; ISO `YYYY-MM` or `YYYY-MM-DD`)
- `pinned` (boolean)

## Link object
- `label` (string; what the user sees, e.g. `repo`, `demo`, `event`, `slides`)
- `href` (string URL)
- `kind` (optional string; e.g. `github`, `demo`, `event`, `video`, `article`)

## Example
```js
export const projects = [
  {
    id: "wave-lab",
    title: "Wave Lab",
    summary: "Interactive AM/FM modulation playground used as the background + controls layer for this site.",
    type: "project",
    tags: ["react", "canvas", "signal-processing"],
    pinned: true,
    links: [
      { label: "repo", kind: "github", href: "https://github.com/…" },
      { label: "live", kind: "demo", href: "https://…" }
    ]
  },
  {
    id: "my-talk",
    title: "Talk: Engineering Intelligence",
    type: "talk",
    date: "2025-09",
    links: [
      { label: "event", kind: "event", href: "https://…" },
      { label: "slides", kind: "article", href: "https://…" }
    ]
  }
];
```

## Display rules (suggested)
- Sort order:
  1. `pinned: true` first
  2. then by `date` descending (if present)
  3. then alphabetical
- Render:
  - title (heading)
  - summary (optional)
  - links row
  - tags row (optional)
