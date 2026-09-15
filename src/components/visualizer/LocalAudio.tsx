import { StyleSheet, Text, View } from 'react-native';
import type { LocalAudioProps } from './audio.types';

const LocalAudio = (_props: LocalAudioProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>Your Track. Your Frequency.</Text>
    <Text style={styles.description}>Open Kalashi Music on the web to load a local audio file and see the visuals react. Use the Spotify link to hear Kalashi.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { gap: 5 },
  title: { color: `#D5D8CE`, fontSize: 12, fontFamily: `SpaceGrotesk` },
  description: { color: `#858A80`, fontSize: 12, lineHeight: 19, fontFamily: `SpaceGrotesk` },
});

export default LocalAudio;
