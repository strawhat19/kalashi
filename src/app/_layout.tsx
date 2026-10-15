import { LocalWorkspaceProvider } from '../shared/account/LocalWorkspaceContext';
import { LibraryProvider } from '../shared/account/LibraryContext';
import { AccountNavigationProvider } from '../shared/account/NavigationContext';
import { View } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/tokens';
import useBrandFonts from '../theme/useBrandFonts';
import AppFrame from '../components/motion/AppFrame';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout = () => {
  const fontsReady = useBrandFonts();

  return <SafeAreaProvider><StatusBar style={`light`} /><View style={{ flex: 1, backgroundColor: colors.black }}>
    <LibraryProvider><LocalWorkspaceProvider><AccountNavigationProvider><AppFrame ready={fontsReady}><Slot /></AppFrame></AccountNavigationProvider></LocalWorkspaceProvider></LibraryProvider>
  </View></SafeAreaProvider>;
};

export default RootLayout;
