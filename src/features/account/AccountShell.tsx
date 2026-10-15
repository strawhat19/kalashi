import { accountRoutes } from '../../shared/account/routes';
import Head from 'expo-router/head';
import { Link, usePathname } from 'expo-router';
import { colors, fonts } from '../../theme/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PropsWithChildren } from 'react';
import { useAccountNavigation } from '../../shared/account/NavigationContext';
import { Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Action, element } from './ui';

const AccountShell = ({ title, description, children }: PropsWithChildren<{ title: string; description: string }>) => {
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { collapsed, ready, notice, toggle } = useAccountNavigation();
  const wide = width > 650;
  return (
    <View {...element(`account-shell`)} style={[layout.root, { paddingTop: insets.top }, wide && { height, minHeight: 0 }]}>
      {Platform.OS === `web` && <Head><title>{`${title} | Kalashi Music`}</title><meta name={`robots`} content={`noindex, nofollow`} /><meta name={`description`} content={description} /></Head>}
      <View {...element(`account-header`)} style={layout.header}>
        <Link {...element(`account-home`)} href={`/`} style={layout.brand}>{`KALASHI ↗`}</Link>
        <Text {...element(`account-mode`)} style={layout.mode}>{`FRONTEND PREVIEW • OFFLINE ACCOUNT`}</Text>
      </View>
      <View {...element(`account-body`)} style={[layout.body, wide && { flexDirection: `row` }]}>
        <View {...element(`account-sidebar`)} style={[layout.sidebar, wide && { width: collapsed ? 100 : 220 }]}>
          {!collapsed && <ScrollView {...element(`account-navigation`)} contentContainerStyle={layout.navigation} style={{ flexShrink: 1 }}>
            <Text {...element(`account-nav-heading`)} style={layout.mode}>{`ACCOUNT`}</Text>
            {accountRoutes.map(item => <Link {...element(`account-nav-link`, item.href.slice(1))} key={item.href} href={item.href} style={[layout.navLink, path === item.href && layout.active]}>{item.label}</Link>)}
            <Text {...element(`account-admin-heading`)} style={layout.mode}>{`ADMIN`}</Text>
            <Link {...element(`account-dashboard-link`)} href={`/dashboard`} style={layout.navLink}>{`◈ Dashboard · Locked`}</Link>
            <Text {...element(`account-owner-notice`)} style={layout.mode}>{`Owner tools stay locked until verified sign-in.`}</Text>
          </ScrollView>}
          <Link {...element(`sidebar-profile-action`)} href={`/profile`} style={layout.navLink}>{collapsed ? `◉` : `◉ Guest / Profile`}</Link>
          <Text {...element(`navigation-storage-notice`)} style={layout.mode}>{notice}</Text>
          <Action id={`sidebar-toggle`} label={collapsed ? `☰ Expand` : `☰ Collapse`} disabled={!ready} onPress={toggle} />
        </View>
        <ScrollView {...element(`account-content-scroll`)} style={layout.scroll} contentContainerStyle={[layout.content, { paddingBottom: 40 + insets.bottom }]}>
          <Text {...element(`account-eyebrow`)} style={layout.mode}>{`YOUR FREQUENCY / KALASHI`}</Text>
          <Text {...element(`account-title`)} accessibilityRole={`header`} style={layout.title}>{title}</Text>
          <Text {...element(`account-description`)} style={layout.description}>{description}</Text>
          {children}
          <View {...element(`account-footer`)} style={layout.footer}>
            <Link {...element(`account-footer-link`, `support`)} href={`/support`} style={layout.navLink}>{`Support ↗`}</Link>
            <Link {...element(`account-footer-link`, `privacy`)} href={`/privacy`} style={layout.navLink}>{`Privacy ↗`}</Link>
            <Link {...element(`account-footer-link`, `terms`)} href={`/terms`} style={layout.navLink}>{`Terms ↗`}</Link>
            <Text {...element(`account-copyright`)} style={layout.mode}>{`© ${new Date().getFullYear()} KALASHI MUSIC`}</Text>
            <Link {...element(`account-piratechs`)} href={`https://piratechs.com/`} style={layout.navLink}>{`Piratechs ↗`}</Link>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
const layout = StyleSheet.create({
  root: { flex: 1, minHeight: 600, backgroundColor: colors.black },
  header: { minHeight: 76, padding: 20, gap: 16, flexDirection: `row`, flexWrap: `wrap`, alignItems: `center`, justifyContent: `space-between`, borderBottomWidth: 1, borderColor: colors.border },
  brand: { color: colors.green, fontFamily: fonts.display, fontSize: 28 },
  mode: { color: colors.muted, fontFamily: fonts.body, fontSize: 11, lineHeight: 19, letterSpacing: 1 },
  body: { flex: 1 },
  sidebar: { padding: 12, gap: 18, flexShrink: 0, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.ink },
  navigation: { gap: 8 },
  navLink: { color: colors.white, padding: 12, fontSize: 15, fontFamily: fonts.body },
  active: { color: colors.green, backgroundColor: colors.surface, borderRadius: 8 },
  scroll: { flex: 1 },
  content: { padding: 28, gap: 24 },
  title: { color: colors.white, fontSize: 48, fontFamily: fonts.display },
  description: { maxWidth: 740, color: colors.muted, lineHeight: 26, fontFamily: fonts.body, fontSize: 16 },
  footer: { gap: 8, marginTop: 28, borderTopWidth: 1, borderColor: colors.border, flexDirection: `row`, flexWrap: `wrap` },
});
export default AccountShell;
