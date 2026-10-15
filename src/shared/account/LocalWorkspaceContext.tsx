import { Platform } from 'react-native';
import { releases } from '../../config/artist';
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';

export type LocalCollection = { id: string; title: string; releaseIds: string[] };
export type LocalProfile = { displayName: string; bio: string };
type Workspace = { collections: LocalCollection[]; profile: LocalProfile };
type LocalWorkspace = Workspace & {
  ready: boolean;
  notice: string;
  createCollection: (title: string) => boolean;
  renameCollection: (id: string, title: string) => void;
  removeCollection: (id: string) => void;
  toggleRelease: (id: string, releaseId: string) => void;
  saveProfile: (profile: LocalProfile) => void;
  clear: () => void;
};
const key = `kalashi:local-workspace:v1`;
const blank = (): Workspace => ({ collections: [], profile: { displayName: ``, bio: `` } });
const catalog = new Set<string>(releases.map(item => item.spotifyUrl));
const Context = createContext<LocalWorkspace | null>(null);
const cleanText = (value: unknown, limit: number) => typeof value === `string` ? value.trim().slice(0, limit) : ``;
const decode = (raw: unknown): Workspace => {
  if (!raw || typeof raw !== `object`) return blank();
  const data = raw as Record<string, unknown>;
  const profile = data.profile && typeof data.profile === `object` ? data.profile as Record<string, unknown> : {};
  const seen = new Set<string>();
  const collections: LocalCollection[] = [];
  if (Array.isArray(data.collections)) for (const item of data.collections.slice(0, 100)) {
    if (!item || typeof item !== `object`) continue;
    const id = cleanText(item.id, 100);
    const title = cleanText(item.title, 80);
    if (!id || !/^[a-zA-Z0-9-]+$/.test(id) || !title || seen.has(id)) continue;
    seen.add(id);
    const releaseIds = Array.isArray(item.releaseIds) ? [...new Set<string>(item.releaseIds.filter((value: unknown): value is string => typeof value === `string` && catalog.has(value)))] : [];
    collections.push({ id, title, releaseIds });
  }
  return { collections, profile: { displayName: cleanText(profile.displayName, 80), bio: cleanText(profile.bio, 500) } };
};
export const LocalWorkspaceProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<Workspace>(blank);
  const current = useRef(state);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState(`Lists and display profile stay in this app session only. No account or cloud sync.`);
  useEffect(() => {
    if (Platform.OS === `web`) {
      try {
        const next = decode(JSON.parse(window.localStorage.getItem(key) ?? `null`));
        current.current = next;
        setState(next);
        setNotice(`Lists and display profile are saved in this browser only, not an account. Clearing browser data removes them.`);
      } catch { setNotice(`Could not load browser storage. Changes stay in this session only until storage is available.`); }
    }
    setReady(true);
  }, []);
  const update = (transform: (previous: Workspace) => Workspace) => {
    if (!ready) return;
    const next = transform(current.current);
    current.current = next;
    setState(next);
    if (Platform.OS === `web`) {
      try { window.localStorage.setItem(key, JSON.stringify(next)); }
      catch { setNotice(`Could not save browser data. These changes stay in this session only; no cloud backup exists.`); }
    }
  };
  const createCollection = (value: string) => {
    const title = cleanText(value, 80);
    if (!ready || !title || current.current.collections.length >= 100) return false;
    const id = `list-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    update(previous => ({ ...previous, collections: [...previous.collections, { id, title, releaseIds: [] }] }));
    return true;
  };
  const renameCollection = (id: string, value: string) => {
    const title = cleanText(value, 80);
    if (title) update(previous => ({ ...previous, collections: previous.collections.map(item => item.id === id ? { ...item, title } : item) }));
  };
  const removeCollection = (id: string) => update(previous => ({ ...previous, collections: previous.collections.filter(item => item.id !== id) }));
  const toggleRelease = (id: string, releaseId: string) => {
    if (!catalog.has(releaseId)) return;
    update(previous => ({ ...previous, collections: previous.collections.map(item => item.id !== id ? item : { ...item, releaseIds: item.releaseIds.includes(releaseId) ? item.releaseIds.filter(value => value !== releaseId) : [...item.releaseIds, releaseId] }) }));
  };
  const saveProfile = (profile: LocalProfile) => update(previous => ({ ...previous, profile: { displayName: cleanText(profile.displayName, 80), bio: cleanText(profile.bio, 500) } }));
  return <Context.Provider value={{ ...state, ready, notice, createCollection, renameCollection, removeCollection, toggleRelease, saveProfile, clear: () => update(blank) }}>{children}</Context.Provider>;
};
export const useLocalWorkspace = () => {
  const value = useContext(Context);
  if (!value) throw new Error(`LocalWorkspaceProvider is missing`);
  return value;
};
