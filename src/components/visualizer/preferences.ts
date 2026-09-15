import { normalizeVisualizerSettings, type VisualizerSettings } from '../../config/visualizer';

const defaults = normalizeVisualizerSettings();
const listeners = new Set<() => void>();
let currentSettings = defaults;

export const readVisualizerPreferences = () => currentSettings;
export const getServerVisualizerPreferences = () => defaults;

export const subscribeVisualizerPreferences = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const saveVisualizerPreferences = (settings: VisualizerSettings) => {
  currentSettings = normalizeVisualizerSettings(settings);
  listeners.forEach((listener) => listener());
};
