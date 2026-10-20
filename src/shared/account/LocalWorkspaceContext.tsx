import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { getCurrentUser } from './auth';
import { cleanText, createRecordId } from './records';
import { accountStorageKey, readJSON, subscribeStorage, withStorageLock, writeJSON } from './storage';
import { blankWorkspace, decodeWorkspace, releaseIds, workspaceStorageKey, type LocalProfile, type Workspace } from './workspace';

export type { LocalCollection, LocalProfile } from './workspace';
type LocalWorkspace = Workspace & {
  ready: boolean;
  notice: string;
  clear: () => Promise<boolean>;
  createCollection: (title: string) => Promise<boolean>;
  removeCollection: (id: string) => Promise<boolean>;
  saveProfile: (profile: LocalProfile) => Promise<boolean>;
  renameCollection: (id: string, title: string) => Promise<boolean>;
  toggleRelease: (id: string, releaseId: string) => Promise<boolean>;
};
type Snapshot = { scope: string; state: Workspace; ready: boolean; notice: string };
const Context = createContext<LocalWorkspace | null>(null);
const errorMessage = (error: unknown) => error instanceof Error ? error.message : `Your changes could not be saved. Please try again`;

export const LocalWorkspaceProvider = ({ children, scope = `guest` }: PropsWithChildren<{ scope?: string }>) => {
  const mounted = useRef(false);
  const generation = useRef(0);
  const [snapshot, setSnapshot] = useState<Snapshot>(() => ({ scope: ``, state: blankWorkspace(), ready: false, notice: `` }));
  const key = accountStorageKey(workspaceStorageKey, scope);
  const ready = snapshot.scope === scope && snapshot.ready;
  const state = snapshot.scope === scope ? snapshot.state : blankWorkspace();
  const notice = snapshot.scope === scope ? snapshot.notice : ``;

  useEffect(() => {
    let current = true;
    mounted.current = true;
    generation.current += 1;
    const load = () => {
      void Promise.resolve().then(() => decodeWorkspace(readJSON<unknown>(key, null))).then(next => {
        if (current) setSnapshot({ scope, state: next, ready: true, notice: `` });
      }).catch(error => {
        if (current) setSnapshot(previous => ({ scope, state: previous.scope === scope ? previous.state : blankWorkspace(), ready: true, notice: errorMessage(error) }));
      });
    };
    load();
    const unsubscribe = subscribeStorage(key, load);
    return () => {
      current = false;
      mounted.current = false;
      generation.current += 1;
      unsubscribe();
    };
  }, [key, scope]);

  const update = async (transform: (previous: Workspace) => Workspace, recover = false): Promise<boolean> => {
    if (!ready || !mounted.current) return false;
    const request = generation.current;
    const active = () => mounted.current && generation.current === request;
    try {
      return await withStorageLock(`accounts`, async () => {
        if (!active()) return false;
        const user = await getCurrentUser();
        if (!active()) return false;
        if ((user?.id ?? `guest`) !== scope) throw new Error(`Your Session Changed — Open Your Collections Again`);
        let previous: Workspace;
        try { previous = decodeWorkspace(readJSON<unknown>(key, null)); }
        catch (error) {
          if (!recover) throw error;
          previous = { ...blankWorkspace(), nextCollectionNumber: state.nextCollectionNumber };
        }
        const next = transform(previous);
        writeJSON(key, { version: 2, ...next });
        if (active()) setSnapshot({ scope, state: next, ready: true, notice: `` });
        return true;
      });
    } catch (error) {
      if (active()) setSnapshot(previous => previous.scope === scope ? { ...previous, notice: errorMessage(error) } : previous);
      return false;
    }
  };
  const createCollection = async (value: string): Promise<boolean> => {
    const title = cleanText(value, 80);
    if (!title) return false;
    return update(previous => {
      if (previous.collections.length >= 100) throw new Error(`You can keep up to 100 collections`);
      const number = previous.nextCollectionNumber;
      const timestamp = new Date().toISOString();
      const collection = { id: createRecordId(`Collection`, number, title, timestamp), number, title, releaseIds: [], createdAt: timestamp, updatedAt: timestamp };
      return { ...previous, nextCollectionNumber: number + 1, collections: [...previous.collections, collection] };
    });
  };
  const renameCollection = async (id: string, value: string): Promise<boolean> => {
    const title = cleanText(value, 80);
    if (!title) return false;
    return update(previous => {
      if (!previous.collections.some(item => item.id === id)) throw new Error(`This Collection Could Not Be Found`);
      return { ...previous, collections: previous.collections.map(item => item.id === id ? { ...item, title, updatedAt: new Date().toISOString() } : item) };
    });
  };
  const removeCollection = (id: string) => update(previous => ({ ...previous, collections: previous.collections.filter(item => item.id !== id) }));
  const toggleRelease = async (id: string, releaseId: string): Promise<boolean> => {
    if (!releaseIds.has(releaseId)) return false;
    return update(previous => {
      if (!previous.collections.some(item => item.id === id)) throw new Error(`This Collection Could Not Be Found`);
      return { ...previous, collections: previous.collections.map(item => item.id !== id ? item : { ...item, updatedAt: new Date().toISOString(), releaseIds: item.releaseIds.includes(releaseId) ? item.releaseIds.filter(value => value !== releaseId) : [...item.releaseIds, releaseId] }) };
    });
  };
  const saveProfile = (profile: LocalProfile) => update(previous => ({ ...previous, profile: { displayName: cleanText(profile.displayName, 80), bio: cleanText(profile.bio, 500) } }));
  const clear = () => update(previous => ({ ...blankWorkspace(), nextCollectionNumber: previous.nextCollectionNumber }), true);
  return <Context.Provider value={{ ...state, ready, notice, createCollection, renameCollection, removeCollection, toggleRelease, saveProfile, clear }}>{children}</Context.Provider>;
};

export const useLocalWorkspace = () => {
  const value = useContext(Context);
  if (!value) throw new Error(`Local Workspace Provider Missing`);
  return value;
};
