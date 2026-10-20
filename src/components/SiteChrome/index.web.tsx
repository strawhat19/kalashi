import '../../features/landing/LandingScreen.css';
import './styles.css';
import { Link, usePathname } from 'expo-router';
import { useEffect, useState, type PropsWithChildren } from 'react';
import ScrollToTop from './ScrollToTop.web';
import { ArrowIcon } from '../Icons.web';
import SiteHeader from '../../features/landing/SiteHeader.web';
import MiniVisualizer from '../visualizer/MiniVisualizer.web';
import { footerNavigation, isAccountPath } from '../../shared/site/routes';
import { SiteAudioProvider, useSiteAudio } from '../../shared/site/SiteAudioContext';

const InnerChrome = ({ ready, children }: PropsWithChildren<{ ready: boolean }>) => {
  const pathname = usePathname();
  const { visualizerState } = useSiteAudio();
  const [motionAllowed, setMotionAllowed] = useState(false);
  const headerState = { ...visualizerState, active: visualizerState.active && motionAllowed };

  useEffect(() => {
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const updateMotion = () => setMotionAllowed(!preference.matches);
    updateMotion();
    preference.addEventListener(`change`, updateMotion);
    return () => preference.removeEventListener(`change`, updateMotion);
  }, []);

  return <div id={`site-page-shell`} className={`kalashi-site kalashi-inner-site${isAccountPath(pathname) ? ` kalashi-account-site` : ``}`}>
    <a href={`#site-page-content`} className={`skip-link`} id={`site-skip-link`}>{`Skip to content`}</a>
    <SiteHeader key={pathname} ready={ready} visualizerState={headerState} />
    <main id={`site-page-content`} className={`site-page-content`} tabIndex={-1}>{children}</main>
    <footer id={`shared-site-footer`} className={`shared-site-footer`}>
      <div id={`shared-footer-top`} className={`shared-site-footer__top`}>
        <Link href={`/`} id={`shared-footer-brand`} className={`brand shared-site-footer__brand`} aria-label={`Kalashi Music home`}>
          <MiniVisualizer ready={ready} state={headerState} />
          <span>{`KALASHI`}<small>{`NO BORDERS. JUST FREQUENCIES.`}</small></span>
        </Link>
        <nav id={`shared-footer-navigation`} className={`shared-site-footer__navigation`} aria-label={`Footer navigation`}>
          {footerNavigation.map((item) => <Link key={item.id} href={item.href} id={`shared-footer-link-${item.id}`} className={`shared-site-footer__link`}>{item.label}<ArrowIcon size={12} /></Link>)}
        </nav>
      </div>
      <div id={`shared-footer-bottom`} className={`shared-site-footer__bottom`}>
        <span id={`shared-footer-copyright`}>{`© ${new Date().getFullYear()} KALASHI MUSIC`}</span>
        <span id={`shared-footer-location`}>{`BANGLADESH → ATLANTA`}</span>
        <a id={`shared-footer-piratechs`} className={`shared-site-footer__credit`} href={`https://piratechs.com/`} target={`_blank`} rel={`noopener noreferrer`}>{`Made with Piratechs`}<ArrowIcon size={12} /></a>
      </div>
    </footer>
    <ScrollToTop pathname={pathname} />
  </div>;
};

const SiteChrome = ({ ready, children }: PropsWithChildren<{ ready: boolean }>) => {
  const pathname = usePathname();
  if (pathname === `/`) return <>{children}<ScrollToTop pathname={pathname} /></>;
  return <SiteAudioProvider><InnerChrome ready={ready}>{children}</InnerChrome></SiteAudioProvider>;
};

export default SiteChrome;
