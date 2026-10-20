import type { BlogCategory } from './data';

export const journalPresentation = {
  All: {
    title: `JOURNAL`,
    label: `Between the frequencies`,
    description: `A few words around the music. Listening guides, pieces of our world, and a little room to experiment.`,
  },
  World: {
    title: `WORLD`,
    label: `Roots / routes / perspective`,
    description: `The places, perspectives and connections around the music. A way into the world of Kalashi.`,
  },
  Listening: {
    title: `LISTENING`,
    label: `Press play / stay a while`,
    description: `A little space for a closer listen. Find a starting point, follow a release, and take your own route.`,
  },
  'Sound Lab': {
    title: `SOUND LAB`,
    label: `Sound / motion / discovery`,
    description: `Take the signal into your own hands. Practical notes for exploring the space between sound and motion.`,
  },
} satisfies Record<BlogCategory | `All`, { title: string; label: string; description: string }>;

export const journalNumber = (number: number) => `${number}`.padStart(2, `0`);
