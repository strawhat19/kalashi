import { useEffect, useState } from 'react';
import { useLocalWorkspace } from '../../shared/account/LocalWorkspaceContext';
import { Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useLibrary } from '../../shared/account/LibraryContext';
import { colors, fonts } from '../../theme/tokens';
import AccountShell from './AccountShell';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

export default function ProfileScreen() {
  const local = useLocalWorkspace();
  const [displayName, setDisplayName] = useState(``);
  const [bio, setBio] = useState(``);
  const [saved, setSaved] = useState(false);
  useEffect(() => { if (local.ready) { setDisplayName(local.profile.displayName); setBio(local.profile.bio); } }, [local.ready, local.profile.displayName, local.profile.bio]);
  const { width } = useWindowDimensions();
  const { ids } = useLibrary();
  return <AccountShell title={`Your profile.`} description={`Personalize your local display profile. This does not create an account, verify your identity or publish your information.`}>
    <View {...element(`profile-columns`)} style={[styles.stack, width > 1100 && { flexDirection: `row`, alignItems: `flex-start` }]}>
      <View {...element(`profile-details`)} style={{ flex: 1, gap: 20 }}>
        <Panel id={`profile-identity`} title={`Local display profile`}>
          <View {...element(`profile-avatar-row`)} style={styles.row}>
            <Text {...element(`profile-avatar`)} accessibilityLabel={`Guest avatar placeholder`} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.green, color: colors.black, fontFamily: fonts.display, fontSize: 32, textAlign: `center`, lineHeight: 64 }}>{displayName.trim().slice(0, 1).toUpperCase() || `K`}</Text>
            <Action id={`avatar-upload`} label={`↑ Upload avatar — unavailable`} disabled />
          </View>
          <Copy id={`profile-local-notice`}>{local.notice}</Copy>
          <Text {...element(`profile-name-label`)} style={styles.label}>{`Display name · local only`}</Text>
          <TextInput {...element(`profile-name-input`)} style={styles.input} accessibilityLabel={`Local display name`} editable={local.ready} maxLength={80} value={displayName} onChangeText={value => { setDisplayName(value); setSaved(false); }} placeholder={`Your display name`} placeholderTextColor={colors.muted} />
          <Text {...element(`profile-bio-label`)} style={styles.label}>{`Bio · local only`}</Text>
          <TextInput {...element(`profile-bio-input`)} style={styles.input} accessibilityLabel={`Local bio`} editable={local.ready} multiline maxLength={500} value={bio} onChangeText={value => { setBio(value); setSaved(false); }} placeholder={`Your favorite frequency`} placeholderTextColor={colors.muted} />
          <Copy id={`profile-email-note`}>{`Email and identity are unavailable until real sign-in is connected. Do not save passwords or sensitive information in this local profile.`}</Copy>
          <Action id={`profile-save`} label={`✓ Save local display profile`} disabled={!local.ready} onPress={() => { local.saveProfile({ displayName, bio }); setSaved(true); }} />
          {saved && <Copy id={`profile-save-result`}>{`Local display profile updated. Check the storage notice above for persistence status; nothing was sent to a server.`}</Copy>}
          <AccountLink id={`profile-sign-in`} href={`/sign-in`} label={`↗ Sign in preview`} />
        </Panel>
      </View>
      <View {...element(`profile-metadata`)} style={{ width: width > 1100 ? 240 : `100%`, gap: 20 }}>
        <Panel id={`profile-account-status`} title={`Account details`}>
          <Copy id={`profile-role`}>{`Role: Guest\nAccount: Not connected\nCloud library: Unavailable\nLocal favorites: ${ids.length}\nLocal collections: ${local.collections.length}`}</Copy>
          <Copy id={`profile-privacy`}>{`Profile visibility: Not published. Your local library is not a private cloud account.`}</Copy>
          <AccountLink id={`profile-settings`} href={`/settings`} label={`⚙ Preferences & data`} />
        </Panel>
      </View>
    </View>
  </AccountShell>;
}
