import { useRef } from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '../../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { artist, releases } from '../../config/artist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AudioVisualizer from '../../components/visualizer/AudioVisualizer';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

type Section = `music` | `about` | `sound`;

const openSpotify = async (url = artist.spotifyUrl) => {
  try { await Linking.openURL(url); }
  catch { Alert.alert(`Spotify Could Not Open`, `Please try again when your connection is available`); }
};

const Monogram = ({ size = 34, color = colors.green }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40" accessibilityElementsHidden>
    <Path fill={color} d={`M3 4h8v13L26 4h11L19 20l18 16H25L11 23v13H3z`} />
    <Path fill={colors.red} d={`M30 0h7v3h-7z`} />
  </Svg>
);

const SpotifyIcon = ({ color = colors.black, size = 23 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
    <Path fill={color} d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24Z" />
    <Path fill="none" stroke={colors.green} strokeWidth={1.6} strokeLinecap="round" d="M5.7 8.7c4.2-1.4 8.8-1 12.6 1.1M6.7 12c3.6-1.1 7.1-.7 10.2.9M7.6 15.2c2.6-.8 5.5-.5 8 .8" />
  </Svg>
);

const SpotifyButton = ({ label = `Listen On Spotify`, url = artist.spotifyUrl }: { label?: string; url?: string }) => (
  <Pressable accessibilityRole="link" accessibilityLabel={label} onPress={() => void openSpotify(url)} style={({ pressed }) => [styles.spotifyButton, pressed && styles.pressed]}>
    <SpotifyIcon /><Text style={styles.spotifyLabel}>{label}</Text><Text style={styles.spotifyArrow}>↗</Text>
  </Pressable>
);

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scroll = useRef<ScrollView>(null);
  const sections = useRef<Record<Section, number>>({ music: 0, about: 0, sound: 0 });
  const compact = width < 700;
  const gutter = compact ? 22 : 42;
  const contentWidth = Math.min(width, 1200);
  const titleSize = Math.min((contentWidth - gutter * 2) * 0.245, 235);
  const portraitSize = compact ? Math.min((width - gutter * 2 - 40) * 0.15, 44) : 68;
  const aboutSize = compact ? Math.min((width - gutter * 2) * 0.19, 61) : 104;
  const releaseWidth = compact ? Math.min(width * 0.73, 350) : (contentWidth - gutter * 2 - 32) / 3;
  const navigate = (section: Section) => scroll.current?.scrollTo({ y: sections.current[section], animated: true });

  return (
    <View style={styles.root}>
      <ScrollView ref={scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View style={[styles.header, styles.content, { paddingHorizontal: gutter }]}>
          <View style={styles.brand}><Monogram /><Text style={styles.brandLabel}>KALASHI MUSIC</Text></View>
          <Pressable accessibilityRole="link" accessibilityLabel="Kalashi On Spotify" onPress={() => void openSpotify()} style={({ pressed }) => [styles.headerLink, pressed && styles.pressed]}>
            <Text style={styles.headerLinkLabel}>SPOTIFY</Text><Text style={styles.headerArrow}>↗</Text>
          </Pressable>
        </View>

        <View style={[styles.content, { paddingHorizontal: gutter }]}>
          <View style={styles.heroMeta}><View style={styles.origin}><View style={styles.redDot} /><Text style={styles.eyebrow}>BANGLADESH → ATLANTA</Text></View><Text style={styles.edition}>VOL. 01</Text></View>
          <Text accessibilityRole="header" numberOfLines={1} adjustsFontSizeToFit style={[styles.heroTitle, { fontSize: titleSize, lineHeight: titleSize * 1.13 }]}>KALASHI</Text>
          <View style={[styles.portraitStage, { height: compact ? Math.min(width * 1.12, 520) : 640 }]}>
            <Image source={require('../../../assets/music/portrait.jpg')} accessibilityLabel="Kalashi Artist Portrait" style={styles.portrait} resizeMode="cover" />
            <LinearGradient colors={[`transparent`, `rgba(9,10,9,0.12)`, `rgba(9,10,9,0.94)`]} locations={[0, 0.36, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.imageTop}><Text style={styles.imageLabel}>THE WORLD OF KALASHI</Text><View style={styles.liveLabel}><View style={styles.greenDot} /><Text style={styles.imageLabel}>IN ROTATION</Text></View></View>
            <View style={styles.portraitCopy}>
              <Text style={[styles.portraitHeadline, { fontSize: portraitSize, lineHeight: portraitSize * 1.12 }]}>NO BORDERS.{`\n`}JUST FREQUENCY.</Text>
              <Text style={styles.portraitDescription}>Bangladesh born. Atlanta in the sound.</Text>
              <SpotifyButton />
            </View>
          </View>
          <View style={styles.heroBottom}><Text style={styles.heroCaption}>A little out of place.{`\n`}Exactly where he belongs.</Text><Text style={styles.scrollCue}>TURN IT UP{`\n`}↓</Text></View>
          <View style={styles.sectionNav}>
            {([{ id: `music`, label: `Music` }, { id: `about`, label: `The Artist` }, { id: `sound`, label: `Sound Lab` }] as const).map(item => (
              <Pressable key={item.id} onPress={() => navigate(item.id)} accessibilityRole="button" accessibilityLabel={`Scroll To ${item.label}`} style={({ pressed }) => [styles.navLink, pressed && styles.pressed]}><Text style={styles.navLabel}>{item.label}</Text><Text style={styles.navArrow}>↘</Text></Pressable>
            ))}
          </View>
        </View>

        <View onLayout={event => { sections.current.music = event.nativeEvent.layout.y; }} style={[styles.content, styles.section, { paddingHorizontal: gutter }]}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionTitleGroup}><Text style={styles.sectionIndex}>01 / THE MUSIC</Text><Text accessibilityRole="header" style={[styles.sectionTitle, { fontSize: compact ? 54 : 76 }]}>ON REPEAT.</Text></View>
            <Text style={styles.headingAccent}>↗</Text>
          </View>
          <Text style={styles.sectionDescription}>Find your next late-night obsession.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -gutter }} contentContainerStyle={[styles.releaseList, { paddingHorizontal: gutter }]}>
            {releases.map((release, index) => (
              <Pressable key={release.title} onPress={() => void openSpotify(release.spotifyUrl)} accessibilityRole="link" accessibilityLabel={`Listen To ${release.title} On Spotify`} style={({ pressed }) => [styles.releaseCard, { width: releaseWidth }, pressed && styles.pressed]}>
                <View style={styles.releaseImageWrap}><Image source={release.artwork} style={styles.releaseImage} accessibilityLabel={`${release.title} Cover`} />{index === 0 && <View style={styles.latestTag}><Text style={styles.latestText}>LATEST RELEASE</Text></View>}<View style={styles.playButton}><Text style={styles.playGlyph}>▶</Text></View></View>
                <View style={styles.releaseMeta}><Text style={styles.releaseType}>{release.type.toUpperCase()} / {release.year}</Text><Text style={styles.releaseNumber}>0{index + 1}</Text></View>
                <Text style={styles.releaseTitle}>{release.title}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable onPress={() => void openSpotify()} accessibilityRole="link" accessibilityLabel="Explore Kalashi's Full Spotify Catalog" style={({ pressed }) => [styles.catalogLink, pressed && styles.pressed]}><Text style={styles.catalogLabel}>The Full Catalog</Text><Text style={styles.catalogArrow}>↗</Text></Pressable>
        </View>

        <View onLayout={event => { sections.current.about = event.nativeEvent.layout.y; }} style={styles.aboutSection}>
          <View style={[styles.content, { paddingHorizontal: gutter }]}>
            <View style={styles.aboutTop}><Text style={styles.aboutIndex}>02 / THE ARTIST</Text><Monogram color={colors.black} size={45} /></View>
            <Text accessibilityRole="header" style={[styles.aboutTitle, { fontSize: aboutSize, lineHeight: aboutSize * 1.08 }]}>TWO WORLDS.{`\n`}ONE VOICE.</Text>
            <View style={styles.aboutDivider} />
            <View style={[styles.aboutBody, !compact && styles.aboutBodyWide]}>
              <View style={styles.originDetails}><Text style={styles.originLabel}>ROOTS</Text><Text style={styles.originPlace}>{artist.origin}</Text><Text style={styles.originLabel}>FREQUENCY</Text><Text style={styles.originPlace}>{artist.home}</Text></View>
              <View style={styles.biography}><Text style={styles.bioHeadline}>Made of everywhere.{`\n`}Sounds like himself.</Text><Text style={styles.bioText}>Bengali-American artist Kalashi brings his own perspective to the Atlanta music scene. Baritone vocals, sharp wordplay, and a sound that keeps moving.</Text><Text style={styles.bioText}>From Bangladesh to Atlanta, the roots run deep. The volume stays up.</Text></View>
            </View>
            <View style={styles.aboutFooter}><Text style={styles.aboutFooterText}>BANGLADESH BORN / ATLANTA BASED</Text><View style={styles.aboutRedDot} /></View>
          </View>
        </View>

        <View onLayout={event => { sections.current.sound = event.nativeEvent.layout.y; }} style={[styles.content, styles.section, { paddingHorizontal: gutter }]}>
          <Text style={styles.sectionIndex}>03 / EXPERIMENTAL FREQUENCIES</Text>
          <Text accessibilityRole="header" style={[styles.sectionTitle, { fontSize: compact ? 54 : 76 }]}>FEEL THE SIGNAL.</Text>
          <Text style={styles.sectionDescription}>Your frequency. Your rules. Turn the dials and make it move.</Text>
          <AudioVisualizer />
          <View style={styles.labListening}><Text style={styles.labListeningText}>Keep Kalashi in rotation.</Text><SpotifyButton label="Open Spotify" /></View>
        </View>

        <View style={[styles.content, styles.footer, { paddingHorizontal: gutter }]}>
          <Text style={styles.footerEyebrow}>SAME ROOTS. NEW FREQUENCIES.</Text>
          <Pressable accessibilityRole="link" accessibilityLabel="Listen To Kalashi On Spotify" onPress={() => void openSpotify()} style={({ pressed }) => [styles.footerCta, pressed && styles.pressed]}><Text numberOfLines={1} adjustsFontSizeToFit style={[styles.footerTitle, { fontSize: compact ? 59 : 100 }]}>STAY TUNED.</Text><Text style={styles.footerArrow}>↗</Text></Pressable>
          <View style={styles.footerBottom}><View style={styles.brand}><Monogram size={22} /><Text style={styles.copyright}>© {new Date().getFullYear()} KALASHI MUSIC</Text></View><Text style={styles.footerLocation}>BD → ATL</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  content: { width: `100%`, maxWidth: 1200, alignSelf: `center` },
  header: { minHeight: 82, gap: 20, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  brand: { gap: 9, flexDirection: `row`, alignItems: `center` },
  brandLabel: { fontSize: 12, letterSpacing: 1, color: colors.white, fontFamily: fonts.body },
  headerLink: { gap: 8, minHeight: 44, flexDirection: `row`, alignItems: `center` },
  headerLinkLabel: { fontSize: 11, letterSpacing: 1, color: colors.white, fontFamily: fonts.body },
  headerArrow: { fontSize: 22, color: colors.green },
  heroMeta: { gap: 12, marginTop: 17, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  origin: { gap: 8, flexDirection: `row`, alignItems: `center` },
  redDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.red },
  greenDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.green },
  eyebrow: { fontSize: 10, letterSpacing: 1.1, color: colors.muted, fontFamily: fonts.body },
  edition: { fontSize: 10, letterSpacing: 1, color: colors.muted, fontFamily: fonts.body },
  heroTitle: { marginTop: 9, letterSpacing: -1.5, color: colors.green, fontFamily: fonts.display },
  portraitStage: { overflow: `hidden`, backgroundColor: colors.surface },
  portrait: { width: `100%`, height: `100%`, position: `absolute` },
  imageTop: { top: 18, left: 16, right: 16, gap: 15, position: `absolute`, flexDirection: `row`, justifyContent: `space-between` },
  imageLabel: { fontSize: 8, letterSpacing: 1.3, color: colors.white, fontFamily: fonts.body },
  liveLabel: { gap: 6, flexDirection: `row`, alignItems: `center` },
  portraitCopy: { left: 20, right: 20, bottom: 20, gap: 13, position: `absolute` },
  portraitHeadline: { color: colors.white, fontFamily: fonts.display },
  portraitDescription: { fontSize: 16, lineHeight: 23, color: colors.white, fontFamily: fonts.body },
  spotifyButton: { gap: 11, minHeight: 54, maxWidth: 380, paddingHorizontal: 20, borderRadius: 30, flexDirection: `row`, alignItems: `center`, backgroundColor: colors.green },
  spotifyLabel: { flex: 1, fontSize: 16, color: colors.black, fontFamily: fonts.body },
  spotifyArrow: { fontSize: 24, color: colors.black },
  pressed: { opacity: 0.7 },
  heroBottom: { gap: 22, marginTop: 22, marginBottom: 28, flexDirection: `row`, justifyContent: `space-between` },
  heroCaption: { fontSize: 16, lineHeight: 24, color: colors.muted, fontFamily: fonts.body },
  scrollCue: { fontSize: 11, lineHeight: 22, textAlign: `right`, color: colors.green, fontFamily: fonts.body },
  sectionNav: { gap: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, flexDirection: `row`, justifyContent: `space-between` },
  navLink: { gap: 7, minHeight: 60, flexDirection: `row`, alignItems: `center` },
  navLabel: { fontSize: 13, color: colors.white, fontFamily: fonts.body },
  navArrow: { fontSize: 17, color: colors.muted },
  section: { gap: 20, paddingTop: 66, paddingBottom: 66 },
  sectionHeading: { gap: 20, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  sectionTitleGroup: { gap: 15 },
  sectionIndex: { fontSize: 10, letterSpacing: 1.4, color: colors.muted, fontFamily: fonts.body },
  sectionTitle: { color: colors.white, fontFamily: fonts.display },
  headingAccent: { fontSize: 48, color: colors.green },
  sectionDescription: { marginTop: -7, maxWidth: 520, fontSize: 16, lineHeight: 25, color: colors.muted, fontFamily: fonts.body },
  releaseList: { gap: 16, paddingTop: 8, paddingBottom: 14 },
  releaseCard: { gap: 13 },
  releaseImageWrap: { aspectRatio: 1, overflow: `hidden`, backgroundColor: colors.surface },
  releaseImage: { width: `100%`, height: `100%` },
  latestTag: { top: 12, left: 12, paddingVertical: 6, paddingHorizontal: 9, position: `absolute`, backgroundColor: colors.green },
  latestText: { fontSize: 9, letterSpacing: 0.7, color: colors.black, fontFamily: fonts.body },
  playButton: { right: 12, bottom: 12, width: 48, height: 48, borderRadius: 24, position: `absolute`, alignItems: `center`, justifyContent: `center`, backgroundColor: colors.green },
  playGlyph: { marginLeft: 3, fontSize: 20, color: colors.black },
  releaseMeta: { gap: 10, flexDirection: `row`, justifyContent: `space-between` },
  releaseType: { fontSize: 10, letterSpacing: 1, color: colors.muted, fontFamily: fonts.body },
  releaseNumber: { fontSize: 10, color: colors.muted, fontFamily: fonts.body },
  releaseTitle: { marginTop: -6, fontSize: 22, color: colors.white, fontFamily: fonts.body },
  catalogLink: { gap: 12, minHeight: 48, borderTopWidth: 1, borderColor: colors.border, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  catalogLabel: { fontSize: 16, color: colors.green, fontFamily: fonts.body },
  catalogArrow: { fontSize: 25, color: colors.green },
  aboutSection: { paddingVertical: 40, backgroundColor: colors.green },
  aboutTop: { gap: 20, marginBottom: 26, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  aboutIndex: { fontSize: 10, letterSpacing: 1.4, color: colors.black, fontFamily: fonts.body },
  aboutTitle: { letterSpacing: -0.8, color: colors.black, fontFamily: fonts.display },
  aboutDivider: { height: 1, marginVertical: 29, backgroundColor: `rgba(9,10,9,0.3)` },
  aboutBody: { gap: 28 },
  aboutBodyWide: { gap: 70, flexDirection: `row` },
  originDetails: { gap: 7, minWidth: 210 },
  originLabel: { marginTop: 10, fontSize: 10, letterSpacing: 1.6, color: `#344522`, fontFamily: fonts.body },
  originPlace: { fontSize: 22, color: colors.black, fontFamily: fonts.body },
  biography: { gap: 17, flexGrow: 1, flexShrink: 1 },
  bioHeadline: { fontSize: 29, lineHeight: 36, letterSpacing: -0.5, color: colors.black, fontFamily: fonts.body },
  bioText: { fontSize: 16, lineHeight: 26, color: `#253617`, fontFamily: fonts.body },
  aboutFooter: { gap: 16, marginTop: 40, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  aboutFooterText: { fontSize: 9, letterSpacing: 1, color: colors.black, fontFamily: fonts.body },
  aboutRedDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.red },
  labListening: { gap: 16, marginTop: 8 },
  labListeningText: { fontSize: 16, color: colors.muted, fontFamily: fonts.body },
  footer: { gap: 16, paddingTop: 34, paddingBottom: 28, borderTopWidth: 1, borderColor: colors.border },
  footerEyebrow: { fontSize: 9, letterSpacing: 1.3, color: colors.muted, fontFamily: fonts.body },
  footerCta: { gap: 12, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  footerTitle: { flex: 1, color: colors.green, fontFamily: fonts.display },
  footerArrow: { fontSize: 48, color: colors.green },
  footerBottom: { gap: 10, paddingTop: 20, borderTopWidth: 1, borderColor: colors.border, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  copyright: { fontSize: 8, letterSpacing: 0.4, color: colors.muted, fontFamily: fonts.body },
  footerLocation: { fontSize: 9, letterSpacing: 1, color: colors.muted, fontFamily: fonts.body },
});
