import type { PopularTrack } from './types';
import { popularity, popularTracks } from '../../config/artist';

export { popularity };
export const tracks: readonly PopularTrack[] = popularTracks;

export const getTrackLink = (track: PopularTrack) => ({
  href: track.listeningUrl ?? track.spotifyUrl,
  service: track.listeningUrl ? `Amazon Music` : `Spotify`,
  canEmbed: track.spotifyUrl.startsWith(`https://open.spotify.com/track/`),
});
