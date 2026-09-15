import { normalizeVisualizerSettings, visualizerConfig, type VisualizerSettings } from '../../config/visualizer';

const defaults = normalizeVisualizerSettings();
const listeners = new Set<() => void>();
let initialized = false;
let currentSettings = defaults;

const parsePreferences = (value: string | null) => {
  try {
    return value ? normalizeVisualizerSettings(JSON.parse(value) as Partial<VisualizerSettings>) : defaults;
  } catch {
    return defaults;
  }
};

export const getServerVisualizerPreferences = () => defaults;

export const readVisualizerPreferences = () => {
  if (!initialized && typeof window !== `undefined`) {
    initialized = true;
    try {
      currentSettings = parsePreferences(window.localStorage.getItem(visualizerConfig.storageKey));
    } catch {
      currentSettings = defaults;
    }
  }
  return currentSettings;
};

export const subscribeVisualizerPreferences = (listener: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== visualizerConfig.storageKey) return;
    currentSettings = parsePreferences(event.newValue);
    listeners.forEach((notify) => notify());
  };
  listeners.add(listener);
  window.addEventListener(`storage`, onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener(`storage`, onStorage);
  };
};

export const saveVisualizerPreferences = (settings: VisualizerSettings) => {
  initialized = true;
  currentSettings = normalizeVisualizerSettings(settings);
  try {
    window.localStorage.setItem(visualizerConfig.storageKey, JSON.stringify(currentSettings));
  } catch {
    listeners.forEach((listener) => listener());
    return;
  }
  listeners.forEach((listener) => listener());
};
