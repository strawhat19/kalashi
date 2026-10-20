import { releases } from '../../config/artist';
import { cleanText, createRecordId } from './records';
import { accountStorageKey, browserPersistence, readJSON, subscribeStorage, withStorageLock, writeJSON } from './storage';
import { decodeFavorites, decodeWorkspace, favoritesStorageKey, navigationStorageKey, workspaceStorageKey, type LocalProfile } from './workspace';

export type InquiryInput = { name: string; email: string; topic: string; message: string };
export type InquiryRecord = InquiryInput & {
  id: string;
  number: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  idempotencyKey: string;
  status: `New` | `Read` | `Archived`;
};
export type InquirySaveResult = { success: true; inquiry: InquiryRecord; duplicate: boolean; persisted: boolean } | { success: false; error: string };
type InquiryStore = { version: 1; nextNumber: number; records: InquiryRecord[] };
export type DashboardSummary = {
  inquiryCount: number;
  catalogCount: number;
  favoriteCount: number;
  collectionCount: number;
  newInquiryCount: number;
  collectionReleaseCount: number;
  loadedAt: string;
  profile: LocalProfile;
  storageMode: `browser` | `session`;
};

const inquiryKey = `kalashi:inquiries:v1`;
const topics = new Set([`Booking`, `Collaboration`, `Press`, `General`, `Privacy`]);
const emptyInquiries = (): InquiryStore => ({ version: 1, nextNumber: 1, records: [] });
const decodeInquiries = (raw: unknown): InquiryStore => {
  if (!raw || typeof raw !== `object` || Array.isArray(raw)) throw new Error(`Your saved inquiries could not be read`);
  const store = raw as Partial<InquiryStore>;
  if (store.version !== 1 || !Array.isArray(store.records) || !Number.isSafeInteger(store.nextNumber) || (store.nextNumber ?? 0) < 1) throw new Error(`Your saved inquiries could not be read`);
  const seen = new Set<string>();
  const records = store.records.filter(record => {
    if (!record || typeof record !== `object` || typeof record.id !== `string` || seen.has(record.id)) return false;
    if (!Number.isSafeInteger(record.number) || record.number < 1 || !record.id.startsWith(`Inquiry_${record.number}_`)) return false;
    if (![record.name, record.email, record.topic, record.message, record.ownerId, record.createdAt, record.updatedAt, record.idempotencyKey].every(value => typeof value === `string`)) return false;
    if (![`New`, `Read`, `Archived`].includes(record.status)) return false;
    seen.add(record.id);
    return true;
  });
  if (records.length !== store.records.length) throw new Error(`A saved inquiry could not be read. Your existing records have been kept`);
  return { version: 1, records, nextNumber: Math.max(store.nextNumber ?? 1, ...records.map(record => record.number + 1)) };
};
const fingerprint = (value: string) => {
  let result = 2166136261;
  for (const character of value) result = Math.imul(result ^ character.charCodeAt(0), 16777619);
  return (result >>> 0).toString(36);
};

export const saveInquiry = async (input: InquiryInput, options: { idempotencyKey?: string; ownerId?: string } = {}): Promise<InquirySaveResult> => {
  const ownerId = options.ownerId || `guest`;
  const record = { name: cleanText(input.name, 80), email: cleanText(input.email, 254).toLowerCase(), topic: cleanText(input.topic, 40), message: cleanText(input.message, 5000) };
  if (!record.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(record.email) || record.message.length < 20 || !topics.has(record.topic)) return { success: false, error: `Add your name, a valid email, and at least 20 characters about your inquiry` };
  const key = accountStorageKey(inquiryKey, ownerId);
  const idempotencyKey = cleanText(options.idempotencyKey, 180) || `draft-${fingerprint(JSON.stringify(record))}`;
  try {
    return await withStorageLock(key, () => {
      const saved = decodeInquiries(readJSON<unknown>(key, emptyInquiries()));
      const existing = saved.records.find(item => item.idempotencyKey === idempotencyKey);
      if (existing) {
        if (existing.name !== record.name || existing.email !== record.email || existing.topic !== record.topic || existing.message !== record.message) return { success: false, error: `This inquiry has changed. Save it with a new draft reference` } as const;
        return { success: true, inquiry: existing, duplicate: true, persisted: browserPersistence() } as const;
      }
      const timestamp = new Date().toISOString();
      const inquiry: InquiryRecord = { ...record, id: createRecordId(`Inquiry`, saved.nextNumber, record.topic, timestamp), number: saved.nextNumber, ownerId, status: `New`, createdAt: timestamp, updatedAt: timestamp, idempotencyKey };
      writeJSON(key, { version: 1, nextNumber: saved.nextNumber + 1, records: [...saved.records, inquiry] });
      return { success: true, inquiry, duplicate: false, persisted: browserPersistence() } as const;
    });
  } catch (error) { return { success: false, error: error instanceof Error ? error.message : `Your inquiry could not be saved. Please try again` }; }
};

export const listInquiries = async (ownerId = `guest`) => (
  decodeInquiries(readJSON<unknown>(accountStorageKey(inquiryKey, ownerId), emptyInquiries())).records.filter(record => record.ownerId === ownerId).sort((left, right) => right.number - left.number)
);

export const updateInquiryStatus = async (id: string, status: InquiryRecord[`status`], ownerId = `guest`) => {
  if (![`New`, `Read`, `Archived`].includes(status)) throw new Error(`Choose a supported inquiry status`);
  const key = accountStorageKey(inquiryKey, ownerId);
  return withStorageLock(key, () => {
    const saved = decodeInquiries(readJSON<unknown>(key, emptyInquiries()));
    const record = saved.records.find(item => item.id === id && item.ownerId === ownerId);
    if (!record) throw new Error(`This inquiry could not be found`);
    const next = { ...record, status, updatedAt: new Date().toISOString() };
    writeJSON(key, { ...saved, records: saved.records.map(item => item.id === id ? next : item) });
    return next;
  });
};

export const getDashboardSummary = async (ownerId = `guest`): Promise<DashboardSummary> => {
  const favorites = decodeFavorites(readJSON<unknown>(accountStorageKey(favoritesStorageKey, ownerId), []));
  const workspace = decodeWorkspace(readJSON<unknown>(accountStorageKey(workspaceStorageKey, ownerId), null));
  const inquiries = await listInquiries(ownerId);
  return { favoriteCount: favorites.length, collectionCount: workspace.collections.length, collectionReleaseCount: workspace.collections.reduce((total, collection) => total + collection.releaseIds.length, 0), inquiryCount: inquiries.length, newInquiryCount: inquiries.filter(item => item.status === `New`).length, catalogCount: releases.length, profile: workspace.profile, storageMode: browserPersistence() ? `browser` : `session`, loadedAt: new Date().toISOString() };
};

export const subscribeAccountData = (ownerId = `guest`, listener: () => void) => subscribeStorage(
  [favoritesStorageKey, workspaceStorageKey, inquiryKey].map(key => accountStorageKey(key, ownerId)), listener,
);

export const accountDataDeletionWrites = (scope: string): readonly { key: string; value: null }[] => {
  if (!scope || scope === `guest`) throw new Error(`Choose an account to remove`);
  return [favoritesStorageKey, workspaceStorageKey, navigationStorageKey, inquiryKey].map(key => ({ key: accountStorageKey(key, scope), value: null }));
};
