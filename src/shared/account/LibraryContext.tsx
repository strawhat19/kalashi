import { Platform } from 'react-native';
import { releases } from '../../config/artist';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

const storageKey = `kalashi:favorites:v1`;
const validIds = new Set<string>(releases.map(release => release.spotifyUrl));
type LibraryState = { ids: string[]; ready: boolean; notice: string; toggle: (id: string) => void; clear: () => void };
const LibraryContext = createContext<LibraryState | null>(null);

export const LibraryProvider = ({ children }: PropsWithChildren) => {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState(`Saved in this session only. No cloud sync.`);
  useEffect(() => {
    if (Platform.OS === `web`) {
      try {
        const raw: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? `[]`);
        if (Array.isArray(raw)) setIds([...new Set(raw.filter((id): id is string => typeof id === `string` && validIds.has(id)))]);
        setNotice(`Saved in this browser only. Not an account backup; clearing browser data removes favorites.`);
      } catch { setNotice(`Browser storage unavailable. Favorites stay in this session only.`); }
    }
    setReady(true);
  }, []);
  const save = (next: string[]) => {
    setIds(next);
    if (Platform.OS === `web`) {
      try { window.localStorage.setItem(storageKey, JSON.stringify(next)); }
      catch { setNotice(`Could not save to browser storage. Changes stay in this session only.`); }
    }
  };
  const toggle = (id: string) => {
    if (!ready || !validIds.has(id)) return;
    save(ids.includes(id) ? ids.filter(value => value !== id) : [...ids, id]);
  };
  return <LibraryContext.Provider value={{ ids, ready, notice, toggle, clear: () => save([]) }}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => {
  const value = useContext(LibraryContext);
  if (!value) throw new Error(`LibraryProvider is missing`);
  return value;
};
