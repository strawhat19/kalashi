import { Link } from 'expo-router';
import About from './About';
import Terms from './Terms';
import Contact from './Contact';
import Privacy from './Privacy';
import Support from './Support';
import { styles } from './styles.native';
import type { InfoPageKey } from './content';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, ScrollView, Text, View } from 'react-native';

const pages = { about: About, terms: Terms, contact: Contact, privacy: Privacy, support: Support };

const InfoPage = ({ page }: { page: InfoPageKey }) => {
  const Page = pages[page];
  const scrollRef = useRef<ScrollView>(null);
  const heroHeight = useRef(420);
  const pageOffset = useRef(0);
  const positions = useRef<Record<string, number>>({});
  const [fade] = useState(() => new Animated.Value(0));
  const [topVisible, setTopVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (mounted) setReducedMotion(value); }).catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setReducedMotion);
    return () => { mounted = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    const animation = Animated.timing(fade, { toValue: topVisible ? 1 : 0, duration: reducedMotion ? 0 : 220, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [fade, topVisible, reducedMotion]);

  return <View nativeID={`info-page-${page}`} style={styles.root}>
    <ScrollView ref={scrollRef} nativeID={`${page}-scroll`} style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps={`handled`} scrollEventThrottle={32} onScroll={event => setTopVisible(event.nativeEvent.contentOffset.y > heroHeight.current)}>
      <Page
        onPageLayout={y => { pageOffset.current = y; }}
        onHeroLayout={height => { heroHeight.current = height; }}
        onSectionLayout={(id, y) => { positions.current[id] = y; }}
        onNavigate={id => scrollRef.current?.scrollTo({ y: pageOffset.current + (positions.current[id] ?? 0), animated: !reducedMotion })}
      />
      <View nativeID={`${page}-next-links`} style={styles.next}>
        <Text nativeID={`${page}-next-caption`} style={styles.kicker}>{`THERE’S MORE TO THE FREQUENCY`}</Text>
        <View nativeID={`${page}-next-navigation`} style={styles.links}>
          <Link nativeID={`${page}-next-music`} href={`/music`} style={styles.link}>{`The Music ↗`}</Link>
          <Link nativeID={`${page}-next-sound`} href={`/sound-lab`} style={styles.link}>{`Sound Lab ↗`}</Link>
          <Link nativeID={`${page}-next-contact`} href={page === `contact` ? `/support` : `/contact`} style={styles.link}>{page === `contact` ? `Help & Support ↗` : `Get In Touch ↗`}</Link>
          <Link nativeID={`${page}-next-policy`} href={page === `privacy` ? `/terms` : `/privacy`} style={styles.link}>{page === `privacy` ? `Terms Of Use ↗` : `Privacy Policy ↗`}</Link>
        </View>
      </View>
    </ScrollView>
    <Animated.View nativeID={`${page}-scroll-top-wrap`} pointerEvents={topVisible ? `auto` : `none`} accessibilityElementsHidden={!topVisible} importantForAccessibility={topVisible ? `auto` : `no-hide-descendants`} style={[styles.topButtonWrap, { opacity: fade }]}>
      <Pressable nativeID={`${page}-scroll-top`} accessibilityRole={`button`} accessibilityLabel={`Scroll To Top`} style={styles.topButton} onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion })}>
        <Text nativeID={`${page}-scroll-top-chevron`} accessible={false} style={styles.topButtonText}>{`⌃`}</Text>
      </Pressable>
    </Animated.View>
  </View>;
};

export default InfoPage;
