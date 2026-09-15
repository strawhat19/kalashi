export type AudioSignal = {
  readWaveform: () => Uint8Array;
  readFrequencies: () => Uint8Array;
};

export type AudioVisualizerState = {
  signal: AudioSignal | null;
  audioPlaying: boolean;
  active: boolean;
};

export type LocalAudioProps = {
  suspended?: boolean;
  onPlaybackChange: (playing: boolean) => void;
  onSignalChange: (signal: AudioSignal | null) => void;
};
