import './styles.css';
import { ArrowIcon, PlayIcon } from '../../../components/Icons.web';
import { latestReleaseId, releaseHighlights, type ReleaseHighlightsProps } from './data';

const ReleaseHighlights = ({ id = `release-highlights`, compact = false }: ReleaseHighlightsProps) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className={`release-highlights${compact ? ` release-highlights--compact` : ``}`}
  >
    <header id={`${id}-heading`} className={`release-highlights__heading`}>
      <div id={`${id}-intro`} className={`release-highlights__intro`}>
        <p id={`${id}-eyebrow`} className={`release-highlights__eyebrow`}>{`NEW MUSIC / KALASHI`}</p>
        <h2 id={`${id}-title`} className={`release-highlights__title`}>{`THE LATEST.`}</h2>
      </div>
      <p id={`${id}-description`} className={`release-highlights__description`}>{`Fresh releases. Find your next repeat.`}</p>
    </header>
    <div id={`${id}-grid`} className={`release-highlights__grid`}>
      {releaseHighlights.map((release) => {
        const latest = release.id === latestReleaseId;
        const releaseId = `${id}-${release.id}`;

        return (
          <article
            key={release.id}
            id={releaseId}
            aria-labelledby={`${releaseId}-title`}
            className={`release-highlights__release${latest ? ` release-highlights__release--latest` : ``}`}
          >
            <a
              target={`_blank`}
              id={`${releaseId}-artwork-link`}
              href={release.listeningUrl}
              rel={`noopener noreferrer`}
              className={`release-highlights__artwork-link`}
              aria-label={`Listen to ${release.title} on ${release.provider} (opens in a new tab)`}
            >
              <img
                width={640}
                height={640}
                loading={`lazy`}
                id={`${releaseId}-artwork`}
                src={release.webArtwork}
                className={`release-highlights__artwork`}
                alt={`${release.title} cover artwork`}
              />
              <span id={`${releaseId}-badge`} className={`release-highlights__badge`}>
                {latest ? `LATEST RELEASE` : `NEW SINGLE`}
              </span>
              <span aria-hidden={`true`} id={`${releaseId}-play`} className={`release-highlights__play`}>
                <PlayIcon size={24} />
              </span>
            </a>
            <div id={`${releaseId}-details`} className={`release-highlights__details`}>
              <div id={`${releaseId}-metadata`} className={`release-highlights__metadata`}>
                <span id={`${releaseId}-type`} className={`release-highlights__type`}>{`${release.type} / ${release.year}`}</span>
                <time id={`${releaseId}-date`} dateTime={release.releaseDate} className={`release-highlights__date`}>{release.releaseLabel}</time>
              </div>
              <h3 id={`${releaseId}-title`} className={`release-highlights__release-title`}>{release.title}</h3>
              <a
                target={`_blank`}
                id={`${releaseId}-listen`}
                href={release.listeningUrl}
                rel={`noopener noreferrer`}
                className={`release-highlights__listen`}
                aria-label={`Listen to ${release.title} on ${release.provider} (opens in a new tab)`}
              >
                <PlayIcon size={15} />
                <span id={`${releaseId}-listen-label`} className={`release-highlights__listen-label`}>{`Listen on ${release.provider}`}</span>
                <ArrowIcon size={17} />
              </a>
            </div>
          </article>
        );
      })}
    </div>
  </section>
);

export type { ReleaseHighlightsProps } from './data';
export default ReleaseHighlights;
