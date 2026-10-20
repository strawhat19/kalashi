import { Platform } from 'react-native';

type StorageWrite = { key: string; value: string | null };
const sessionValues = new Map<string, string>();
const sessionListeners = new Set<(keys: readonly string[]) => void>();
const changeEvent = `kalashi:account-data-changed`;

export const browserPersistence = () => Platform.OS === `web` && typeof window !== `undefined`;
export const accountStorageKey = (key: string, scope = `guest`) => (
  scope === `guest` ? key : `${key}:account:${encodeURIComponent(scope)}`
);

export const readStoredValue = (key: string): string | null => {
  if (!browserPersistence()) return sessionValues.get(key) ?? null;
  try { return window.localStorage.getItem(key); }
  catch { throw new Error(`Your saved data could not be opened. Check this browser’s storage settings and try again`); }
};

const writeValue = ({ key, value }: StorageWrite) => {
  if (browserPersistence()) {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } else if (value === null) sessionValues.delete(key);
  else sessionValues.set(key, value);
};

export const writeStoredValues = (entries: readonly StorageWrite[]) => {
  const previous = entries.map(({ key }) => ({ key, value: readStoredValue(key) }));
  try { entries.forEach(writeValue); }
  catch {
    // Restore earlier keys before publishing a multi-record change.
    for (const entry of previous) {
      try { writeValue(entry); } catch { /* Storage may have become completely inaccessible. */ }
    }
    throw new Error(`Your changes could not be saved. Free some browser storage and try again`);
  }
  const keys = entries.map(({ key }) => key);
  sessionListeners.forEach(listener => listener(keys));
  if (browserPersistence()) window.dispatchEvent(new CustomEvent(changeEvent, { detail: keys }));
};

export const removeStoredValue = (key: string) => writeStoredValues([{ key, value: null }]);
export const readJSON = <Value,>(key: string, fallback: Value): Value => {
  const saved = readStoredValue(key);
  if (saved === null) return fallback;
  try { return JSON.parse(saved) as Value; }
  catch { throw new Error(`Your saved data could not be read. Export or clear this site’s storage before starting again`); }
};
export const writeJSON = (key: string, value: unknown) => {
  const serialized = JSON.stringify(value);
  if (serialized === undefined) throw new Error(`This record could not be saved`);
  writeStoredValues([{ key, value: serialized }]);
};

export const subscribeStorage = (keys: string | readonly string[], listener: () => void) => {
  const watched = new Set(typeof keys === `string` ? [keys] : keys);
  if (!browserPersistence()) {
    const onChange = (changed: readonly string[]) => { if (changed.some(key => watched.has(key))) listener(); };
    sessionListeners.add(onChange);
    return () => { sessionListeners.delete(onChange); };
  }
  const onStorage = (event: StorageEvent) => { if (event.key === null || watched.has(event.key)) listener(); };
  const onChange = (event: Event) => {
    const changed = (event as CustomEvent<unknown>).detail;
    if (Array.isArray(changed) && changed.some(key => typeof key === `string` && watched.has(key))) listener();
  };
  window.addEventListener(`storage`, onStorage);
  window.addEventListener(changeEvent, onChange);
  return () => {
    window.removeEventListener(`storage`, onStorage);
    window.removeEventListener(changeEvent, onChange);
  };
};

const pendingOperations = new Map<string, Promise<unknown>>();
export const withStorageLock = async <Value,>(key: string, operation: () => Value | Promise<Value>): Promise<Value> => {
  if (browserPersistence() && typeof navigator !== `undefined` && navigator.locks?.request) {
    return navigator.locks.request(`kalashi:${key}`, operation);
  }
  const previous = pendingOperations.get(key) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(operation);
  pendingOperations.set(key, next);
  try { return await next; }
  finally { if (pendingOperations.get(key) === next) pendingOperations.delete(key); }
};
