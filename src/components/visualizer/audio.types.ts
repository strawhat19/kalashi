export type AudioSignal = {
  readWaveform: () => Uint8Array;
  readFrequencies: () => Uint8Array;
};

export type LocalAudioProps = {
  suspended?: boolean;
  onPlaybackChange: (playing: boolean) => void;
  onSignalChange: (signal: AudioSignal | null) => void;
};
