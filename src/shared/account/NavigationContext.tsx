import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { accountStorageKey, readStoredValue, subscribeStorage, writeStoredValues } from './storage';
import { navigationStorageKey } from './workspace';

const NavigationContext = createContext({ collapsed: false, ready: false, notice: ``, toggle: () => {} });
type Snapshot = { scope: string; collapsed: boolean; ready: boolean; notice: string };
export const AccountNavigationProvider = ({ children, scope = `guest` }: PropsWithChildren<{ scope?: string }>) => {
  const [snapshot, setSnapshot] = useState<Snapshot>({ scope: ``, collapsed: false, ready: false, notice: `` });
  const key = accountStorageKey(navigationStorageKey, scope);
  const ready = snapshot.scope === scope && snapshot.ready;
  const collapsed = snapshot.scope === scope && snapshot.collapsed;
  const notice = snapshot.scope === scope ? snapshot.notice : ``;

  useEffect(() => {
    let current = true;
    const load = () => {
      void Promise.resolve().then(() => readStoredValue(key)).then(value => {
        if (current) setSnapshot({ scope, collapsed: value === `collapsed`, ready: true, notice: `` });
      }).catch(error => {
        if (current) setSnapshot({ scope, collapsed: false, ready: true, notice: error instanceof Error ? error.message : `Your navigation preference could not be opened` });
      });
    };
    load();
    const unsubscribe = subscribeStorage(key, load);
    return () => { current = false; unsubscribe(); };
  }, [key, scope]);

  const toggle = () => {
    if (!ready) return;
    try {
      const next = readStoredValue(key) !== `collapsed`;
      writeStoredValues([{ key, value: next ? `collapsed` : `expanded` }]);
      setSnapshot({ scope, collapsed: next, ready: true, notice: `` });
    } catch (error) {
      setSnapshot(previous => ({ ...previous, notice: error instanceof Error ? error.message : `Your navigation preference could not be saved` }));
    }
  };
  return <NavigationContext.Provider value={{ collapsed, ready, notice, toggle }}>{children}</NavigationContext.Provider>;
};
export const useAccountNavigation = () => useContext(NavigationContext);
