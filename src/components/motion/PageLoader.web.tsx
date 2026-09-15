import { OrbitBrandMark } from '../Icons.web';
import LoaderSpectrum from './LoaderSpectrum.web';
import { loaderConfig } from '../../config/loader';
import { useId, useRef, useEffect, useState, type CSSProperties } from 'react';

type PageLoaderProps = { ready: boolean; onReveal: () => void; onComplete: () => void };
type LoaderStyle = CSSProperties & { [key: `--${string}`]: string | number };

const blinds = Array.from({ length: loaderConfig.bars }, (_, index) => index);
const smoothstep = (value: number) => value * value * (3 - 2 * value);

const PageLoader = ({ ready, onReveal, onComplete }: PageLoaderProps) => {
  const filterId = `loader-blur-${useId().replace(/:/g, ``)}`;
  const readyRef = useRef(ready);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const [phase, setPhase] = useState(`waiting`);

  useEffect(() => { readyRef.current = ready; }, [ready]);

  useEffect(() => {
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const timers: number[] = [];
    const startedAt = performance.now();
    let lastTime = startedAt;
    let finishStartedAt: number | null = null;
    let frame = 0;
    let value = 0;
    let blur = 0;
    let finishFrom = 0;
    let lastNumber = -1;
    let stopped = false;

    const stop = () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
    const skip = () => {
      if (!preference.matches) return;
      stop();
      onReveal();
      onComplete();
    };
    const update = (nextValue: number, now: number) => {
      const velocity = Math.abs(nextValue - value) / Math.max(1, now - lastTime) * 1000;
      blur += (Math.min(loaderConfig.maxBlur, velocity * .035) - blur) * .3;
      blurRef.current?.setAttribute(`stdDeviation`, `0 ${nextValue === 100 ? 0 : blur.toFixed(2)}`);
      loaderRef.current?.style.setProperty(`--loader-progress`, `${nextValue / 100}`);
      const rounded = Math.floor(nextValue);
      if (rounded !== lastNumber) {
        if (counterRef.current) counterRef.current.textContent = `${rounded}`.padStart(2, `0`);
        progressRef.current?.setAttribute(`aria-valuenow`, `${rounded}`);
        lastNumber = rounded;
      }
      lastTime = now;
      value = nextValue;
    };
    const tick = (now: number) => {
      if (stopped) return;
      const elapsed = now - startedAt;
      if (finishStartedAt === null && elapsed >= loaderConfig.progressMs && (readyRef.current || elapsed >= loaderConfig.readyTimeoutMs)) {
        finishFrom = value;
        finishStartedAt = now;
      }
      const finishing = finishStartedAt !== null;
      const fraction = finishStartedAt === null ? Math.min(1, elapsed / loaderConfig.progressMs) : Math.min(1, (now - finishStartedAt) / loaderConfig.finishMs);
      const nextValue = finishing
        ? finishFrom + (100 - finishFrom) * smoothstep(fraction)
        : 90 * smoothstep(fraction) + 4 * (1 - Math.exp(-Math.max(0, elapsed - loaderConfig.progressMs) / 700));
      update(Math.max(value, nextValue), now);

      if (finishing && fraction === 1) {
        update(100, now);
        setPhase(`complete`);
        timers.push(window.setTimeout(() => {
          setPhase(`leaving`);
          const stagger = loaderConfig.staggerMs * (loaderConfig.bars - 1);
          timers.push(window.setTimeout(onReveal, stagger));
          timers.push(window.setTimeout(onComplete, loaderConfig.barExitMs + stagger));
        }, loaderConfig.holdMs));
      } else frame = window.requestAnimationFrame(tick);
    };

    preference.addEventListener(`change`, skip);
    if (preference.matches) skip();
    else frame = window.requestAnimationFrame(tick);
    return () => {
      stop();
      preference.removeEventListener(`change`, skip);
    };
  }, [onReveal, onComplete]);

  const style: LoaderStyle = {
    [`--loader-progress`]: 0,
    [`--loader-bars`]: loaderConfig.bars,
    [`--loader-red`]: loaderConfig.colors.red,
    [`--loader-ink`]: loaderConfig.colors.ink,
    [`--loader-green`]: loaderConfig.colors.green,
    [`--loader-skew`]: `${loaderConfig.skew}deg`,
    [`--loader-spectrum-gain`]: loaderConfig.spectrumGain,
    [`--loader-spectrum-speed`]: loaderConfig.spectrumSpeed,
    [`--loader-exit-duration`]: `${loaderConfig.barExitMs}ms`,
  };

  return <div ref={loaderRef} style={style} className={`page-loader page-loader--${phase}`}>
    <svg className={`page-loader__filter`} aria-hidden={`true`}><defs><filter id={filterId} x={`-20%`} y={`-40%`} width={`140%`} height={`180%`} colorInterpolationFilters={`sRGB`}><feGaussianBlur ref={blurRef} stdDeviation={`0 0`} /></filter></defs></svg>
    <div className={`page-loader__blinds`} aria-hidden={`true`}>{blinds.map((index) => (
      <div className={`page-loader__blind`} key={index} style={{
        [`--blind-delay`]: `${(loaderConfig.bars - index - 1) * loaderConfig.staggerMs}ms`,
        [`--signal-delay`]: `${index * -173}ms`,
        [`--signal-height`]: `${20 + Math.sin(index * 1.9) ** 2 * 65}%`,
      } as LoaderStyle}><span /></div>
    ))}</div>
    <div className={`page-loader__content`}>
      <header className={`page-loader__header`} aria-hidden={`true`}>
        <div className={`page-loader__brand`}><OrbitBrandMark size={44} /><span>{`KALASHI`}<small>{`MUSIC / WORLDWIDE`}</small></span></div>
        <span className={`page-loader__location`}>{`BANGLADESH → ATLANTA`}</span>
      </header>
      <div className={`page-loader__center`}>
        <div className={`page-loader__eyebrow`} aria-hidden={`true`}><span><i />{`FIND YOUR FREQUENCY`}</span><span>{`K / 001`}</span></div>
        <div className={`page-loader__readout`} aria-hidden={`true`}>
          <div className={`page-loader__counter`}><span ref={counterRef} style={{ filter: `url(#${filterId})` }}>{`00`}</span><span className={`page-loader__percent`}>{`%`}</span></div>
          <div className={`page-loader__caption`}><span>{`TWO WORLDS.`}</span><span>{`ONE SIGNAL.`}</span></div>
        </div>
        <LoaderSpectrum barCount={loaderConfig.spectrumBars} />
        <div ref={progressRef} className={`page-loader__progress`} role={`progressbar`} aria-label={`Preparing Kalashi Music`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span /></div>
        <div className={`page-loader__metadata`} aria-hidden={`true`}><span>{phase === `waiting` ? `TUNING IN` : `YOU’RE IN`}</span><span>{`AMBIENT SIGNAL`}<i /></span></div>
      </div>
      <footer className={`page-loader__footer`} aria-hidden={`true`}><span>{`NO BORDERS. JUST FREQUENCIES.`}</span><span>{`KALASHI MUSIC`}</span></footer>
    </div>
  </div>;
};

export default PageLoader;
