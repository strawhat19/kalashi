import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, ScrollView, type LayoutChangeEvent, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

export const useNativeReading = () => {
  const scrollRef = useRef<ScrollView>(null);
  const heroHeight = useRef(300);
  const [opacity] = useState(() => new Animated.Value(0));
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    let current = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (current) setReducedMotion(value);
    }).catch(() => undefined);
    const listener = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setReducedMotion);
    return () => { current = false; listener.remove(); };
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

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = event.nativeEvent.contentOffset.y > heroHeight.current;
    setVisible(current => current === next ? current : next);
  };
  const onHeroLayout = (event: LayoutChangeEvent) => { heroHeight.current = event.nativeEvent.layout.height; };
  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion });

  return { visible, opacity, onScroll, scrollRef, scrollToTop, onHeroLayout };
};
