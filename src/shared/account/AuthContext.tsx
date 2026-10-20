import * as accounts from './auth';
import type { AccountUser, ProfileInput, SignInInput, SignUpInput } from './auth.types';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';

type AuthValue = {
  error: string;
  loading: boolean;
  user: AccountUser | null;
  clearError: () => void;
  signOut: () => Promise<void>;
  signIn: (input: SignInInput) => Promise<AccountUser>;
  signUp: (input: SignUpInput) => Promise<AccountUser>;
  updateProfile: (input: ProfileInput) => Promise<AccountUser>;
  deleteAccount: (password: string) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
};

const Context = createContext<AuthValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AccountUser | null>(null);
  const mounted = useRef(false);
  const hydration = useRef(0);

  const hydrate = useCallback(async () => {
    const request = ++hydration.current;
    try {
      const currentUser = await accounts.getCurrentUser();
      if (!mounted.current || request !== hydration.current) return;
      setUser(currentUser);
      setError(``);
    } catch (cause) {
      if (!mounted.current || request !== hydration.current) return;
      setUser(null);
      setError(cause instanceof Error ? cause.message : `Your Account Could Not Be Loaded`);
    } finally { if (mounted.current && request === hydration.current) setLoading(false); }
  }, []);

  useEffect(() => {
    mounted.current = true;
    const refresh = () => { if (mounted.current) void hydrate(); };
    const unsubscribe = accounts.subscribeAuth(refresh);
    refresh();
    return () => { mounted.current = false; hydration.current += 1; unsubscribe(); };
  }, [hydrate]);

  const perform = useCallback(async <Value,>(operation: () => Promise<Value>) => {
    try {
      const value = await operation();
      const currentUser = await accounts.getCurrentUser();
      if (mounted.current) { setUser(currentUser); setError(``); }
      return value;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : `Your Account Could Not Be Updated`;
      if (mounted.current) setError(message);
      throw new Error(message);
    }
  }, []);

  const actions = useMemo(() => ({
    clearError: () => setError(``),
    signOut: () => perform(accounts.signOut),
    signIn: (input: SignInInput) => perform(() => accounts.signIn(input)),
    signUp: (input: SignUpInput) => perform(() => accounts.signUp(input)),
    updateProfile: (input: ProfileInput) => perform(() => accounts.updateProfile(input)),
    deleteAccount: (password: string) => perform(() => accounts.deleteAccount(password)),
    changePassword: (current: string, next: string) => perform(() => accounts.changePassword(current, next)),
  }), [perform]);

  return <Context.Provider value={{ user, error, loading, ...actions }}>{children}</Context.Provider>;
};

export const useAuth = () => {
  const context = useContext(Context);
  if (!context) throw new Error(`AuthProvider Is Missing`);
  return context;
};
