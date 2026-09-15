import { useRef } from 'react';
import type { View } from 'react-native';

export const useVisualizerVisibility = () => {
  const canvasRef = useRef<View>(null);
  return { visible: true, canvasRef };
};
