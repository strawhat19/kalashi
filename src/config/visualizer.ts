export type VisualizerMode = `waveform` | `orbit`;

export type VisualizerSettings = {
  speed: number;
  density: number;
  intensity: number;
  mode: VisualizerMode;
};

/** Shared feel for the logo orbit and its straight header counterpart. */
export const miniVisualizerSettings: VisualizerSettings = {
  mode: `orbit`,
  speed: 1,
  intensity: 1.15,
  density: 64,
};

export const visualizerConfig = {
  fps: 30,
  smoothing: 0.76,
  accent: `#B1F750`,
  alert: `#F05951`,
  storageKey: `kalashi.visualizer.v1`,
  defaults: {
    speed: 1,
    density: 72,
    intensity: 1,
    mode: `waveform` as VisualizerMode,
  },
  limits: {
    speed: { min: 0.25, max: 2, step: 0.25 },
    density: { min: 32, max: 128, step: 16 },
    intensity: { min: 0.25, max: 2, step: 0.25 },
  },
};

export const normalizeVisualizerSettings = (value?: Partial<VisualizerSettings> | null): VisualizerSettings => {
  const clamp = (key: `speed` | `density` | `intensity`) => {
    const { min, max } = visualizerConfig.limits[key];
    const candidate = value?.[key];
    return typeof candidate === `number` && Number.isFinite(candidate)
      ? Math.min(max, Math.max(min, candidate))
      : visualizerConfig.defaults[key];
  };

  return {
    speed: clamp(`speed`),
    intensity: clamp(`intensity`),
    density: Math.round(clamp(`density`)),
    mode: value?.mode === `orbit` || value?.mode === `waveform` ? value.mode : visualizerConfig.defaults.mode,
  };
};
