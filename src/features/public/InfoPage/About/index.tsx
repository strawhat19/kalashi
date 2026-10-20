import { Link } from 'expo-router';
import { infoContent } from '../content';
import { styles } from '../styles.native';
import type { NativePageProps } from '../native.types';
import { Image, Pressable, Text, View } from 'react-native';
import { artist, releases } from '../../../../config/artist';

const About = ({ onHeroLayout }: NativePageProps) => <>
  <View nativeID={`about-hero`} style={styles.originHero} onLayout={event => onHeroLayout(event.nativeEvent.layout.height)}>
    <View nativeID={`about-register`} style={styles.register}><Text style={styles.micro}>{`KALASHI / ARTIST DOSSIER`}</Text><Text style={styles.redMicro}>{`BD → ATL`}</Text></View>
    <Text nativeID={`about-eyebrow`} style={styles.kicker}>{`THE ORIGIN / THE SOUND / THE WORLD`}</Text>
    <Text nativeID={`about-title`} accessibilityRole={`header`} style={styles.originTitle}>{`TWO WORLDS.
`}<Text style={styles.lime}>{`ONE SOUND.`}</Text></Text>
    <View nativeID={`about-editorial`} style={styles.originEditorial}>
      <View nativeID={`about-route`} style={styles.originRoute} accessibilityLabel={`Born in Bangladesh. Based in Atlanta.`}><Text style={styles.micro}>{`THE ROOTS`}</Text><Text style={styles.routeType}>{`BD`}</Text><Text style={styles.routeArrow}>{`↘`}</Text><Text style={styles.routeType}>{`ATL`}</Text><Text style={styles.micro}>{`THE FREQUENCY`}</Text></View>
      <View style={styles.portraitWrap}><Image nativeID={`about-artist-image`} source={require('../../../../../assets/music/portrait.jpg')} accessibilityLabel={`Kalashi standing in a concrete doorway, holding a baseball cap`} style={styles.portrait} /><Text nativeID={`about-artist-caption`} style={styles.portraitCaption}>{`BANGLADESH-BORN / ATLANTA-BASED`}</Text></View>
    </View>
    <View nativeID={`about-opening-note`} style={styles.originNote}><Text style={styles.micro}>{`A NOTE ON THE ARTIST`}</Text><Text style={styles.editorialCopy}>{infoContent.about.description}</Text><Link nativeID={`about-spotify-link`} href={artist.spotifyUrl} style={styles.link}>{`▷ Step Into The Sound ↗`}</Link></View>
  </View>
  <View nativeID={`about-story`} style={styles.body}>
    {infoContent.about.sections.map((section, index) => <View key={section.title} nativeID={`about-section-${index}`} style={styles.storyChapter}><Text style={styles.redMicro}>{`0${index + 1} / THE STORY`}</Text><Text nativeID={`about-section-title-${index}`} accessibilityRole={`header`} style={styles.sectionTitle}>{section.title}</Text>{section.paragraphs.map((paragraph, paragraphIndex) => <Text key={paragraphIndex} nativeID={`about-section-${index}-paragraph-${paragraphIndex}`} style={styles.paragraph}>{paragraph}</Text>)}</View>)}
  </View>
  <View nativeID={`about-featured-music`} style={styles.catalog}>
    <Text style={styles.micro}>{`THE RECORDS / A PLACE TO BEGIN`}</Text><Text nativeID={`about-catalog-title`} accessibilityRole={`header`} style={styles.catalogTitle}>{`HEAR THE STORY.`}</Text>
    {releases.map((release, index) => <Link key={release.spotifyUrl} nativeID={`about-release-${index}`} href={release.spotifyUrl} asChild><Pressable accessibilityRole={`link`} accessibilityLabel={`Listen to ${release.title} on Spotify`} style={styles.release}><Image nativeID={`about-release-image-${index}`} source={release.artwork} accessibilityLabel={`${release.title} cover`} style={styles.artwork} /><View style={styles.releaseCopy}><Text style={styles.micro}>{`${release.type.toUpperCase()} / ${release.year}`}</Text><Text nativeID={`about-release-title-${index}`} style={styles.releaseTitle}>{`${release.title} ↗`}</Text></View></Pressable></Link>)}
    <Link nativeID={`about-explore-link`} href={`/music`} style={styles.link}>{`Explore The Music ↗`}</Link>
  </View>
</>;

export default About;
