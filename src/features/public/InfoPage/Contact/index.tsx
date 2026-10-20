import { Link } from 'expo-router';
import { infoContent } from '../content';
import { styles } from '../styles.native';
import { Text, View } from 'react-native';
import InquiryComposer from '../InquiryComposer';
import type { NativePageProps } from '../native.types';

const notes = [
  { title: `FOR THE STAGE`, detail: `The date. The city. The room.` },
  { title: `FOR A SHARED SOUND`, detail: `The idea. The people. The direction.` },
  { title: `FOR THE STORY`, detail: `The publication. The angle. The deadline.` },
];

const Contact = ({ onHeroLayout }: NativePageProps) => <>
  <View nativeID={`contact-hero`} style={styles.creativeHero} onLayout={event => onHeroLayout(event.nativeEvent.layout.height)}>
    <Text nativeID={`contact-eyebrow`} style={styles.kicker}>{`THE CREATIVE DESK / KALASHI MUSIC`}</Text><Text nativeID={`contact-title`} accessibilityRole={`header`} style={styles.creativeTitle}>{`LET’S MAKE
`}<Text style={styles.lime}>{`SOMETHING.`}</Text></Text><View style={styles.creativeIntro}><Text nativeID={`contact-description`} style={[styles.description, styles.creativeDescription]}>{infoContent.contact.description}</Text><Text accessible={false} style={styles.asterisk}>{`✳`}</Text></View>
  </View>
  <View nativeID={`contact-body`} style={styles.body}>
    <View nativeID={`contact-brief-guide`} style={styles.brief}><Text style={styles.briefTab}>{`BEFORE YOU WRITE`}</Text><Text nativeID={`contact-brief-title`} accessibilityRole={`header`} style={styles.sectionTitle}>{`A little detail.
A lot of possibility.`}</Text><Text style={styles.paragraph}>{infoContent.contact.sections[0].paragraphs[0]}</Text>
      {notes.map((note, index) => <View key={note.title} nativeID={`contact-note-${index}`} style={styles.briefNote}><Text style={styles.redMicro}>{`0${index + 1} / ${note.title}`}</Text><Text style={styles.noteCopy}>{note.detail}</Text></View>)}
      <Text style={styles.paragraph}>{infoContent.contact.sections[1].paragraphs[0]}</Text><Link nativeID={`contact-saved-link`} href={`/profile/inquiries`} style={styles.link}>{`Your Saved Inquiries ↗`}</Link>
    </View>
    <InquiryComposer />
  </View>
</>;

export default Contact;
