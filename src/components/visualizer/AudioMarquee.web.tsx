import './AudioMarquee.css';
import { useEffect, useId, useRef, useState } from 'react';
import { getScrollDirection, subscribeScrollDirection } from '../motion/scrollDirection.web';
import type { AudioVisualizerState } from './audio.types';
import { miniVisualizerSettings, visualizerConfig } from '../../config/visualizer';
import { ambientSpectrumSample } from './ambientSignal';

type AudioMarqueeProps = {
  state?: AudioVisualizerState;
  ready?: boolean;
  /** Horizontal speed in pixels per second. */
  speed?: number;
  /** Move opposite to the main text marquee. */
  reverse?: boolean;
  className?: string;
};

const barPitch = 6;
const wrap = (value: number, width: number) => ((value % width) + width) % width;
const bandCount = miniVisualizerSettings.density;
// Spread the original orbit rays across the row without stretching their
// envelope or repeating a recognizable block. Stable when the viewport resizes.
const bandForBar = (index: number) => Math.floor(((index * 0.6180339887498949) % 1) * bandCount);
const heightPercent = (level: number) => `${(15 + level * 85).toFixed(2)}%`;

const AudioMarquee = ({ state, ready = true, speed = 24, reverse = true, className = `` }: AudioMarqueeProps) => {
  const patternId = `audio-marquee-${useId().replace(/:/g, ``)}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const patternRef = useRef<SVGPatternElement>(null);
  const barsRef = useRef<(SVGRectElement | null)[]>([]);
  const [barCount, setBarCount] = useState(64);
  const tileWidth = barCount * barPitch;
  const motion = useRef({ phase: 0, offset: 0, direction: getScrollDirection(), levels: [] as number[] });
  const signal = state?.signal ?? null;
  const audioPlaying = state?.audioPlaying ?? false;
  const active = state?.active ?? true;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // One viewport-wide tile keeps the two red accents sparse at every size.
    const observer = new ResizeObserver(([entry]) => {
      setBarCount(Math.max(32, Math.ceil(entry.contentRect.width / barPitch)));
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const pattern = patternRef.current;
    if (!root || !pattern) return;
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const current = motion.current;
    const velocity = Number.isFinite(speed) ? Math.max(0, speed) : 24;
    let inView = typeof IntersectionObserver === `undefined`;
    let frame: number | undefined;
    let previousTime: number | null = null;
    const direction = () => current.direction * (reverse ? -1 : 1);
    const shouldAnimate = () => ready && active && inView && !document.hidden && !preference.matches;

    const paint = () => {
      const frequencies = audioPlaying && signal ? signal.readFrequencies() : null;
      const spectrum = Array.from({ length: bandCount }, (_, index) => {
        const position = index / Math.max(1, bandCount - 1);
        // Use the orbit's native bands, cadence, and smoothing for real audio too.
        if (!frequencies) return ambientSpectrumSample(position, current.phase);
        const bin = Math.floor(position ** 2 * (frequencies.length - 1));
        const target = (frequencies[bin] ?? 0) / 255;
        const previous = current.levels[index] ?? target;
        const smoothing = visualizerConfig.smoothing;
        const level = previous * smoothing + target * (1 - smoothing);
        current.levels[index] = level;
        return level;
      });
      barsRef.current.forEach((bar, index) => {
        bar?.setAttribute(`height`, heightPercent(spectrum[bandForBar(index)]));
      });
      pattern.setAttribute(`patternTransform`, `translate(${current.offset.toFixed(2)} 0)`);
    };
    const stop = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      previousTime = null;
      root.dataset.marqueeActive = `false`;
    };
    const tick = (time: number) => {
      if (!shouldAnimate()) { stop(); return; }
      if (previousTime === null || time - previousTime >= 1000 / visualizerConfig.fps) {
        const elapsed = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.1);
        previousTime = time;
        current.phase += elapsed * miniVisualizerSettings.speed;
        current.offset = wrap(current.offset + direction() * elapsed * velocity, tileWidth);
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const updatePlayback = () => {
      if (!shouldAnimate()) stop();
      else if (frame === undefined) {
        root.dataset.marqueeActive = `true`;
        frame = requestAnimationFrame(tick);
      }
    };
    const unsubscribe = subscribeScrollDirection((value) => {
      current.direction = value;
      root.dataset.marqueeDirection = direction() < 0 ? `left` : `right`;
    });
    const observer = typeof IntersectionObserver === `undefined` ? null : new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      updatePlayback();
    });
    observer?.observe(root);
    preference.addEventListener(`change`, updatePlayback);
    document.addEventListener(`visibilitychange`, updatePlayback);
    updatePlayback();
    return () => {
      stop();
      unsubscribe();
      observer?.disconnect();
      preference.removeEventListener(`change`, updatePlayback);
      document.removeEventListener(`visibilitychange`, updatePlayback);
    };
  }, [signal, audioPlaying, active, ready, speed, reverse, barCount, tileWidth]);

  return <div ref={rootRef} className={`audio-marquee ${className}`.trim()} aria-hidden={`true`}>
    <svg className={`audio-marquee__canvas`} width={`100%`} height={`100%`} focusable={`false`}>
      <defs>
        <pattern ref={patternRef} id={patternId} className={`audio-marquee__pattern`} width={tileWidth} height={`100%`} patternUnits={`userSpaceOnUse`}>
          {Array.from({ length: barCount }, (_, index) => {
            const accent = index === Math.floor(barCount * 0.18) || index === Math.floor(barCount * 0.68);
            return <rect key={index} ref={(bar) => { barsRef.current[index] = bar; }} className={accent ? `audio-marquee__bar audio-marquee__bar--accent` : `audio-marquee__bar`} x={index * barPitch + 2} y={0} width={2} height={heightPercent(ambientSpectrumSample(bandForBar(index) / Math.max(1, bandCount - 1), 0))} fill={accent ? visualizerConfig.alert : `currentColor`} />;
          })}
        </pattern>
      </defs>
      {/* An SVG pattern repeats seamlessly at any viewport width. */}
      <rect width={`100%`} height={`100%`} fill={`url(#${patternId})`} />
    </svg>
  </div>;
};

export default AudioMarquee;
