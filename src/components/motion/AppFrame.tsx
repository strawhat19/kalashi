import type { PropsWithChildren } from 'react';
import { colors } from '../../theme/tokens';
import { ActivityIndicator, Image, Text, View } from 'react-native';

const AppFrame = ({ ready, children }: PropsWithChildren<{ ready: boolean }>) => ready ? children : (
  <View style={{ flex: 1, gap: 18, alignItems: `center`, justifyContent: `center`, backgroundColor: colors.black }}>
    <Image source={require('../../../assets/brand/icon.png')} style={{ width: 78, height: 78 }} accessibilityIgnoresInvertColors />
    <Text style={{ color: colors.white, fontSize: 12, letterSpacing: 4 }}>{`KALASHI MUSIC`}</Text>
    <ActivityIndicator color={colors.green} accessibilityLabel={`Loading Kalashi Music`} />
  </View>
);

export default AppFrame;
