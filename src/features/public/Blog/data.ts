import { artist, releases } from '../../../config/artist';
import type { ImageSourcePropType } from 'react-native';

export type BlogCategory = `World` | `Listening` | `Sound Lab`;
export type BlogSource = {
  href: string;
  title: string;
  credit: string;
  reviewedAt: string;
  provenance: string;
};
export type BlogArticle = {
  id: string;
  number: number;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  status: `draft` | `published` | `archived`;
  image: { web: string; native: ImageSourcePropType; alt: string };
  sections: readonly { heading: string; paragraphs: readonly string[] }[];
  sources: readonly BlogSource[];
  relatedSlugs: readonly string[];
};

const editorialDate = `2026-10-20`;
const siteSource = (href: string, title: string): BlogSource => ({
  href,
  title,
  credit: `Kalashi Music`,
  reviewedAt: editorialDate,
  provenance: `Based on the current site's artist information and working feature implementation.`,
});
const spotifySource = (href: string, title: string): BlogSource => ({
  href,
  title,
  credit: `Kalashi on Spotify`,
  reviewedAt: editorialDate,
  provenance: `Official catalog destination linked by this site; artist/release title verified on Spotify.`,
});

export const blogCategories: readonly BlogCategory[] = [`World`, `Listening`, `Sound Lab`];
export const blogCategorySlug = (category: BlogCategory) => category.toLowerCase().replace(/\s+/gu, `-`);
export const resolveBlogCategory = (slug: string | undefined): BlogCategory | `All` | null => (
  slug === undefined ? `All` : blogCategories.find(category => blogCategorySlug(category) === slug) ?? null
);
export const blogArticles: readonly BlogArticle[] = [
  {
    number: 1,
    category: `World`,
    status: `published`,
    slug: `two-worlds-one-signal`,
    title: `Two worlds. One signal.`,
    author: `Kalashi Site Editorial`,
    createdAt: editorialDate,
    updatedAt: editorialDate,
    publishedAt: editorialDate,
    id: `Article_1_Two-Worlds_2026-10-20_6f998e44-90cf-49ec-8d6f-8cb706fa5581`,
    excerpt: `Bangladesh roots. Atlanta energy. A way into the world of Kalashi, without putting the music in a box.`,
    image: {
      web: `/media/music/portrait.jpg`,
      native: require('../../../../assets/music/portrait.jpg'),
      alt: `Kalashi artist portrait`,
    },
    sections: [
      {
        heading: `Start with the person`,
        paragraphs: [
          `The Kalashi story presented on this site starts with Bangladesh and continues in Atlanta. Those two places are part of the artist's introduction, but a place name can only tell you so much. The next step is to listen: spend a little time with a track before deciding where it belongs in your own world.`,
          `Think of these journal notes as a companion to that first visit. They are site editorial, rather than artist interviews or personal quotations. The music, official catalog links and the artist's own future updates are the places to go for more.`,
        ],
      },
      {
        heading: `Let the music lead`,
        paragraphs: [
          `You do not need a complete discography, a genre label or a perfect listening setup to begin. Choose one of the releases featured here and give it a little room. On a second listen, notice a different detail: a vocal phrase, a change in the arrangement, or the space between sounds. That is a listening suggestion, not a claim about how any particular recording was made.`,
          `The site's Music page is a small starting point. Spotify opens the official artist destination when you want to continue beyond the releases featured on this website. Its catalog and availability are managed by Spotify.`,
        ],
      },
      {
        heading: `Find your own frequency`,
        paragraphs: [
          `The visual language around the music is deliberately direct: dark space, bright green signals and a mark that moves. Sound Lab gives that idea a hands-on place to live. You can explore ambient motion, change the shape of a signal, or use supported audio tools to make the visuals respond to sound.`,
          `Take the route that feels natural: the story first, a release first, or a few minutes playing with the visuals. There is no required order. The point of the site is to make the next listen easy to reach.`,
        ],
      },
    ],
    sources: [
      siteSource(`/about`, `About Kalashi`),
      spotifySource(artist.spotifyUrl, `Kalashi — official Spotify artist page`),
    ],
    relatedSlugs: [`three-releases-your-own-route`, `make-the-sound-move`],
  },
  {
    number: 2,
    category: `Listening`,
    status: `published`,
    slug: `three-releases-your-own-route`,
    title: `Three releases. Your own route.`,
    author: `Kalashi Site Editorial`,
    createdAt: editorialDate,
    updatedAt: editorialDate,
    publishedAt: editorialDate,
    id: `Article_2_Three-Releases_2026-10-20_37caa372-64b3-4561-9cea-214db79cf442`,
    excerpt: `A listening guide to the featured catalog: Come Thru, MiSSery and Passenger Princess. Start anywhere. Stay a while.`,
    image: {
      web: releases[1].webArtwork,
      native: releases[1].artwork,
      alt: `MiSSery album artwork`,
    },
    sections: [
      {
        heading: `A starting point, not a ranking`,
        paragraphs: [
          `Come Thru, MiSSery and Passenger Princess are the three releases currently featured on this site. Spotify identifies Come Thru and Passenger Princess as singles, and MiSSery as an album. This guide offers a few ways to explore those entries; the order below is editorial, rather than a release chronology or a ranking.`,
          `Use the official links below to open the recordings on Spotify. Playback, previews, sign-in requirements and regional availability are handled by that service. A website card is a doorway into the music, rather than a promise that every player will behave the same way on every device.`,
        ],
      },
      {
        heading: `One track at a time`,
        paragraphs: [
          `If you like to start small, begin with Come Thru. Let the first play be a first play: there is no need to analyze every moment. Return to it later and see which details you remember. A familiar recording can feel different when you hear it in a different part of your day.`,
          `Passenger Princess gives you another single to step into next. Listen in whichever order you prefer, or keep returning to one release. The useful comparison is your own response, rather than a set of expectations someone else has written for you.`,
        ],
      },
      {
        heading: `Make space for an album`,
        paragraphs: [
          `For a longer route, open MiSSery and follow the album's sequence on Spotify. Try a first pass with fewer interruptions, then revisit the tracks you want to hear again. This is a suggested listening habit, not a claim about the album's intended narrative.`,
          `The Music page brings the featured artwork and destinations together. The artist page on Spotify is there when you want to explore the wider available catalog. Favoriting a release in your library keeps its reference handy for another listen; it does not download the recording or grant a listening license.`,
        ],
      },
    ],
    sources: [
      spotifySource(releases[0].spotifyUrl, `Come Thru — single on Spotify`),
      spotifySource(releases[1].spotifyUrl, `MiSSery — album on Spotify`),
      spotifySource(releases[2].spotifyUrl, `Passenger Princess — single on Spotify`),
      siteSource(`/music`, `Featured music on Kalashi`),
    ],
    relatedSlugs: [`two-worlds-one-signal`, `make-the-sound-move`],
  },
  {
    number: 3,
    category: `Sound Lab`,
    status: `published`,
    slug: `make-the-sound-move`,
    title: `Make the sound move.`,
    author: `Kalashi Site Editorial`,
    createdAt: editorialDate,
    updatedAt: editorialDate,
    publishedAt: editorialDate,
    id: `Article_3_Sound-Lab_2026-10-20_f3a66731-51b5-45f8-b111-eb758893942f`,
    excerpt: `A practical guide to waveform, orbit, ambient motion and the audio tools already inside Kalashi's Sound Lab.`,
    image: {
      web: releases[0].webArtwork,
      native: releases[0].artwork,
      alt: `Come Thru artwork, featured alongside the Sound Lab listening guide`,
    },
    sections: [
      {
        heading: `Begin with the ambient signal`,
        paragraphs: [
          `Sound Lab can move before you play a recording. Its ambient signal is generated by the site, so motion alone does not mean that the visuals are reacting to Spotify or listening to a microphone. The status label tells you whether the current view is ambient, audio reactive, paused or respecting reduced motion.`,
          `Switch between Waveform and Orbit to change the presentation. Open Tune Visuals to adjust intensity, speed and density. Speed changes the ambient movement and orbit rotation; it does not change the tempo of a recording. Reset returns the controls to their default settings.`,
        ],
      },
      {
        heading: `Bring your own sound`,
        paragraphs: [
          `On supported web browsers, the local-audio controls let you choose an audio file from your device. The browser plays and analyzes that file locally for the visualizer. Choosing it is not an upload to a Kalashi account. Clear the selection when you are finished, and only choose audio you are comfortable playing on your current device.`,
          `Spotify embeds are separate players. The visualizer cannot directly read an embedded player's audio across its service boundary. On supported desktop browsers, Sync Site Audio offers an explicit tab-sharing flow instead: choose this site's tab and enable Share tab audio in the browser dialog. If the browser cannot supply tab audio, the interface explains that limitation.`,
        ],
      },
      {
        heading: `Keep the controls yours`,
        paragraphs: [
          `Stop Sync ends a running tab-sharing session. Pause stops visual movement, while the audio source keeps its own playback controls. If you prefer still visuals, your device's reduced-motion setting turns the animation off. Native app views provide their supported ambient controls; browser file playback and tab sharing are web features.`,
          `Try a low intensity first, then increase it until the signal feels comfortable. The tool is a way to explore motion alongside music, not a measurement of the recording's artistic quality or an audio-editing effect. Your original recording stays at its original tempo.`,
        ],
      },
    ],
    sources: [
      siteSource(`/sound-lab`, `Kalashi Sound Lab — controls and playback notices`),
      siteSource(`/privacy`, `Kalashi privacy and local-data information`),
    ],
    relatedSlugs: [`three-releases-your-own-route`, `two-worlds-one-signal`],
  },
];

export const articleReadingMinutes = (article: BlogArticle) => Math.max(1, Math.ceil(
  article.sections.flatMap(section => section.paragraphs).join(` `).split(/\s+/u).length / 200,
));
export const formatEditorialDate = (value: string) => new Intl.DateTimeFormat(`en-US`, {
  day: `numeric`,
  year: `numeric`,
  month: `long`,
  timeZone: `UTC`,
}).format(new Date(`${value}T12:00:00Z`));
