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
    <AppFrame ready={fontsReady}><Slot /></AppFrame>
  </View></SafeAreaProvider>;
};

export default RootLayout;
