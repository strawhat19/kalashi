import './AppFrame.css';
import { usePathname } from 'expo-router';
import PageLoader from './PageLoader.web';
import { PageIntroContext } from './PageIntroContext';
import { useState, useCallback, useLayoutEffect, type PropsWithChildren } from 'react';

let lastPagePath: string | undefined;

const AppFrame = ({ ready, children }: PropsWithChildren<{ ready: boolean }>) => {
  const pathname = usePathname();
  const [revealed, setRevealed] = useState(() => lastPagePath === pathname);
  const [complete, setComplete] = useState(() => lastPagePath === pathname);
  const reveal = useCallback(() => setRevealed(true), []);
  const finish = useCallback(() => setComplete(true), []);

  useLayoutEffect(() => {
    if (lastPagePath === pathname) return;
    lastPagePath = pathname;
    setRevealed(false);
    setComplete(false);
  }, [pathname]);

  return <PageIntroContext.Provider value={revealed}><div className={`web-app-frame`}>
    {children}
    {!complete ? <PageLoader key={pathname} ready={ready} onReveal={reveal} onComplete={finish} /> : null}
  </div></PageIntroContext.Provider>;
};

export default AppFrame;
