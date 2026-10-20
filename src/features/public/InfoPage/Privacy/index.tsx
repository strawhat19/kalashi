import { Link } from 'expo-router';
import { infoContent } from '../content';
import { styles } from '../styles.native';
import { Pressable, Text, View } from 'react-native';
import type { NativePageProps } from '../native.types';

const mapItems = [
  { id: `saved`, title: `YOUR SAVED SPACE`, detail: `This app session`, section: 0 },
  { id: `audio`, title: `WEB SOUND LAB AUDIO`, detail: `Processed in your browser`, section: 2 },
  { id: `services`, title: `OTHER SERVICES`, detail: `Their own policies`, section: 3 },
];

const Privacy = ({ onNavigate, onPageLayout, onHeroLayout, onSectionLayout }: NativePageProps) => <View nativeID={`privacy-document`} style={styles.privacyPage} onLayout={event => onPageLayout(event.nativeEvent.layout.y)}>
  <View nativeID={`privacy-hero`} style={styles.privacyHero} onLayout={event => onHeroLayout(event.nativeEvent.layout.height)}><Text nativeID={`privacy-eyebrow`} style={styles.kicker}>{`A MAP OF YOUR DIGITAL SPACE`}</Text><Text nativeID={`privacy-title`} accessibilityRole={`header`} style={styles.privacyTitle}>{`YOUR DATA.
`}<Text style={styles.lime}>{`YOUR SPACE.`}</Text></Text><Text nativeID={`privacy-description`} style={styles.description}>{infoContent.privacy.description}</Text><View style={styles.privacyMapLabel}><Text style={styles.micro}>{`FOLLOW THE INFORMATION`}</Text><Text style={styles.routeArrow} accessible={false}>{`↓`}</Text></View></View>
  <View nativeID={`privacy-data-map`} style={styles.privacyMap}>{mapItems.map((item, index) => <Pressable key={item.id} nativeID={`privacy-map-${item.id}`} accessibilityRole={`button`} accessibilityLabel={`Read about ${item.title.toLowerCase()}`} onPress={() => onNavigate(`privacy-section-${item.section}`)} style={styles.privacyNode}><View style={styles.register}><Text style={styles.kicker}>{`0${index + 1}`}</Text><Text style={styles.kicker} accessible={false}>{`↗`}</Text></View><Text accessibilityRole={`header`} style={styles.privacyNodeTitle}>{item.title}</Text><Text style={styles.privacyDestination}>{`● ${item.detail}`}</Text></Pressable>)}</View>
  <View nativeID={`privacy-disclosure-notice`} style={styles.privacyRetention}><Text style={styles.kicker}>{`KEEP THIS IN MIND`}</Text><Text style={styles.paragraph}>{infoContent.privacy.notice}</Text></View>
  <View nativeID={`privacy-index`} style={styles.privacyIndex}><Text style={styles.redMicro}>{`THE DETAILS ↓`}</Text>{infoContent.privacy.sections.map((section, index) => <Pressable key={section.title} nativeID={`privacy-index-${index}`} accessibilityRole={`button`} accessibilityLabel={`Go to ${section.title}`} onPress={() => onNavigate(`privacy-section-${index}`)} style={styles.privacyIndexLink}><Text style={styles.micro}>{`0${index + 1}`}</Text><Text style={styles.privacyIndexText}>{section.title}</Text><Text style={styles.kicker} accessible={false}>{`↘`}</Text></Pressable>)}</View>
  {infoContent.privacy.sections.map((section, index) => <View key={section.title} nativeID={`privacy-section-${index}`} style={styles.privacyChapter} onLayout={event => onSectionLayout(`privacy-section-${index}`, event.nativeEvent.layout.y)}><Text style={styles.kicker}>{`0${index + 1} /`}</Text><Text nativeID={`privacy-section-title-${index}`} accessibilityRole={`header`} style={styles.sectionTitle}>{section.title}</Text>{section.paragraphs.map((paragraph, paragraphIndex) => <Text key={paragraphIndex} nativeID={`privacy-section-${index}-paragraph-${paragraphIndex}`} style={styles.paragraph}>{paragraph}</Text>)}{index === 1 ? <Link nativeID={`privacy-settings-link`} href={`/settings`} style={styles.link}>{`Manage Your Space ↗`}</Link> : null}</View>)}
</View>;

export default Privacy;
