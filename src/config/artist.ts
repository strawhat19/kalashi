export const artist = {
  name: `Kalashi`,
  origin: `Bangladesh`,
  home: `Atlanta, GA`,
  spotifyId: `6DIbARWmXOeQr5vo23NZFC`,
  spotifyUrl: `https://open.spotify.com/artist/6DIbARWmXOeQr5vo23NZFC`,
  spotifyEmbed: `https://open.spotify.com/embed/artist/6DIbARWmXOeQr5vo23NZFC?theme=0`,
  description: `Bangladesh born. Atlanta raised the sound. Step into the world of Kalashi.`,
};

export const releases = [
  {
    year: `2026`,
    type: `Single`,
    title: `Come Thru`,
    artwork: require('../../assets/music/come-thru.jpg'),
    webArtwork: `/media/music/come-thru.jpg`,
    spotifyUrl: `https://open.spotify.com/album/4elA2ZLggQeNsoShIcfCsN`,
  },
  {
    year: `2026`,
    type: `Album`,
    title: `MiSSery`,
    artwork: require('../../assets/music/missery.jpg'),
    webArtwork: `/media/music/missery.jpg`,
    spotifyUrl: `https://open.spotify.com/album/35G9hdatO42yljsgHFMtv2`,
  },
  {
    year: `2026`,
    type: `Single`,
    title: `Passenger Princess`,
    artwork: require('../../assets/music/passenger-princess.jpg'),
    webArtwork: `/media/music/passenger-princess.jpg`,
    spotifyUrl: `https://open.spotify.com/album/6ANqPEod09E9QVbutjk4Tp`,
  },
] as const;

export const recentReleases = [
  {
    year: `2026`,
    type: `Single`,
    id: `kiss-n-tell`,
    title: `Kiss N Tell`,
    releaseDate: `2026-10-17`,
    provider: `Amazon Music`,
    releaseLabel: `October 17, 2026`,
    webArtwork: `/media/music/kiss-n-tell.jpg`,
    artwork: require('../../assets/music/kiss-n-tell.jpg'),
    listeningUrl: `https://music.amazon.co.uk/albums/B0HNDBMXVN`,
  },
  {
    year: `2026`,
    type: `Single`,
    id: `autobahn`,
    title: `Autobahn`,
    releaseDate: `2026-10-14`,
    provider: `Amazon Music`,
    releaseLabel: `October 14, 2026`,
    webArtwork: `/media/music/autobahn.jpg`,
    artwork: require('../../assets/music/autobahn.jpg'),
    listeningUrl: `https://music.amazon.co.uk/albums/B0HN1KVGPF`,
  },
] as const;

export const latestRelease = recentReleases[0];

export const popularity = {
  checkedAt: `2026-10-20`,
  label: `Spotify top tracks`,
  sourceUrl: artist.spotifyEmbed,
} as const;

export const popularTracks = [
  {
    id: `autobahn`,
    title: `Autobahn`,
    duration: `02:23`,
    listeningUrl: recentReleases[1].listeningUrl,
    spotifyUrl: `https://open.spotify.com/search/Autobahn%20Kalashi`,
  },
  {
    id: `kiss-n-tell`,
    title: `Kiss N Tell`,
    duration: `02:11`,
    listeningUrl: latestRelease.listeningUrl,
    spotifyUrl: `https://open.spotify.com/search/Kiss%20N%20Tell%20Kalashi`,
  },
  {
    duration: `03:06`,
    id: `life-aint-fair-freestyle`,
    title: `Life Aint Fair Freestyle`,
    listeningUrl: `https://music.amazon.co.uk/albums/B0C9MJBYJS?trackAsin=B0C9ML5MDQ`,
    spotifyUrl: `https://open.spotify.com/search/Life%20Aint%20Fair%20Freestyle%20Kalashi`,
  },
  {
    duration: `03:39`,
    id: `repeated-obstacles`,
    title: `Repeated Obstacles`,
    listeningUrl: `https://music.amazon.co.uk/albums/B0GX6DNGM3`,
    spotifyUrl: `https://open.spotify.com/search/Repeated%20Obstacles%20Kalashi`,
  },
  {
    id: `lozer`,
    title: `Lozer`,
    duration: `02:15`,
    listeningUrl: `https://music.amazon.com/tracks/B0GWS5TVVR`,
    spotifyUrl: `https://open.spotify.com/search/Lozer%20Kalashi`,
  },
] as const;
