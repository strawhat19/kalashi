import { accountRoutes } from '../../shared/account/routes';
import { Link, usePathname } from 'expo-router';
import { colors, fonts } from '../../theme/tokens';
import { useAuth } from '../../shared/account/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PropsWithChildren } from 'react';
import { useAccountNavigation } from '../../shared/account/NavigationContext';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Action, element } from './ui';
import { getAccountPresentation } from './presentation';

const AccountShell = ({ title, description, children }: PropsWithChildren<{ title: string; description: string }>) => {
  const path = usePathname();
  const presentation = getAccountPresentation(path);
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { collapsed, ready, notice, toggle } = useAccountNavigation();
  const identity = loading ? `Loading Account…` : user ? user.displayName.trim() || `Listener` : `Guest`;
  const initial = loading ? `…` : user?.displayName.trim().slice(0, 1).toUpperCase() || `K`;
  const profileHref = user || loading ? `/profile` : `/sign-in`;
  const wide = width > 650;
  return (
    <View {...element(`account-shell`)} style={layout.root}>
      <View {...element(`account-body`)} style={[layout.body, wide && { flexDirection: `row` }]}>
        <View {...element(`account-sidebar`)} style={[layout.sidebar, wide && { width: collapsed ? 100 : 220 }]}>
          {!collapsed && <ScrollView {...element(`account-navigation`)} contentContainerStyle={layout.navigation} style={{ flexShrink: 1 }}>
            <Text {...element(`account-nav-heading`)} style={layout.mode}>{`ACCOUNT`}</Text>
            {accountRoutes.filter(item => item.href === `/profile`).map(item => <Link {...element(`account-nav-link`, item.href.slice(1))} key={item.href} href={profileHref} style={[layout.navLink, (path === item.href || path === `/connections`) && layout.active]}>{item.label}</Link>)}
            <Text {...element(`account-library-heading`)} style={layout.mode}>{`LIBRARY`}</Text>
            {accountRoutes.filter(item => item.href === `/library` || item.href === `/collections` || item.href === `/settings`).map(item => <Link {...element(`account-nav-link`, item.href.slice(1))} key={item.href} href={item.href} style={[layout.navLink, path === item.href && layout.active]}>{item.label}</Link>)}
          </ScrollView>}
          <Link href={profileHref} asChild>
            <Pressable {...element(`sidebar-profile-action`)} accessibilityRole={`link`} accessibilityLabel={loading ? `Loading account` : user ? `${identity} profile` : `Sign in`} accessibilityState={{ busy: loading }} style={[layout.identity, collapsed && { justifyContent: `center` }]}>
              <Text {...element(`sidebar-profile-avatar`)} accessibilityElementsHidden style={layout.avatar}>{initial}</Text>
              {!collapsed ? <Text {...element(`sidebar-profile-label`)} numberOfLines={1} style={layout.identityText}>{identity}</Text> : null}
            </Pressable>
          </Link>
          {notice ? <Text {...element(`navigation-storage-notice`)} accessibilityLiveRegion={`polite`} style={layout.mode}>{notice}</Text> : null}
          <Action id={`sidebar-toggle`} label={collapsed ? `${wide ? `›` : `⌄`} Expand` : `${wide ? `‹` : `⌃`} Collapse`} disabled={!ready} onPress={toggle} />
        </View>
        <ScrollView {...element(`account-content-scroll`)} style={layout.scroll} contentContainerStyle={[layout.content, { paddingBottom: 40 + insets.bottom }]}>
          <View {...element(`account-page-heading`)} style={[layout.heading, { borderTopColor: presentation.accent }]}>
            <View {...element(`account-heading-folio`)} style={layout.folio}>
              <Text {...element(`account-eyebrow`)} style={[layout.mode, { color: presentation.accent }]}>{presentation.eyebrow}</Text>
              <Text {...element(`account-page-number`)} style={layout.mode}>{`${presentation.number} / K`}</Text>
            </View>
            <Text {...element(`account-heading-word`)} accessibilityElementsHidden style={layout.headingWord}>{presentation.word}</Text>
            <Text {...element(`account-title`)} accessibilityRole={`header`} style={layout.title}>{title}</Text>
            <Text {...element(`account-description`)} style={layout.description}>{description}</Text>
          </View>
          {children}
        </ScrollView>
      </View>
    </View>
  );
};
const layout = StyleSheet.create({
  root: { flex: 1, minHeight: 0, backgroundColor: colors.black },
  mode: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, lineHeight: 19, letterSpacing: 1 },
  body: { flex: 1 },
  sidebar: { padding: 12, gap: 18, flexShrink: 0, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.ink },
  navigation: { gap: 8 },
  navLink: { color: colors.white, padding: 12, fontSize: 15, fontFamily: fonts.body },
  identity: { gap: 8, minHeight: 44, paddingHorizontal: 4, flexDirection: `row`, alignItems: `center` },
  avatar: { width: 28, height: 28, borderRadius: 14, color: colors.black, backgroundColor: colors.green, fontFamily: fonts.body, fontSize: 16, textAlign: `center`, lineHeight: 28 },
  identityText: { flex: 1, color: colors.white, fontFamily: fonts.body, fontSize: 13 },
  active: { color: colors.green, backgroundColor: colors.surface, borderRadius: 8 },
  scroll: { flex: 1 },
  content: { padding: 28, gap: 24 },
  heading: { gap: 18, paddingTop: 18, borderTopWidth: 2 },
  folio: { gap: 12, flexWrap: `wrap`, flexDirection: `row`, justifyContent: `space-between` },
  headingWord: { color: `#242a22`, fontFamily: fonts.display, fontSize: 64, lineHeight: 72 },
  title: { color: colors.white, fontSize: 48, fontFamily: fonts.display },
  description: { maxWidth: 740, color: colors.muted, lineHeight: 26, fontFamily: fonts.body, fontSize: 16 },
});
export default AccountShell;
