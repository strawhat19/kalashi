import { useEffect, useState } from 'react';

const ScrollToTop = ({ pathname }: { pathname: string }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>(`#home, [data-page-hero]`);
      const threshold = hero ? hero.getBoundingClientRect().bottom + window.scrollY : 420;
      const headerOffset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(`--site-header-offset`)) || 0;
      setVisible(window.scrollY > Math.max(160, threshold - headerOffset));
    };
    update();
    window.addEventListener(`scroll`, update, { passive: true });
    window.addEventListener(`resize`, update);
    return () => {
      window.removeEventListener(`scroll`, update);
      window.removeEventListener(`resize`, update);
    };
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `instant` : `smooth` });
    document.querySelector<HTMLElement>(`#site-header a`)?.focus({ preventScroll: true });
  };

  return <button
    type={`button`}
    id={`site-scroll-to-top`}
    tabIndex={visible ? 0 : -1}
    aria-label={`Scroll to top`}
    aria-hidden={!visible}
    onClick={scrollToTop}
    className={`site-scroll-top${visible ? ` is-visible` : ``}`}
  >
    <svg width={22} height={22} fill={`none`} viewBox={`0 0 24 24`} aria-hidden={`true`}><path d={`m5 15 7-7 7 7`} stroke={`currentColor`} strokeWidth={1.6} strokeLinecap={`round`} strokeLinejoin={`round`} /></svg>
  </button>;
};

export default ScrollToTop;
