import type { MouseEvent } from 'react';

export const scrollToAnchor = (event: MouseEvent<HTMLElement>) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>(`a[href]`) : null;
  if (!link || link.hasAttribute(`download`) || (link.target && link.target !== `_self`)) return;
  const destination = new URL(link.href, window.location.href);
  if (!destination.hash || destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || destination.search !== window.location.search) return;

  let id: string;
  try { id = decodeURIComponent(destination.hash.slice(1)); }
  catch { return; }
  const section = document.getElementById(id);
  if (!section) return;

  event.preventDefault();
  // Keep section changes out of Expo's route history while preserving its state ID.
  window.history.replaceState(window.history.state, ``, destination.href);
  section.scrollIntoView({ block: `start`, behavior: window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `instant` : `smooth` });
  if (!section.hasAttribute(`tabindex`)) {
    section.setAttribute(`tabindex`, `-1`);
    section.addEventListener(`blur`, () => section.removeAttribute(`tabindex`), { once: true });
  }
  section.focus({ preventScroll: true });
};
