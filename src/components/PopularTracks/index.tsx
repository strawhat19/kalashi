import { Link } from 'expo-router';
import { styles } from './styles.native';
import type { PopularTracksProps } from './types';
import { Pressable, Text, View } from 'react-native';
import { tracks, popularity, getTrackLink } from './tracks';

const PopularTracks = ({ id = `popular-tracks`, onListen }: PopularTracksProps) => (
  <View nativeID={id} style={styles.root}>
    <View nativeID={`${id}-heading`} style={styles.heading}>
      <View nativeID={`${id}-intro`} style={styles.intro}>
        <Text nativeID={`${id}-eyebrow`} style={styles.eyebrow}>{`POPULAR ON SPOTIFY`}</Text>
        <Text nativeID={`${id}-title`} accessibilityRole={`header`} style={styles.title}>{`ON REPEAT.`}</Text>
      </View>
      <Link
        href={popularity.sourceUrl}
        nativeID={`${id}-source`}
        style={styles.source}
        accessibilityLabel={`View Kalashi’s top tracks on Spotify`}
      >{`Spotify top tracks ↗`}</Link>
    </View>
    {tracks.every(track => track.listeningUrl && !(onListen && getTrackLink(track).canEmbed)) ? <Text nativeID={`${id}-listening-service`} style={styles.note}>{`Listening links open Amazon Music.`}</Text> : null}
    <View nativeID={`${id}-list`} style={styles.list}>
      {tracks.map((track, index) => {
        const trackId = `${id}-${track.id}`;
        const { href, service, canEmbed } = getTrackLink(track);
        const listen = canEmbed ? onListen : undefined;
        const row = <Pressable
          nativeID={`${trackId}-listen`}
          accessibilityRole={listen ? `button` : `link`}
          accessibilityLabel={listen ? `Listen to ${track.title} in the Spotify player` : `Listen to ${track.title} on ${service}`}
          onPress={listen ? () => listen(track.spotifyUrl) : undefined}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <Text nativeID={`${trackId}-rank`} style={[styles.rank, index === 0 && styles.firstRank]}>{String(index + 1).padStart(2, `0`)}</Text>
          <Text nativeID={`${trackId}-title`} style={styles.name}>{track.title}</Text>
          <Text nativeID={`${trackId}-duration`} style={styles.duration}>{track.duration}</Text>
          <View nativeID={`${trackId}-play`} style={styles.play} accessibilityElementsHidden>
            <Text style={styles.playIcon}>{`▶`}</Text>
          </View>
        </Pressable>;

        return <View key={track.id} nativeID={trackId} style={styles.item}>
          {listen ? row : <Link href={href} asChild>{row}</Link>}
        </View>;
      })}
    </View>
    <Text nativeID={`${id}-note`} style={styles.note}>{`${popularity.label} · Checked ${popularity.checkedAt}`}</Text>
  </View>
);

export default PopularTracks;
