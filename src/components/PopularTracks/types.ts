export type PopularTracksProps = {
  id?: string;
  onListen?: (spotifyUrl: string) => void;
};

export type PopularTrack = {
  id: string;
  title: string;
  duration: string;
  spotifyUrl: string;
  listeningUrl?: string;
};
