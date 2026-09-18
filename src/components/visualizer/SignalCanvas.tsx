import { StyleSheet, View } from 'react-native';
import type { AudioSignal } from './audio.types';
import { useEffect, useRef, useState } from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { useVisualizerVisibility } from './useVisualizerVisibility';
import { visualizerConfig, type VisualizerSettings } from '../../config/visualizer';
import { ambientSpectrumSample, ambientWaveformSample } from './ambientSignal';

type SignalCanvasProps = {
  active: boolean;
  compact: boolean;
  audioPlaying: boolean;
  signal: AudioSignal | null;
  settings: VisualizerSettings;
  presentation?: `monitor` | `mini` | `preview`;
  showMark?: boolean;
};

type VisualFrame = { phase: number; spectrum: number[]; waveform: number[] };

const createAmbientFrame = (count: number, phase: number): VisualFrame => ({
  phase,
  waveform: Array.from({ length: count }, (_, index) => ambientWaveformSample(index / Math.max(1, count - 1), phase)),
  spectrum: Array.from({ length: count }, (_, index) => ambientSpectrumSample(index / Math.max(1, count - 1), phase)),
});

const SignalCanvas = ({ signal, active, compact, settings, audioPlaying, presentation = `monitor`, showMark = true }: SignalCanvasProps) => {
  const mini = presentation === `mini`;
  const monitor = presentation === `monitor`;
  const fullWidthWaveform = monitor && settings.mode === `waveform`;
  const waveformInset = fullWidthWaveform ? 0 : 24;
  const waveformWidth = 1000 - waveformInset * 2;
  const phaseRef = useRef(0);
  const smoothRef = useRef<number[]>([]);
  const { visible, canvasRef } = useVisualizerVisibility();
  const [frame, setFrame] = useState(() => createAmbientFrame(settings.density, 0));

  useEffect(() => {
    if (!active || !visible) return;
    let animationFrame = 0;
    let previousTimestamp = 0;
    const interval = 1000 / visualizerConfig.fps;
    const update = (timestamp: number) => {
      if (timestamp - previousTimestamp >= interval) {
        const elapsed = previousTimestamp ? Math.min((timestamp - previousTimestamp) / 1000, 0.1) : interval / 1000;
        previousTimestamp = timestamp;
        phaseRef.current += elapsed * settings.speed;
        if (signal && audioPlaying) {
          const frequencies = signal.readFrequencies();
          const waveform = signal.readWaveform();
          const nextSpectrum = Array.from({ length: settings.density }, (_, index) => {
            const position = index / Math.max(1, settings.density - 1);
            const sampleIndex = Math.min(frequencies.length - 1, Math.floor(Math.pow(position, 2) * (frequencies.length - 1)));
            const target = (frequencies[sampleIndex] ?? 0) / 255;
            const previous = smoothRef.current?.[index] ?? target;
            return previous * visualizerConfig.smoothing + target * (1 - visualizerConfig.smoothing);
          });
          smoothRef.current = nextSpectrum;
          setFrame({
            phase: phaseRef.current,
            spectrum: nextSpectrum,
            waveform: Array.from({ length: settings.density }, (_, index) => {
              const sampleIndex = Math.floor(index / Math.max(1, settings.density - 1) * (waveform.length - 1));
              return ((waveform[sampleIndex] ?? 128) - 128) / 128;
            }),
          });
        } else {
          setFrame(createAmbientFrame(settings.density, phaseRef.current));
        }
      }
      animationFrame = requestAnimationFrame(update);
    };
    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [active, signal, visible, audioPlaying, settings.speed, settings.density]);

  const linePath = frame.waveform.map((sample, index) => {
    const x = waveformInset + index / Math.max(1, frame.waveform.length - 1) * waveformWidth;
    const y = 160 + sample * 95 * settings.intensity;
    return `${index === 0 ? `M` : `L`} ${x.toFixed(1)} ${Math.max(18, Math.min(302, y)).toFixed(1)}`;
  }).join(` `);

  return (
    <View ref={canvasRef} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.canvas, compact && styles.compact, !monitor && styles.embedded]}>
      <Svg width="100%" height="100%" viewBox={mini ? `380 40 240 240` : `0 0 1000 320`} preserveAspectRatio={fullWidthWaveform ? `none` : `xMidYMid meet`}>
        {monitor && (
          <>
            {Array.from({ length: 21 }, (_, index) => (
              <Line key={`grid-v-${index}`} x1={index * 50} x2={index * 50} y1={0} y2={320} stroke="#FFFFFF" strokeOpacity={0.035} />
            ))}
            {Array.from({ length: 7 }, (_, index) => (
              <Line key={`grid-h-${index}`} x1={0} x2={1000} y1={index * 50 + 10} y2={index * 50 + 10} stroke="#FFFFFF" strokeOpacity={0.035} />
            ))}
            <Line x1={0} x2={1000} y1={160} y2={160} stroke={visualizerConfig.accent} strokeOpacity={0.15} strokeDasharray="2 6" />
            <Line x1={500} x2={500} y1={0} y2={320} stroke={visualizerConfig.accent} strokeOpacity={0.1} strokeDasharray="2 6" />
          </>
        )}
        {settings.mode === `waveform` ? (
          <>
            {frame.spectrum.map((sample, index) => {
              const x = waveformInset + index / Math.max(1, frame.spectrum.length - 1) * waveformWidth;
              const height = Math.min(268, Math.max(3, sample * 190 * settings.intensity));
              return <Rect key={`bar-${index}`} x={x - 1.5} y={160 - height / 2} width={3} height={height} fill={visualizerConfig.accent} opacity={0.18} />;
            })}
            <Path d={linePath} fill="none" stroke={visualizerConfig.accent} strokeWidth={13} strokeOpacity={0.035} strokeLinejoin="round" />
            <Path d={linePath} fill="none" stroke={visualizerConfig.accent} strokeWidth={6} strokeOpacity={0.12} strokeLinejoin="round" />
            <Path d={linePath} fill="none" stroke={visualizerConfig.accent} strokeWidth={presentation === `preview` ? 4 : 2} strokeLinejoin="round" />
            <Circle cx={500} cy={160} r={3.5} fill={visualizerConfig.alert} />
          </>
        ) : (
          <>
            <Circle cx={500} cy={160} r={mini ? 114 : 116} stroke={mini ? visualizerConfig.accent : `#FFFFFF`} strokeOpacity={mini ? 0.12 : 0.06} fill="none" />
            <Circle cx={500} cy={160} r={mini ? 45 : 57} stroke={visualizerConfig.accent} strokeOpacity={mini ? 0.4 : 0.15} strokeWidth={mini ? 1.5 : 1} fill="none" />
            <Circle cx={500} cy={160} r={mini ? 59 : 72} stroke={visualizerConfig.accent} strokeOpacity={0.5} strokeWidth={mini ? 1.5 : 0.6} fill="none" />
            {frame.spectrum.map((sample, index) => {
              const angle = (index / frame.spectrum.length) * Math.PI * 2 - Math.PI / 2 + frame.phase * (mini ? 0.3 : 0.06);
              const startRadius = mini ? 61 : 76;
              // Keep a clearly legible ring at rest, with room for the spectrum to breathe.
              const radius = mini ? 69 + Math.min(43, sample * 48 * settings.intensity) : 73 + Math.min(72, sample * 58 * settings.intensity);
              return (
                <Line
                  key={`ray-${index}`}
                  x1={500 + Math.cos(angle) * startRadius}
                  y1={160 + Math.sin(angle) * startRadius}
                  x2={500 + Math.cos(angle) * radius}
                  y2={160 + Math.sin(angle) * radius}
                  stroke={index % 23 === 0 ? visualizerConfig.alert : visualizerConfig.accent}
                  strokeWidth={mini ? (index % 4 === 0 ? 3.8 : 2.4) : (index % 4 === 0 ? 2.5 : 1.4)}
                  strokeLinecap={mini ? `round` : `butt`}
                  strokeOpacity={mini ? 0.7 + sample * 0.3 : 0.5 + sample * 0.5}
                />
              );
            })}
            {showMark ? <Path d="M 489 140 L 489 180 M 491 160 L 510 140 M 491 160 L 512 180" fill="none" stroke={visualizerConfig.accent} strokeWidth={mini ? 4 : 3} /> : null}
            <Circle cx={mini ? 500 + Math.cos(frame.phase * 0.75) * 45 : 560} cy={mini ? 160 + Math.sin(frame.phase * 0.75) * 45 : 160} r={mini ? 4 : 3} fill={visualizerConfig.alert} />
          </>
        )}
        {monitor && <Path d="M 12 30 L 12 12 L 30 12 M 970 12 L 988 12 L 988 30 M 12 290 L 12 308 L 30 308 M 970 308 L 988 308 L 988 290" fill="none" stroke="#9AAA8D" strokeOpacity={0.45} />}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  compact: { height: 190 },
  canvas: { height: 280, width: `100%` },
  embedded: { height: `100%`, width: `100%` },
});

export default SignalCanvas;
