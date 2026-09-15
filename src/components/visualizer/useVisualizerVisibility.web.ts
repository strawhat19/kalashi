import type { View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

export const useVisualizerVisibility = () => {
  const canvasRef = useRef<View>(null);
  const [intersecting, setIntersecting] = useState(false);
  const visible = intersecting || (typeof window !== `undefined` && typeof IntersectionObserver === `undefined`);

  useEffect(() => {
    const element = canvasRef.current as unknown as Element | null;
    if (!element || typeof IntersectionObserver === `undefined`) return;
    const observer = new IntersectionObserver((entries) => {
      setIntersecting(entries?.[0]?.isIntersecting === true);
    }, { threshold: 0.01 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { visible, canvasRef };
};
