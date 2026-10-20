import { useState } from 'react';
import { Link } from 'expo-router';
import { styles } from './styles.native';
import { Image, Pressable, Text, View } from 'react-native';
import { latestReleaseId, releaseHighlights, type ReleaseHighlightsProps } from './data';

const ReleaseHighlights = ({ id = `release-highlights`, compact = false }: ReleaseHighlightsProps) => {
  const [width, setWidth] = useState(0);
  const wide = width >= 760;

  return (
    <View
      nativeID={id}
      style={[styles.root, compact && styles.rootCompact]}
      onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
    >
      <View nativeID={`${id}-heading`} style={[styles.heading, wide && styles.headingWide]}>
        <View nativeID={`${id}-intro`} style={styles.intro}>
          <Text nativeID={`${id}-eyebrow`} style={styles.eyebrow}>{`NEW MUSIC / KALASHI`}</Text>
          <Text nativeID={`${id}-title`} accessibilityRole={`header`} style={[styles.title, compact && styles.titleCompact]}>{`THE LATEST.`}</Text>
        </View>
        <Text nativeID={`${id}-description`} style={styles.description}>{`Fresh releases. Find your next repeat.`}</Text>
      </View>
      <View nativeID={`${id}-grid`} style={[styles.grid, wide && styles.gridWide]}>
        {releaseHighlights.map((release) => {
          const latest = release.id === latestReleaseId;
          const releaseId = `${id}-${release.id}`;

          return (
            <View
              key={release.id}
              nativeID={releaseId}
              style={[styles.release, wide && styles.releaseWide, latest && styles.releaseLatest, wide && latest && styles.releaseLatestWide]}
            >
              <View nativeID={`${releaseId}-artwork-wrap`} style={styles.artworkWrap}>
                <Image
                  source={release.artwork}
                  style={styles.artwork}
                  nativeID={`${releaseId}-artwork`}
                  accessibilityLabel={`${release.title} cover artwork`}
                />
                <View nativeID={`${releaseId}-badge`} style={[styles.badge, latest && styles.badgeLatest]}>
                  <Text nativeID={`${releaseId}-badge-label`} style={[styles.badgeText, latest && styles.badgeTextLatest]}>
                    {latest ? `LATEST RELEASE` : `NEW SINGLE`}
                  </Text>
                </View>
              </View>
              <View nativeID={`${releaseId}-details`} style={[styles.details, compact && styles.detailsCompact]}>
                <View nativeID={`${releaseId}-metadata`} style={styles.metadata}>
                  <Text nativeID={`${releaseId}-type`} style={styles.type}>{`${release.type.toUpperCase()} / ${release.year}`}</Text>
                  <Text nativeID={`${releaseId}-date`} style={styles.date}>{release.releaseLabel}</Text>
                </View>
                <Text nativeID={`${releaseId}-title`} accessibilityRole={`header`} style={[styles.releaseTitle, latest && styles.releaseTitleLatest]}>{release.title}</Text>
                <Link asChild href={release.listeningUrl}>
                  <Pressable
                    accessibilityRole={`link`}
                    nativeID={`${releaseId}-listen`}
                    accessibilityLabel={`Listen to ${release.title} on ${release.provider}`}
                    style={({ pressed }) => [styles.listen, pressed && styles.listenPressed]}
                  >
                    <Text accessible={false} nativeID={`${releaseId}-listen-play`} style={styles.listenIcon}>{`▶`}</Text>
                    <Text nativeID={`${releaseId}-listen-label`} style={styles.listenLabel}>{`Listen on ${release.provider}`}</Text>
                    <Text accessible={false} nativeID={`${releaseId}-listen-arrow`} style={styles.listenArrow}>{`↗`}</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export type { ReleaseHighlightsProps } from './data';
export default ReleaseHighlights;
