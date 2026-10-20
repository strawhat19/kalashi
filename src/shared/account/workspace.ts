import { releases } from '../../config/artist';
import { cleanText } from './records';

export type LocalCollection = { id: string; title: string; releaseIds: string[]; number?: number; createdAt?: string; updatedAt?: string };
export type LocalProfile = { displayName: string; bio: string };
export type Workspace = { collections: LocalCollection[]; profile: LocalProfile; nextCollectionNumber: number };

export const workspaceStorageKey = `kalashi:local-workspace:v1`;
export const favoritesStorageKey = `kalashi:favorites:v1`;
export const navigationStorageKey = `kalashi:guest-navigation:v1`;
export const releaseIds = new Set<string>(releases.map(item => item.spotifyUrl));
export const blankWorkspace = (): Workspace => ({ collections: [], nextCollectionNumber: 1, profile: { displayName: ``, bio: `` } });

export const decodeFavorites = (raw: unknown): string[] => {
  if (!Array.isArray(raw)) throw new Error(`Your saved favorites could not be read`);
  return [...new Set(raw.filter((value): value is string => typeof value === `string` && releaseIds.has(value)))];
};

export const decodeWorkspace = (raw: unknown): Workspace => {
  if (raw === null) return blankWorkspace();
  if (!raw || typeof raw !== `object` || Array.isArray(raw)) throw new Error(`Your saved collections could not be read`);
  const data = raw as Record<string, unknown>;
  if (!Array.isArray(data.collections) || !data.profile || typeof data.profile !== `object`) throw new Error(`Your saved collections could not be read`);
  const profile = data.profile as Record<string, unknown>;
  const seen = new Set<string>();
  const collections: LocalCollection[] = [];
  for (const value of data.collections) {
    if (!value || typeof value !== `object`) throw new Error(`A saved collection could not be read. Your existing records have been kept`);
    const item = value as Record<string, unknown>;
    const id = cleanText(item.id, 180);
    const title = cleanText(item.title, 80);
    if (!id || !/^[a-zA-Z0-9_-]+$/u.test(id) || !title || seen.has(id)) throw new Error(`A saved collection could not be read. Your existing records have been kept`);
    seen.add(id);
    const number = typeof item.number === `number` && Number.isSafeInteger(item.number) && item.number > 0 ? item.number : undefined;
    collections.push({
      id,
      title,
      ...(number ? { number } : {}),
      releaseIds: Array.isArray(item.releaseIds) ? decodeFavorites(item.releaseIds) : [],
      ...(typeof item.createdAt === `string` ? { createdAt: item.createdAt } : {}),
      ...(typeof item.updatedAt === `string` ? { updatedAt: item.updatedAt } : {}),
    });
  }
  const maximum = Math.max(0, ...collections.map(item => item.number ?? 0));
  const next = typeof data.nextCollectionNumber === `number` && Number.isSafeInteger(data.nextCollectionNumber) ? data.nextCollectionNumber : 1;
  return { collections, nextCollectionNumber: Math.max(maximum + 1, next, 1), profile: { displayName: cleanText(profile.displayName, 80), bio: cleanText(profile.bio, 500) } };
};
