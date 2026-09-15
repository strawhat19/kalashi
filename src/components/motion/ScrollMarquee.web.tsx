import './ScrollMarquee.css';
import { useRef, useState, useLayoutEffect, type CSSProperties } from 'react';
import { getScrollDirection, subscribeScrollDirection } from './scrollDirection.web';

type ScrollMarqueeProps = {
  text: string;
  speed?: number;
  ready?: boolean;
  reverse?: boolean;
  reveal?: boolean;
  className?: string;
};

const wrap = (value: number, period: number) => ((value % period) + period) % period;

const ScrollMarquee = ({ text, speed = 55, ready = true, reverse = false, reveal = false, className = `` }: ScrollMarqueeProps) => {
  const [copies, setCopies] = useState(1);
  const itemRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const revealedTextRef = useRef<string | null>(null);
  const motion = useRef({ width: 0, offset: 0, rotation: 0, direction: getScrollDirection() });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    let observer: IntersectionObserver | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (timer !== undefined) clearTimeout(timer);
      root.dataset.marqueeReveal = `complete`;
      root.dispatchEvent(new Event(`marqueerevealend`));
    };
    const show = (animate: boolean) => {
      revealedTextRef.current = text;
      observer?.disconnect();
      if (!animate) { finish(); return; }
      root.dataset.marqueeReveal = `visible`;
      // One entrance for the whole track, including its copies. Clearing the
      // animation afterward keeps later resize-created copies static as well.
      const characterCount = Array.from(text.replace(/\s/gu, ``)).length;
      timer = setTimeout(finish, 680 + Math.min(Math.max(0, characterCount - 1) * 35, 700));
    };
    const onPreferenceChange = () => {
      if (preference.matches) show(false);
    };

    if (!reveal) finish();
    else if (revealedTextRef.current === text || preference.matches || !(`IntersectionObserver` in window)) show(false);
    else {
      root.dataset.marqueeReveal = `waiting`;
      observer = new IntersectionObserver((entries) => {
        if (ready && entries.some((entry) => entry.isIntersecting)) show(true);
      }, { threshold: 0.1 });
      observer.observe(root);
    }

    preference.addEventListener(`change`, onPreferenceChange);
    return () => {
      observer?.disconnect();
      if (timer !== undefined) clearTimeout(timer);
      preference.removeEventListener(`change`, onPreferenceChange);
    };
  }, [ready, reveal, text]);

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
    const shouldAnimate = () => active && ready && inView && (!reveal || root.dataset.marqueeReveal === `complete`) && !document.hidden && !preference.matches && state.width > 0 && velocity > 0;
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
      // Each unchanged word reserves its natural font metrics. Position the
      // animated characters from text ranges to preserve kerning and width.
      if (reveal) {
        root.querySelectorAll<HTMLElement>(`.scroll-marquee__word-mask`).forEach((mask) => {
          const sizer = mask.querySelector<HTMLElement>(`.scroll-marquee__word-sizer`);
          const textNode = sizer?.firstChild;
          if (!sizer || !textNode) return;
          const left = sizer.getBoundingClientRect().left;
          const range = document.createRange();
          let characterOffset = 0;
          mask.querySelectorAll<HTMLElement>(`.scroll-marquee__character`).forEach((character) => {
            const length = character.textContent?.length ?? 0;
            range.setStart(textNode, characterOffset);
            range.setEnd(textNode, characterOffset + length);
            character.style.left = `${range.getBoundingClientRect().left - left}px`;
            characterOffset += length;
          });
        });
      }
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
    const unsubscribeDirection = subscribeScrollDirection((direction) => {
      state.direction = direction;
      root.dataset.marqueeDirection = getDirection() < 0 ? `left` : `right`;
    });
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
    document.addEventListener(`visibilitychange`, updatePlayback);
    root.addEventListener(`marqueerevealend`, updatePlayback);
    return () => {
      active = false;
      stop();
      size?.disconnect();
      visibility?.disconnect();
      document.fonts?.removeEventListener(`loadingdone`, measure);
      preference.removeEventListener(`change`, measure);
      window.removeEventListener(`resize`, measure);
      unsubscribeDirection();
      document.removeEventListener(`visibilitychange`, updatePlayback);
      root.removeEventListener(`marqueerevealend`, updatePlayback);
    };
  }, [ready, speed, text, reverse, reveal, copies]);

  const renderText = () => {
    if (!reveal) return text;
    let characterIndex = 0;
    return text.split(/(\s+)/u).map((word, index) => {
      if (/^\s+$/u.test(word)) return word;
      return <span key={index} className={`scroll-marquee__word-mask`}>
        <span className={`scroll-marquee__word-sizer`}>{word}</span>
        <span className={`scroll-marquee__word`}>
          {Array.from(word).map((character, offset) => {
            const style = { [`--marquee-reveal-delay`]: `${Math.min(characterIndex++ * 35, 700)}ms` } as CSSProperties;
            return <span key={offset} className={`scroll-marquee__character`} style={style}>{character}</span>;
          })}
        </span>
      </span>;
    });
  };

  return <span ref={rootRef} className={`scroll-marquee ${className}`.trim()}>
    <span className={`scroll-marquee__label`}>{text}</span>
    <span aria-hidden={`true`} className={`scroll-marquee__visual`}>
      <span ref={trackRef} className={`scroll-marquee__track`}>
        {[0, 1].map((group) => <span key={group} className={`scroll-marquee__group`}>
          {Array.from({ length: copies }, (_, index) => <span key={index} ref={group === 0 && index === 0 ? itemRef : undefined} className={`scroll-marquee__item`}>
            <span className={`scroll-marquee__text`}>{renderText()}</span><span className={`scroll-marquee__symbol`}>{`✳\uFE0E`}</span>
          </span>)}
        </span>)}
      </span>
    </span>
  </span>;
};

export default ScrollMarquee;
