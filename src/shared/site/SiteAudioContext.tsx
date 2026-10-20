import { createContext, useContext, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from 'react';
import type { AudioVisualizerState } from '../../components/visualizer/audio.types';

export const ambientSiteAudio: AudioVisualizerState = { signal: null, active: true, audioPlaying: false };

type SiteAudioValue = {
  visualizerState: AudioVisualizerState;
  setVisualizerState: Dispatch<SetStateAction<AudioVisualizerState>>;
};

const SiteAudioContext = createContext<SiteAudioValue | undefined>(undefined);

export const SiteAudioProvider = ({ children }: PropsWithChildren) => {
  const [visualizerState, setVisualizerState] = useState(ambientSiteAudio);
  return <SiteAudioContext.Provider value={{ visualizerState, setVisualizerState }}>{children}</SiteAudioContext.Provider>;
};

export const useSiteAudio = () => {
  const context = useContext(SiteAudioContext);
  if (!context) throw new Error(`Site Audio Provider Missing`);
  return context;
};
