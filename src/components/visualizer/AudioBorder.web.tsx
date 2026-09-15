import './AudioBorder.css';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import type { AudioVisualizerState } from './audio.types';
import { visualizerConfig } from '../../config/visualizer';

export type AudioBorderProps = {
  children: ReactNode;
  state?: AudioVisualizerState;
  ready?: boolean;
  /** Corner radius in pixels. The default follows pill-shaped buttons. */
  radius?: number;
  /** Maximum outward pulse in pixels; does not take up layout space. */
  amplitude?: number;
  gap?: number;
  speed?: number;
  color?: string;
  accentColor?: string;
  className?: string;
  style?: CSSProperties;
};

type BorderPoint = { x: number; y: number; nx: number; ny: number };

/** Orbit-style spectrum bars radiating outward behind a button, link, or element. */
const AudioBorder = ({ children, state, ready = true, radius = 999, amplitude = 6, gap = 2, speed = 1, color = visualizerConfig.accent, accentColor = visualizerConfig.alert, className = ``, style }: AudioBorderProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const outlineRef = useRef<SVGRectElement>(null);
  const raysRef = useRef<SVGPathElement>(null);
  const accentRaysRef = useRef<SVGPathElement>(null);
  const phaseRef = useRef(0);
  const signal = state?.signal ?? null;
  const audioPlaying = state?.audioPlaying ?? false;
  const active = state?.active ?? true;
  const gain = Math.max(0, amplitude);
  const spacing = Math.max(0, gap);
  const bleed = gain + spacing + 3;

  useEffect(() => {
    const host = hostRef.current;
    const svg = svgRef.current;
    const outline = outlineRef.current;
    const rays = raysRef.current;
    const accentRays = accentRaysRef.current;
    if (!host || !svg || !outline || !rays || !accentRays) return;
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    let points: BorderPoint[] = [];
    let levels: number[] = [];
    let frame: number | undefined;
    let previousTime = 0;
    let inView = typeof IntersectionObserver === `undefined`;
    const canAnimate = () => ready && active && inView && !document.hidden && !preference.matches;

    const paint = () => {
      if (!points.length) return;
      const frequencies = audioPlaying && signal ? signal.readFrequencies() : null;
      const phase = phaseRef.current;
      const ticks: string[] = [];
      const accentTicks: string[] = [];
      const distances: number[] = [];
      // Two accents travel half a lap apart, sharing the animation's pause
      // and speed controls. A lap takes about 17 seconds at the default speed.
      const accentCursors = [0.18, 0.68].map((offset) => ((offset + phase * 0.06) % 1) * points.length);
      const accentIndices = accentCursors.map((cursor) => Math.round(cursor) % points.length);
      points.forEach((point, index) => {
        const position = index / points.length;
        const carrier = 0.5 + 0.5 * Math.sin(index * 0.72 - phase * 3.8);
        const swell = 0.5 + 0.5 * Math.sin(position * Math.PI * 2 - phase * 1.4);
        const ambient = 0.15 + carrier * (0.2 + 0.65 * swell ** 3);
        // Mirror the frequency range around the perimeter so the seam stays quiet.
        const bin = frequencies ? Math.floor((1 - Math.abs(position * 2 - 1)) ** 2 * (frequencies.length - 1)) : 0;
        const target = frequencies ? (frequencies[bin] ?? 0) / 255 : ambient;
        const level = frequencies ? (levels[index] ?? target) * 0.7 + target * 0.3 : ambient;
        levels[index] = level;
        // Separate, clearly visible bars like the orbit visualizer. Leave a
        // short resting bar even in quiet frequency bands.
        const distance = Math.max(Math.min(1.5, gain), gain * (0.2 + level * 0.8));
        distances.push(distance);
        const x = point.x + point.nx * distance;
        const y = point.y + point.ny * distance;
        if (index !== accentIndices[0] && index !== accentIndices[1]) {
          ticks.push(`M${point.x.toFixed(2)},${point.y.toFixed(2)}L${x.toFixed(2)},${y.toFixed(2)}`);
        }
      });
      accentCursors.forEach((cursor) => {
        // Interpolate both position and outward direction so accents glide
        // between bars and around corners, rather than jumping per frame.
        const index = Math.floor(cursor);
        const nextIndex = (index + 1) % points.length;
        const fraction = cursor - index;
        const point = points[index];
        const next = points[nextIndex];
        const x = point.x + (next.x - point.x) * fraction;
        const y = point.y + (next.y - point.y) * fraction;
        const nx = point.nx + (next.nx - point.nx) * fraction;
        const ny = point.ny + (next.ny - point.ny) * fraction;
        const magnitude = Math.hypot(nx, ny) || 1;
        const distance = distances[index] + (distances[nextIndex] - distances[index]) * fraction;
        accentTicks.push(`M${x.toFixed(2)},${y.toFixed(2)}L${(x + nx / magnitude * distance).toFixed(2)},${(y + ny / magnitude * distance).toFixed(2)}`);
      });
      rays.setAttribute(`d`, ticks.join(` `));
      accentRays.setAttribute(`d`, accentTicks.join(` `));
    };

    const stop = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      previousTime = 0;
    };
    const tick = (time: number) => {
      if (!canAnimate()) { stop(); return; }
      if (time - previousTime >= 1000 / visualizerConfig.fps) {
        const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.1) : 0;
        previousTime = time;
        phaseRef.current += elapsed * Math.max(0, speed);
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    const updatePlayback = () => {
      if (!canAnimate()) stop();
      else if (frame === undefined) frame = requestAnimationFrame(tick);
    };
    const measure = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      svg.setAttribute(`viewBox`, `0 0 ${width + bleed * 2} ${height + bleed * 2}`);
      outline.setAttribute(`x`, String(bleed - spacing));
      outline.setAttribute(`y`, String(bleed - spacing));
      outline.setAttribute(`width`, String(width + spacing * 2));
      outline.setAttribute(`height`, String(height + spacing * 2));
      outline.setAttribute(`rx`, String(Math.max(0, Math.min(radius, width / 2, height / 2)) + spacing));
      const length = outline.getTotalLength();
      const count = Math.max(24, Math.min(320, Math.ceil(length / 4.5)));
      points = Array.from({ length: count }, (_, index) => {
        const distance = index / count * length;
        const point = outline.getPointAtLength(distance);
        const before = outline.getPointAtLength((distance - 0.5 + length) % length);
        const after = outline.getPointAtLength((distance + 0.5) % length);
        const dx = after.x - before.x;
        const dy = after.y - before.y;
        const magnitude = Math.hypot(dx, dy) || 1;
        return { x: point.x, y: point.y, nx: dy / magnitude, ny: -dx / magnitude };
      });
      paint();
      updatePlayback();
    };
    const sizeObserver = new ResizeObserver(measure);
    const visibilityObserver = typeof IntersectionObserver === `undefined` ? null : new IntersectionObserver((entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      updatePlayback();
    });
    sizeObserver.observe(host);
    visibilityObserver?.observe(host);
    preference.addEventListener(`change`, updatePlayback);
    document.addEventListener(`visibilitychange`, updatePlayback);
    measure();
    return () => {
      stop();
      sizeObserver.disconnect();
      visibilityObserver?.disconnect();
      preference.removeEventListener(`change`, updatePlayback);
      document.removeEventListener(`visibilitychange`, updatePlayback);
    };
  }, [signal, audioPlaying, active, ready, radius, gain, spacing, speed, bleed]);

  return <div ref={hostRef} className={`audio-border ${className}`.trim()} style={{ ...style, [`--audio-border-bleed`]: `${bleed}px`, [`--audio-border-color`]: color, [`--audio-border-accent`]: accentColor } as CSSProperties}>
    <svg ref={svgRef} className={`audio-border__canvas`} aria-hidden={`true`} focusable={`false`}>
      <rect ref={outlineRef} className={`audio-border__outline`} />
      <path ref={raysRef} className={`audio-border__rays`} />
      <path ref={accentRaysRef} className={`audio-border__rays audio-border__rays--accent`} />
    </svg>
    {children}
  </div>;
};

export default AudioBorder;
