import { Platform } from 'react-native';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

const storageKey = `kalashi:guest-navigation:v1`;
const NavigationContext = createContext({ collapsed: false, ready: false, notice: `Navigation preference lasts for this session.`, toggle: () => {} });
export const AccountNavigationProvider = ({ children }: PropsWithChildren) => {
  const [ready, setReady] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notice, setNotice] = useState(`Navigation preference lasts for this session.`);
  useEffect(() => {
    if (Platform.OS === `web`) {
      try {
        setCollapsed(window.localStorage.getItem(storageKey) === `collapsed`);
        setNotice(`Navigation preference is saved in this browser.`);
      } catch { setNotice(`Storage unavailable. Navigation preference lasts for this session.`); }
    }
    setReady(true);
  }, []);
  const toggle = () => {
    if (!ready) return;
    const next = !collapsed;
    setCollapsed(next);
    if (Platform.OS === `web`) {
      try { window.localStorage.setItem(storageKey, next ? `collapsed` : `expanded`); }
      catch { setNotice(`Could not save navigation preference. Using this session only.`); }
    }
  };
  return <NavigationContext.Provider value={{ collapsed, ready, notice, toggle }}>{children}</NavigationContext.Provider>;
};
export const useAccountNavigation = () => useContext(NavigationContext);
