import './AppFrame.css';
import { BrandMark } from '../Icons.web';
import { PageIntroContext } from './PageIntroContext';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';

const introTiming = { hold: 220, exit: 320, maxWait: 1200 };

const AppFrame = ({ ready, children }: PropsWithChildren<{ ready: boolean }>) => {
  const startedAt = useRef<number | null>(null);
  const [phase, setPhase] = useState(`waiting`);

  useEffect(() => {
    if (phase !== `waiting`) return;
    startedAt.current ??= performance.now();
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const elapsed = performance.now() - startedAt.current;
    const delay = preference.matches ? 0 : Math.max(0, (ready ? introTiming.hold : introTiming.maxWait) - elapsed);
    const timer = window.setTimeout(() => setPhase(`leaving`), delay);
    const reduceMotion = () => { if (preference.matches) setPhase(`leaving`); };
    preference.addEventListener(`change`, reduceMotion);
    return () => {
      window.clearTimeout(timer);
      preference.removeEventListener(`change`, reduceMotion);
    };
  }, [ready, phase]);

  useEffect(() => {
    if (phase !== `leaving`) return;
    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    const timer = window.setTimeout(() => setPhase(`done`), reducedMotion ? 0 : introTiming.exit);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return <PageIntroContext.Provider value={phase !== `waiting`}><div className={`web-app-frame`}>
    {children}
    {phase !== `done` ? <div className={`page-loader page-loader--${phase}`} role={`status`} aria-label={`Loading Kalashi Music`}>
      <div className={`page-loader__brand`} aria-hidden={`true`}><BrandMark size={56} /><span>{`KALASHI`}</span><small>{`MUSIC / ATLANTA`}</small><div className={`page-loader__line`} /></div>
    </div> : null}
  </div></PageIntroContext.Provider>;
};

export default AppFrame;
