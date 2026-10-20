import './SiteHeader.css';
import { Link, usePathname } from 'expo-router';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowIcon, SpotifyIcon } from '../../components/Icons.web';
import MiniVisualizer from '../../components/visualizer/MiniVisualizer.web';
import AudioBorder from '../../components/visualizer/AudioBorder.web';
import AudioMarquee from '../../components/visualizer/AudioMarquee.web';
import type { AudioVisualizerState } from '../../components/visualizer/audio.types';
import { artist } from '../../config/artist';
import { headerConfig } from '../../config/header';
import NavigationIcon from '../../components/SiteChrome/NavigationIcon.web';
import { siteNavigation } from '../../shared/site/routes';
import AccountMenu from '../../components/AccountMenu';
import { useAuth } from '../../shared/account/AuthContext';

type SiteHeaderProps = {
  ready: boolean;
  visualizerState: AudioVisualizerState;
  sticky?: boolean;
};

const renderMenuLabel = (text: string, id: string, index: number) => (
  <span
    aria-hidden={`true`}
    id={`${id}-label`}
    className={`menu-label`}
    style={{
      [`--menu-item-index`]: index,
      [`--menu-exit-index`]: siteNavigation.length - index - 1,
      [`--menu-character-count`]: Array.from(text).length,
    } as CSSProperties}
  >
    {Array.from(text).map((character, characterIndex) => (
      <span
        key={characterIndex}
        className={`menu-label__character`}
        id={`${id}-character-${characterIndex}`}
        style={{ [`--menu-character-index`]: characterIndex } as CSSProperties}
      >
        {character === ` ` ? `\u00a0` : character}
      </span>
    ))}
  </span>
);

const SiteHeader = ({ ready, visualizerState, sticky = headerConfig.sticky }: SiteHeaderProps) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigationItems = siteNavigation.map((item) => item.id === `account` && user ? { ...item, href: `/profile` as const, label: `Profile` } : item);

  useEffect(() => {
    const breakpoint = window.matchMedia(`(max-width: 1100px)`);
    const updateBreakpoint = () => {
      setMobileMenu(breakpoint.matches);
      if (!breakpoint.matches) setMenuPath(null);
    };
    updateBreakpoint();
    breakpoint.addEventListener(`change`, updateBreakpoint);
    return () => breakpoint.removeEventListener(`change`, updateBreakpoint);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener(`scroll`, onScroll, { passive: true });
    return () => window.removeEventListener(`scroll`, onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen || !mobileMenu) return;
    menuRef.current?.querySelector<HTMLAnchorElement>(`a[href]`)?.focus({ preventScroll: true });

    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === `Escape`) {
        event.preventDefault();
        setMenuPath(null);
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuPath(null);
    };
    document.addEventListener(`keydown`, closeMenu);
    document.addEventListener(`pointerdown`, closeOutside);
    return () => {
      document.removeEventListener(`keydown`, closeMenu);
      document.removeEventListener(`pointerdown`, closeOutside);
    };
  }, [menuOpen, mobileMenu]);

  useEffect(() => {
    const root = document.documentElement;
    const header = headerRef.current;
    if (!sticky || !header) {
      root.style.removeProperty(`--site-header-offset`);
      return;
    }

    const strip = header.querySelector<HTMLElement>(`.site-header__audio-marquee`);
    const updateOffset = () => {
      const height = header.getBoundingClientRect().height + (strip?.getBoundingClientRect().height ?? 0);
      root.style.setProperty(`--site-header-offset`, `${Math.ceil(height)}px`);
      const brand = brandRef.current;
      if (brand) root.style.setProperty(`--site-brand-extent`, `${Math.ceil(brand.getBoundingClientRect().right - header.getBoundingClientRect().left)}px`);
    };
    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(header);
    if (strip) observer.observe(strip);
    if (brandRef.current) observer.observe(brandRef.current);
    return () => {
      observer.disconnect();
      root.style.removeProperty(`--site-header-offset`);
      root.style.removeProperty(`--site-brand-extent`);
    };
  }, [sticky]);

  return <header id={`site-header`} ref={headerRef} className={`site-header${sticky ? ` site-header--sticky` : ``}${scrolled ? ` site-header--scrolled` : ``}${user ? ` site-header--signed-in` : ``}`}>
    <Link href={`/`} asChild>
    <a ref={brandRef} id={`header-brand-link`} className={`brand`} aria-label={`Kalashi Music home`} onClick={(event) => {
      setMenuPath(null);
      if (pathname !== `/`) return;
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `instant` : `smooth` });
    }}>
      <MiniVisualizer state={visualizerState} ready={ready} />
      <span>{`KALASHI`}<small>{`MUSIC / WORLDWIDE`}</small></span>
    </a>
    </Link>
    <nav
      ref={menuRef}
      id={`main-navigation`}
      inert={mobileMenu && !menuOpen}
      aria-label={`Main navigation`}
      aria-hidden={mobileMenu && !menuOpen ? true : undefined}
      className={menuOpen ? `main-nav is-open` : `main-nav`}
    >
      {navigationItems.map((item, index) => <Link
        key={item.id}
        href={item.href}
        aria-label={item.label}
        id={`header-${item.id}-link`}
        className={`header-nav-link header-${item.id}-link`}
        aria-current={pathname === item.href || (item.id === `blog` && pathname.startsWith(`/blog/`)) ? `page` : undefined}
        onPress={() => setMenuPath(null)}
      >
        <NavigationIcon name={item.icon} />
        {renderMenuLabel(item.label, `header-${item.id}-link`, index)}
        {item.id === `sound` ? <span aria-hidden={`true`} className={`nav-plus`}>{`+`}</span> : null}
      </Link>)}
      {user ? <a id={`header-mobile-spotify-link`} className={`header-nav-link header-mobile-spotify`} href={artist.spotifyUrl} aria-label={`Kalashi on Spotify`} target={`_blank`} rel={`noopener noreferrer`} onClick={() => setMenuPath(null)}><SpotifyIcon size={18} />{renderMenuLabel(`Spotify`, `header-mobile-spotify-link`, navigationItems.length - 1)}</a> : null}
    </nav>
    <AudioBorder className={`header-spotify-border`} state={visualizerState} ready={ready} amplitude={5}>
      <a className={`header-spotify`} href={artist.spotifyUrl} aria-label={`Kalashi on Spotify`} target={`_blank`} rel={`noopener noreferrer`} onClick={() => setMenuPath(null)}><SpotifyIcon size={19} /><span>{`Spotify`}</span><ArrowIcon size={14} /></a>
    </AudioBorder>
    <div id={`header-account-control`} className={`header-account-control`} onPointerDown={() => setMenuPath(null)}><AccountMenu key={user?.id ?? `guest`} /></div>
    <button
      type={`button`}
      ref={toggleRef}
      id={`mobile-menu-toggle`}
      className={`menu-toggle`}
      aria-expanded={menuOpen}
      aria-controls={`main-navigation`}
      aria-label={menuOpen ? `Close navigation` : `Open navigation`}
      onClick={() => setMenuPath((openPath) => openPath === pathname ? null : pathname)}
    >
      <span id={`mobile-menu-icon`} aria-hidden={`true`} className={`menu-toggle__icon`}>
        <span id={`mobile-menu-line-top`} className={`menu-toggle__line menu-toggle__line--top`} />
        <span id={`mobile-menu-line-middle`} className={`menu-toggle__line menu-toggle__line--middle`} />
        <span id={`mobile-menu-line-bottom`} className={`menu-toggle__line menu-toggle__line--bottom`} />
      </span>
    </button>
    <AudioMarquee className={`site-header__audio-marquee`} state={visualizerState} ready={ready} />
  </header>;
};

export default SiteHeader;
