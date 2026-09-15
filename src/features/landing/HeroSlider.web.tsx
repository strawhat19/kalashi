import './HeroSlider.css';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { ArrowIcon, PlayIcon, SpotifyIcon } from '../../components/Icons.web';
import SplitText from '../../components/motion/SplitText.web';
import { artist, releases } from '../../config/artist';
import { heroSliderConfig } from '../../config/heroSlider';
import HeroVisualizer from '../../components/visualizer/HeroVisualizer.web';
import AudioBorder from '../../components/visualizer/AudioBorder.web';
import type { AudioVisualizerState } from '../../components/visualizer/audio.types';

type HeroSliderProps = {
  ready?: boolean;
  onListen: (releaseIndex: number) => void;
  visualizerState: AudioVisualizerState;
  autoplay?: boolean;
  intervalMs?: number;
};

const slides = [
  { title: `A world in my sound`, releaseIndex: 0 },
  { title: `Come Thru`, releaseIndex: 0, eyebrow: `THE LATEST FREQUENCY`, firstLine: `COME`, secondLine: `THRU.`, description: `Come Thru. A new Kalashi single.`, detail: `Press play. Find your frequency.` },
  { title: `MiSSery`, releaseIndex: 1, eyebrow: `STEP INSIDE THE ALBUM`, firstLine: `MiSSERY.`, secondLine: `ON REPEAT.`, description: `A whole world inside one album.`, detail: `Get into MiSSery. Stay a while.` },
  { title: `Passenger Princess`, releaseIndex: 2, eyebrow: `TAKE THE LONG WAY HOME`, firstLine: `PASSENGER`, secondLine: `PRINCESS.`, description: `Passenger Princess. Kalashi, 2026.`, detail: `One more track for your rotation.` },
] as const;

const wrapIndex = (index: number) => (index + slides.length) % slides.length;

const HeroSlider = ({ ready = true, onListen, visualizerState, autoplay = heroSliderConfig.autoplay, intervalMs = heroSliderConfig.intervalMs }: HeroSliderProps) => {
  const root = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; distance: number; locked: boolean } | null>(null);
  const suppressClickUntil = useRef(0);
  const slideId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pointerEngaged, setPointerEngaged] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcement, setAnnouncement] = useState(``);

  useEffect(() => {
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState !== `hidden`);
    updateMotion();
    updateVisibility();
    preference.addEventListener(`change`, updateMotion);
    document.addEventListener(`visibilitychange`, updateVisibility);
    const observer = `IntersectionObserver` in window ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 }) : null;
    if (root.current && observer) observer.observe(root.current);
    else setInView(true);
    return () => {
      preference.removeEventListener(`change`, updateMotion);
      document.removeEventListener(`visibilitychange`, updateVisibility);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!autoplay || paused || !ready || reducedMotion || !inView || !pageVisible || hovered || focused || pointerEngaged) return;
    const timer = window.setTimeout(() => setActiveIndex((index) => wrapIndex(index + 1)), Math.max(1000, intervalMs));
    return () => window.clearTimeout(timer);
  }, [activeIndex, autoplay, focused, hovered, inView, intervalMs, pageVisible, paused, pointerEngaged, ready, reducedMotion]);

  const goTo = (index: number) => {
    const next = wrapIndex(index);
    setActiveIndex(next);
    setAnnouncement(`Slide ${next + 1} of ${slides.length}: ${slides[next].title}`);
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest(`.hero-slider__controls`)) return;
    suppressClickUntil.current = 0;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, distance: 0, locked: false };
    setPointerEngaged(true);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const x = event.clientX - gesture.x;
    const y = event.clientY - gesture.y;
    if (!gesture.locked) {
      // Leave vertical gestures to the page, including swipes beginning on links.
      if (Math.abs(y) > 10 && Math.abs(y) > Math.abs(x)) {
        drag.current = null;
        setPointerEngaged(false);
        return;
      }
      if (Math.abs(x) < 9 || Math.abs(x) <= Math.abs(y)) return;
      gesture.locked = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
    }
    event.preventDefault();
    gesture.distance = x;
    event.currentTarget.style.setProperty(`--hero-drag-x`, `${Math.max(-100, Math.min(100, x * 0.3))}px`);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.style.removeProperty(`--hero-drag-x`);
    setDragging(false);
    setPointerEngaged(false);
    if (!gesture.locked) return;
    suppressClickUntil.current = Date.now() + 500;
    const threshold = Math.min(80, event.currentTarget.clientWidth * 0.12);
    if (!cancelled && Math.abs(gesture.distance) >= threshold) goTo(activeIndex + (gesture.distance < 0 ? 1 : -1));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || (event.target !== event.currentTarget && !(event.target as Element).closest(`.hero-slider__controls`))) return;
    if (event.key === `ArrowLeft`) { event.preventDefault(); goTo(activeIndex - 1); }
    else if (event.key === `ArrowRight`) { event.preventDefault(); goTo(activeIndex + 1); }
    else if (event.key === `Home`) { event.preventDefault(); goTo(0); }
    else if (event.key === `End`) { event.preventDefault(); goTo(slides.length - 1); }
  };

  return <div
    ref={root}
    className={`hero-slider${dragging ? ` is-dragging` : ``}`}
    role={`region`}
    aria-roledescription={`carousel`}
    aria-label={`Featured music`}
    tabIndex={0}
    onKeyDown={onKeyDown}
    onPointerEnter={(event) => { if (event.pointerType === `mouse`) setHovered(true); }}
    onPointerLeave={(event) => { if (event.pointerType === `mouse`) setHovered(false); if (drag.current && !drag.current.locked) endDrag(event, true); }}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
    onPointerDown={startDrag}
    onPointerMove={moveDrag}
    onPointerUp={(event) => endDrag(event)}
    onPointerCancel={(event) => endDrag(event, true)}
    onLostPointerCapture={(event) => { if (event.target === event.currentTarget) endDrag(event, true); }}
    onDragStart={(event) => event.preventDefault()}
    onClickCapture={(event) => { if (Date.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); } }}
  >
    {slides.map((slide, index) => {
      const currentRelease = releases[slide.releaseIndex];
      const active = index === activeIndex;
      return <div
        id={`${slideId}-${index}`}
        key={slide.title}
        className={`hero-scene hero-slider__slide${active ? ` is-active` : ``}${index > 0 ? ` hero-slider__release-slide` : ``}`}
        role={`group`}
        aria-roledescription={`slide`}
        aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
        aria-hidden={!active}
        inert={!active}
      >
        <div className={`portrait-stage`}>
          <img className={`hero-portrait`} src={index === 0 ? `/media/music/portrait.jpg` : currentRelease.webArtwork} width={640} height={640} alt={index === 0 ? `Kalashi standing in a concrete doorway, holding a baseball cap` : `${currentRelease.title} ${currentRelease.type.toLowerCase()} artwork`} fetchPriority={index === 0 ? `high` : `low`} draggable={false} />
          <div className={`portrait-shade`} />
          <span className={`photo-register`}>{`K / 0${index + 1}`}<span>{index === 0 ? `ATLANTA, GA` : `${currentRelease.type.toUpperCase()} / ${currentRelease.year}`}</span></span>
          <span className={`portrait-caption`}>{index === 0 ? <>ROOTED IN TWO WORLDS.<br />HEARD IN YOURS.</> : <>KALASHI MUSIC.<br />FIND YOUR FREQUENCY.</>}</span>
        </div>
        <div className={`hero-copy`}>
          <div className={`eyebrow`}><span className={`line`} />{`eyebrow` in slide ? slide.eyebrow : `THIS IS MY FREQUENCY`}</div>
          <h2>{`firstLine` in slide ? <><SplitText text={slide.firstLine} ready={ready && active} delay={80} /><br /><span className={`accent-text`}><SplitText text={slide.secondLine} ready={ready && active} delay={150} /></span></> : <><SplitText text={`A WORLD`} ready={ready && active} delay={80} /><br /><SplitText text={`IN MY `} ready={ready && active} delay={150} /><span className={`accent-text`}><SplitText text={`SOUND.`} ready={ready && active} delay={240} /></span></>}</h2>
          <p>{`description` in slide ? slide.description : `Bangladesh roots. Atlanta energy.`}<br />{`detail` in slide ? slide.detail : `No boxes. No borders. Just Kalashi.`}</p>
          <AudioBorder className={`hero-listen-border`} state={visualizerState} ready={ready && active} radius={999} amplitude={6.5} gap={1}>
            <a className={`button button-green`} href={index === 0 ? artist.spotifyUrl : currentRelease.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`}><SpotifyIcon />{`Listen on Spotify`}<ArrowIcon size={18} /></a>
          </AudioBorder>
          <a className={`explore-link`} href={`#music`}>{`Explore the music`}<span>{`↓`}</span></a>
        </div>
        <button className={`featured-release featured-release--signal`} type={`button`} onClick={() => onListen(slide.releaseIndex)} aria-label={`Load ${currentRelease.title} in the Spotify player`}>
          <HeroVisualizer state={visualizerState} ready={ready && active} />
          <img src={currentRelease.webArtwork} width={74} height={74} alt={`${currentRelease.title} ${currentRelease.type.toLowerCase()} artwork`} draggable={false} />
          <span className={`featured-copy`}><span className={`micro-label`}><i />{index < 2 ? `LATEST FREQUENCY` : `IN THE ROTATION`}</span><strong>{currentRelease.title}</strong><small>{`KALASHI · ${currentRelease.type.toUpperCase()} · ${currentRelease.year}`}</small></span>
          <span className={`featured-action`} aria-hidden={true}><span className={`featured-play`}><PlayIcon size={24} /></span><span>{`LISTEN`}</span></span>
        </button>
      </div>;
    })}
    <div className={`hero-slider__controls`} aria-label={`Slide controls`}>
      <button type={`button`} className={`hero-slider__arrow`} onClick={() => goTo(activeIndex - 1)} aria-label={`Previous slide`}><span aria-hidden={`true`}>{`←`}</span></button>
      <span className={`hero-slider__count`} aria-hidden={`true`}>{`0${activeIndex + 1}`}<span>{` / 0${slides.length}`}</span></span>
      <div className={`hero-slider__dots`}>
        {slides.map((slide, index) => <button key={slide.title} type={`button`} aria-label={`Show slide ${index + 1}: ${slide.title}`} aria-controls={`${slideId}-${index}`} aria-pressed={index === activeIndex} onClick={() => goTo(index)}><span /></button>)}
      </div>
      <button type={`button`} className={`hero-slider__arrow`} onClick={() => goTo(activeIndex + 1)} aria-label={`Next slide`}><span aria-hidden={`true`}>{`→`}</span></button>
      {autoplay ? <button type={`button`} className={`hero-slider__pause`} aria-label={reducedMotion ? `Automatic slides paused for reduced motion` : paused ? `Resume automatic slides` : `Pause automatic slides`} aria-pressed={paused || reducedMotion} disabled={reducedMotion} onClick={() => setPaused((value) => !value)}>{paused || reducedMotion ? <PlayIcon size={15} /> : <span className={`hero-slider__pause-icon`} aria-hidden={`true`} />}</button> : null}
    </div>
    <span className={`hero-slider__announcement`} aria-live={`polite`} aria-atomic={`true`}>{announcement}</span>
  </div>;
};

export default HeroSlider;
