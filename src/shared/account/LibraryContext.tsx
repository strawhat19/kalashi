import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { getCurrentUser } from './auth';
import { accountStorageKey, readJSON, subscribeStorage, withStorageLock, writeJSON } from './storage';
import { decodeFavorites, favoritesStorageKey, releaseIds } from './workspace';

type LibraryState = { ids: string[]; ready: boolean; notice: string; toggle: (id: string) => Promise<boolean>; clear: () => Promise<boolean> };
type Snapshot = { scope: string; ids: string[]; ready: boolean; notice: string };
const LibraryContext = createContext<LibraryState | null>(null);
const message = (error: unknown) => error instanceof Error ? error.message : `Your favorites could not be saved. Please try again`;

export const LibraryProvider = ({ children, scope = `guest` }: PropsWithChildren<{ scope?: string }>) => {
  const mounted = useRef(false);
  const generation = useRef(0);
  const [snapshot, setSnapshot] = useState<Snapshot>({ scope: ``, ids: [], ready: false, notice: `` });
  const key = accountStorageKey(favoritesStorageKey, scope);
  const ready = snapshot.scope === scope && snapshot.ready;
  const ids = snapshot.scope === scope ? snapshot.ids : [];
  const notice = snapshot.scope === scope ? snapshot.notice : ``;

  useEffect(() => {
    let current = true;
    mounted.current = true;
    generation.current += 1;
    const load = () => {
      void Promise.resolve().then(() => decodeFavorites(readJSON<unknown>(key, []))).then(next => {
        if (current) setSnapshot({ scope, ids: next, ready: true, notice: `` });
      }).catch(error => {
        if (current) setSnapshot(previous => ({ scope, ids: previous.scope === scope ? previous.ids : [], ready: true, notice: message(error) }));
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

  const mutate = async (transform: (previous: string[]) => string[], replace = false): Promise<boolean> => {
    if (!ready || !mounted.current) return false;
    const request = generation.current;
    const active = () => mounted.current && generation.current === request;
    try {
      return await withStorageLock(`accounts`, async () => {
        if (!active()) return false;
        const user = await getCurrentUser();
        if (!active()) return false;
        if ((user?.id ?? `guest`) !== scope) throw new Error(`Your Session Changed — Open Your Library Again`);
        const previous = replace ? [] : decodeFavorites(readJSON<unknown>(key, []));
        const next = transform(previous);
        writeJSON(key, next);
        if (active()) setSnapshot({ scope, ids: next, ready: true, notice: `` });
        return true;
      });
    } catch (error) {
      if (active()) setSnapshot(previous => previous.scope === scope ? { ...previous, notice: message(error) } : previous);
      return false;
    }
  };
  const toggle = async (id: string): Promise<boolean> => {
    if (!releaseIds.has(id)) return false;
    return mutate(previous => previous.includes(id) ? previous.filter(value => value !== id) : [...previous, id]);
  };
  const clear = () => mutate(() => [], true);
  return <LibraryContext.Provider value={{ ids, ready, notice, toggle, clear }}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => {
  const value = useContext(LibraryContext);
  if (!value) throw new Error(`Library Provider Missing`);
  return value;
};
