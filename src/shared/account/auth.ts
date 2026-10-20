import type { AccountUser, ProfileInput, SignInInput, SignUpInput } from './auth.types';
import { cleanText, createRecordId } from './records';
import { accountDataDeletionWrites } from './service';
import { readJSON, subscribeStorage, withStorageLock, writeStoredValues } from './storage';

const profileKey = `kalashi:accounts:profiles:v1`;
const credentialKey = `kalashi:accounts:credentials:v1`;
const sessionKey = `kalashi:accounts:session:v1`;
const numberKey = `kalashi:accounts:number:v1`;
const iterations = 210000;
const storageKeys = [profileKey, credentialKey, sessionKey];

type Credential = { userId: string; salt: string; hash: string; revision: string; iterations: number };
type Session = { userId: string; revision: string };
type AccountRecords = { profiles: AccountUser[]; credentials: Credential[] };

const accountLock = <Value,>(operation: () => Promise<Value>): Promise<Value> => withStorageLock(`accounts`, operation);

const asRecord = (value: unknown): Record<string, unknown> | null => (
  value !== null && typeof value === `object` && !Array.isArray(value) ? value as Record<string, unknown> : null
);
const normalizeEmail = (value: string) => value.trim().toLowerCase();
const validateEmail = (email: string) => {
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)) throw new Error(`Enter A Valid Email Address`);
};
const validatePassword = (password: string) => {
  if (password.length < 8 || password.length > 128) throw new Error(`Use A Password Between 8 And 128 Characters`);
};
const readAccounts = (): AccountRecords => {
  const profiles = readJSON<unknown>(profileKey, []);
  const credentials = readJSON<unknown>(credentialKey, []);
  if (!Array.isArray(profiles) || !Array.isArray(credentials)) throw new Error(`Your Account Data Could Not Be Read`);
  const validProfiles = profiles.every((value) => {
    const item = asRecord(value);
    return item && typeof item.id === `string` && typeof item.number === `number` && Number.isSafeInteger(item.number) && item.number > 0
      && typeof item.email === `string` && typeof item.displayName === `string` && typeof item.bio === `string`
      && (item.photoURL === null || typeof item.photoURL === `string`) && item.role === `Subscriber`
      && typeof item.createdAt === `string` && typeof item.updatedAt === `string`;
  });
  const validCredentials = credentials.every((value) => {
    const item = asRecord(value);
    return item && typeof item.userId === `string` && typeof item.salt === `string` && /^[A-Za-z0-9+/]{22}==$/u.test(item.salt)
      && typeof item.hash === `string` && /^[A-Za-z0-9+/]{43}=$/u.test(item.hash)
      && typeof item.revision === `string` && item.iterations === iterations;
  });
  if (!validProfiles || !validCredentials) throw new Error(`Your Saved Account Data Needs Attention — Nothing Was Changed`);
  return { profiles: profiles as AccountUser[], credentials: credentials as Credential[] };
};
const readSession = (): Session | null => {
  const saved = readJSON<unknown>(sessionKey, null);
  if (saved === null) return null;
  const session = asRecord(saved);
  if (!session || typeof session.userId !== `string` || typeof session.revision !== `string`) throw new Error(`Your Session Could Not Be Restored — Sign In Again`);
  return { userId: session.userId, revision: session.revision };
};
const cryptoProvider = () => {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) throw new Error(`Open Kalashi In A Secure Browser To Use Password Accounts`);
  return globalThis.crypto;
};
const encode = (value: Uint8Array) => btoa(Array.from(value, (byte) => String.fromCharCode(byte)).join(``));
const decode = (value: string) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
const hashPassword = async (password: string, salt: string): Promise<string> => {
  const provider = cryptoProvider();
  const key = await provider.subtle.importKey(`raw`, new TextEncoder().encode(password), `PBKDF2`, false, [`deriveBits`]);
  const bits = await provider.subtle.deriveBits({ salt: decode(salt), name: `PBKDF2`, hash: `SHA-256`, iterations }, key, 256);
  return encode(new Uint8Array(bits));
};
const createCredential = async (userId: string, password: string): Promise<Credential> => {
  const provider = cryptoProvider();
  const salt = encode(provider.getRandomValues(new Uint8Array(16)));
  const revision = encode(provider.getRandomValues(new Uint8Array(18)));
  return { userId, salt, revision, iterations, hash: await hashPassword(password, salt) };
};
const matchesPassword = async (password: string, credential: Credential) => {
  const actual = decode(await hashPassword(password, credential.salt));
  const expected = decode(credential.hash);
  if (actual.length !== expected.length) return false;
  return actual.reduce((difference, value, index) => difference | (value ^ expected[index]), 0) === 0;
};
const sessionUser = ({ profiles, credentials }: AccountRecords, session: Session | null): AccountUser | null => {
  if (!session || !credentials.some((credential) => credential.userId === session.userId && credential.revision === session.revision)) return null;
  return profiles.find((profile) => profile.id === session.userId) ?? null;
};
const requireUser = (records: AccountRecords) => {
  const user = sessionUser(records, readSession());
  if (!user) throw new Error(`Sign In To Continue`);
  return user;
};
const serialized = (key: string, value: unknown) => ({ key, value: value === null ? null : JSON.stringify(value) });

export const getCurrentUser = async (): Promise<AccountUser | null> => {
  const session = readSession();
  return session ? sessionUser(readAccounts(), session) : null;
};
export const subscribeAuth = (listener: () => void) => subscribeStorage(storageKeys, listener);

export const signUp = (input: SignUpInput): Promise<AccountUser> => accountLock(async () => {
  const email = normalizeEmail(input.email);
  const displayName = cleanText(input.displayName, 80);
  validateEmail(email);
  validatePassword(input.password);
  if (!displayName) throw new Error(`Add Your Name To Continue`);
  const records = readAccounts();
  if (records.profiles.some((user) => user.email === email)) throw new Error(`An Account With This Email Already Exists — Sign In Instead`);
  const storedNumber = readJSON<unknown>(numberKey, 0);
  if (typeof storedNumber !== `number` || !Number.isSafeInteger(storedNumber) || storedNumber < 0) throw new Error(`Your Account Counter Could Not Be Read`);
  const number = Math.max(storedNumber, ...records.profiles.map((user) => user.number), 0) + 1;
  const createdAt = new Date().toISOString();
  const id = createRecordId(`User`, number, displayName, createdAt);
  const user: AccountUser = { id, number, email, displayName, role: `Subscriber`, photoURL: null, bio: cleanText(input.bio ?? ``, 500), createdAt, updatedAt: createdAt };
  const credential = await createCredential(id, input.password);
  writeStoredValues([
    serialized(profileKey, [...records.profiles, user]),
    serialized(credentialKey, [...records.credentials, credential]),
    serialized(numberKey, number),
    serialized(sessionKey, { userId: id, revision: credential.revision }),
  ]);
  return user;
});

export const signIn = (input: SignInInput): Promise<AccountUser> => accountLock(async () => {
  const email = normalizeEmail(input.email);
  validateEmail(email);
  if (!input.password || input.password.length > 128) throw new Error(`Enter Your Password`);
  const records = readAccounts();
  const user = records.profiles.find((profile) => profile.email === email);
  const credential = records.credentials.find((record) => record.userId === user?.id);
  if (!user || !credential || !await matchesPassword(input.password, credential)) throw new Error(`Email Or Password Is Incorrect`);
  writeStoredValues([serialized(sessionKey, { userId: user.id, revision: credential.revision })]);
  return user;
});

export const signOut = (): Promise<void> => accountLock(async () => { writeStoredValues([serialized(sessionKey, null)]); });

export const updateProfile = (input: ProfileInput): Promise<AccountUser> => accountLock(async () => {
  const records = readAccounts();
  const current = requireUser(records);
  const displayName = cleanText(input.displayName, 80);
  if (!displayName) throw new Error(`Your Name Cannot Be Empty`);
  const user = { ...current, displayName, bio: cleanText(input.bio, 500), updatedAt: new Date().toISOString() };
  writeStoredValues([serialized(profileKey, records.profiles.map((profile) => profile.id === user.id ? user : profile))]);
  return user;
});

export const changePassword = (currentPassword: string, nextPassword: string): Promise<void> => accountLock(async () => {
  validatePassword(nextPassword);
  const records = readAccounts();
  const user = requireUser(records);
  const credential = records.credentials.find((record) => record.userId === user.id);
  if (!credential || !await matchesPassword(currentPassword, credential)) throw new Error(`Current Password Is Incorrect`);
  const nextCredential = await createCredential(user.id, nextPassword);
  writeStoredValues([
    serialized(credentialKey, records.credentials.map((record) => record.userId === user.id ? nextCredential : record)),
    serialized(sessionKey, { userId: user.id, revision: nextCredential.revision }),
  ]);
});

export const deleteAccount = (password: string): Promise<void> => accountLock(async () => {
  const records = readAccounts();
  const user = requireUser(records);
  const credential = records.credentials.find((record) => record.userId === user.id);
  if (!credential || !await matchesPassword(password, credential)) throw new Error(`Password Is Incorrect`);
  writeStoredValues([
    ...accountDataDeletionWrites(user.id),
    serialized(profileKey, records.profiles.filter((profile) => profile.id !== user.id)),
    serialized(credentialKey, records.credentials.filter((record) => record.userId !== user.id)),
    serialized(sessionKey, null),
  ]);
});
