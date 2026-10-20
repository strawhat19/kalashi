import Svg, { Path } from 'react-native-svg';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Text, TextInput, View, useWindowDimensions } from 'react-native';
import AccountShell from './AccountShell';
import { Admission } from './AccountDecor';
import { pageStyles } from './pageStyles';
import { useAuth } from '../../shared/account/AuthContext';
import { useLocalWorkspace } from '../../shared/account/LocalWorkspaceContext';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

export type AuthMode = `sign-in` | `sign-up` | `forgot-password`;
const titles = { 'sign-in': `Welcome back.`, 'sign-up': `Find your frequency.`, 'forgot-password': `Password help.` };
const GoogleMark = () => <Svg width={22} height={22} viewBox={`0 0 24 24`} accessibilityLabel={`Google`}>
  <Path fill={`#4285F4`} d={`M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z`} />
  <Path fill={`#34A853`} d={`M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.05v2.59A10 10 0 0 0 12 22Z`} />
  <Path fill={`#FBBC05`} d={`M6.4 13.92a6 6 0 0 1 0-3.84V7.49H3.05a10 10 0 0 0 0 9.02l3.35-2.59Z`} />
  <Path fill={`#EA4335`} d={`M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.95 5.49l3.35 2.59C7.19 7.72 9.4 5.96 12 5.96Z`} />
</Svg>;
export default function AuthScreen({ mode }: { mode: AuthMode }) {
  const auth = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const workspace = useLocalWorkspace();
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [message, setMessage] = useState(``);
  const [pending, setPending] = useState(false);
  const reset = mode === `forgot-password`;
  const submit = async () => {
    if (pending || auth.loading) return;
    setPending(true);
    setMessage(``);
    try {
      if (mode === `sign-up`) await auth.signUp({ email, password, displayName: name ?? workspace.profile.displayName });
      else await auth.signIn({ email, password });
      setPassword(``);
      router.replace(`/profile`);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : `Could Not Continue — Please Try Again`); }
    finally { setPending(false); }
  };

  if (reset) return <AccountShell title={titles[mode]} description={`Let’s get you back to your frequency.`}>
    <View {...element(`auth-composition`, mode)} style={[pageStyles.authComposition, width > 1100 && pageStyles.splitWide]}>
    <View {...element(`auth-art-column`)} style={pageStyles.authArt}><Admission id={`recovery`} mode={mode} /></View>
    <View {...element(`auth-form-column`)} style={pageStyles.authForm}>
    <Panel id={`auth-recovery`} number={`?`} eyebrow={`THE WAY BACK`} title={`Let’s retrace the steps.`}>
      <Copy id={`auth-recovery-copy`}>{auth.user ? `You can change your password in Settings using your current password.` : `Sign in with the email and password you used to create your account in this browser. Password recovery by email is not available yet.`}</Copy>
      {auth.user ? <AccountLink id={`auth-recovery-settings`} href={`/settings`} label={`⚙ Change your password`} /> : <AccountLink id={`auth-recovery-signin`} href={`/sign-in`} label={`↗ Back to sign in`} />}
      <AccountLink id={`auth-recovery-signup`} href={`/sign-up`} label={`+ Start a new account`} />
      <AccountLink id={`auth-recovery-music`} href={`/music`} label={`♫ Keep exploring the music`} />
    </Panel>
    </View>
    </View>
  </AccountShell>;

  if (auth.user) return <AccountShell title={`You’re in, ${auth.user.displayName}.`} description={`Your music, your collections, your frequency.`}>
    <View {...element(`auth-composition`, `signed-in`)} style={[pageStyles.authComposition, width > 1100 && pageStyles.splitWide]}>
    <View {...element(`auth-art-column`)} style={pageStyles.authArt}><Admission id={`signed-in`} mode={`sign-in`} /></View>
    <View {...element(`auth-form-column`)} style={pageStyles.authForm}>
    <Panel id={`auth-signed-in`} eyebrow={`YOU’RE ON THE LIST`} title={`Welcome to Kalashi`}>
      <AccountLink id={`auth-open-profile`} href={`/profile`} label={`◉ Open your profile`} />
      <AccountLink id={`auth-open-library`} href={`/library`} label={`♡ Open your library`} />
      <Action id={`auth-switch-account`} label={`↪ Sign out`} onPress={() => void auth.signOut().catch((cause: unknown) => setMessage(cause instanceof Error ? cause.message : `Could Not Sign Out`))} />
      {message ? <Copy id={`auth-account-message`}>{message}</Copy> : null}
    </Panel>
    </View>
    </View>
  </AccountShell>;

  return <AccountShell title={titles[mode]} description={mode === `sign-up` ? `Create your Kalashi account and make this frequency yours.` : `Sign in to your profile, favorites, and collections.`}>
    <View {...element(`auth-composition`, mode)} style={[pageStyles.authComposition, width > 1100 && pageStyles.splitWide]}>
    <View {...element(`auth-art-column`)} style={pageStyles.authArt}><Admission id={mode} mode={mode} /></View>
    <View {...element(`auth-form-column`)} style={pageStyles.authForm}>
    <Panel id={`auth`} number={mode === `sign-up` ? `A2` : `A1`} eyebrow={mode === `sign-up` ? `YOUR ADMISSION` : `YOUR RE-ENTRY`} title={mode === `sign-up` ? `Join the frequency` : `Take your place.`}>
      <View {...element(`auth-google`)} style={styles.row}>
        <GoogleMark />
        <Action id={`google`} label={`Continue with Google`} disabled={pending || auth.loading} onPress={() => setMessage(`Google Sign-In Is Not Available Yet — Use Email To Continue`)} />
      </View>
      <Copy id={`auth-email-divider`}>{`Or continue with email`}</Copy>
      {mode === `sign-up` ? <>
        <Text {...element(`auth-label`, `name`)} style={styles.label}>{`Your name`}</Text>
        <TextInput {...element(`auth-input`, `name`)} accessibilityLabel={`Your name`} editable={!pending} autoComplete={`name`} maxLength={80} value={name ?? workspace.profile.displayName} onChangeText={setName} placeholder={`Your name`} placeholderTextColor={`#92978e`} style={styles.input} />
      </> : null}
      <Text {...element(`auth-label`, `email`)} style={styles.label}>{`Email address`}</Text>
      <TextInput {...element(`auth-input`, `email`)} accessibilityLabel={`Email address`} editable={!pending} keyboardType={`email-address`} autoComplete={`email`} autoCapitalize={`none`} autoCorrect={false} maxLength={254} value={email} onChangeText={setEmail} placeholder={`you@example.com`} placeholderTextColor={`#92978e`} style={styles.input} />
      <Text {...element(`auth-label`, `password`)} style={styles.label}>{`Password`}</Text>
      <TextInput {...element(`auth-input`, `password`)} accessibilityLabel={`Password`} editable={!pending} secureTextEntry autoComplete={mode === `sign-up` ? `new-password` : `current-password`} autoCapitalize={`none`} maxLength={128} value={password} onChangeText={setPassword} placeholder={mode === `sign-up` ? `At least 8 characters` : `Your password`} placeholderTextColor={`#92978e`} onSubmitEditing={() => void submit()} style={styles.input} />
      <Action id={`auth-submit`} label={pending ? `◌ Please wait` : mode === `sign-up` ? `+ Create account` : `↗ Sign in`} disabled={pending || auth.loading} onPress={() => void submit()} />
      {message || auth.error ? <Text {...element(`auth-message`)} accessibilityRole={`alert`} style={styles.copy}>{message || auth.error}</Text> : null}
      <AccountLink id={`auth-switch`} href={mode === `sign-up` ? `/sign-in` : `/sign-up`} label={mode === `sign-up` ? `↗ Already have an account? Sign in` : `↗ New here? Create an account`} />
      <AccountLink id={`auth-reset`} href={`/forgot-password`} label={`↗ Forgot password?`} />
      <View {...element(`auth-policy-links`)} style={styles.row}><AccountLink id={`auth-terms`} href={`/terms`} label={`↗ Terms`} /><AccountLink id={`auth-privacy`} href={`/privacy`} label={`↗ Privacy`} /></View>
      <AccountLink id={`auth-library`} href={`/music`} label={`♫ Explore the music`} />
    </Panel>
    </View>
    </View>
  </AccountShell>;
}
