import { useState } from 'react';
import { Text, TextInput, View, useWindowDimensions } from 'react-native';
import { colors, fonts } from '../../theme/tokens';
import { useLibrary } from '../../shared/account/LibraryContext';
import { useAuth } from '../../shared/account/AuthContext';
import { useLocalWorkspace } from '../../shared/account/LocalWorkspaceContext';
import type { AccountUser } from '../../shared/account/auth.types';
import AccountShell from './AccountShell';
import { Passport, RecordMark } from './AccountDecor';
import { pageStyles } from './pageStyles';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

const ProfileForm = ({ user }: { user: AccountUser }) => {
  const auth = useAuth();
  const { width } = useWindowDimensions();
  const { ids } = useLibrary();
  const workspace = useLocalWorkspace();
  const [draft, setDraft] = useState<{ displayName?: string; bio?: string }>({});
  const [message, setMessage] = useState(``);
  const [pending, setPending] = useState(false);
  const displayName = draft.displayName ?? user.displayName;
  const bio = draft.bio ?? user.bio;

  const save = async () => {
    if (pending) return;
    setPending(true);
    setMessage(``);
    try {
      await auth.updateProfile({ displayName, bio });
      setDraft({});
      setMessage(`Profile Saved`);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : `Your Profile Could Not Be Saved`); }
    finally { setPending(false); }
  };

  return <AccountShell title={`Your profile.`} description={`A little about you. Make this frequency your own.`}>
    <View {...element(`profile-columns`)} style={[styles.stack, width > 1100 && { flexDirection: `row`, alignItems: `flex-start` }]}>
      <View {...element(`profile-details`)} style={{ flex: 1, gap: 20 }}>
        <Passport
          id={user.id}
          role={user.role}
          number={user.number}
          email={user.email}
          name={user.displayName}
          joined={new Date(user.createdAt).toLocaleDateString(undefined, { year: `numeric`, month: `short`, day: `numeric` })}
        />
        <Panel id={`profile-identity`} number={`01`} eyebrow={`MAKE YOURSELF AT HOME`} title={`The person behind the playlist.`}>
          <View {...element(`profile-avatar-row`)} style={styles.row}>
            <Text {...element(`profile-avatar`)} accessibilityLabel={`${user.displayName} avatar`} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.green, color: colors.black, fontFamily: fonts.display, fontSize: 32, textAlign: `center`, lineHeight: 64 }}>{displayName.trim().slice(0, 1).toUpperCase() || `K`}</Text>
            <View {...element(`profile-identity-copy`)} style={{ gap: 5 }}><Text style={styles.label}>{user.displayName}</Text><Text style={styles.copy}>{user.email}</Text></View>
          </View>
          <View {...element(`profile-edit-row`, `name`)} style={pageStyles.stack}>
            <Text {...element(`profile-name-label`)} style={styles.label}>{`Display name`}</Text>
            <TextInput {...element(`profile-name-input`)} style={styles.input} accessibilityLabel={`Display name`} autoComplete={`name`} editable={!pending} maxLength={80} value={displayName} onChangeText={(value) => { setDraft((previous) => ({ ...previous, displayName: value })); setMessage(``); }} placeholder={`Your name`} placeholderTextColor={colors.muted} />
          </View>
          <View {...element(`profile-edit-row`, `bio`)} style={pageStyles.stack}>
            <Text {...element(`profile-bio-label`)} style={styles.label}>{`Bio`}</Text>
            <TextInput {...element(`profile-bio-input`)} style={[styles.input, { minHeight: 100, textAlignVertical: `top` }]} accessibilityLabel={`Bio`} editable={!pending} multiline maxLength={500} value={bio} onChangeText={(value) => { setDraft((previous) => ({ ...previous, bio: value })); setMessage(``); }} placeholder={`Your favorite frequency`} placeholderTextColor={colors.muted} />
          </View>
          <View {...element(`profile-edit-row`, `email`)} style={pageStyles.stack}>
            <Text {...element(`profile-email-label`)} style={styles.label}>{`Email address`}</Text>
            <Copy id={`profile-email`}>{user.email}</Copy>
          </View>
          <Action id={`profile-save`} label={pending ? `◌ Saving` : `✓ Save profile`} disabled={pending || !displayName.trim()} onPress={() => void save()} />
          {message ? <Text {...element(`profile-save-result`)} accessibilityLiveRegion={`polite`} style={styles.copy}>{message}</Text> : null}
        </Panel>
      </View>
      <View {...element(`profile-metadata`)} style={{ width: width > 1100 ? 240 : `100%`, gap: 20 }}>
        <Panel id={`profile-account-status`} eyebrow={`PASSPORT NOTES`} title={`Your details`}>
          <Copy id={`profile-role`}>{`Role: ${user.role}\nFavorites: ${ids.length}\nCollections: ${workspace.collections.length}`}</Copy>
          <Copy id={`profile-joined`}>{`Joined ${new Date(user.createdAt).toLocaleDateString(undefined, { year: `numeric`, month: `long`, day: `numeric` })}`}</Copy>
          <Copy id={`profile-privacy`}>{`Your profile and collections are private.`}</Copy>
          <AccountLink id={`profile-library`} href={`/library`} label={`♡ Your library`} />
          <AccountLink id={`profile-settings`} href={`/settings`} label={`⚙ Settings & security`} />
          <AccountLink id={`profile-connections`} href={`/connections`} label={`◇ Connections`} />
          <AccountLink id={`profile-inquiries`} href={`/profile/inquiries`} label={`✉ My inquiries`} />
        </Panel>
      </View>
    </View>
  </AccountShell>;
};

const ProfileScreen = () => {
  const { user, loading, error } = useAuth();
  if (loading) return <AccountShell title={`Your profile.`} description={`Getting your details ready.`}><Panel id={`profile-loading`} title={`Your profile`}><Copy id={`profile-loading-copy`}>{`Loading your profile…`}</Copy></Panel></AccountShell>;
  if (!user) return <AccountShell title={`Your profile.`} description={`Sign in to view this.`}>
    <View {...element(`profile-welcome`)} style={pageStyles.ribbon}><RecordMark id={`profile-welcome`} /><View style={pageStyles.ribbonCopy}><Text {...element(`profile-welcome-heading`)} style={pageStyles.sectionTitle}>{`A place in the rotation.`}</Text><Copy id={`profile-welcome-description`}>{`Your own corner of Kalashi. Ready when you are.`}</Copy></View></View>
    <Panel id={`profile-sign-in`} title={`Find your frequency`}>
      <Copy id={`profile-sign-in-copy`}>{`Your profile brings your favorites, collections, and account settings together.`}</Copy>
      {error ? <Copy id={`profile-account-error`}>{error}</Copy> : null}
      <AccountLink id={`profile-signin-action`} href={`/sign-in`} label={`↗ Sign in`} />
      <AccountLink id={`profile-signup-action`} href={`/sign-up`} label={`+ Create an account`} />
      <AccountLink id={`profile-explore-action`} href={`/music`} label={`♫ Explore the music`} />
    </Panel>
  </AccountShell>;
  return <ProfileForm key={user.id} user={user} />;
};

export default ProfileScreen;
