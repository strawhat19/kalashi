import { Link } from 'expo-router';
import { infoContent } from '../content';
import { artist, releases } from '../../../../config/artist';
import SplitText from '../../../../components/motion/SplitText.web';
import { ArrowIcon, SpotifyIcon } from '../../../../components/Icons.web';

const About = ({ ready }: { ready: boolean }) => <>
  <section id={`about-hero`} className={`origin-hero`} data-page-hero aria-labelledby={`about-title`}>
    <div id={`about-register`} className={`origin-register`}><span>{`KALASHI / ARTIST DOSSIER`}</span><span>{`BD → ATL`}</span></div>
    <div id={`about-title-wrap`} className={`origin-title-wrap`}>
      <p id={`about-eyebrow`} className={`info-page__kicker`}>{`THE ORIGIN / THE SOUND / THE WORLD`}</p>
      <h1 id={`about-title`} className={`origin-title`}><SplitText ready={ready} text={`TWO WORLDS.`} /><span><SplitText ready={ready} delay={120} text={`ONE SOUND.`} /></span></h1>
    </div>
    <div id={`about-hero-editorial`} className={`origin-editorial`}>
      <div id={`about-route`} className={`origin-route`} aria-label={`Born in Bangladesh. Based in Atlanta.`}>
        <span className={`origin-route__label`}>{`THE ROOTS`}</span><strong>{`BD`}</strong><span className={`origin-route__line`} aria-hidden={`true`}>{`↘`}</span><strong>{`ATL`}</strong><span className={`origin-route__label`}>{`THE FREQUENCY`}</span>
      </div>
      <figure id={`about-artist-portrait`} className={`origin-portrait`}>
        <img id={`about-artist-image`} src={`/media/music/portrait.jpg`} alt={`Kalashi standing in a concrete doorway, holding a baseball cap`} width={720} height={900} />
        <figcaption id={`about-artist-caption`}><span>{`BANGLADESH-BORN`}</span><span>{`ATLANTA-BASED`}</span></figcaption>
        <span className={`origin-portrait__mark`} aria-hidden={`true`}>{`K.`}</span>
      </figure>
      <div id={`about-opening-note`} className={`origin-note`}><span className={`info-page__kicker`}>{`A NOTE ON THE ARTIST`}</span><p>{infoContent.about.description}</p><a id={`about-spotify-link`} href={artist.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`} className={`info-page__text-link`}><SpotifyIcon size={19} />{`Step Into The Sound`}<ArrowIcon size={18} /></a></div>
    </div>
  </section>
  <section id={`about-story`} className={`origin-story`} aria-label={`The Kalashi story`}>
    {infoContent.about.sections.map((section, index) => <article id={`about-section-${index}`} key={section.title} className={`origin-story__chapter`}>
      <span id={`about-section-number-${index}`} className={`origin-story__number`}>{`0${index + 1}`}</span>
      <div><h2 id={`about-section-title-${index}`}><SplitText text={section.title} /></h2>{section.paragraphs.map((paragraph, paragraphIndex) => <p id={`about-section-${index}-paragraph-${paragraphIndex}`} key={paragraphIndex}>{paragraph}</p>)}</div>
    </article>)}
  </section>
  <section id={`about-featured-music`} className={`origin-records`} aria-labelledby={`about-catalog-title`}>
    <div id={`about-catalog-heading`} className={`origin-records__heading`}><div><p className={`info-page__kicker`}>{`THE RECORDS / A PLACE TO BEGIN`}</p><h2 id={`about-catalog-title`}>{`HEAR THE STORY.`}</h2></div><Link id={`about-explore-link`} href={`/music`} className={`info-page__text-link`}>{`Explore The Music`}<ArrowIcon size={20} /></Link></div>
    <div id={`about-release-grid`} className={`origin-records__grid`}>
      {releases.map((release, index) => <a id={`about-release-${index}`} key={release.spotifyUrl} href={release.spotifyUrl} target={`_blank`} rel={`noopener noreferrer`} className={`origin-record`} aria-label={`Listen to ${release.title} on Spotify`}>
        <div className={`origin-record__image`}><img id={`about-release-image-${index}`} src={release.webArtwork} width={640} height={640} loading={`lazy`} alt={`${release.title} cover`} /><span aria-hidden={`true`}>{`0${index + 1}`}</span></div>
        <span id={`about-release-type-${index}`} className={`info-page__kicker`}>{`${release.type.toUpperCase()} / ${release.year}`}</span><strong id={`about-release-title-${index}`}>{release.title}<ArrowIcon size={22} /></strong>
      </a>)}
    </div>
  </section>
</>;

export default About;
