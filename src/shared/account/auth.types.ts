export type AccountUser = {
  id: string;
  bio: string;
  email: string;
  number: number;
  displayName: string;
  photoURL: string | null;
  role: `Subscriber`;
  createdAt: string;
  updatedAt: string;
};

export type SignInInput = { email: string; password: string };
export type SignUpInput = SignInInput & { displayName: string; bio?: string };
export type ProfileInput = Pick<AccountUser, `displayName` | `bio`>;
