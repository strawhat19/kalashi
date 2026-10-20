import './styles.css';
import './art-direction.css';
import Head from 'expo-router/head';
import { Link } from 'expo-router';
import { useContext, useRef, useState } from 'react';
import ReleaseHighlights from '../ReleaseHighlights';
import PopularTracks from '../../../components/PopularTracks';
import { artist, releases, latestRelease, recentReleases } from '../../../config/artist';
import { scrollToAnchor } from '../../../components/motion/scrollToAnchor.web';
import SplitText from '../../../components/motion/SplitText.web';
import { PageIntroContext } from '../../../components/motion/PageIntroContext';
import { ArrowIcon, PlayIcon, SpotifyIcon } from '../../../components/Icons.web';

const Music = () => {
  const ready = useContext(PageIntroContext);
  const player = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState(`All`);
  const [selected, setSelected] = useState<number | null>(null);
  const release = selected === null ? null : releases[selected];
  const playerUrl = release ? `${release.spotifyUrl.replace(`/album/`, `/embed/album/`)}?theme=0` : artist.spotifyEmbed;
  const catalog = releases.map((item, index) => ({ item, index })).filter(({ item }) => filter === `All` || item.type === filter);
  const selectRelease = (index: number) => {
    setSelected(index);
    player.current?.scrollIntoView({ block: `center`, behavior: window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `instant` : `smooth` });
  };

  return <div id={`music-page`} className={`catalog-page`} onClick={scrollToAnchor}>
    <Head><title>{`The Music | Kalashi Music`}</title><meta name={`description`} content={`Listen to ${latestRelease.title}, Kalashi’s latest single, and explore Autobahn, popular tracks, and more from his catalog.`} /></Head>
    <header id={`music-page-hero`} className={`catalog-hero`} data-page-hero>
      <div id={`music-hero-copy`} className={`catalog-hero__copy`}>
        <p id={`music-page-eyebrow`} className={`catalog-eyebrow`}>{`KALASHI RECORDS / NO BORDERS`}</p>
        <h1 id={`music-page-title`}><SplitText ready={ready} text={`NO SKIPS.`} /><span><SplitText ready={ready} delay={100} text={`JUST FEELING.`} /></span></h1>
        <p id={`music-page-intro`} className={`catalog-hero__description`}>{`Fresh pressings. Heavy rotation. A few records you might want to keep close.`}</p>
        <div id={`music-hero-links`} className={`catalog-hero__links`}><a id={`music-dig-link`} className={`catalog-button`} href={`#music-latest-releases`}>{`Dig into the records`}<ArrowIcon size={18} /></a><a id={`music-artist-spotify`} className={`catalog-link`} href={artist.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`}><SpotifyIcon size={18} />{`Spotify`}<ArrowIcon size={14} /></a></div>
        <div id={`music-hero-edition`} className={`catalog-edition`}><span>{`BD → ATL`}</span><span>{`INDEPENDENT SOUND`}</span><span>{`VOL. 01`}</span></div>
      </div>
      <div id={`music-record-object`} className={`catalog-record-object`}>
        <div className={`catalog-record-object__grid`} aria-hidden={`true`} />
        <div id={`music-vinyl-disc`} className={`catalog-vinyl`} aria-hidden={`true`}><img src={latestRelease.webArtwork} alt={``} width={160} height={160} /><span /></div>
        <a id={`music-featured-sleeve`} className={`catalog-featured-sleeve`} href={latestRelease.listeningUrl} target={`_blank`} rel={`noopener noreferrer`} aria-label={`Listen to ${latestRelease.title} on ${latestRelease.provider}`}><img id={`music-featured-cover`} src={latestRelease.webArtwork} width={640} height={640} alt={`${latestRelease.title} cover artwork`} fetchPriority={`high`} /><span className={`catalog-featured-sticker`}>{`NEW\nDROP`}</span><span className={`catalog-featured-sleeve__footer`}>{latestRelease.title}<ArrowIcon size={19} /></span></a>
        <span className={`catalog-record-object__serial`} aria-hidden={`true`}>{`K / ${latestRelease.releaseDate.replaceAll(`-`, `.`)}`}</span>
        <span id={`music-record-caption`} className={`catalog-record-object__caption`}>{`THE LATEST SINGLE`}<strong>{latestRelease.title}</strong><span>{latestRelease.releaseLabel}</span></span>
      </div>
    </header>
    <nav id={`music-index-strip`} className={`catalog-index-strip`} aria-label={`Explore the records`}>
      {[{ id: `music-latest-releases`, label: `NEW FREQUENCIES` }, { id: `music-popular-tracks`, label: `HEAVY ROTATION` }, { id: `music-catalog`, label: `THE RECORD CRATE` }].map((item, index) => <a key={item.id} id={`music-index-link-${index}`} href={`#${item.id}`}><span>{`0${index + 1}`}</span>{item.label}<span>{`↘`}</span></a>)}
    </nav>
    <ReleaseHighlights id={`music-latest-releases`} />
    <div id={`music-rotation-room`} className={`catalog-rotation-room`}><aside id={`music-rotation-art`} className={`catalog-rotation-art`}><p className={`catalog-eyebrow`}>{`SOME THINGS DESERVE ANOTHER PLAY.`}</p><h2>{`RUN IT`}<br /><span>{`BACK.`}</span></h2><div className={`catalog-rotation-art__sleeves`} aria-hidden={`true`}>{recentReleases.map(item => <img key={item.id} id={`music-rotation-cover-${item.id}`} src={item.webArtwork} width={240} height={240} loading={`lazy`} alt={``} />)}</div><p className={`catalog-rotation-art__note`}>{`The tracks finding their way back into the queue.`}</p></aside><PopularTracks id={`music-popular-tracks`} /></div>
    <section id={`music-catalog`} className={`catalog-releases`} aria-labelledby={`music-catalog-heading`}>
      <div id={`music-catalog-heading-row`} className={`catalog-section-heading`}><div><p className={`catalog-eyebrow`}>{`03 / PULL SOMETHING OUT`}</p><h2 id={`music-catalog-heading`}>{`THE RECORD CRATE.`}</h2></div><div id={`music-catalog-filters`} className={`catalog-filters`} role={`group`} aria-label={`Filter releases`}>{[`All`, `Single`, `Album`].map(value => <button key={value} id={`music-filter-${value.toLowerCase()}`} type={`button`} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === `All` ? `All records` : `${value}s`}<span aria-hidden={`true`}>{filter === value ? `↗` : `+`}</span></button>)}</div></div>
      <p id={`music-filter-result`} className={`catalog-result`} role={`status`}>{`${catalog.length.toString().padStart(2, `0`)} record${catalog.length === 1 ? `` : `s`} in this crate`}</p>
      <div id={`music-release-grid`} className={`catalog-grid`}>
        {catalog.map(({ item, index }) => <article key={item.spotifyUrl} id={`music-release-${index}`} className={`catalog-release${selected === index ? ` is-selected` : ``}`}>
          <a id={`music-artwork-link-${index}`} className={`catalog-artwork`} href={item.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`} aria-label={`Listen to ${item.title} on Spotify`}><img id={`music-artwork-${index}`} src={item.webArtwork} width={640} height={640} loading={`lazy`} alt={`${item.title} cover artwork`} /><span className={`catalog-release-number`} aria-hidden={`true`}>{`0${index + 1}`}</span><span className={`catalog-artwork-play`} aria-hidden={`true`}><PlayIcon size={24} /></span></a>
          <div id={`music-release-meta-${index}`} className={`catalog-release-meta`}><div><p>{`${item.type.toUpperCase()} / ${item.year}`}</p><h3 id={`music-release-title-${index}`}>{item.title}</h3></div><button type={`button`} id={`music-preview-${index}`} className={`catalog-preview`} aria-pressed={selected === index} onClick={() => selectRelease(index)}><PlayIcon size={15} /><span>{selected === index ? `Selected` : `Listen`}</span></button></div>
        </article>)}
      </div>
    </section>
    <section id={`music-listen`} ref={player} className={`catalog-listen`} aria-labelledby={`music-player-title`}>
      <p className={`catalog-eyebrow`}>{`SIDE B / STAY A WHILE`}</p>
      <div className={`catalog-section-heading`}><h2 id={`music-player-title`}>{release ? release.title.toUpperCase() : `THE LISTENING ROOM.`}</h2><SpotifyIcon size={28} /></div>
      <iframe id={`music-spotify-player`} key={playerUrl} src={playerUrl} title={`Spotify player — ${release?.title ?? artist.name}`} width={`100%`} height={352} loading={`lazy`} allow={`autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture`} />
      <p id={`music-player-note`} className={`catalog-note`}>{`Spotify provides playback and may ask you to sign in. If the player cannot load, open the release on Spotify above.`}</p>
    </section>
    <aside id={`music-sound-lab-link`} className={`catalog-next`}><div><p className={`catalog-eyebrow`}>{`A DIFFERENT WAY TO LISTEN`}</p><h2>{`TAKE IT`}<span>{`FOR A SPIN.`}</span></h2></div><Link href={`/sound-lab`} id={`music-open-sound-lab`} className={`catalog-next__link`} aria-label={`Explore Sound Lab`}><ArrowIcon size={45} /><span>{`ENTER SOUND LAB`}</span></Link></aside>
  </div>;
};

export default Music;
