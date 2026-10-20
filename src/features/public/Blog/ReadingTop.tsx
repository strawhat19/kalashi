import Svg, { Path } from 'react-native-svg';
import { Animated, Pressable } from 'react-native';
import { colors } from '../../../theme/tokens';
import { styles } from './styles.native';

const ReadingTop = ({ visible, opacity, onPress, id }: { id: string; visible: boolean; opacity: Animated.Value; onPress: () => void }) => (
  <Animated.View
    nativeID={`${id}-wrap`}
    pointerEvents={visible ? `auto` : `none`}
    accessibilityElementsHidden={!visible}
    importantForAccessibility={visible ? `auto` : `no-hide-descendants`}
    style={[styles.topWrap, { opacity }]}
  >
    <Pressable nativeID={id} style={styles.topButton} accessibilityRole={`button`} accessibilityLabel={`Scroll to top`} onPress={onPress}>
      <Svg nativeID={`${id}-icon`} width={22} height={22} viewBox={`0 0 24 24`} fill={`none`} accessibilityElementsHidden>
        <Path d={`m6 15 6-6 6 6`} stroke={colors.green} strokeWidth={1.8} strokeLinecap={`round`} strokeLinejoin={`round`} />
      </Svg>
    </Pressable>
  </Animated.View>
);

export default ReadingTop;
