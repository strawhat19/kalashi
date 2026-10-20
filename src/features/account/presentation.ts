const presentations = {
  library: { number: `01`, word: `ROTATION`, eyebrow: `THE RECORD CRATE`, accent: `#b1f750` },
  collections: { number: `02`, word: `MIXTAPES`, eyebrow: `MADE BY YOU`, accent: `#c4b0f0` },
  profile: { number: `03`, word: `LISTENER`, eyebrow: `YOUR LISTENER PASSPORT`, accent: `#d8cdb8` },
  settings: { number: `04`, word: `CONTROL`, eyebrow: `THE PERSONAL PATCHBAY`, accent: `#8ecad0` },
  inquiries: { number: `05`, word: `DISPATCH`, eyebrow: `YOUR MESSAGE ARCHIVE`, accent: `#ed9a72` },
  connections: { number: `06`, word: `SIGNAL`, eyebrow: `YOUR LISTENING CONNECTIONS`, accent: `#a1d6be` },
  signin: { number: `A1`, word: `ENCORE`, eyebrow: `WELCOME BACK / RE-ENTRY`, accent: `#b1f750` },
  signup: { number: `A2`, word: `ADMIT ONE`, eyebrow: `YOUR NEXT FREQUENCY`, accent: `#c4b0f0` },
  recovery: { number: `A3`, word: `REWIND`, eyebrow: `LET’S FIND YOUR WAY BACK`, accent: `#ed9a72` },
  studio: { number: `S1`, word: `STUDIO`, eyebrow: `KALASHI / BEHIND THE RECORDS`, accent: `#e84939` },
} as const;

export const getAccountPresentation = (path: string) => {
  const key = path === `/profile/inquiries` ? `inquiries`
    : path === `/forgot-password` ? `recovery`
      : path === `/sign-up` ? `signup`
        : path === `/sign-in` ? `signin`
          : path === `/library` ? `library`
            : path === `/collections` ? `collections`
              : path === `/connections` ? `connections`
                : path === `/settings` ? `settings`
                  : path === `/profile` ? `profile` : `studio`;

  return { key, ...presentations[key] };
};
