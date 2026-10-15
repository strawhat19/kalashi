import Svg, { Path } from 'react-native-svg';
import { Text, TextInput, View } from 'react-native';
import AccountShell from './AccountShell';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

export type AuthMode = `sign-in` | `sign-up` | `forgot-password`;
const titles = { 'sign-in': `Welcome back.`, 'sign-up': `Find your frequency.`, 'forgot-password': `Reset your password.` };
const GoogleMark = () => <Svg width={22} height={22} viewBox={`0 0 24 24`} accessibilityLabel={`Google`}>
  <Path fill={`#4285F4`} d={`M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z`} />
  <Path fill={`#34A853`} d={`M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.05v2.59A10 10 0 0 0 12 22Z`} />
  <Path fill={`#FBBC05`} d={`M6.4 13.92a6 6 0 0 1 0-3.84V7.49H3.05a10 10 0 0 0 0 9.02l3.35-2.59Z`} />
  <Path fill={`#EA4335`} d={`M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.95 5.49l3.35 2.59C7.19 7.72 9.4 5.96 12 5.96Z`} />
</Svg>;
export default function AuthScreen({ mode }: { mode: AuthMode }) {
  const reset = mode === `forgot-password`;
  return <AccountShell title={titles[mode]} description={`Account access is not connected yet. This preview does not collect credentials, create accounts, or send reset emails.`}>
    <Panel id={`auth`} title={reset ? `Email recovery` : `Your Kalashi account`}>
      {!reset && <View {...element(`auth-google`)} style={styles.row}><GoogleMark /><Action id={`google`} label={`Continue with Google — coming soon`} disabled /></View>}
      {mode === `sign-up` && <><Text {...element(`auth-label`, `name`)} style={styles.label}>{`Display name`}</Text><TextInput {...element(`auth-input`, `name`)} accessibilityLabel={`Display name, unavailable until accounts launch`} editable={false} placeholder={`Your name`} placeholderTextColor={`#92978e`} style={styles.input} /></>}
      <Text {...element(`auth-label`, `email`)} style={styles.label}>{`Email address`}</Text>
      <TextInput {...element(`auth-input`, `email`)} accessibilityLabel={`Email address, unavailable until accounts launch`} editable={false} placeholder={`you@example.com`} placeholderTextColor={`#92978e`} style={styles.input} />
      {!reset && <><Text {...element(`auth-label`, `password`)} style={styles.label}>{`Password`}</Text><TextInput {...element(`auth-input`, `password`)} accessibilityLabel={`Password, unavailable until accounts launch`} editable={false} secureTextEntry placeholder={`Unavailable in preview`} placeholderTextColor={`#92978e`} style={styles.input} /></>}
      <Action id={`auth-submit`} label={reset ? `↗ Send reset email — unavailable` : `↗ ${mode === `sign-up` ? `Create account` : `Sign in`} — unavailable`} disabled />
      <Copy id={`auth-explanation`}>{`Keep exploring without signing in. Favorites can be kept locally; they will not automatically become cloud favorites later.`}</Copy>
      <AccountLink id={`auth-switch`} href={mode === `sign-up` ? `/sign-in` : `/sign-up`} label={mode === `sign-up` ? `↗ Already have an account? Sign in` : `↗ New here? Create an account`} />
      {!reset && <AccountLink id={`auth-reset`} href={`/forgot-password`} label={`↗ Forgot password?`} />}
      {reset && <AccountLink id={`auth-back`} href={`/sign-in`} label={`← Back to sign in`} />}
      <AccountLink id={`auth-library`} href={`/library`} label={`♡ Explore your local library`} />
    </Panel>
  </AccountShell>;
}
