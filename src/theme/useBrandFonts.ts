import { useFonts } from 'expo-font';

const useBrandFonts = () => {
  const [loaded, error] = useFonts({
    Anton: require('../../assets/fonts/Anton-Regular.ttf'),
    SpaceGrotesk: require('../../assets/fonts/SpaceGrotesk.ttf'),
  });
  return loaded || !!error;
};

export default useBrandFonts;
