import { View } from 'react-native';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme/tokens';
import AppFrame from '../components/motion/AppFrame';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout = () => {
  const [loaded, error] = useFonts({
    Anton: require('../../assets/fonts/Anton-Regular.ttf'),
    SpaceGrotesk: require('../../assets/fonts/SpaceGrotesk.ttf'),
  });

  return <SafeAreaProvider><StatusBar style={`light`} /><View style={{ flex: 1, backgroundColor: colors.black }}>
    <AppFrame ready={loaded || !!error}><Slot /></AppFrame>
  </View></SafeAreaProvider>;
};

export default RootLayout;
