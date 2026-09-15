import './HeroVisualizer.css';
import SignalCanvas from './SignalCanvas';
import type { AudioVisualizerState } from './audio.types';
import type { VisualizerSettings } from '../../config/visualizer';

const heroSettings: VisualizerSettings = {
  mode: `waveform`,
  speed: 0.65,
  intensity: 1.1,
  density: 80,
};

type HeroVisualizerProps = {
  state: AudioVisualizerState;
  ready: boolean;
};

const HeroVisualizer = ({ state, ready }: HeroVisualizerProps) => (
  <span className={`hero-visualizer`} aria-hidden={true}>
    <span className={`hero-visualizer__canvas`}>
      <SignalCanvas
        presentation={`preview`}
        compact={false}
        active={ready && state.active}
        signal={state.signal}
        audioPlaying={state.audioPlaying}
        settings={heroSettings}
      />
    </span>
  </span>
);

export default HeroVisualizer;
