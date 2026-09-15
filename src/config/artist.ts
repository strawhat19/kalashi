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
