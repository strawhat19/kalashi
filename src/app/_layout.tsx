import { LocalWorkspaceProvider } from '../shared/account/LocalWorkspaceContext';
import { LibraryProvider } from '../shared/account/LibraryContext';
import { AccountNavigationProvider } from '../shared/account/NavigationContext';
import { AuthProvider, useAuth } from '../shared/account/AuthContext';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/tokens';
import useBrandFonts from '../theme/useBrandFonts';
import AppFrame from '../components/motion/AppFrame';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const AccountData = ({ ready }: { ready: boolean }) => {
  const { user, loading } = useAuth();
  const scope = user?.id ?? `guest`;
  return <AppFrame ready={ready && !loading}>
    <LibraryProvider key={scope} scope={scope}>
      <LocalWorkspaceProvider scope={scope}>
        <AccountNavigationProvider scope={scope}><Slot /></AccountNavigationProvider>
      </LocalWorkspaceProvider>
    </LibraryProvider>
  </AppFrame>;
};

const RootLayout = () => {
  const fontsReady = useBrandFonts();
  return <SafeAreaProvider><StatusBar style={`light`} /><View style={{ flex: 1, backgroundColor: colors.black }}>
    <AuthProvider><AccountData ready={fontsReady} /></AuthProvider>
  </View></SafeAreaProvider>;
};

export default RootLayout;
