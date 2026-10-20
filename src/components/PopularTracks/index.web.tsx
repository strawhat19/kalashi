import './styles.css';
import type { PopularTracksProps } from './types';
import { ArrowIcon, PlayIcon } from '../Icons.web';
import { tracks, popularity, getTrackLink } from './tracks';

const PopularTracks = ({ id = `popular-tracks`, onListen }: PopularTracksProps) => (
  <section
    id={id}
    className={`popular-tracks`}
    aria-labelledby={`${id}-title`}
  >
    <div id={`${id}-heading`} className={`popular-tracks__heading`}>
      <div id={`${id}-intro`} className={`popular-tracks__intro`}>
        <p id={`${id}-eyebrow`} className={`popular-tracks__eyebrow`}>{`POPULAR ON SPOTIFY`}</p>
        <h2 id={`${id}-title`} className={`popular-tracks__title`}>{`ON REPEAT.`}</h2>
      </div>
      <a
        target={`_blank`}
        rel={`noopener noreferrer`}
        id={`${id}-source`}
        href={popularity.sourceUrl}
        className={`popular-tracks__source`}
        aria-label={`View Kalashi’s top tracks on Spotify`}
      >
        {`Spotify top tracks`}
        <ArrowIcon size={16} />
      </a>
    </div>
    {tracks.every(track => track.listeningUrl && !(onListen && getTrackLink(track).canEmbed)) ? <p id={`${id}-listening-service`} className={`popular-tracks__service`}>{`Listening links open Amazon Music.`}</p> : null}
    <ol id={`${id}-list`} role={`list`} className={`popular-tracks__list`}>
      {tracks.map((track, index) => {
        const trackId = `${id}-${track.id}`;
        const { href, service, canEmbed } = getTrackLink(track);
        const listen = canEmbed ? onListen : undefined;
        const content = <>
          <span id={`${trackId}-rank`} className={`popular-tracks__rank`} aria-hidden={`true`}>{String(index + 1).padStart(2, `0`)}</span>
          <span id={`${trackId}-title`} className={`popular-tracks__name`}>{track.title}</span>
          <span id={`${trackId}-duration`} className={`popular-tracks__duration`}>{track.duration}</span>
          <span id={`${trackId}-play`} className={`popular-tracks__play`} aria-hidden={`true`}><PlayIcon size={18} /></span>
        </>;

        return <li key={track.id} id={trackId} className={`popular-tracks__item`}>
          {listen ? <button
            type={`button`}
            id={`${trackId}-listen`}
            className={`popular-tracks__row`}
            onClick={() => listen(track.spotifyUrl)}
            aria-label={`Listen to ${track.title} in the Spotify player`}
          >{content}</button> : <a
            target={`_blank`}
            href={href}
            rel={`noopener noreferrer`}
            id={`${trackId}-listen`}
            className={`popular-tracks__row`}
            aria-label={`Listen to ${track.title} on ${service}`}
          >{content}</a>}
        </li>;
      })}
    </ol>
    <p id={`${id}-note`} className={`popular-tracks__note`}>
      {popularity.label}
      {` · `}
      <time dateTime={popularity.checkedAt}>{`Checked ${popularity.checkedAt}`}</time>
    </p>
  </section>
);

export default PopularTracks;
