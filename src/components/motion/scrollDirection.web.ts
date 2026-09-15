export type ScrollDirection = -1 | 1;

type DirectionListener = (direction: ScrollDirection) => void;

let direction: ScrollDirection = -1;
let previousScroll = 0;
const listeners = new Set<DirectionListener>();

const onScroll = () => {
  const scroll = Math.max(0, window.scrollY);
  if (scroll === previousScroll) return;
  const next: ScrollDirection = scroll > previousScroll ? -1 : 1;
  previousScroll = scroll;
  if (next === direction) return;
  direction = next;
  for (const listener of listeners) listener(direction);
};

/** -1 travels left while scrolling down; 1 travels right while scrolling up. */
export const getScrollDirection = (): ScrollDirection => direction;

/** Share one passive scroll listener across every animated marquee. */
export const subscribeScrollDirection = (listener: DirectionListener): (() => void) => {
  if (typeof window === `undefined`) {
    listener(direction);
    return () => undefined;
  }

  // A wrapper gives each subscription its own cleanup even when callbacks match.
  const subscription: DirectionListener = (next) => listener(next);
  if (listeners.size === 0) {
    previousScroll = Math.max(0, window.scrollY);
    window.addEventListener(`scroll`, onScroll, { passive: true });
  }
  listeners.add(subscription);
  listener(direction);
  return () => {
    listeners.delete(subscription);
    if (listeners.size === 0) window.removeEventListener(`scroll`, onScroll);
  };
};
