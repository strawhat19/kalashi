import { Link, type Href } from 'expo-router';
import { colors, fonts } from '../../theme/tokens';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PropsWithChildren } from 'react';

export const element = (name: string, suffix = ``) => ({
  nativeID: `${name}${suffix ? `-${suffix}` : ``}`,
  ...(Platform.OS === `web` ? { className: name } : {}),
});
export const Copy = ({ children, id }: PropsWithChildren<{ id: string }>) => (
  <Text {...element(`account-copy`, id)} style={styles.copy}>{children}</Text>
);
export const Panel = ({ title, id, number, eyebrow, children }: PropsWithChildren<{ title: string; id: string; number?: string; eyebrow?: string }>) => (
  <View {...element(`account-panel`, id)} style={styles.panel}>
    <View {...element(`account-panel-heading`, id)} style={styles.panelHeading}>
      {number ? <Text {...element(`account-panel-number`, id)} style={styles.panelNumber}>{number}</Text> : null}
      <View {...element(`account-panel-heading-copy`, id)} style={styles.panelHeadingCopy}>
        {eyebrow ? <Text {...element(`account-panel-eyebrow`, id)} style={styles.panelEyebrow}>{eyebrow}</Text> : null}
        <Text {...element(`account-panel-title`, id)} accessibilityRole={`header`} style={styles.subtitle}>{title}</Text>
      </View>
    </View>
    {children}
  </View>
);
export const Action = ({ id, label, onPress, selected, disabled = false }: { id: string; label: string; selected?: boolean; onPress?: () => void; disabled?: boolean }) => (
  <Pressable {...element(`account-action`, id)} accessibilityRole={`button`} accessibilityState={{ disabled, selected }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.action, selected && styles.actionSelected, disabled && styles.disabled, pressed && { opacity: 0.7 }]}>
    <Text {...element(`account-action-label`, id)} style={styles.actionText}>{label}</Text>
  </Pressable>
);
export const AccountLink = ({ href, label, id }: { href: Href; label: string; id: string }) => (
  <Link {...element(`account-link`, id)} href={href} style={styles.link}>{label}</Link>
);
export const styles = StyleSheet.create({
  copy: { color: colors.muted, fontFamily: fonts.body, fontSize: 16, lineHeight: 25 },
  panel: { gap: 18, padding: 22, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 12 },
  panelHeading: { gap: 15, flexDirection: `row`, alignItems: `flex-start` },
  panelHeadingCopy: { flex: 1, gap: 8 },
  panelNumber: { paddingTop: 5, color: colors.muted, fontSize: 11, letterSpacing: 1, fontFamily: fonts.body },
  panelEyebrow: { color: colors.muted, fontSize: 9, letterSpacing: 1.5, fontFamily: fonts.body },
  subtitle: { color: colors.white, fontFamily: fonts.body, fontSize: 23 },
  action: { padding: 14, minHeight: 48, alignItems: `center`, justifyContent: `center`, borderWidth: 1, borderColor: colors.green, borderRadius: 8 },
  actionSelected: { backgroundColor: `#b1f75018` },
  actionText: { color: colors.green, fontSize: 15, fontFamily: fonts.body },
  disabled: { opacity: 0.5, borderColor: colors.border },
  link: { color: colors.green, fontSize: 16, lineHeight: 25, paddingVertical: 12, fontFamily: fonts.body },
  row: { gap: 16, flexDirection: `row`, flexWrap: `wrap`, alignItems: `center` },
  stack: { gap: 20 },
  input: { minHeight: 48, padding: 13, borderWidth: 1, borderColor: colors.border, borderRadius: 8, color: colors.white, fontFamily: fonts.body, fontSize: 16 },
  label: { color: colors.white, fontFamily: fonts.body, fontSize: 14 },
});
