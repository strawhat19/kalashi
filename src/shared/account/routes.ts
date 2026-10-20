// Route metadata describes UI availability, not authorization.
export const accountRoutes = [
  { href: `/profile`, label: `◉ Profile`, mode: `local` },
  { href: `/library`, label: `♡ My library`, mode: `local` },
  { href: `/collections`, label: `☷ Collections`, mode: `local` },
  { href: `/connections`, label: `◇ Connections`, mode: `local` },
  { href: `/settings`, label: `⚙ Settings`, mode: `local` },
] as const;
export const ownerRoutes = [
  { href: `/dashboard`, label: `Dashboard`, capability: `owner` },
  { href: `/analytics`, label: `Analytics`, capability: `owner` },
  { href: `/users`, label: `Users`, capability: `owner` },
  { href: `/feedback`, label: `Feedback`, capability: `owner` },
  { href: `/features`, label: `Features`, capability: `owner` },
] as const;
