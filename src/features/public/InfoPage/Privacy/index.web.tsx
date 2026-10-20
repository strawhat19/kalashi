import { Link } from 'expo-router';
import { infoContent } from '../content';
import { ArrowIcon } from '../../../../components/Icons.web';
import SplitText from '../../../../components/motion/SplitText.web';

const privacyMap = [
  { id: `saved`, number: `01`, title: `YOUR SAVED SPACE`, label: `PROFILE / LIBRARY / INQUIRIES`, detail: `Browser storage`, section: 0 },
  { id: `audio`, number: `02`, title: `YOUR AUDIO`, label: `FILES / SHARED TAB AUDIO`, detail: `Browser processing`, section: 2 },
  { id: `services`, number: `03`, title: `OTHER SERVICES`, label: `PLAYBACK / HOSTING / ANALYTICS`, detail: `Their own policies`, section: 3 },
];

const Privacy = ({ ready }: { ready: boolean }) => <>
  <header id={`privacy-hero`} className={`privacy-hero`} data-page-hero>
    <div className={`privacy-register`}><p id={`privacy-eyebrow`} className={`info-page__kicker`}>{`A MAP OF YOUR DIGITAL SPACE`}</p><span>{`PRIVACY / KALASHI`}</span></div>
    <div className={`privacy-hero__title`}><h1 id={`privacy-title`}><SplitText ready={ready} text={`YOUR DATA.`} /><span><SplitText ready={ready} delay={120} text={`YOUR SPACE.`} /></span></h1><div className={`privacy-symbol`} aria-hidden={`true`}><span>{`↙`}</span><i /><i /><i /></div></div>
    <p id={`privacy-description`}>{infoContent.privacy.description}</p>
  </header>
  <section id={`privacy-data-map`} className={`privacy-map`} aria-label={`Where information goes`}>
    <div className={`privacy-map__heading`}><span>{`FOLLOW THE INFORMATION`}</span><span aria-hidden={`true`}>{`↓`}</span></div>
    <ol id={`privacy-map-list`} className={`privacy-map__nodes`}>
      {privacyMap.map(item => <li id={`privacy-map-${item.id}`} key={item.id}><a href={`#privacy-section-${item.section}`}><span className={`privacy-map__number`}>{item.number}<ArrowIcon size={16} /></span><span className={`privacy-map__label`}>{item.label}</span><strong>{item.title}</strong><span className={`privacy-map__destination`}><i />{item.detail}</span></a></li>)}
    </ol>
    <p id={`privacy-disclosure-notice`} className={`privacy-retention`}><span>{`KEEP THIS IN MIND`}</span>{infoContent.privacy.notice}</p>
  </section>
  <div id={`privacy-body`} className={`privacy-body`}>
    <nav id={`privacy-index`} className={`privacy-index`} aria-label={`Privacy contents`}><span>{`THE DETAILS ↓`}</span>{infoContent.privacy.sections.map((section, index) => <a id={`privacy-index-${index}`} key={section.title} href={`#privacy-section-${index}`}>{`0${index + 1}`}<span>{section.title}</span></a>)}</nav>
    <div id={`privacy-sections`} className={`privacy-sections`}>
      {infoContent.privacy.sections.map((section, index) => <section id={`privacy-section-${index}`} key={section.title} className={`privacy-chapter`} aria-labelledby={`privacy-section-title-${index}`}><span className={`privacy-chapter__number`}>{`0${index + 1} /`}</span><h2 id={`privacy-section-title-${index}`}>{section.title}</h2>{section.paragraphs.map((paragraph, paragraphIndex) => <p id={`privacy-section-${index}-paragraph-${paragraphIndex}`} key={paragraphIndex}>{paragraph}</p>)}{index === 1 ? <Link id={`privacy-settings-link`} className={`info-page__text-link`} href={`/settings`}>{`Manage Your Space`}<ArrowIcon size={17} /></Link> : null}</section>)}
    </div>
  </div>
</>;

export default Privacy;
