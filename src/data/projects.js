export const projects = [
  {
    id: 'boag-dev',
    title: 'boag_dev',
    summary: 'Personal site + wave modulation playground.',
    highlights: [
      'Canvas-based wave background with real-time AM/FM modulation controls.',
      'Reducer-driven modulation state keeps controls and rendering loop in sync.',
      'SPA routing (`/projects`) with Vercel rewrite for refresh-safe deep links.',
    ],
    type: 'project',
    tags: ['react', 'canvas'],
    pinned: true,
    links: [
      {
        label: 'repo',
        kind: 'github',
        href: 'https://github.com/DayByDayBy/boag_dev',
      },
      {
        label: 'site',
        kind: 'demo',
        href: 'https://page-of-things.vercel.app',
      },
    ],
  },
  {
    id: 'github',
    title: 'GitHub profile',
    summary: 'More repos and experiments.',
    type: 'link',
    tags: ['github'],
    links: [
      {
        label: 'github',
        kind: 'github',
        href: 'https://github.com/DayByDayBy',
      },
    ],
  },
];
