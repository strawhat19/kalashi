import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { visualizerConfig } from '../../config/visualizer';
import type { LocalAudioProps } from './audio.types';

type CaptureOptions = DisplayMediaStreamOptions & {
  preferCurrentTab: boolean;
  selfBrowserSurface: `include`;
  systemAudio: `exclude`;
  monitorTypeSurfaces: `exclude`;
  surfaceSwitching: `exclude`;
  windowAudio: `exclude`;
};

type SiteAudioSession = {
  stream: MediaStream;
  context: AudioContext;
  source: MediaStreamAudioSourceNode;
  analyser: AnalyserNode;
  timer: ReturnType<typeof setInterval>;
  onEnded: () => void;
};

const captureError = (cause: unknown) => {
  if (cause instanceof DOMException) {
    if (cause.name === `NotAllowedError`) return `Sharing was canceled or blocked. Try Sync site audio again, choose this tab, and enable Share tab audio.`;
    if (cause.name === `NotFoundError` || cause.name === `NotSupportedError`) return `Tab audio sharing is unavailable here. Open this site in desktop Chrome or Edge and try again.`;
    if (cause.name === `NotReadableError`) return `The browser could not capture this tab. Close other sharing sessions and try again.`;
    if (cause.name === `InvalidStateError`) return `Keep this tab in the foreground, then press Sync site audio again.`;
  }
  return cause instanceof Error ? cause.message : `Audio sync could not start. Try again in desktop Chrome or Edge.`;
};

// Embedded players are cross-origin. Capture this tab's audio with explicit browser
// permission; the analyser never connects to the speakers, which avoids an echo.
const SiteAudio = ({ suspended = false, onSignalChange, onPlaybackChange }: LocalAudioProps) => {
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [playing, setPlaying] = useState(false);
  const sessionRef = useRef<SiteAudioSession | null>(null);
  const pendingContextRef = useRef<AudioContext | null>(null);
  const generationRef = useRef(0);
  const playingRef = useRef(false);
  const suspendedRef = useRef(suspended);
  const callbacksRef = useRef({ onSignalChange, onPlaybackChange });

  useEffect(() => {
    suspendedRef.current = suspended;
    callbacksRef.current = { onSignalChange, onPlaybackChange };
  }, [suspended, onSignalChange, onPlaybackChange]);

  const updatePlayback = useCallback((next: boolean) => {
    if (playingRef.current === next) return;
    playingRef.current = next;
    setPlaying(next);
    callbacksRef.current.onPlaybackChange(next);
  }, []);

  const destroySession = useCallback(() => {
    const session = sessionRef.current;
    sessionRef.current = null;
    if (session) {
      clearInterval(session.timer);
      for (const track of session.stream.getTracks()) {
        track.removeEventListener(`ended`, session.onEnded);
        track.stop();
      }
      session.source.disconnect();
      session.analyser.disconnect();
      void session.context.close().catch(() => undefined);
    }
    const pendingContext = pendingContextRef.current;
    pendingContextRef.current = null;
    if (pendingContext) void pendingContext.close().catch(() => undefined);
  }, []);

  const stopSync = useCallback(() => {
    generationRef.current += 1;
    destroySession();
    setConnected(false);
    setLoading(false);
    updatePlayback(false);
    callbacksRef.current.onSignalChange(null);
  }, [destroySession, updatePlayback]);

  useEffect(() => () => {
    generationRef.current += 1;
    destroySession();
  }, [destroySession]);

  useEffect(() => {
    const updateContext = () => {
      const session = sessionRef.current;
      if (!session) return;
      if (suspendedRef.current || document.hidden) {
        updatePlayback(false);
        void session.context.suspend().catch(() => undefined);
      } else {
        void session.context.resume().catch(() => {
          if (sessionRef.current === session) {
            stopSync();
            setError(`Audio sync was interrupted. Press Sync site audio to reconnect.`);
          }
        });
      }
    };
    updateContext();
    document.addEventListener(`visibilitychange`, updateContext);
    return () => document.removeEventListener(`visibilitychange`, updateContext);
  }, [suspended, stopSync, updatePlayback]);

  const startSync = async () => {
    if (loading || connected) return;
    const generation = ++generationRef.current;
    setError(``);
    setLoading(true);
    let pendingStream: MediaStream | null = null;
    let context: AudioContext | null = null;

    try {
      if (!navigator.mediaDevices?.getDisplayMedia || !window.AudioContext) {
        throw new Error(`Tab audio sharing needs desktop Chrome or Edge on a secure connection (HTTPS or localhost).`);
      }

      // Resume during the button gesture, before waiting for the sharing dialog.
      context = new AudioContext();
      pendingContextRef.current = context;
      // Handle rejection immediately while the user is choosing a tab, then
      // report it after capture resolves instead of claiming a silent connection.
      const resumed = context.resume().then(() => true, () => false);
      const options: CaptureOptions = {
        video: { displaySurface: `browser` },
        audio: { suppressLocalAudioPlayback: false } as MediaTrackConstraints,
        preferCurrentTab: true,
        selfBrowserSurface: `include`,
        systemAudio: `exclude`,
        monitorTypeSurfaces: `exclude`,
        surfaceSwitching: `exclude`,
        windowAudio: `exclude`,
      };
      const stream = await navigator.mediaDevices.getDisplayMedia(options);
      pendingStream = stream;
      if (generation !== generationRef.current) return;

      const videoTrack = stream.getVideoTracks()[0];
      const displaySurface = videoTrack?.getSettings().displaySurface;
      if (displaySurface && displaySurface !== `browser`) {
        throw new Error(`Choose the browser tab for this site instead of a window or screen, and enable Share tab audio.`);
      }
      if (!stream.getAudioTracks().some((track) => track.readyState === `live`)) {
        throw new Error(`No tab audio was shared. Try again, choose this tab, and enable Share tab audio in the browser dialog.`);
      }

      const didResume = await resumed;
      if (generation !== generationRef.current) return;
      if (!didResume || context.state === `closed` || (context.state !== `running` && !suspendedRef.current && !document.hidden)) {
        throw new Error(`Audio analysis could not start. Keep this tab open and press Sync site audio to reconnect.`);
      }
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = visualizerConfig.smoothing;
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      const frequencies = new Uint8Array(analyser.frequencyBinCount);
      const waveform = new Uint8Array(analyser.fftSize);
      const levelSamples = new Uint8Array(analyser.fftSize);
      let lastSoundAt = 0;
      const onEnded = () => {
        if (generation !== generationRef.current) return;
        stopSync();
      };
      for (const track of stream.getTracks()) track.addEventListener(`ended`, onEnded);
      const activeContext = context;
      const timer = setInterval(() => {
        if (generation !== generationRef.current) return;
        if (suspendedRef.current || document.hidden || activeContext.state !== `running`) {
          updatePlayback(false);
          return;
        }
        analyser.getByteTimeDomainData(levelSamples);
        let energy = 0;
        for (const sample of levelSamples) energy += ((sample - 128) / 128) ** 2;
        const now = performance.now();
        if (Math.sqrt(energy / levelSamples.length) > 0.004) lastSoundAt = now;
        updatePlayback(lastSoundAt > 0 && now - lastSoundAt < 700);
      }, 120);
      sessionRef.current = { stream, context, source, analyser, timer, onEnded };
      pendingStream = null;
      pendingContextRef.current = null;
      callbacksRef.current.onSignalChange({
        readWaveform: () => {
          analyser.getByteTimeDomainData(waveform);
          return waveform;
        },
        readFrequencies: () => {
          analyser.getByteFrequencyData(frequencies);
          return frequencies;
        },
      });
      setConnected(true);
      if (suspendedRef.current || document.hidden) void context.suspend().catch(() => undefined);
    } catch (cause) {
      if (generation !== generationRef.current) return;
      stopSync();
      setError(captureError(cause));
    } finally {
      // A dismissed or stale dialog must never leave a capture running.
      if (pendingStream) for (const track of pendingStream.getTracks()) track.stop();
      if (context && sessionRef.current?.context !== context) {
        if (pendingContextRef.current === context) pendingContextRef.current = null;
        void context.close().catch(() => undefined);
      }
      if (generation === generationRef.current) setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={connected ? `Stop site audio sync` : `Sync site audio`}
          disabled={loading}
          onPress={() => connected ? stopSync() : void startSync()}
          style={({ pressed }) => [styles.button, connected && styles.connectedButton, pressed && styles.pressed, loading && styles.disabled]}
        >
          <Text style={styles.buttonText}>{loading ? `Waiting for tab sharing…` : connected ? `Stop Sync` : `↗ Sync Site Audio`}</Text>
        </Pressable>
        {connected ? <Text accessibilityLiveRegion="polite" style={styles.status}>{playing ? `Reacting to this tab` : `Synced · waiting for music`}</Text> : null}
      </View>
      <Text style={styles.description}>
        {connected
          ? `Play music anywhere on this site, including Spotify. Stop Sync ends tab sharing.`
          : `Sync music from this site, including Spotify. In desktop Chrome or Edge, choose this tab and enable “Share tab audio” in the browser dialog.`}
      </Text>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 9, marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: `#2B3026` },
  row: { gap: 12, flexDirection: `row`, flexWrap: `wrap`, alignItems: `center` },
  button: { minHeight: 44, paddingVertical: 11, paddingHorizontal: 15, borderWidth: 1, borderColor: `#475A32`, borderRadius: 3 },
  connectedButton: { backgroundColor: `#202B17` },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  buttonText: { color: `#B1F750`, fontSize: 12, fontFamily: `SpaceGrotesk` },
  description: { color: `#858A80`, fontSize: 12, lineHeight: 19, fontFamily: `SpaceGrotesk` },
  status: { color: `#BBC5AF`, fontSize: 12, fontFamily: `SpaceGrotesk` },
  error: { color: `#FF938A`, fontSize: 12, lineHeight: 18, fontFamily: `SpaceGrotesk` },
});

export default SiteAudio;
