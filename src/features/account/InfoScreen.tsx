import Head from 'expo-router/head';
import { Link } from 'expo-router';
import { Platform, ScrollView, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/tokens';
import { AccountLink, Copy, Panel, element, styles } from './ui';

const content = {
  about: { title: `About Kalashi`, sections: [
    [`Bangladesh to Atlanta`, `Kalashi is the Bangladesh-born, Atlanta-based artist featured on this site. Explore the existing releases and the interactive Sound Lab from the home page.`],
    [`The catalog`, `Come Thru, MiSSery and Passenger Princess are the releases currently featured. Follow the official Spotify links for listening and the wider catalog.`],
  ] },
  contact: { title: `Contact Kalashi`, sections: [
    [`Get in touch`, `A verified artist contact destination is still being configured. This preview does not send messages, booking inquiries or submissions.`],
    [`Need help?`, `For local favorites and account-preview information, read Help & support. For Spotify playback, use Spotify support within that service.`],
  ] },
  support: { title: `Help & support`, sections: [
    [`Listening`, `Open the artist or release links to listen on Spotify. Availability, sign-in and playback are handled by Spotify.`],
    [`Favorites`, `The library saves release references in this browser where storage is available. Native previews retain favorites for the current app session. Neither is a cloud backup.`],
    [`Accounts`, `Google sign-in, email/password and cloud sync are not available yet. Display-name and bio edits are local device preferences, not verified accounts. Do not enter credentials into this preview.`],
    [`Feedback & contact`, `A verified artist support destination and connected feedback form still need to be configured. No message submission is enabled here.`],
  ] },
  privacy: { title: `Privacy preview`, sections: [
    [`Local favorites`, `Favorite release references, collection titles/membership, navigation preferences and optional display name/bio are stored locally in your browser, or in memory for native sessions. They are not sent to a Kalashi account database. Clear favorites, lists and display profile in Settings; clear browser data to also remove navigation preferences.`],
    [`External services`, `The existing music experience uses Spotify links and embeds. Spotify handles its own playback data. The existing public-home Vercel analytics component remains separate from the disconnected internal dashboard; account pages do not load that component.`],
    [`Before launch`, `This page is a product disclosure draft, not a completed privacy policy. The operator must confirm contact details, analytics configuration, retention, consent requirements and rights-request handling before account, advertising or app-store launch.`],
  ] },
  terms: { title: `Site information`, sections: [
    [`The music`, `This site presents the Kalashi artist and release information already included in its catalog. Listening links open external services. Favoriting a release does not purchase, download or license the recording.`],
    [`Preview limitations`, `Local favorites may be lost if storage is cleared or unavailable. No subscription, paid membership, cloud account or public collection publishing is offered in this frontend preview.`],
    [`Before launch`, `Operator-reviewed terms, support contact and any applicable music, artwork and advertising permissions are required before commercial or app-store release. This page does not claim legal or platform approval.`],
  ] },
} as const;
export default function InfoScreen({ page }: { page: keyof typeof content }) {
  const info = content[page];
  return <ScrollView {...element(`information-page`, page)} style={{ flex: 1, backgroundColor: colors.black }} contentContainerStyle={{ padding: 28, gap: 24 }}>
    {Platform.OS === `web` && <Head><title>{`${info.title} | Kalashi Music`}</title><meta name={`description`} content={`Kalashi Music ${info.title.toLowerCase()}, listening and local-library information.`} />{(page === `privacy` || page === `terms`) && <meta name={`robots`} content={`noindex, follow`} />}</Head>}
    <Link {...element(`information-home`, page)} href={`/`} style={styles.link}>{`← KALASHI MUSIC`}</Link>
    <Text {...element(`information-title`, page)} accessibilityRole={`header`} style={{ color: colors.white, fontFamily: fonts.display, fontSize: 44 }}>{info.title}</Text>
    {info.sections.map(([title, body], index) => <Panel key={title} id={`${page}-${index}`} title={title}><Copy id={`${page}-copy-${index}`}>{body}</Copy></Panel>)}
    <View {...element(`information-links`, page)} style={styles.row}><AccountLink id={`${page}-library`} href={`/library`} label={`♡ Local library`} /><AccountLink id={`${page}-settings`} href={`/settings`} label={`⚙ Local data settings`} /></View>
  </ScrollView>;
}
