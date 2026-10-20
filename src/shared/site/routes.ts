export const siteNavigation = [
  { id: `music`, href: `/music`, label: `The Music`, icon: `music` },
  { id: `sound`, href: `/sound-lab`, label: `Sound Lab`, icon: `sound` },
  { id: `story`, href: `/about`, label: `The Story`, icon: `story` },
  { id: `blog`, href: `/blog`, label: `Blog`, icon: `blog` },
  { id: `contact`, href: `/contact`, label: `Contact`, icon: `contact` },
  { id: `library`, href: `/library`, label: `My library`, icon: `library` },
  { id: `account`, href: `/sign-in`, label: `Account`, icon: `account` },
] as const;

export const footerNavigation = [
  { id: `about`, href: `/about`, label: `About` },
  { id: `blog`, href: `/blog`, label: `Blog` },
  { id: `contact`, href: `/contact`, label: `Contact` },
  { id: `support`, href: `/support`, label: `Help` },
  { id: `terms`, href: `/terms`, label: `Terms` },
  { id: `privacy`, href: `/privacy`, label: `Privacy` },
] as const;

const accountPaths = new Set([
  `/users`, `/signin`, `/signup`, `/account`, `/library`, `/profile`,
  `/login`, `/sign-in`, `/sign-up`, `/settings`, `/features`, `/feedback`,
  `/analytics`, `/dashboard`, `/collections`, `/connections`, `/forgot-password`,
  `/preview/dashboard`,
  `/profile/inquiries`,
]);

export const isAccountPath = (pathname: string) => accountPaths.has(pathname.replace(/\/$/u, ``));

export type SiteIconName = typeof siteNavigation[number][`icon`];
