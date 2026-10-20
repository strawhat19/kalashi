import { Link } from 'expo-router';
import { useState } from 'react';
import { colors, fonts } from '../../theme/tokens';
import { useAuth } from '../../shared/account/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type AccountMenuProps = { onOpen?: () => void; reducedMotion?: boolean };

const AccountMenu = ({ onOpen, reducedMotion = true }: AccountMenuProps) => {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(``);
  if (!user) return null;

  const logout = async () => {
    setBusy(true);
    setError(``);
    try { await signOut(); setOpen(false); }
    catch (reason) { setError(reason instanceof Error ? reason.message : `Could Not Sign Out`); }
    finally { setBusy(false); }
  };

  return <View nativeID={`site-account-menu`}>
    <Pressable nativeID={`site-account-trigger`} accessibilityRole={`button`} accessibilityLabel={`${user.displayName} account menu`} accessibilityState={{ expanded: open }} style={styles.trigger} onPress={() => { onOpen?.(); setOpen(true); }}><Text nativeID={`site-account-avatar`} style={styles.avatar}>{user.displayName.trim().slice(0, 1).toUpperCase() || `K`}</Text></Pressable>
    <Modal transparent visible={open} animationType={reducedMotion ? `none` : `fade`} onRequestClose={() => setOpen(false)}>
      <Pressable nativeID={`site-account-dismiss`} accessibilityRole={`button`} accessibilityLabel={`Close account menu`} style={styles.backdrop} onPress={() => setOpen(false)} />
      <View nativeID={`site-account-panel`} accessibilityViewIsModal style={[styles.panel, { top: insets.top + 82 }]}>
        <View nativeID={`site-account-identity`} style={styles.identity}>
          <View style={styles.identityRow}><Text style={styles.name} numberOfLines={1}>{user.displayName}</Text><Text style={styles.role}>{user.role}</Text></View>
          <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
        </View>
        <Link href={`/profile`} asChild><Pressable nativeID={`site-account-profile`} style={styles.link} onPress={() => setOpen(false)}><Text style={styles.linkText}>{`◉ Profile`}</Text></Pressable></Link>
        <Link href={`/settings`} asChild><Pressable nativeID={`site-account-settings`} style={styles.link} onPress={() => setOpen(false)}><Text style={styles.linkText}>{`⚙ Settings`}</Text></Pressable></Link>
        {!!error && <Text nativeID={`site-account-error`} accessibilityLiveRegion={`polite`} style={styles.error}>{error}</Text>}
        <Pressable nativeID={`site-account-sign-out`} style={styles.link} disabled={busy} accessibilityRole={`button`} onPress={() => void logout()}><Text style={styles.linkText}>{busy ? `Signing Out…` : `↪ Sign Out`}</Text></Pressable>
      </View>
    </Modal>
  </View>;
};

const styles = StyleSheet.create({
  trigger: { width: 44, height: 44, alignItems: `center`, justifyContent: `center` },
  avatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.green, backgroundColor: colors.ink, color: colors.green, fontFamily: fonts.body, fontSize: 15, lineHeight: 32, textAlign: `center` },
  backdrop: { position: `absolute`, top: 0, right: 0, bottom: 0, left: 0, backgroundColor: `rgba(0,0,0,.2)` },
  panel: { position: `absolute`, right: 18, width: 260, maxWidth: `90%`, padding: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 14, backgroundColor: colors.ink },
  identity: { gap: 6, padding: 8, paddingBottom: 12, borderBottomWidth: 1, borderColor: colors.border },
  identityRow: { gap: 9, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  name: { flex: 1, color: colors.white, fontFamily: fonts.body, fontSize: 13 },
  role: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, color: colors.green, backgroundColor: colors.surface, fontFamily: fonts.body, fontSize: 9 },
  email: { color: colors.muted, fontFamily: fonts.body, fontSize: 11 },
  link: { minHeight: 44, padding: 9, justifyContent: `center` },
  linkText: { color: colors.white, fontFamily: fonts.body, fontSize: 13 },
  error: { padding: 8, color: colors.red, fontFamily: fonts.body, fontSize: 11 },
});

export default AccountMenu;
