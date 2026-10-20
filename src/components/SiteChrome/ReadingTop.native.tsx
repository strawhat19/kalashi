import Svg, { Path } from 'react-native-svg';
import { useEffect, useRef, useState } from 'react';
import { colors } from '../../theme/tokens';
import { AccessibilityInfo, Animated, Pressable, ScrollView, StyleSheet, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

export const useReadingTop = () => {
  const scrollRef = useRef<ScrollView>(null);
  const heroBoundary = useRef(Number.POSITIVE_INFINITY);
  const scrollOffset = useRef(0);
  const [opacity] = useState(() => new Animated.Value(0));
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    let current = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (current) setReducedMotion(value);
    }).catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setReducedMotion);
    return () => { current = false; subscription.remove(); };
  }, []);

  useEffect(() => {
    const animation = Animated.timing(opacity, {
      useNativeDriver: true,
      toValue: visible ? 1 : 0,
      duration: reducedMotion ? 0 : 220,
    });
    animation.start();
    return () => animation.stop();
  }, [visible, opacity, reducedMotion]);

  const updateVisibility = () => setVisible(scrollOffset.current > heroBoundary.current);
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
    updateVisibility();
  };
  const onHeroLayout = (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    heroBoundary.current = y + height;
    updateVisibility();
  };
  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion });

  return { visible, opacity, onScroll, scrollRef, scrollToTop, onHeroLayout };
};

type ReadingTopProps = {
  id: string;
  visible: boolean;
  opacity: Animated.Value;
  onPress: () => void;
};

const ReadingTop = ({ id, visible, opacity, onPress }: ReadingTopProps) => (
  <Animated.View
    nativeID={`${id}-wrap`}
    pointerEvents={visible ? `auto` : `none`}
    accessibilityElementsHidden={!visible}
    importantForAccessibility={visible ? `auto` : `no-hide-descendants`}
    style={[styles.wrap, { opacity }]}
  >
    <Pressable nativeID={id} style={styles.button} accessibilityRole={`button`} accessibilityLabel={`Scroll To Top`} onPress={onPress}>
      <Svg nativeID={`${id}-chevron`} width={22} height={22} viewBox={`0 0 24 24`} fill={`none`} accessibilityElementsHidden>
        <Path d={`m6 15 6-6 6 6`} stroke={colors.green} strokeWidth={1.8} strokeLinecap={`round`} strokeLinejoin={`round`} />
      </Svg>
    </Pressable>
  </Animated.View>
);

const styles = StyleSheet.create({
  wrap: { position: `absolute`, right: 20, bottom: 20 },
  button: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: colors.green, backgroundColor: colors.ink, alignItems: `center`, justifyContent: `center` },
});

export default ReadingTop;
