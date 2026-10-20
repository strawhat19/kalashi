import './styles.css';
import { Link } from 'expo-router';
import Head from 'expo-router/head';
import { useContext } from 'react';
import About from './About/index.web';
import Terms from './Terms/index.web';
import Contact from './Contact/index.web';
import Privacy from './Privacy/index.web';
import Support from './Support/index.web';
import { ArrowIcon } from '../../../components/Icons.web';
import { infoContent, type InfoPageKey } from './content';
import { scrollToAnchor } from '../../../components/motion/scrollToAnchor.web';
import { PageIntroContext } from '../../../components/motion/PageIntroContext';

const pages = { about: About, terms: Terms, contact: Contact, privacy: Privacy, support: Support };

const InfoPage = ({ page }: { page: InfoPageKey }) => {
  const ready = useContext(PageIntroContext);
  const content = infoContent[page];
  const Page = pages[page];
  const legal = page === `terms` || page === `privacy`;

  return <div id={`info-page-${page}`} className={`info-page info-page--${page}`} onClick={scrollToAnchor}>
    <Head>
      <title>{`${content.title} | Kalashi Music`}</title>
      <meta name={`description`} content={content.description} />
      {legal ? <meta name={`robots`} content={`noindex, follow`} /> : null}
    </Head>
    <Page ready={ready} />
    <aside id={`${page}-next-links`} className={`info-page__next`} aria-label={`Keep exploring Kalashi`}>
      <p id={`${page}-next-caption`} className={`info-page__kicker`}>{`THERE’S MORE TO THE FREQUENCY`}</p>
      <div id={`${page}-next-navigation`} className={`info-page__next-links`}>
        <Link id={`${page}-next-music`} className={`info-page__text-link`} href={`/music`}>{`The Music`}<ArrowIcon size={17} /></Link>
        <Link id={`${page}-next-sound`} className={`info-page__text-link`} href={`/sound-lab`}>{`Sound Lab`}<ArrowIcon size={17} /></Link>
        <Link id={`${page}-next-contact`} className={`info-page__text-link`} href={page === `contact` ? `/support` : `/contact`}>{page === `contact` ? `Help & Support` : `Get In Touch`}<ArrowIcon size={17} /></Link>
        <Link id={`${page}-next-policy`} className={`info-page__text-link`} href={page === `privacy` ? `/terms` : `/privacy`}>{page === `privacy` ? `Terms Of Use` : `Privacy Policy`}<ArrowIcon size={17} /></Link>
      </div>
    </aside>
  </div>;
};

export default InfoPage;
