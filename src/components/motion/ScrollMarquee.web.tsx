import './ScrollMarquee.css';
import { useRef, useState, useLayoutEffect } from 'react';

type ScrollMarqueeProps = {
  text: string;
  speed?: number;
  ready?: boolean;
  reverse?: boolean;
  className?: string;
};

let lastDirection = -1;
const wrap = (value: number, period: number) => ((value % period) + period) % period;

const ScrollMarquee = ({ text, speed = 55, ready = true, reverse = false, className = `` }: ScrollMarqueeProps) => {
  const [copies, setCopies] = useState(1);
  const itemRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const motion = useRef({ width: 0, offset: 0, rotation: 0, direction: lastDirection });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const item = itemRef.current;
    const track = trackRef.current;
    if (!root || !item || !track) return;
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const state = motion.current;
    let active = true;
    let frame: number | undefined;
    let previousTime: number | null = null;
    let previousScroll = Math.max(0, window.scrollY);
    let inView = !(`IntersectionObserver` in window);
    const velocity = Number.isFinite(speed) ? Math.max(0, speed) : 55;
    const getDirection = () => state.direction * (reverse ? -1 : 1);
    root.dataset.marqueeEnhanced = `true`;
    root.dataset.marqueeDirection = getDirection() < 0 ? `left` : `right`;

    const paint = () => {
      track.style.transform = `translate3d(${-state.offset}px, 0, 0)`;
      track.style.setProperty(`--marquee-rotation`, `${state.rotation}deg`);
    };
    const stop = () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      frame = undefined;
      previousTime = null;
      root.dataset.marqueeActive = `false`;
    };
    const shouldAnimate = () => active && ready && inView && !document.hidden && !preference.matches && state.width > 0 && velocity > 0;
    const tick = (time: number) => {
      frame = undefined;
      if (!shouldAnimate()) { stop(); return; }
      const elapsed = previousTime === null ? 0 : Math.min(64, time - previousTime) / 1000;
      const direction = getDirection();
      previousTime = time;
      state.rotation = wrap(state.rotation + direction * elapsed * 24, 360);
      state.offset = wrap(state.offset - direction * elapsed * velocity, state.width);
      paint();
      frame = window.requestAnimationFrame(tick);
    };
    const updatePlayback = () => {
      if (!shouldAnimate()) stop();
      else if (frame === undefined) {
        root.dataset.marqueeActive = `true`;
        frame = window.requestAnimationFrame(tick);
      }
    };
    const measure = () => {
      if (!active) return;
      const width = parseFloat(window.getComputedStyle(item).width);
      if (width > 0) {
        state.offset = state.width > 0 ? state.offset / state.width * width : 0;
        state.width = width;
        const count = Math.max(1, Math.ceil(root.clientWidth / width));
        setCopies((current) => current === count ? current : count);
        paint();
      }
      updatePlayback();
    };
    const onScroll = () => {
      const scroll = Math.max(0, window.scrollY);
      if (scroll !== previousScroll) {
        state.direction = scroll > previousScroll ? -1 : 1;
        lastDirection = state.direction;
        root.dataset.marqueeDirection = getDirection() < 0 ? `left` : `right`;
        previousScroll = scroll;
      }
    };
    const visibility = `IntersectionObserver` in window ? new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      updatePlayback();
    }) : undefined;
    const size = `ResizeObserver` in window ? new ResizeObserver(measure) : undefined;
    visibility?.observe(root);
    size?.observe(root);
    size?.observe(item);
    measure();
    document.fonts?.ready.then(measure);
    document.fonts?.addEventListener(`loadingdone`, measure);
    preference.addEventListener(`change`, measure);
    window.addEventListener(`resize`, measure, { passive: true });
    window.addEventListener(`scroll`, onScroll, { passive: true });
    document.addEventListener(`visibilitychange`, updatePlayback);
    return () => {
      active = false;
      stop();
      size?.disconnect();
      visibility?.disconnect();
      document.fonts?.removeEventListener(`loadingdone`, measure);
      preference.removeEventListener(`change`, measure);
      window.removeEventListener(`resize`, measure);
      window.removeEventListener(`scroll`, onScroll);
      document.removeEventListener(`visibilitychange`, updatePlayback);
    };
  }, [ready, speed, text, reverse]);

  return <span ref={rootRef} className={`scroll-marquee ${className}`.trim()}>
    <span className={`scroll-marquee__label`}>{text}</span>
    <span aria-hidden={`true`} className={`scroll-marquee__visual`}>
      <span ref={trackRef} className={`scroll-marquee__track`}>
        {[0, 1].map((group) => <span key={group} className={`scroll-marquee__group`}>
          {Array.from({ length: copies }, (_, index) => <span key={index} ref={group === 0 && index === 0 ? itemRef : undefined} className={`scroll-marquee__item`}>
            <span className={`scroll-marquee__text`}>{text}</span><span className={`scroll-marquee__symbol`}>{`✳\uFE0E`}</span>
          </span>)}
        </span>)}
      </span>
    </span>
  </span>;
};

export default ScrollMarquee;
