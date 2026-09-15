/** Shared idle signal for the orbit, waveform, and hanging header bars. */
export const ambientWaveformSample = (position: number, phase: number) => {
  const envelope = Math.pow(Math.sin(position * Math.PI), 1.7);
  const carrier = Math.sin(position * 56 + phase * 2.2) * 0.65
    + Math.sin(position * 107 - phase * 1.7) * 0.25
    + Math.cos(position * 21 + phase * 0.8) * 0.1;
  return carrier * envelope;
};

export const ambientSpectrumSample = (position: number, phase: number) => (
  0.1 + Math.abs(ambientWaveformSample(position, phase)) * 0.8
);
