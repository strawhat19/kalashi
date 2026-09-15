import './LandingScreen.css';
import Head from 'expo-router/head';
import { artist, releases } from '../../config/artist';
import { useEffect, useRef, useState, useContext } from 'react';
import SplitText from '../../components/motion/SplitText.web';
import ScrollMarquee from '../../components/motion/ScrollMarquee.web';
import { PageIntroContext } from '../../components/motion/PageIntroContext';
import AudioVisualizer from '../../components/visualizer/AudioVisualizer';
import { scrollToAnchor } from '../../components/motion/scrollToAnchor.web';
import { ArrowIcon, BrandMark, PlayIcon, SpotifyIcon } from '../../components/Icons.web';

const LandingScreen = () => {
  const introReady = useContext(PageIntroContext);
  const player = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [selectedRelease, setSelectedRelease] = useState<number | null>(null);
  const release = selectedRelease === null ? null : releases[selectedRelease];
  const playerUrl = release ? `${release.spotifyUrl.replace(`/album/`, `/embed/album/`)}?theme=0` : artist.spotifyEmbed;

  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => { if (event.key === `Escape`) setMenuOpen(false); };
    document.addEventListener(`keydown`, closeMenu);
    return () => document.removeEventListener(`keydown`, closeMenu);
  }, []);

  const listen = (index: number) => {
    if (index !== selectedRelease) setPlayerLoaded(false);
    setSelectedRelease(index);
    player.current?.scrollIntoView({ block: `center`, behavior: window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `instant` : `smooth` });
  };

  return <div className={`kalashi-site`} onClick={scrollToAnchor}>
    <Head><title>{`KALASHI — A World In My Sound`}</title><meta name={`description`} content={`Kalashi Music. Bangladesh roots. Atlanta energy. Explore the music and find your frequency.`} /></Head>
    <a className={`skip-link`} href={`#main`}>{`Skip to content`}</a>
    <header className={`site-header`}>
      <a href={`#home`} className={`brand`} aria-label={`Kalashi Music home`}><BrandMark /><span>{`KALASHI`}<small>{`MUSIC / WORLDWIDE`}</small></span></a>
      <nav id={`main-navigation`} className={menuOpen ? `main-nav is-open` : `main-nav`} aria-label={`Main navigation`}>
        <a href={`#music`} onClick={() => setMenuOpen(false)}>{`The Music`}</a>
        <a href={`#sound-lab`} onClick={() => setMenuOpen(false)}>{`Sound Lab`}<span className={`nav-plus`}>{`+`}</span></a>
        <a href={`#story`} onClick={() => setMenuOpen(false)}>{`The Story`}</a>
      </nav>
      <a className={`header-spotify`} href={artist.spotifyUrl} aria-label={`Kalashi on Spotify`} target={`_blank`} rel={`noopener noreferrer`}><SpotifyIcon size={19} /><span>{`Spotify`}</span><ArrowIcon size={14} /></a>
      <button className={`menu-toggle`} aria-label={menuOpen ? `Close navigation` : `Open navigation`} aria-expanded={menuOpen} aria-controls={`main-navigation`} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? `Close −` : `Menu +`}</button>
    </header>

    <main id={`main`}>
      <section id={`home`} className={`hero`} aria-labelledby={`hero-title`}>
        <div className={`hero-index`}><span><i className={`red-square`} />{`TWO WORLDS. UNFILTERED SOUND.`}</span><span>{`BANGLADESH → ATLANTA → EVERYWHERE`}</span></div>
        <h1 id={`hero-title`} className={`hero-wordmark`}><ScrollMarquee text={`KALASHI MUSIC`} speed={72} ready={introReady} /></h1>
        <div className={`hero-scene`}>
          <div className={`portrait-stage`}>
            <img className={`hero-portrait`} src={`/media/music/portrait.jpg`} width={640} height={640} alt={`Kalashi standing in a concrete doorway, holding a baseball cap`} fetchPriority={`high`} />
            <div className={`portrait-shade`} />
            <span className={`photo-register`}>{`K / 01`}<span>{`ATLANTA, GA`}</span></span>
            <span className={`portrait-caption`}>{`ROOTED IN TWO WORLDS.`}<br />{`HEARD IN YOURS.`}</span>
          </div>
          <div className={`hero-copy`}>
            <div className={`eyebrow`}><span className={`line`} />{`THIS IS MY FREQUENCY`}</div>
            <h2><SplitText text={`A WORLD`} ready={introReady} delay={80} /><br /><SplitText text={`IN MY `} ready={introReady} delay={150} /><span className={`accent-text`}><SplitText text={`SOUND.`} ready={introReady} delay={240} /></span></h2>
            <p>{`Bangladesh roots. Atlanta energy.`}<br />{`No boxes. No borders. Just Kalashi.`}</p>
            <a className={`button button-green`} href={artist.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`}><SpotifyIcon />{`Listen on Spotify`}<ArrowIcon size={18} /></a>
            <a className={`explore-link`} href={`#music`}>{`Explore the music`}<span>{`↓`}</span></a>
          </div>
          <button className={`featured-release`} onClick={() => listen(0)} aria-label={`Listen to Come Thru in the Spotify player`}>
            <img src={releases[0].webArtwork} width={74} height={74} alt={`Come Thru single artwork`} />
            <span className={`featured-copy`}><span className={`micro-label`}><i />{`LATEST FREQUENCY`}</span><strong>{`Come Thru`}</strong><small>{`KALASHI · SINGLE · 2026`}</small></span>
            <span className={`featured-play`}><PlayIcon size={24} /></span>
          </button>
        </div>
        <div className={`hero-bottom`}><span>{`BORN IN BANGLADESH`}</span><span className={`hero-bottom-center`}>{`BASED IN ATLANTA. BUILT DIFFERENT.`}</span><a href={`#music`}>{`SCROLL TO FEEL SOMETHING`}<span>{`↓`}</span></a></div>
      </section>

      <div className={`frequency-strip`}><ScrollMarquee reverse text={`NO BORDERS. JUST FREQUENCIES.`} speed={52} ready={introReady} /></div>

      <section id={`music`} className={`music-section section-shell`} aria-labelledby={`music-title`}>
        <div className={`section-topline`}><span>{`01 / THE MUSIC`}</span><span>{`PRESS PLAY. STAY A WHILE.`}</span></div>
        <div className={`section-heading`}><h2 id={`music-title`}><SplitText text={`STRAIGHT FROM`} /><br /><span className={`muted-text`}><SplitText text={`MY WORLD.`} delay={100} /></span></h2><a className={`text-link`} href={artist.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`}>{`Full discography`}<ArrowIcon /></a></div>
        <div className={`release-grid`}>{releases.map((item, index) => <article className={`release-card`} key={item.title}>
          <button className={`release-artwork`} aria-label={`Load ${item.title} in the Spotify player`} onClick={() => listen(index)}><img src={item.webArtwork} width={640} height={640} loading={`lazy`} alt={`${item.title} ${item.type.toLowerCase()} cover`} /><span className={`release-number`}>{`0${index + 1}`}</span><span className={`release-play`}><PlayIcon size={25} /></span></button>
          <div className={`release-details`}><div><p>{`${item.type.toUpperCase()} / ${item.year}`}</p><h3><a href={item.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`}>{item.title}</a></h3></div><a className={`release-spotify`} href={item.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`} aria-label={`Open ${item.title} on Spotify`}><ArrowIcon /></a></div>
        </article>)}</div>
        <div id={`listen`} className={`spotify-player`} ref={player}>
          <div className={`player-heading`}><span><SpotifyIcon size={20} />{release ? `ON ROTATION / ${release.title.toUpperCase()}` : `TUNE IN / KALASHI`}</span><a href={release?.spotifyUrl ?? artist.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`}>{`Open Spotify`}<ArrowIcon size={14} /></a></div>
          <div className={`iframe-shell`}>{!playerLoaded ? <p className={`player-loading`} role={`status`}>{`Connecting to Spotify…`}</p> : null}<iframe key={playerUrl} src={playerUrl} width={`100%`} height={352} title={`Spotify player — ${release?.title ?? `Kalashi`}`} loading={`lazy`} allow={`autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture`} onLoad={() => setPlayerLoaded(true)} /></div>
          <p className={`player-note`}>{`Playback is provided by Spotify. If the player is unavailable, open Spotify above.`}</p>
        </div>
      </section>

      <section id={`sound-lab`} className={`sound-section section-shell`} aria-labelledby={`sound-title`}>
        <div className={`section-topline`}><span>{`02 / THE SOUND LAB`}</span><span className={`accent`}>{`MAKE IT MOVE YOUR WAY`}</span></div>
        <div className={`sound-intro`}><h2 id={`sound-title`}><SplitText text={`DON’T JUST LISTEN.`} /><br /><span className={`accent-text`}><SplitText text={`FEEL THE FREQUENCY.`} delay={100} /></span></h2><p>{`A little space to get lost in sound.`}<br />{`Change the shape. Turn up the energy.`}<br />{`Find your own frequency.`}</p></div>
        <AudioVisualizer />
      </section>

      <section id={`story`} className={`story-section section-shell`} aria-labelledby={`story-title`}>
        <div className={`section-topline`}><span>{`03 / THE ROOTS`}</span><span>{`TWO WORLDS. ONE VOICE.`}</span></div>
        <div className={`story-grid`}><div className={`story-coordinate`}><span>{`THE ORIGIN`}</span><div>{`BD`}<span>{`↗`}</span>{`ATL`}</div><p>{`23.6850° N / 90.3563° E`}<br />{`33.7490° N / 84.3880° W`}</p><div className={`flag-marks`}><span className={`bangladesh-mark`} /><span>{`BANGLADESH-BORN`}<br />{`ATLANTA-BASED`}</span></div></div>
          <div className={`story-copy`}><h2 id={`story-title`}><SplitText text={`DIFFERENT ROOTS.`} /><br /><span className={`muted-text`}><SplitText text={`SAME HUNGER.`} delay={100} /></span></h2><p>{`Born in Bangladesh. Making noise in Atlanta. Kalashi brings two worlds into one sound — with the freedom to go wherever the next feeling takes him.`}</p><p>{`Baritone vocals. Sharp wordplay. A little hyperpop in the DNA. Music for the ones who never fit into a single box.`}</p><a className={`text-link`} href={artist.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`}>{`Step into my world`}<ArrowIcon /></a></div></div>
      </section>

      <section className={`closing-section`} aria-labelledby={`closing-title`}><div><span className={`micro-label`}>{`THE NEXT CHAPTER IS ALWAYS LOADING`}</span><h2 id={`closing-title`}><SplitText text={`STAY ON MY`} /><br /><SplitText text={`FREQUENCY.`} delay={100} /></h2></div><a href={artist.spotifyUrl} className={`closing-link`} target={`_blank`} rel={`noopener noreferrer`}><SpotifyIcon size={30} /><span>{`Follow on`}<strong>{`Spotify`}</strong></span><ArrowIcon size={34} /></a></section>
    </main>

    <footer className={`site-footer`}><a className={`brand footer-brand`} href={`#home`} aria-label={`Kalashi Music back to top`}><BrandMark size={27} /><span>{`KALASHI`}</span></a><span>{`© ${new Date().getFullYear()} KALASHI MUSIC`}</span><a href={`#home`}>{`BACK TO THE TOP`}<span>{`↑`}</span></a></footer>
  </div>;
};

export default LandingScreen;
