import { Link } from 'expo-router';
import { useEffect } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, fonts } from '../../../theme/tokens';
import AudioVisualizer from '../../../components/visualizer/AudioVisualizer';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ReadingTop, { useReadingTop } from '../../../components/SiteChrome/ReadingTop.native';
import { ambientSiteAudio, useSiteAudio } from '../../../shared/site/SiteAudioContext';

const SoundLab = () => {
  const { visible, opacity, onScroll, scrollRef, scrollToTop, onHeroLayout } = useReadingTop();
  const { visualizerState, setVisualizerState } = useSiteAudio();
  useEffect(() => () => setVisualizerState(ambientSiteAudio), [setVisualizerState]);

  return <View nativeID={`sound-lab-page`} style={styles.root}><ScrollView ref={scrollRef} scrollEventThrottle={32} onScroll={onScroll} contentContainerStyle={styles.content}>
    <View nativeID={`sound-lab-page-hero`} style={styles.hero} onLayout={onHeroLayout}>
      <Text nativeID={`sound-lab-eyebrow`} style={styles.eyebrow}>{`KALASHI EXPERIMENTAL / INSTRUMENT 02`}</Text>
      <Text nativeID={`sound-lab-title`} accessibilityRole={`header`} style={styles.title}>{`SOUND IS\nA MATERIAL.`}</Text>
      <Text nativeID={`sound-lab-intro`} style={styles.copy}>{`Give it a shape. Change the pressure. Somewhere between a listening room and a little controlled chaos.`}</Text>
      <View nativeID={`sound-lab-instrument`} style={styles.instrument}>
        <View style={styles.instrumentCaption}><Text style={styles.instrumentLabel}>{`SIGNAL ROUTING`}</Text><Text style={styles.instrumentLabel}>{`K—02`}</Text></View>
        <Svg width={`100%`} height={230} viewBox={`0 0 500 400`} accessibilityElementsHidden>
          <Rect width={500} height={400} fill={`#10150e`} />
          <Circle cx={250} cy={200} r={145} fill={`none`} stroke={`#68785a`} strokeWidth={.7} /><Circle cx={250} cy={200} r={110} fill={`none`} stroke={colors.green} strokeWidth={1.5} /><Circle cx={250} cy={200} r={68} fill={`none`} stroke={`#b1f75033`} strokeDasharray={`3 7`} />
          <Path d={`M0 300H90C130 300 130 200 180 200H320C370 200 370 95 410 95H500`} fill={`none`} stroke={colors.green} strokeWidth={2} /><Path d={`M0 95H75C140 95 135 260 200 260H300C365 260 360 330 430 330H500`} fill={`none`} stroke={colors.red} strokeWidth={1.5} /><Circle cx={250} cy={200} r={8} fill={colors.green} />
        </Svg>
        <View nativeID={`sound-lab-instrument-state`} style={styles.instrumentState} accessibilityLiveRegion={`polite`}><View style={[styles.light, visualizerState.active && styles.lightActive]} /><Text style={styles.instrumentLabel}>{visualizerState.audioPlaying ? `AUDIO REACTIVE` : visualizerState.active ? `AMBIENT SIGNAL` : `VISUALS AT REST`}</Text></View>
      </View>
    </View>
    <View nativeID={`sound-lab-session-strip`} style={styles.sessionStrip}><Text style={styles.eyebrow}>{`01 SOURCE → 02 SHAPE → 03 FEEL`}</Text><Text style={styles.instrumentLabel}>{`NO RIGHT WAY TO PLAY`}</Text></View>
    <View nativeID={`sound-lab-workspace`} style={styles.workbench}>
      <Text nativeID={`sound-lab-console-eyebrow`} style={styles.eyebrow}>{`THE WORKBENCH`}</Text><Text nativeID={`sound-lab-console-title`} accessibilityRole={`header`} style={styles.subtitle}>{`MAKE A LITTLE NOISE.`}</Text>
      <View nativeID={`sound-lab-console-case`} style={styles.consoleCase}><AudioVisualizer onStateChange={setVisualizerState} /></View>
    </View>
    <View nativeID={`sound-lab-field-manual`} style={styles.manual}>
      <Text style={styles.eyebrow}>{`A SMALL FIELD MANUAL`}</Text><Text accessibilityRole={`header`} style={styles.subtitle}>{`THREE WAYS IN.`}</Text>
      {[{ title: `Start with a signal`, copy: `Ambient motion needs no track. Pick Waveform or Orbit, change the density, and slow things down whenever you like.` }, { title: `Bring your sound`, copy: `On the web Sound Lab, choose an audio file from your device. The file stays on your device and is never uploaded.` }, { title: `Feel it together`, copy: `Supported web browsers can share this tab’s audio with the visualizer. You control the browser prompt and can stop sharing at any time.` }].map((item, index) => <View key={item.title} nativeID={`sound-lab-manual-step-${index}`} style={styles.manualStep}><Text style={styles.stepNumber}>{`0${index + 1} /`}</Text><View style={styles.stepCopy}><Text accessibilityRole={`header`} style={styles.stepTitle}>{item.title}</Text><Text style={styles.copy}>{item.copy}</Text></View></View>)}
      <Text nativeID={`sound-lab-native-note`} style={styles.note}>{`This app has ambient visual modes. Local audio files and tab audio sharing are web features.`}</Text>
    </View>
    <View nativeID={`sound-lab-next-room`} style={styles.nextRoom}><Text style={styles.eyebrow}>{`GOOD EXPERIMENTS START WITH GOOD MUSIC.`}</Text><Text accessibilityRole={`header`} style={styles.subtitle}>{`KEEP THE SIGNAL GOING.`}</Text><Link nativeID={`sound-lab-listen-link`} href={`/music`} style={styles.link}>{`↗ Dig into the records`}</Link><Link nativeID={`sound-lab-help-link`} href={`/support`} style={styles.link}>{`↗ Read the field guide`}</Link></View>
  </ScrollView><ReadingTop id={`sound-lab-scroll-to-top`} visible={visible} opacity={opacity} onPress={scrollToTop} /></View>;
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.black },
  hero: { gap: 24, paddingTop: 18 },
  content: { gap: 30, width: `100%`, maxWidth: 1600, alignSelf: `center`, padding: 24, paddingBottom: 60 },
  title: { color: colors.green, fontFamily: fonts.display, fontSize: 56, lineHeight: 64, letterSpacing: -1 },
  copy: { color: colors.muted, fontFamily: fonts.body, fontSize: 16, lineHeight: 26 },
  eyebrow: { color: colors.green, fontFamily: fonts.body, fontSize: 10, letterSpacing: 2 },
  link: { color: colors.green, fontFamily: fonts.body, fontSize: 15, paddingVertical: 14 },
  subtitle: { color: colors.white, fontFamily: fonts.display, fontSize: 34, lineHeight: 41 },
  instrument: { borderWidth: 1, borderColor: `#76846844`, backgroundColor: `#10150e`, transform: [{ rotate: `2deg` }], marginVertical: 12 },
  instrumentCaption: { gap: 16, padding: 15, flexDirection: `row`, justifyContent: `space-between`, borderBottomWidth: 1, borderColor: colors.border },
  instrumentLabel: { color: colors.muted, fontFamily: fonts.body, fontSize: 8, letterSpacing: 1.3 },
  instrumentState: { gap: 10, padding: 15, flexDirection: `row`, alignItems: `center`, borderTopWidth: 1, borderColor: colors.border },
  light: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.muted },
  lightActive: { backgroundColor: colors.green },
  sessionStrip: { gap: 15, paddingVertical: 18, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  workbench: { gap: 18 },
  consoleCase: { padding: 8, paddingVertical: 14, borderWidth: 1, borderColor: `#68755b55`, backgroundColor: `#1a2314`, borderRadius: 5 },
  manual: { gap: 20, paddingTop: 24, borderTopWidth: 1, borderColor: colors.border },
  manualStep: { gap: 17, paddingVertical: 20, flexDirection: `row`, borderTopWidth: 1, borderColor: colors.border },
  stepNumber: { color: colors.red, fontFamily: fonts.body, fontSize: 11, paddingTop: 5 },
  stepCopy: { flex: 1, gap: 10 },
  stepTitle: { color: colors.white, fontFamily: fonts.body, fontSize: 20 },
  note: { color: colors.muted, fontFamily: fonts.body, fontSize: 12, lineHeight: 21 },
  nextRoom: { gap: 16, padding: 22, borderWidth: 1, borderColor: colors.border, backgroundColor: `#11170d` },
});

export default SoundLab;
