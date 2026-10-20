import { Link } from 'expo-router';
import { useState } from 'react';
import ReleaseHighlights from '../ReleaseHighlights';
import PopularTracks from '../../../components/PopularTracks';
import { artist, releases, latestRelease } from '../../../config/artist';
import { colors, fonts } from '../../../theme/tokens';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import ReadingTop, { useReadingTop } from '../../../components/SiteChrome/ReadingTop.native';

const Music = () => {
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState(`All`);
  const { visible, opacity, onScroll, scrollRef, scrollToTop, onHeroLayout } = useReadingTop();
  const catalog = releases.map((item, index) => ({ item, index })).filter(({ item }) => filter === `All` || item.type === filter);
  return <View nativeID={`music-page`} style={styles.root}>
    <ScrollView ref={scrollRef} onScroll={onScroll} scrollEventThrottle={32} contentContainerStyle={styles.content}>
      <View nativeID={`music-page-hero`} style={[styles.hero, width > 850 && styles.heroWide]} onLayout={onHeroLayout}>
        <View nativeID={`music-hero-copy`} style={styles.heroCopy}>
          <Text nativeID={`music-page-eyebrow`} style={styles.eyebrow}>{`KALASHI RECORDS / NO BORDERS`}</Text>
          <Text nativeID={`music-page-title`} accessibilityRole={`header`} style={styles.title}>{`NO SKIPS.\nJUST FEELING.`}</Text>
          <Text nativeID={`music-page-intro`} style={styles.copy}>{`Fresh pressings. Heavy rotation. A few records you might want to keep close.`}</Text>
          <Link href={artist.spotifyUrl} nativeID={`music-artist-spotify`} style={styles.link}>{`↗ Full catalog on Spotify`}</Link>
          <Text nativeID={`music-hero-edition`} style={styles.edition}>{`BD → ATL   /   INDEPENDENT SOUND`}</Text>
        </View>
        <View nativeID={`music-native-record-object`} style={[styles.recordObject, { width: Math.min(360, width - 64), height: Math.min(360, width - 64) + 45 }]}>
          <View nativeID={`music-native-vinyl`} style={styles.vinyl} accessibilityElementsHidden><View style={styles.vinylLabel} /></View>
          <Link href={latestRelease.listeningUrl} asChild><Pressable nativeID={`music-native-featured-sleeve`} accessibilityLabel={`Listen to ${latestRelease.title} on ${latestRelease.provider}`} style={styles.sleeve}><Image source={latestRelease.artwork} nativeID={`music-native-featured-cover`} accessibilityLabel={`${latestRelease.title} cover artwork`} style={styles.heroArtwork} /><View style={styles.sleeveFooter}><Text style={styles.sleeveTitle}>{latestRelease.title}</Text><Text style={styles.sleeveArrow}>{`↗`}</Text></View></Pressable></Link>
          <View nativeID={`music-new-drop-sticker`} style={styles.sticker}><Text style={styles.stickerText}>{`NEW\nDROP`}</Text></View>
          <Text nativeID={`music-latest-date`} style={styles.recordDate}>{latestRelease.releaseLabel}</Text>
        </View>
      </View>
      <ReleaseHighlights id={`music-latest-releases`} />
      <PopularTracks id={`music-popular-tracks`} />
      <Text nativeID={`music-catalog-heading`} accessibilityRole={`header`} style={styles.subtitle}>{`THE RECORD CRATE.`}</Text>
      <View nativeID={`music-catalog-filters`} style={styles.filters}>{[`All`, `Single`, `Album`].map(value => <Pressable key={value} nativeID={`music-filter-${value.toLowerCase()}`} accessibilityRole={`button`} accessibilityState={{ selected: value === filter }} onPress={() => setFilter(value)} style={[styles.filter, value === filter && styles.filterActive]}><Text style={[styles.filterText, value === filter && styles.filterTextActive]}>{value === `All` ? `All records` : `${value}s`}</Text></Pressable>)}</View>
      {catalog.map(({ item, index }) => <View key={item.spotifyUrl} nativeID={`music-release-${index}`} style={styles.release}>
        <Image nativeID={`music-artwork-${index}`} source={item.artwork} accessibilityLabel={`${item.title} cover artwork`} style={styles.artwork} />
        <Text nativeID={`music-release-meta-${index}`} style={styles.eyebrow}>{`${item.type.toUpperCase()} / ${item.year}`}</Text>
        <Text nativeID={`music-release-title-${index}`} accessibilityRole={`header`} style={styles.subtitle}>{item.title}</Text>
        <Link nativeID={`music-release-listen-${index}`} href={item.spotifyUrl} style={styles.link}>{`▶ Listen on Spotify`}</Link>
      </View>)}
      <View nativeID={`music-next-room`} style={styles.nextRoom}><Text style={styles.nextEyebrow}>{`A DIFFERENT WAY TO LISTEN`}</Text><Text accessibilityRole={`header`} style={styles.nextTitle}>{`TAKE IT\nFOR A SPIN.`}</Text><Link href={`/sound-lab`} nativeID={`music-open-sound-lab`} style={styles.nextLink}>{`↗ Enter Sound Lab`}</Link></View>
    </ScrollView>
    <ReadingTop id={`music-scroll-to-top`} visible={visible} opacity={opacity} onPress={scrollToTop} />
  </View>;
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  hero: { gap: 28, paddingTop: 18, paddingBottom: 30 },
  heroWide: { flexDirection: `row`, alignItems: `center` },
  heroCopy: { flex: 1, gap: 22 },
  content: { gap: 24, width: `100%`, maxWidth: 1600, alignSelf: `center`, padding: 24, paddingBottom: 60 },
  title: { color: colors.green, fontFamily: fonts.display, fontSize: 59, lineHeight: 65, letterSpacing: -1 },
  copy: { color: colors.muted, fontFamily: fonts.body, fontSize: 16, lineHeight: 26 },
  eyebrow: { color: colors.green, fontFamily: fonts.body, fontSize: 10, letterSpacing: 2 },
  link: { color: colors.green, fontFamily: fonts.body, fontSize: 15, paddingVertical: 14 },
  release: { gap: 14, borderTopWidth: 1, borderColor: colors.border, paddingTop: 24 },
  artwork: { width: `100%`, aspectRatio: 1, maxWidth: 600 },
  subtitle: { color: colors.white, fontFamily: fonts.display, fontSize: 34 },
  edition: { color: colors.muted, fontFamily: fonts.body, fontSize: 8, letterSpacing: 1.5 },
  recordObject: { position: `relative`, alignSelf: `center`, marginTop: 20 },
  vinyl: { position: `absolute`, top: `12%`, right: 0, width: `80%`, aspectRatio: 1, borderRadius: 500, borderWidth: 8, borderColor: `#252c20`, backgroundColor: `#12170e`, alignItems: `center`, justifyContent: `center` },
  vinylLabel: { width: `35%`, aspectRatio: 1, borderRadius: 100, borderWidth: 2, borderColor: `#768663`, backgroundColor: colors.green },
  sleeve: { width: `77%`, backgroundColor: colors.ink, borderWidth: 1, borderColor: colors.border, transform: [{ rotate: `-8deg` }] },
  heroArtwork: { width: `100%`, aspectRatio: 1 },
  sleeveFooter: { gap: 15, padding: 12, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  sleeveTitle: { color: colors.white, fontFamily: fonts.body, fontSize: 12 },
  sleeveArrow: { color: colors.green, fontSize: 22 },
  sticker: { position: `absolute`, top: -8, right: `17%`, width: 60, height: 60, borderRadius: 30, backgroundColor: colors.green, justifyContent: `center`, alignItems: `center`, transform: [{ rotate: `12deg` }] },
  stickerText: { color: colors.black, fontFamily: fonts.body, fontSize: 11, textAlign: `center`, lineHeight: 14, letterSpacing: .8 },
  recordDate: { position: `absolute`, bottom: 0, right: 0, color: colors.muted, fontFamily: fonts.body, fontSize: 10 },
  filters: { gap: 8, flexDirection: `row`, flexWrap: `wrap` },
  filter: { minHeight: 44, padding: 12, borderWidth: 1, borderColor: colors.border },
  filterActive: { borderColor: colors.green },
  filterText: { color: colors.muted, fontFamily: fonts.body, fontSize: 12 },
  filterTextActive: { color: colors.green },
  nextRoom: { gap: 20, padding: 26, marginTop: 20, backgroundColor: colors.green },
  nextEyebrow: { color: `#35451f`, fontFamily: fonts.body, fontSize: 8, letterSpacing: 1.5 },
  nextTitle: { color: colors.black, fontFamily: fonts.display, fontSize: 48, lineHeight: 53 },
  nextLink: { color: colors.black, fontFamily: fonts.body, fontSize: 14, paddingVertical: 12 },
});

export default Music;
