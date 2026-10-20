import { Link } from 'expo-router';
import { infoContent } from '../content';
import { styles } from '../styles.native';
import { Pressable, Text, View } from 'react-native';
import type { NativePageProps } from '../native.types';

const Terms = ({ onNavigate, onPageLayout, onHeroLayout, onSectionLayout }: NativePageProps) => <View nativeID={`terms-document`} style={styles.linerNotes} onLayout={event => onPageLayout(event.nativeEvent.layout.y)}>
  <View nativeID={`terms-hero`} style={styles.linerCover} onLayout={event => onHeroLayout(event.nativeEvent.layout.height)}><Text nativeID={`terms-eyebrow`} style={styles.linerMicro}>{`KALASHI MUSIC / TERMS OF USE`}</Text><Text nativeID={`terms-title`} accessibilityRole={`header`} style={styles.linerTitle}>{`The small
print.`}</Text><Text nativeID={`terms-description`} style={styles.linerDescription}>{infoContent.terms.description}</Text><Text style={styles.linerSignature}>{`K / T&Cs`}</Text></View>
  <View nativeID={`terms-index`} style={styles.linerIndex}><Text style={styles.linerMicro}>{`THE CONTENTS`}</Text>{infoContent.terms.sections.map((section, index) => <Pressable key={section.title} nativeID={`terms-index-${index}`} accessibilityRole={`button`} accessibilityLabel={`Go to ${section.title}`} onPress={() => onNavigate(`terms-section-${index}`)} style={styles.linerIndexLink}><Text style={styles.linerIndexNumber}>{`0${index + 1}`}</Text><Text style={styles.linerIndexText}>{section.title}</Text><Text style={styles.linerIndexNumber}>{`↘`}</Text></Pressable>)}<Link nativeID={`terms-privacy-link`} href={`/privacy`} style={styles.linerPolicyLink}>{`Privacy Policy ↗`}</Link></View>
  {infoContent.terms.sections.map((section, index) => <View key={section.title} nativeID={`terms-section-${index}`} style={styles.linerChapter} onLayout={event => onSectionLayout(`terms-section-${index}`, event.nativeEvent.layout.y)}><Text style={styles.linerMicro}>{`0${index + 1} /`}</Text><Text nativeID={`terms-section-title-${index}`} accessibilityRole={`header`} style={styles.linerChapterTitle}>{section.title}</Text>{section.paragraphs.map((paragraph, paragraphIndex) => <Text key={paragraphIndex} nativeID={`terms-section-${index}-paragraph-${paragraphIndex}`} style={styles.linerParagraph}>{paragraph}</Text>)}</View>)}
  <View nativeID={`terms-end-note`} style={styles.linerEnd}><Text style={styles.linerMicro}>{`THANK YOU FOR LISTENING.`}</Text><Link nativeID={`terms-help-link`} href={`/support`} style={styles.linerPolicyLink}>{`Explore The Field Guide ↗`}</Link></View>
</View>;

export default Terms;
