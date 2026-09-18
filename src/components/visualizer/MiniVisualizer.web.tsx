import './MiniVisualizer.css';
import SignalCanvas from './SignalCanvas';
import type { AudioVisualizerState } from './audio.types';
import { miniVisualizerSettings } from '../../config/visualizer';
import { BrandMark } from '../Icons.web';

type MiniVisualizerProps = {
  state: AudioVisualizerState;
  ready: boolean;
};

const MiniVisualizer = ({ state, ready }: MiniVisualizerProps) => (
  <div className={`mini-visualizer`} aria-hidden={true}>
    <div className={`mini-visualizer__orbit`}>
      <SignalCanvas
        presentation={`mini`}
        showMark={false}
        compact={false}
        active={ready && state.active}
        signal={state.signal}
        audioPlaying={state.audioPlaying}
        settings={miniVisualizerSettings}
      />
    </div>
    <BrandMark size={20} className={`mini-visualizer__mark`} />
  </div>
);

export default MiniVisualizer;
