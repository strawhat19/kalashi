import { Link, usePathname } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useEffect, useState, useCallback, type ReactNode, type SetStateAction } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccessibilityInfo, Animated, AppState, BackHandler, Easing, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import NativeBrand from './NativeBrand';
import AccountMenu from '../AccountMenu';
import { styles } from './styles.native';
import { artist } from '../../config/artist';
import { colors } from '../../theme/tokens';
import { headerConfig } from '../../config/header';
import { useAuth } from '../../shared/account/AuthContext';
import { visualizerConfig } from '../../config/visualizer';
import type { AudioVisualizerState } from '../visualizer/audio.types';
import { ambientSpectrumSample } from '../visualizer/ambientSignal';
import { SiteAudioProvider, useSiteAudio } from '../../shared/site/SiteAudioContext';
import { footerNavigation, siteNavigation, type SiteIconName } from '../../shared/site/routes';

type SiteChromeProps = { ready: boolean; children: ReactNode };

const iconPaths: Record<SiteIconName, string> = {
  blog: `M5 4h14v16H5zM8 8h8M8 12h8M8 16h4`,
  music: `M9 18V5l11-2v13M9 8l11-2M9 18c0 1.7-1.5 3-3.5 3S2 19.7 2 18s1.5-3 3.5-3S9 16.3 9 18M20 16c0 1.7-1.5 3-3.5 3S13 17.7 13 16s1.5-3 3.5-3S20 14.3 20 16`,
  sound: `M3 9v6M7 5v14M12 2v20M17 5v14M21 9v6`,
  story: `M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 21v-2a8 8 0 0 1 16 0v2`,
  contact: `M3 5h18v14H3zM3 5l9 7 9-7`,
  library: `M12 21 3.8 13a5.6 5.6 0 0 1 8.2-7.6A5.6 5.6 0 0 1 20.2 13z`,
  account: `M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M7 19v-1a5 5 0 0 1 10 0v1M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6`,
};

const NavigationIcon = ({ name, active }: { name: SiteIconName; active: boolean }) => (
  <Svg width={18} height={18} viewBox={`0 0 24 24`} accessibilityElementsHidden>
    <Path d={iconPaths[name]} fill={`none`} stroke={active ? colors.green : colors.muted} strokeWidth={1.5} strokeLinecap={`round`} strokeLinejoin={`round`} />
  </Svg>
);

const NativeSoundStrip = ({ state, active, width }: { state: AudioVisualizerState; active: boolean; width: number }) => {
  const count = Math.max(32, Math.ceil(width / 6));
  const [phase, setPhase] = useState(0);
  const [spectrum, setSpectrum] = useState<number[]>([]);

  useEffect(() => {
    if (!active) return;
    let request = 0;
    let previousTimestamp = 0;
    let elapsed = 0;
    const animate = (timestamp: number) => {
      if (timestamp - previousTimestamp >= 1000 / visualizerConfig.fps) {
        elapsed += previousTimestamp ? Math.min((timestamp - previousTimestamp) / 1000, .1) : 1 / visualizerConfig.fps;
        previousTimestamp = timestamp;
        setPhase(elapsed);
        const frequencies = state.audioPlaying ? state.signal?.readFrequencies() : undefined;
        setSpectrum(frequencies ? Array.from({ length: count }, (_, index) => (
          (frequencies[Math.floor(index / Math.max(1, count - 1) * (frequencies.length - 1))] ?? 0) / 255
        )) : []);
      }
      request = requestAnimationFrame(animate);
    };
    request = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(request);
  }, [active, count, state.signal, state.audioPlaying]);

  return (
    <View nativeID={`native-site-sound-bars`} style={styles.soundStrip} accessibilityElementsHidden importantForAccessibility={`no-hide-descendants`}>
      <Svg width={`100%`} height={14} viewBox={`0 0 ${width} 14`} preserveAspectRatio={`none`}>
        {Array.from({ length: count }, (_, index) => {
          const energy = spectrum[index] ?? ambientSpectrumSample(index / Math.max(1, count - 1), phase);
          return (
            <Rect
              y={0}
              key={index}
              x={index * width / count}
              opacity={.4 + energy * .5}
              height={2 + energy * 12}
              width={Math.max(1, width / count - 2)}
              fill={index % 23 === 0 ? colors.red : colors.green}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const NativeChrome = ({ ready, children, sticky = headerConfig.sticky }: SiteChromeProps & { sticky?: boolean }) => {
  const path = usePathname();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { visualizerState } = useSiteAudio();
  const [toggleProgress] = useState(() => new Animated.Value(0));
  const [menuProgress] = useState(() => new Animated.Value(0));
  const [menuState, setMenuState] = useState(() => ({ path, width, open: false }));
  const [headerHeight, setHeaderHeight] = useState(80 + insets.top);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [foreground, setForeground] = useState(AppState.currentState === `active`);
  const menuOpen = menuState.path === path && menuState.width === width && menuState.open;
  const setMenuOpen = useCallback((value: SetStateAction<boolean>) => {
    setMenuState((current) => {
      const open = current.path === path && current.width === width && current.open;
      return { path, width, open: typeof value === `function` ? value(open) : value };
    });
  }, [path, width]);
  const gutter = Math.max(18, insets.left, insets.right);
  const motionAllowed = ready && foreground && !reducedMotion;
  const signalActive = motionAllowed && visualizerState.active;
  const navigation = siteNavigation.map((item) => item.id === `account` && user ? { ...item, href: `/profile` as const, label: `Profile` } : item);
  const menuHeight = Math.min(siteNavigation.length * 48 + 26, Math.max(96, height - headerHeight - 14 - insets.bottom));

  useEffect(() => {
    let subscribed = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (subscribed) setReducedMotion(enabled);
    }).catch(() => undefined);
    const motionSubscription = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setReducedMotion);
    const appSubscription = AppState.addEventListener(`change`, (state) => setForeground(state === `active`));
    return () => {
      subscribed = false;
      motionSubscription.remove();
      appSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const subscription = BackHandler.addEventListener(`hardwareBackPress`, () => {
      setMenuOpen(false);
      return true;
    });
    return () => subscription.remove();
  }, [menuOpen, setMenuOpen]);

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(toggleProgress, {
        toValue: menuOpen ? 1 : 0,
        duration: motionAllowed ? 300 : 0,
        easing: Easing.bezier(.4, 0, .2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(menuProgress, {
        toValue: menuOpen ? 1 : 0,
        duration: motionAllowed ? (menuOpen ? 700 : 600) : 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [menuOpen, motionAllowed, menuProgress, toggleProgress]);

  return (
    <View nativeID={`native-site-chrome`} style={styles.root}>
      <View
        nativeID={`native-site-header`}
        style={[styles.header, { paddingTop: insets.top, paddingHorizontal: gutter, zIndex: sticky ? 40 : 25 }]}
        onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
      >
        <View nativeID={`native-site-header-row`} style={styles.headerRow}>
          <Link href={`/`} asChild>
            <Pressable
              accessibilityRole={`link`}
              nativeID={`native-site-home`}
              onPress={() => setMenuOpen(false)}
              accessibilityLabel={`Kalashi Music home`}
              style={({ pressed }) => [styles.brand, pressed && styles.pressed]}
            >
              <NativeBrand id={`native-site-logo`} state={visualizerState} active={signalActive} />
              <View nativeID={`native-site-wordmark`} style={styles.wordmark}>
                <Text nativeID={`native-site-brand-name`} style={styles.brandName}>{`KALASHI`}</Text>
                <Text nativeID={`native-site-brand-caption`} style={styles.brandCaption}>{`MUSIC / WORLDWIDE`}</Text>
              </View>
            </Pressable>
          </Link>
          <View nativeID={`native-site-header-actions`} style={styles.actions}>
            {user ? <AccountMenu key={user.id} reducedMotion={reducedMotion} onOpen={() => setMenuOpen(false)} /> : <Link href={artist.spotifyUrl} asChild>
              <Pressable
                accessibilityRole={`link`}
                nativeID={`native-site-spotify`}
                onPress={() => setMenuOpen(false)}
                accessibilityLabel={`Kalashi on Spotify`}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
              >
                <Svg width={23} height={23} viewBox={`0 0 24 24`} accessibilityElementsHidden>
                  <Circle cx={12} cy={12} r={11} fill={colors.green} />
                  <Path d={`M6 8.7c4.2-1.1 8.5-.7 12 1.1M6.8 12.1c3.7-.9 7.2-.5 10.2 1M7.5 15.3c3-.7 5.8-.3 8.2.8`} fill={`none`} stroke={colors.black} strokeWidth={1.6} strokeLinecap={`round`} />
                </Svg>
              </Pressable>
            </Link>}
            <Pressable
              accessibilityRole={`button`}
              nativeID={`native-site-menu-toggle`}
              accessibilityState={{ expanded: menuOpen }}
              onPress={() => setMenuOpen((open) => !open)}
              accessibilityLabel={menuOpen ? `Close navigation` : `Open navigation`}
              style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
            >
              <View nativeID={`native-site-menu-icon`} style={styles.hamburger} accessibilityElementsHidden>
                <Animated.View
                  nativeID={`native-site-menu-line-top`}
                  style={[styles.hamburgerLine, {
                    top: 0,
                    transform: [
                      { translateY: toggleProgress.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }) },
                      { rotate: toggleProgress.interpolate({ inputRange: [0, 1], outputRange: [`0deg`, `45deg`] }) },
                    ],
                  }]}
                />
                <Animated.View
                  nativeID={`native-site-menu-line-middle`}
                  style={[styles.hamburgerLine, {
                    top: 6,
                    opacity: toggleProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                    transform: [{ scaleX: toggleProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }],
                  }]}
                />
                <Animated.View
                  nativeID={`native-site-menu-line-bottom`}
                  style={[styles.hamburgerLine, {
                    top: 12,
                    transform: [
                      { translateY: toggleProgress.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) },
                      { rotate: toggleProgress.interpolate({ inputRange: [0, 1], outputRange: [`0deg`, `-45deg`] }) },
                    ],
                  }]}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
      <NativeSoundStrip state={visualizerState} active={signalActive} width={width} />
      <View
        style={styles.body}
        nativeID={`native-site-page`}
        accessibilityElementsHidden={menuOpen}
        importantForAccessibility={menuOpen ? `no-hide-descendants` : `auto`}
      >
        {children}
      </View>
      <View
        nativeID={`native-site-footer`}
        accessibilityElementsHidden={menuOpen}
        importantForAccessibility={menuOpen ? `no-hide-descendants` : `auto`}
        style={[styles.footer, { paddingHorizontal: gutter, paddingBottom: Math.max(8, insets.bottom) }]}
      >
        <View nativeID={`native-site-footer-navigation`} style={styles.footerLinks}>
          {footerNavigation.map((item) => <Link key={item.id} nativeID={`native-site-footer-link-${item.id}`} href={item.href} style={styles.footerLink}>{item.label}</Link>)}
        </View>
        <View nativeID={`native-site-footer-bottom`} style={styles.footerBottom}>
          <NativeBrand id={`native-site-footer-logo`} state={visualizerState} active={signalActive} size={32} />
          <Text nativeID={`native-site-copyright`} style={styles.copyright}>{`© ${new Date().getFullYear()} KALASHI MUSIC`}</Text>
          <Link nativeID={`native-site-piratechs`} href={`https://piratechs.com/`} style={styles.piratechs}>{`Piratechs ↗`}</Link>
        </View>
      </View>
      {menuOpen && (
        <Pressable
          accessibilityRole={`button`}
          nativeID={`native-site-menu-dismiss`}
          onPress={() => setMenuOpen(false)}
          accessibilityLabel={`Close navigation`}
          style={[styles.scrim, { top: headerHeight + 14 }]}
        />
      )}
      <Animated.View
        nativeID={`native-site-navigation`}
        pointerEvents={menuOpen ? `auto` : `none`}
        accessibilityElementsHidden={!menuOpen}
        importantForAccessibility={menuOpen ? `auto` : `no-hide-descendants`}
        style={[styles.menu, {
          top: headerHeight + 14,
          height: menuProgress.interpolate({ inputRange: [0, .6, 1], outputRange: [0, menuHeight, menuHeight], extrapolate: `clamp` }),
        }]}
      >
        <ScrollView nativeID={`native-site-navigation-scroll`} contentContainerStyle={[styles.menuContent, { paddingHorizontal: gutter }]}>
          {navigation.map((item, itemIndex) => (
            <Link key={item.id} href={item.href} asChild>
              <Pressable
                accessibilityRole={`link`}
                accessibilityLabel={item.label}
                onPress={() => setMenuOpen(false)}
                nativeID={`native-site-nav-link-${item.id}`}
                accessibilityState={{ selected: path === item.href }}
                style={({ pressed }) => [styles.menuLink, pressed && styles.pressed]}
              >
                <NavigationIcon name={item.icon} active={path === item.href} />
                <View nativeID={`native-site-nav-label-${item.id}`} style={styles.menuLabel} accessibilityElementsHidden importantForAccessibility={`no-hide-descendants`}>
                  {Array.from(item.label).map((character, characterIndex) => {
                    const start = itemIndex * .035 + characterIndex * .012;
                    return (
                      <Animated.Text
                        key={characterIndex}
                        nativeID={`native-site-nav-character-${item.id}-${characterIndex}`}
                        style={[styles.menuCharacter, path === item.href && styles.menuLinkActive, {
                          opacity: menuProgress.interpolate({ inputRange: [start, start + .5], outputRange: [0, 1], extrapolate: `clamp` }),
                          transform: [{ translateY: menuProgress.interpolate({ inputRange: [start, start + .5], outputRange: [16, 0], extrapolate: `clamp` }) }],
                        }]}
                      >
                        {character === ` ` ? `\u00a0` : character}
                      </Animated.Text>
                    );
                  })}
                </View>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const SiteChrome = ({ ready, children }: SiteChromeProps) => {
  const pathname = usePathname();
  if (pathname === `/`) return children;
  return <SiteAudioProvider><NativeChrome key={pathname} ready={ready}>{children}</NativeChrome></SiteAudioProvider>;
};

export default SiteChrome;
