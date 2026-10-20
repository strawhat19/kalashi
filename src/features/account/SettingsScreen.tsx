import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Platform, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/tokens';
import { useAuth } from '../../shared/account/AuthContext';
import { useLibrary } from '../../shared/account/LibraryContext';
import { useLocalWorkspace } from '../../shared/account/LocalWorkspaceContext';
import AccountShell from './AccountShell';
import { Patchbay } from './AccountDecor';
import { pageStyles } from './pageStyles';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

const SettingsScreen = () => {
  const auth = useAuth();
  const router = useRouter();
  const library = useLibrary();
  const workspace = useLocalWorkspace();
  const [confirmFavorites, setConfirmFavorites] = useState(false);
  const [confirmWorkspace, setConfirmWorkspace] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(``);
  const [newPassword, setNewPassword] = useState(``);
  const [deletePassword, setDeletePassword] = useState(``);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(``);

  const clearLibrary = async (kind: `favorites` | `collections`) => {
    if (pending) return;
    setPending(true);
    setMessage(``);
    try {
      if (await (kind === `favorites` ? library.clear() : workspace.clear())) {
        if (kind === `favorites`) { setConfirmFavorites(false); setMessage(`Favorites Removed`); }
        else { setConfirmWorkspace(false); setMessage(`Collections Removed`); }
      }
    } finally { setPending(false); }
  };
  const signOut = async () => {
    if (pending) return;
    setPending(true);
    setMessage(``);
    try { await auth.signOut(); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : `Could Not Sign Out`); }
    finally { setPending(false); }
  };
  const changePassword = async () => {
    if (pending) return;
    setPending(true);
    setMessage(``);
    try {
      await auth.changePassword(currentPassword, newPassword);
      setCurrentPassword(``);
      setNewPassword(``);
      setMessage(`Password Updated`);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : `Your Password Could Not Be Updated`); }
    finally { setPending(false); }
  };
  const deleteAccount = async () => {
    if (pending) return;
    setPending(true);
    setMessage(``);
    try {
      await auth.deleteAccount(deletePassword);
      setDeletePassword(``);
      router.replace(`/`);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : `Your Account Could Not Be Deleted`); }
    finally { setPending(false); }
  };

  return <AccountShell title={`Your settings.`} description={`Make Kalashi feel like your space.`}>
    <Patchbay id={`settings`} labels={[`LOOK`, `RECORDS`, `MIXTAPES`, `SECURITY`, `ACCOUNT`]} />
    <Text {...element(`settings-patchbay-note`)} style={pageStyles.routeNote}>{`Everything in its right place. A few controls for your corner of the frequency.`}</Text>
    <View {...element(`settings-patch-panels`)} style={pageStyles.stack}>
    <Panel id={`settings-appearance`} number={`01`} eyebrow={`THE LOOK`} title={`Signature frequency`}>
      <View {...element(`settings-palette`)} style={styles.row} accessibilityLabel={`Kalashi theme colors: midnight, lime, warm white, and red`}>
        {[colors.black, colors.green, colors.white, colors.red].map((color, index) => <View key={color} {...element(`settings-swatch`, String(index))} style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.border, backgroundColor: color }} />)}
      </View>
      <Copy id={`settings-appearance-copy`}>{`Midnight, lime, and a little red. Kalashi’s signature theme follows you around the site.`}</Copy>
    </Panel>
    <Panel id={`settings-data`} number={`02`} eyebrow={`THE RECORDS`} title={`Your library`}>
      <Copy id={`settings-storage-copy`}>{Platform.OS === `web` ? `Your profile, favorites, and collections are saved in this browser. Clearing site data removes them.` : `Your profile, favorites, and collections stay in this app session.`}</Copy>
      {library.notice ? <Copy id={`settings-library-error`}>{library.notice}</Copy> : null}
      {confirmFavorites ? <>
        <Copy id={`clear-confirm-copy`}>{`Remove all favorites? Your collections stay in place. This cannot be undone.`}</Copy>
        <Action id={`clear-confirm`} label={`× Remove favorites`} disabled={pending} onPress={() => void clearLibrary(`favorites`)} />
        <Action id={`clear-cancel`} label={`⌃ Keep favorites`} disabled={pending} onPress={() => setConfirmFavorites(false)} />
      </> : <Action id={`clear-request`} label={`× Clear favorites`} disabled={pending || !library.ready || !library.ids.length} onPress={() => setConfirmFavorites(true)} />}
      <AccountLink id={`settings-library-link`} href={`/library`} label={`♡ Open your library`} />
    </Panel>
    <Panel id={`settings-workspace`} number={`03`} eyebrow={`THE MIXTAPES`} title={`Your collections`}>
      {workspace.notice ? <Copy id={`settings-workspace-error`}>{workspace.notice}</Copy> : null}
      <Copy id={`settings-workspace-copy`}>{`${workspace.collections.length} collection${workspace.collections.length === 1 ? `` : `s`} in your library`}</Copy>
      {confirmWorkspace ? <>
        <Copy id={`workspace-clear-warning`}>{`Remove all collections? Your favorite releases and account profile will stay in place. This cannot be undone.`}</Copy>
        <Action id={`workspace-clear-confirm`} label={`× Remove collections`} disabled={pending} onPress={() => void clearLibrary(`collections`)} />
        <Action id={`workspace-clear-cancel`} label={`⌃ Keep collections`} disabled={pending} onPress={() => setConfirmWorkspace(false)} />
      </> : <Action id={`workspace-clear`} label={`× Clear collections`} disabled={pending || !workspace.ready || !workspace.collections.length} onPress={() => setConfirmWorkspace(true)} />}
      <AccountLink id={`settings-collections-link`} href={`/collections`} label={`☷ Open your collections`} />
    </Panel>
    </View>
    <View {...element(`settings-account-panels`)} style={pageStyles.stack}>
    {auth.user ? <>
      <Panel id={`settings-security`} number={`04`} eyebrow={`ACCESS CONTROLS`} title={`Password & security`}>
        <Text {...element(`settings-current-password-label`)} style={styles.label}>{`Current password`}</Text>
        <TextInput {...element(`settings-current-password`)} accessibilityLabel={`Current password`} secureTextEntry autoComplete={`current-password`} autoCapitalize={`none`} maxLength={128} editable={!pending} value={currentPassword} onChangeText={setCurrentPassword} placeholder={`Current password`} placeholderTextColor={colors.muted} style={styles.input} />
        <Text {...element(`settings-new-password-label`)} style={styles.label}>{`New password`}</Text>
        <TextInput {...element(`settings-new-password`)} accessibilityLabel={`New password`} secureTextEntry autoComplete={`new-password`} autoCapitalize={`none`} maxLength={128} editable={!pending} value={newPassword} onChangeText={setNewPassword} placeholder={`At least 8 characters`} placeholderTextColor={colors.muted} style={styles.input} />
        <Action id={`settings-change-password`} label={pending ? `◌ Please wait` : `✓ Update password`} disabled={pending || !currentPassword || newPassword.length < 8} onPress={() => void changePassword()} />
      </Panel>
      <Panel id={`settings-account`} number={`05`} eyebrow={`THE MASTER CHANNEL`} title={`Your account`}>
        <AccountLink id={`settings-profile-link`} href={`/profile`} label={`◉ Edit your profile`} />
        <Action id={`settings-signout`} label={`↪ Sign out`} disabled={pending} onPress={() => void signOut()} />
        {confirmDelete ? <>
          <Copy id={`settings-delete-warning`}>{`Delete your account and its saved data from this browser? This cannot be undone. Enter your password to continue.`}</Copy>
          <TextInput {...element(`settings-delete-password`)} accessibilityLabel={`Password to delete account`} secureTextEntry autoComplete={`current-password`} autoCapitalize={`none`} maxLength={128} editable={!pending} value={deletePassword} onChangeText={setDeletePassword} placeholder={`Your password`} placeholderTextColor={colors.muted} style={styles.input} />
          <Action id={`settings-delete-confirm`} label={pending ? `◌ Deleting` : `× Delete my account`} disabled={pending || !deletePassword} onPress={() => void deleteAccount()} />
          <Action id={`settings-delete-cancel`} label={`⌃ Keep my account`} disabled={pending} onPress={() => { setConfirmDelete(false); setDeletePassword(``); }} />
        </> : <Action id={`delete-account`} label={`× Delete account`} disabled={pending} onPress={() => setConfirmDelete(true)} />}
      </Panel>
    </> : <Panel id={`settings-account`} number={`05`} eyebrow={`THE MASTER CHANNEL`} title={`Your account`}><AccountLink id={`settings-signin`} href={`/sign-in`} label={`↗ Sign in`} /><AccountLink id={`settings-signup`} href={`/sign-up`} label={`+ Create an account`} /></Panel>}
    </View>
    {message ? <Text {...element(`settings-result`)} accessibilityLiveRegion={`polite`} style={styles.copy}>{message}</Text> : null}
  </AccountShell>;
};

export default SettingsScreen;
