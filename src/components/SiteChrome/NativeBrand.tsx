import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/tokens';
import SignalCanvas from '../visualizer/SignalCanvas';
import type { AudioVisualizerState } from '../visualizer/audio.types';
import { miniVisualizerSettings } from '../../config/visualizer';
import { styles } from './styles.native';

type NativeBrandProps = {
  id: string;
  active: boolean;
  size?: number;
  state: AudioVisualizerState;
};

const NativeBrand = ({ id, state, active, size = 58 }: NativeBrandProps) => (
  <View
    nativeID={id}
    accessibilityElementsHidden
    importantForAccessibility={`no-hide-descendants`}
    style={[styles.brandOrbit, { width: size, height: size }]}
  >
    <SignalCanvas
      compact={false}
      active={active}
      showMark={false}
      signal={state.signal}
      presentation={`mini`}
      audioPlaying={state.audioPlaying}
      settings={miniVisualizerSettings}
    />
    <View nativeID={`${id}-mark`} style={styles.brandMark}>
      <Svg width={size * .3} height={size * .3} viewBox={`0 0 40 40`}>
        <Path fill={colors.green} d={`M3 4h8v13L26 4h11L19 20l18 16H25L11 23v13H3z`} />
        <Path fill={colors.red} d={`M30 0h7v3h-7z`} />
      </Svg>
    </View>
  </View>
);

export default NativeBrand;
