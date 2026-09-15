import type { LocalAudioProps } from './audio.types';
import { visualizerConfig } from '../../config/visualizer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type AudioSession = {
  url: string;
  audio: HTMLAudioElement;
  context: AudioContext;
  analyser: AnalyserNode;
  source: MediaElementAudioSourceNode;
};

const LocalAudio = ({ suspended, onSignalChange, onPlaybackChange }: LocalAudioProps) => {
  const [error, setError] = useState(``);
  const [fileName, setFileName] = useState(``);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const generationRef = useRef(0);
  const suspendedRef = useRef(suspended);
  const sessionRef = useRef<AudioSession | null>(null);
  const callbacksRef = useRef({ onSignalChange, onPlaybackChange });
  const isPlaybackSuspended = useCallback(() => suspendedRef.current || document.hidden, []);

  useEffect(() => {
    suspendedRef.current = suspended;
    callbacksRef.current = { onSignalChange, onPlaybackChange };
  }, [suspended, onSignalChange, onPlaybackChange]);

  const destroySession = useCallback(() => {
    const session = sessionRef.current;
    sessionRef.current = null;
    if (!session) return;
    session.audio.onplay = null;
    session.audio.onpause = null;
    session.audio.onended = null;
    session.audio.onerror = null;
    session.audio.pause();
    session.audio.removeAttribute(`src`);
    session.audio.load();
    session.source.disconnect();
    session.analyser.disconnect();
    URL.revokeObjectURL(session.url);
    void session.context.close().catch(() => undefined);
  }, []);

  useEffect(() => () => {
    generationRef.current += 1;
    destroySession();
  }, [destroySession]);

  useEffect(() => {
    const session = sessionRef.current;
    if (!suspended || !session) return;
    session.audio.pause();
    void session.context.suspend().catch(() => undefined);
  }, [suspended]);

  const loadFile = async (file?: File) => {
    if (!file) return;
    const generation = ++generationRef.current;
    destroySession();
    setError(``);
    setPlaying(false);
    setFileName(``);
    setLoading(true);
    callbacksRef.current.onSignalChange(null);
    callbacksRef.current.onPlaybackChange(false);
    let pendingContext: AudioContext | null = null;
    let pendingUrl: string | null = null;

    try {
      const AudioContextConstructor = window.AudioContext
        ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextConstructor) throw new Error(`Audio analysis is unavailable in this browser. Try a current Chrome, Firefox, or Safari browser.`);
      if (file.type && !file.type.startsWith(`audio/`) && file.type !== `video/mp4`) {
        throw new Error(`Choose an audio file, such as MP3, WAV, or M4A.`);
      }

      const context = new AudioContextConstructor();
      pendingContext = context;
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      pendingUrl = url;
      audio.preload = `metadata`;
      audio.src = url;
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = visualizerConfig.smoothing;
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      const frequencies = new Uint8Array(analyser.frequencyBinCount);
      const waveform = new Uint8Array(analyser.fftSize);
      sessionRef.current = { url, audio, source, context, analyser };
      pendingContext = null;
      pendingUrl = null;

      const updatePlayback = (value: boolean) => {
        if (generation !== generationRef.current) return;
        setPlaying(value);
        callbacksRef.current.onPlaybackChange(value);
      };
      audio.onplay = () => {
        if (isPlaybackSuspended()) {
          audio.pause();
          void context.suspend().catch(() => undefined);
          return;
        }
        updatePlayback(true);
      };
      audio.onpause = () => updatePlayback(false);
      audio.onended = () => updatePlayback(false);
      audio.onerror = () => {
        if (generation !== generationRef.current) return;
        generationRef.current += 1;
        destroySession();
        callbacksRef.current.onSignalChange(null);
        callbacksRef.current.onPlaybackChange(false);
        setFileName(``);
        setPlaying(false);
        setLoading(false);
        setError(`This audio format could not be played. Try an MP3 or WAV file.`);
      };

      setFileName(file.name);
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
      await context.resume();
      if (generation !== generationRef.current) return;
      if (isPlaybackSuspended()) {
        void context.suspend().catch(() => undefined);
        return;
      }
      await audio.play();
      if (isPlaybackSuspended()) {
        audio.pause();
        void context.suspend().catch(() => undefined);
      }
    } catch (cause) {
      if (pendingUrl) URL.revokeObjectURL(pendingUrl);
      if (pendingContext) void pendingContext.close().catch(() => undefined);
      if (generation !== generationRef.current) return;
      if (isPlaybackSuspended() && cause instanceof DOMException && cause.name === `AbortError`) return;
      setError(cause instanceof Error ? cause.message : `Audio could not start. Try another file.`);
      setPlaying(false);
      callbacksRef.current.onPlaybackChange(false);
    } finally {
      if (generation === generationRef.current) setLoading(false);
    }
  };

  const togglePlayback = async () => {
    const session = sessionRef.current;
    const generation = generationRef.current;
    if (!session || isPlaybackSuspended()) return;
    setError(``);
    if (!session.audio.paused) {
      session.audio.pause();
      return;
    }
    try {
      await session.context.resume();
      if (generation !== generationRef.current || session !== sessionRef.current) return;
      if (isPlaybackSuspended()) {
        void session.context.suspend().catch(() => undefined);
        return;
      }
      await session.audio.play();
      if (isPlaybackSuspended()) {
        session.audio.pause();
        void session.context.suspend().catch(() => undefined);
      }
    } catch (cause) {
      if (generation !== generationRef.current || session !== sessionRef.current) return;
      if (isPlaybackSuspended() && cause instanceof DOMException && cause.name === `AbortError`) return;
      setError(`Playback could not start. Choose another audio file and try again.`);
    }
  };

  const clearFile = () => {
    generationRef.current += 1;
    destroySession();
    setError(``);
    setFileName(``);
    setPlaying(false);
    setLoading(false);
    callbacksRef.current.onSignalChange(null);
    callbacksRef.current.onPlaybackChange(false);
  };

  return (
    <View style={styles.container}>
      <input
        type="file"
        ref={inputRef}
        aria-label="Choose A Local Audio File"
        accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac"
        style={{ display: `none` }}
        onChange={(event) => {
          void loadFile(event.target.files?.[0]);
          event.target.value = ``;
        }}
      />
      <View style={styles.row}>
        <Pressable
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={fileName ? `Choose Another Audio File` : `Choose A Local Audio File`}
          onPress={() => inputRef.current?.click()}
          style={({ pressed }) => [styles.button, pressed && styles.buttonActive, loading && styles.disabled]}
        >
          <Text style={styles.buttonText}>{loading ? `Loading…` : fileName ? `↗ Change Track` : `↗ Load Your Own Track`}</Text>
        </Pressable>
        {fileName ? (
          <>
            <Pressable
              disabled={loading}
              accessibilityRole="button"
              onPress={() => void togglePlayback()}
              accessibilityLabel={playing ? `Pause Local Audio` : `Play Local Audio`}
              style={({ pressed }) => [styles.button, pressed && styles.buttonActive]}
            >
              <Text style={styles.buttonText}>{playing ? `Ⅱ Pause Track` : `▷ Play Track`}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Remove Local Track" onPress={clearFile} style={styles.clearButton}>
              <Text style={styles.clearText}>Remove</Text>
            </Pressable>
          </>
        ) : null}
      </View>
      {fileName ? <Text numberOfLines={1} style={styles.fileName}>{fileName}</Text> : null}
      <Text style={styles.description}>Audio-reactive mode uses a file on your device. Your audio stays here; nothing is uploaded.</Text>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 9 },
  disabled: { opacity: 0.5 },
  row: { gap: 8, flexDirection: `row`, flexWrap: `wrap` },
  buttonActive: { borderColor: `#A4DF5C`, backgroundColor: `#252E1C` },
  fileName: { color: `#BBC5AF`, fontSize: 12, maxWidth: 440, fontFamily: `SpaceGrotesk` },
  error: { color: `#FF938A`, fontSize: 12, lineHeight: 18, fontFamily: `SpaceGrotesk` },
  buttonText: { color: `#D5E3C2`, fontSize: 12, fontFamily: `SpaceGrotesk` },
  description: { color: `#858A80`, fontSize: 12, lineHeight: 19, fontFamily: `SpaceGrotesk` },
  clearText: { color: `#A5AB9E`, fontSize: 12, textDecorationLine: `underline`, fontFamily: `SpaceGrotesk` },
  clearButton: { minHeight: 44, paddingHorizontal: 10, justifyContent: `center` },
  button: { minHeight: 44, paddingVertical: 11, paddingHorizontal: 15, borderWidth: 1, borderColor: `#384030`, borderRadius: 3 },
});

export default LocalAudio;
