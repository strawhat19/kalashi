export type InfoPageKey = `about` | `contact` | `support` | `terms` | `privacy`;
export type InfoSection = { title: string; paragraphs: string[] };
type InfoContent = {
  title: string;
  kicker: string;
  lines: [string, string];
  description: string;
  sections: InfoSection[];
  notice?: string;
};

export const infoContent: Record<InfoPageKey, InfoContent> = {
  about: {
    title: `About Kalashi`,
    kicker: `01 / THE STORY`,
    lines: [`TWO WORLDS.`, `ONE SOUND.`],
    description: `Bangladesh roots. Atlanta energy. A little closer to the artist behind the frequency.`,
    sections: [
      {
        title: `From Bangladesh to Atlanta.`,
        paragraphs: [
          `Kalashi is a Bangladesh-born artist based in Atlanta, Georgia. That connection between two places sits at the heart of this world: Bangladesh roots, Atlanta energy, and music that invites you to find your own frequency.`,
          `Start with the music. Explore the releases, find something to keep on repeat, and follow the listening links into Kalashi’s catalog.`,
        ],
      },
      {
        title: `More than a play button.`,
        paragraphs: [
          `The Sound Lab is a space to make the music visible. Explore moving waveforms and orbiting bars, adjust the energy, or bring your own track into the browser visualizer.`,
          `Keep a few favorites in your library and make this corner of Kalashi’s world your own. No sign-in is needed to explore.`,
        ],
      },
    ],
  },
  contact: {
    title: `Contact Kalashi`,
    kicker: `02 / GET IN TOUCH`,
    lines: [`LET’S TALK.`, `MAKE A CONNECTION.`],
    description: `Bookings, collaborations, press, or just a note. Put the idea into words.`,
    sections: [
      {
        title: `Bring the details.`,
        paragraphs: [`For a booking or collaboration, include the date, location, project, and the best way to reach you. For press, include the publication and any deadline.`],
      },
      {
        title: `Your inquiry, in one place.`,
        paragraphs: [`Choose a topic, add your details, and save your inquiry. You can also copy or download a version for your records. Visit Help for playback and library questions.`],
      },
    ],
  },
  support: {
    title: `Help & Support`,
    kicker: `03 / KEEP LISTENING`,
    lines: [`KEEP THE`, `MUSIC GOING.`],
    description: `A few answers to keep you in your frequency.`,
    sections: [
      {
        title: `How do I listen?`,
        paragraphs: [`Open a release on its linked music service, or visit the artist’s Spotify page. The site also includes an embedded Spotify player. Each service handles its own playback availability, sign-in, and subscription requirements.`],
      },
      {
        title: `What makes the Sound Lab move?`,
        paragraphs: [`The visualizer starts with ambient motion. On web, Load Your Own Track analyzes an audio file on your device. Sync Site Audio asks your browser to share this tab’s audio; choose this tab and enable audio sharing when supported. Audio is analyzed locally, without recording or uploading it.`, `Stop Sync ends the sharing session. Pause controls stop visual motion or local playback separately. Reduced-motion preferences are respected. The native app currently supports ambient visualizer motion and tuning; local-file analysis and tab sharing are web features.`],
      },
      {
        title: `Where are my favorites?`,
        paragraphs: [`Open My Library to find your saved releases, then organize them into Collections. Your Kalashi library is separate from your Spotify library.`, `Use Settings to manage your profile, preferences, and saved data. If a change cannot be saved, keep the page open and try again.`],
      },
      {
        title: `Can I create an account?`,
        paragraphs: [`Choose Create Account and enter your name, email, and password. You can then sign in, personalize your profile, and manage your saved items. If you need to change your password, sign in and open Settings.`],
      },
      {
        title: `How do I prepare an inquiry?`,
        paragraphs: [`Visit Contact, choose the right topic, and include your project details. Save the inquiry to keep it with your records, or copy, download, or share a version when you need it.`],
      },
    ],
  },
  terms: {
    title: `Terms of Use`,
    kicker: `04 / SITE INFORMATION`,
    lines: [`THE SMALL`, `PRINT.`],
    description: `How this Kalashi experience works, what you can use, and what stays with the music.`,
    sections: [
      {
        title: `Explore freely.`,
        paragraphs: [`You can browse the artist pages, journal, music links, and Sound Lab without signing in. Create an account when you want to personalize your profile and return to your saved items.`],
      },
      {
        title: `Respect the music.`,
        paragraphs: [`The music, artwork, artist identity, and other creative materials retain their respective rights. Listening to or favoriting a release does not purchase, download, or license a recording. Use the official listening links and obtain permission for any reuse that requires it.`],
      },
      {
        title: `External listening services.`,
        paragraphs: [`Official listening links and Spotify embeds are provided for listening. External music services manage their own accounts, playback availability, terms, and data practices. Availability may vary by device, location, and service account.`],
      },
      {
        title: `Your account and library.`,
        paragraphs: [`Keep your account details accurate and choose a password you can keep private. Favorites and collections help organize listening links; they do not give ownership of a recording or publish your collection to other listeners. Use Settings to manage your profile and saved data.`],
      },
      {
        title: `Bring audio you can use.`,
        paragraphs: [`The web Sound Lab can analyze a local audio file or browser-approved tab audio. Choose audio you have permission to use, and share only the intended tab. The site does not grant rights to that audio or record and upload your session.`],
      },
      {
        title: `Questions and updates.`,
        paragraphs: [`Visit Help for feature guidance and Contact to save a question or inquiry. Include only information you are comfortable keeping in your records. The site’s features and these terms may be updated as the experience evolves.`],
      },
    ],
  },
  privacy: {
    title: `Privacy Policy`,
    kicker: `05 / YOUR PRIVACY`,
    lines: [`YOUR DATA.`, `YOUR SPACE.`],
    description: `A clear look at what stays on your device and where other services are involved.`,
    notice: `Your profile, library, and saved inquiries are stored in this browser. They do not sync between devices, and clearing site data removes them. Native app data stays in the current session.`,
    sections: [
      {
        title: `Favorites and preferences.`,
        paragraphs: [`Kalashi saves favorite release references, collection names and membership, your display name and bio, navigation preferences, and visualizer settings so you can return to your experience. Your Kalashi library remains separate from your Spotify account.`],
      },
      {
        title: `Control your data.`,
        paragraphs: [`Settings lets you manage your profile, password, favorites, and collections. You can delete your account when you no longer want to keep it. Clear this site’s browser data to remove all remaining saved preferences and inquiries. Keep a copy of anything you want to retain before clearing data.`],
      },
      {
        title: `Audio stays local.`,
        paragraphs: [`A file selected in the web Sound Lab is played and analyzed in the browser. It is not uploaded. Optional Sync Site Audio uses an explicit browser sharing prompt to analyze tab audio locally. The site does not record or upload that session.`, `Use Stop Sync or your browser’s sharing controls to stop capture. Leaving the audio component ends its capture session. Avoid sharing a tab that contains audio you do not intend to analyze.`],
      },
      {
        title: `Listening and hosting services.`,
        paragraphs: [`Spotify embeds and listening links load or open external music services, which handle their own playback and data practices. The public home page includes Vercel Web Analytics. Hosting and embedded services may process information needed to deliver their services under their own policies.`],
      },
      {
        title: `Inquiries and accounts.`,
        paragraphs: [`Saving a Contact inquiry keeps its topic, name, email, message, and saved date with your records. This action does not email the artist. If you copy, download, or share an inquiry elsewhere, your chosen destination handles that copy.`, `Creating an account saves your email, profile, and a salted password hash. Password information is kept separate from your profile; your password is not stored in plain text. Signing in restores that account’s browser session.`],
      },
      {
        title: `Questions about privacy.`,
        paragraphs: [`Choose Privacy on the Contact page to prepare and save a question about your data. For direct control of information saved by this site, use Settings or your browser’s site-data controls.`],
      },
    ],
  },
};
