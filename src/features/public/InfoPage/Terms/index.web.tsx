import { Link } from 'expo-router';
import { infoContent } from '../content';
import { ArrowIcon } from '../../../../components/Icons.web';
import SplitText from '../../../../components/motion/SplitText.web';

const Terms = ({ ready }: { ready: boolean }) => <div className={`liner-notes`}>
  <header id={`terms-hero`} className={`liner-cover`} data-page-hero>
    <div className={`liner-cover__register`}><span id={`terms-eyebrow`}>{`KALASHI MUSIC / TERMS OF USE`}</span><span>{`THE LISTENING NOTES`}</span></div>
    <h1 id={`terms-title`}><SplitText ready={ready} text={`The small`} /><span><SplitText ready={ready} delay={100} text={`print.`} /></span></h1>
    <div className={`liner-cover__bottom`}><p id={`terms-description`}>{infoContent.terms.description}</p><span aria-hidden={`true`}>{`K / T&Cs`}</span></div>
  </header>
  <div id={`terms-body`} className={`liner-document`}>
    <nav id={`terms-index`} className={`liner-index`} aria-label={`Terms contents`}><p>{`THE CONTENTS`}</p>{infoContent.terms.sections.map((section, index) => <a id={`terms-index-${index}`} key={section.title} href={`#terms-section-${index}`}><span>{`0${index + 1}`}</span>{section.title}</a>)}<Link id={`terms-privacy-link`} href={`/privacy`}>{`Privacy Policy`}<ArrowIcon size={14} /></Link></nav>
    <div id={`terms-sections`} className={`liner-sections`}>
      {infoContent.terms.sections.map((section, index) => <section id={`terms-section-${index}`} key={section.title} aria-labelledby={`terms-section-title-${index}`} className={`liner-chapter`}><span className={`liner-chapter__number`}>{`0${index + 1}`}</span><div><h2 id={`terms-section-title-${index}`}>{section.title}</h2>{section.paragraphs.map((paragraph, paragraphIndex) => <p id={`terms-section-${index}-paragraph-${paragraphIndex}`} key={paragraphIndex}>{paragraph}</p>)}</div></section>)}
      <div id={`terms-end-note`} className={`liner-end-note`}><span>{`THANK YOU FOR LISTENING.`}</span><Link id={`terms-help-link`} href={`/support`}>{`Explore The Field Guide`}<ArrowIcon size={18} /></Link></div>
    </div>
  </div>
</div>;

export default Terms;
