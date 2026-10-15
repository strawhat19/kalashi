// These contracts describe a future adapter, not a connected service.
export type AccountIdentity = { uid: string; displayName: string; photoURL: string | null };
export type FavoriteKind = `album` | `song`;
export type Favorite = { id: string; kind: FavoriteKind; catalogId: string; savedAt: string };
export type LibraryCollection = { id: string; ownerId: string; title: string; favoriteIds: string[]; visibility: `private` };
export type ConnectionState = `disconnected` | `loading` | `ready` | `error`;
export interface FutureAccountAdapter {
  subscribeIdentity: (listener: (identity: AccountIdentity | null) => void) => () => void;
  subscribeFavorites: (uid: string, listener: (favorites: Favorite[]) => void) => () => void;
  saveFavorite: (uid: string, favorite: Favorite) => Promise<void>;
  removeFavorite: (uid: string, id: string) => Promise<void>;
}
export const accountConnection: ConnectionState = `disconnected`;
// No owner email matching or client role switching. Backend authorization is required.
export const ownerAccess = false;
