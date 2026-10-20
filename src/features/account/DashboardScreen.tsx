import { usePathname } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import AccountShell from './AccountShell';
import { StudioDoor } from './AccountDecor';
import { pageStyles } from './pageStyles';
import { ownerRoutes } from '../../shared/account/routes';
import { useAuth } from '../../shared/account/AuthContext';
import { AccountLink, Copy, Panel, element } from './ui';

const DashboardScreen = () => {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { width } = useWindowDimensions();
  const page = ownerRoutes.find((item) => item.href === pathname);

  return <AccountShell title={`${page?.label ?? `Studio`}.`} description={`A space for the Kalashi studio team.`}>
    <View {...element(`studio-access-layout`)} style={[pageStyles.split, width > 1000 && pageStyles.splitWide]}>
    <View {...element(`studio-door-column`)} style={pageStyles.column}><StudioDoor id={`restricted`} label={page?.label ?? `Studio`} /></View>
    <View {...element(`studio-access-column`)} style={pageStyles.column}>
    <Panel id={`studio-access`} eyebrow={`BEHIND THE SCENES`} title={loading ? `Loading Account…` : user ? `Studio Access Required` : `Sign In To Continue`}>
      <Copy id={`studio-access-description`}>{loading ? `Getting your account ready.` : user ? `This section is reserved for the Kalashi studio team. You can manage your profile, favorites, collections, and inquiries from your account.` : `Sign in to open your account and keep your favorite records close.`}</Copy>
      {user ? <AccountLink id={`studio-profile`} href={`/profile`} label={`◉ Open profile`} /> : <><AccountLink id={`studio-sign-in`} href={`/sign-in`} label={`↗ Sign in`} /><AccountLink id={`studio-sign-up`} href={`/sign-up`} label={`+ Create account`} /></>}
    </Panel>
    <Panel id={`studio-explore`} eyebrow={`THE LISTENER’S SIDE`} title={`The music is yours to explore.`}>
      <AccountLink id={`studio-music`} href={`/music`} label={`♫ Explore the music`} />
      <AccountLink id={`studio-library`} href={`/library`} label={`♡ Your library`} />
      <AccountLink id={`studio-inquiries`} href={`/profile/inquiries`} label={`✉ Your inquiries`} />
    </Panel>
    </View>
    </View>
  </AccountShell>;
};

export default DashboardScreen;
