import './SiteHeader.css';
import { useEffect, useRef, useState } from 'react';
import { ArrowIcon, SpotifyIcon } from '../../components/Icons.web';
import MiniVisualizer from '../../components/visualizer/MiniVisualizer.web';
import AudioBorder from '../../components/visualizer/AudioBorder.web';
import AudioMarquee from '../../components/visualizer/AudioMarquee.web';
import type { AudioVisualizerState } from '../../components/visualizer/audio.types';
import { artist } from '../../config/artist';
import { headerConfig } from '../../config/header';

type SiteHeaderProps = {
  ready: boolean;
  visualizerState: AudioVisualizerState;
  sticky?: boolean;
};

const SiteHeader = ({ ready, visualizerState, sticky = headerConfig.sticky }: SiteHeaderProps) => {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === `Escape`) setMenuOpen(false);
    };
    document.addEventListener(`keydown`, closeMenu);
    return () => document.removeEventListener(`keydown`, closeMenu);
  }, []);

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
    };
    updateOffset();
    const observer = new ResizeObserver(updateOffset);
    observer.observe(header);
    if (strip) observer.observe(strip);
    return () => {
      observer.disconnect();
      root.style.removeProperty(`--site-header-offset`);
    };
  }, [sticky]);

  return <header ref={headerRef} className={`site-header${sticky ? ` site-header--sticky` : ``}`}>
    <a href={`#home`} className={`brand`} aria-label={`Kalashi Music home`}>
      <MiniVisualizer state={visualizerState} ready={ready} />
      <span>{`KALASHI`}<small>{`MUSIC / WORLDWIDE`}</small></span>
    </a>
    <nav id={`main-navigation`} className={menuOpen ? `main-nav is-open` : `main-nav`} aria-label={`Main navigation`}>
      <a href={`#music`} onClick={() => setMenuOpen(false)}>{`The Music`}</a>
      <a href={`#sound-lab`} onClick={() => setMenuOpen(false)}>{`Sound Lab`}<span className={`nav-plus`}>{`+`}</span></a>
      <a href={`#story`} onClick={() => setMenuOpen(false)}>{`The Story`}</a>
    </nav>
    <AudioBorder className={`header-spotify-border`} state={visualizerState} ready={ready} amplitude={5}>
      <a className={`header-spotify`} href={artist.spotifyUrl} aria-label={`Kalashi on Spotify`} target={`_blank`} rel={`noopener noreferrer`}><SpotifyIcon size={19} /><span>{`Spotify`}</span><ArrowIcon size={14} /></a>
    </AudioBorder>
    <button className={`menu-toggle`} aria-label={menuOpen ? `Close navigation` : `Open navigation`} aria-expanded={menuOpen} aria-controls={`main-navigation`} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? `Close −` : `Menu +`}</button>
    <AudioMarquee className={`site-header__audio-marquee`} state={visualizerState} ready={ready} />
  </header>;
};

export default SiteHeader;
