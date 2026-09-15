import LocalAudio from './LocalAudio';
import SiteAudio from './SiteAudio';
import SignalCanvas from './SignalCanvas';
import type { AudioSignal, AudioVisualizerState } from './audio.types';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { normalizeVisualizerSettings, visualizerConfig } from '../../config/visualizer';
import { AccessibilityInfo, AppState, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { getServerVisualizerPreferences, readVisualizerPreferences, saveVisualizerPreferences, subscribeVisualizerPreferences } from './preferences';

type AdjustmentKey = `speed` | `density` | `intensity`;
type AudioVisualizerProps = {
  compact?: boolean;
  onStateChange?: (state: AudioVisualizerState) => void;
};

const AudioVisualizer = ({ compact = false, onStateChange }: AudioVisualizerProps) => {
  const { width } = useWindowDimensions();
  const [paused, setPaused] = useState(false);
  const [tuning, setTuning] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const [localAudioPlaying, setLocalAudioPlaying] = useState(false);
  const [localSignal, setLocalSignal] = useState<AudioSignal | null>(null);
  const [siteAudioPlaying, setSiteAudioPlaying] = useState(false);
  const [siteSignal, setSiteSignal] = useState<AudioSignal | null>(null);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [appActive, setAppActive] = useState(AppState.currentState !== `background`);
  const settings = useSyncExternalStore(subscribeVisualizerPreferences, readVisualizerPreferences, getServerVisualizerPreferences);

  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReducedMotion(enabled);
    }).catch(() => {
      if (mounted) setReducedMotion(false);
    });
    const motionListener = AccessibilityInfo.addEventListener(`reduceMotionChanged`, setReducedMotion);
    const appListener = AppState.addEventListener(`change`, (state) => setAppActive(state === `active`));
    return () => {
      mounted = false;
      motionListener.remove();
      appListener.remove();
    };
  }, []);

  const adjustSetting = (key: AdjustmentKey, direction: -1 | 1) => {
    const current = readVisualizerPreferences();
    saveVisualizerPreferences(normalizeVisualizerSettings({
      ...current,
      [key]: current[key] + visualizerConfig.limits[key].step * direction,
    }));
  };

  const reset = () => {
    setPaused(false);
    saveVisualizerPreferences({ ...visualizerConfig.defaults });
    setResetVersion((current) => current + 1);
  };

  const signal = siteSignal ?? localSignal;
  const audioPlaying = siteSignal ? siteAudioPlaying : localAudioPlaying;
  const status = reducedMotion ? `Reduced Motion` : paused ? `Visuals Paused` : audioPlaying ? `Audio Reactive` : `Ambient Motion`;
  const active = appActive && !paused && !reducedMotion;

  useEffect(() => {
    onStateChange?.({ signal, audioPlaying, active });
  }, [signal, audioPlaying, active, onStateChange]);

  return (
    <View style={[styles.panel, width < 600 && styles.panelSmall]}>
      <View style={styles.header}>
        <View style={styles.headingRow}>
          <View style={styles.signalIcon}>
            {[6, 14, 22, 12, 5].map((height, index) => <View key={index} style={[styles.signalBar, { height }]} />)}
          </View>
          <View style={styles.headingCopy}>
            <Text style={styles.title}>SOUND LAB</Text>
            <Text style={styles.eyebrow}>BUILT TO BE FELT.</Text>
          </View>
        </View>
        <View style={styles.status}>
          <View style={[styles.statusDot, !active && styles.statusDotPaused, audioPlaying && active && styles.statusDotAudio]} />
          <Text style={styles.statusText}>{status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.monitor}>
        <View style={styles.monitorTop}>
          <Text style={styles.monitorLabel}>KALASHI — SIGNAL {settings.mode === `orbit` ? `02` : `01`}</Text>
          <Text style={styles.monitorLabel}>{siteSignal ? `INPUT: SITE AUDIO` : audioPlaying ? `INPUT: LOCAL AUDIO` : `INPUT: GENERATIVE`}</Text>
        </View>
        <SignalCanvas
          key={`${resetVersion}:${settings.density}`}
          active={active}
          signal={signal}
          compact={compact || width < 600}
          settings={settings}
          audioPlaying={audioPlaying}
        />
        <View style={styles.monitorBottom}>
          <Text style={styles.monitorMeta}>[ {settings.mode.toUpperCase()} ]</Text>
          <Text style={styles.monitorMeta}>{settings.density} POINTS / {settings.intensity.toFixed(2)} GAIN</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <View accessibilityRole="tablist" style={styles.modeGroup}>
          {([`waveform`, `orbit`] as const).map((mode) => (
            <Pressable
              key={mode}
              accessibilityRole="tab"
              accessibilityState={{ selected: settings.mode === mode }}
              onPress={() => saveVisualizerPreferences({ ...readVisualizerPreferences(), mode })}
              style={({ pressed }) => [styles.modeButton, settings.mode === mode && styles.modeButtonActive, pressed && styles.pressed]}
            >
              <Text style={[styles.modeText, settings.mode === mode && styles.modeTextActive]}>{mode === `waveform` ? `∿ Waveform` : `◎ Orbit`}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.actionGroup}>
          <Pressable
            disabled={reducedMotion}
            accessibilityRole="button"
            onPress={() => setPaused((current) => !current)}
            accessibilityState={{ disabled: reducedMotion }}
            accessibilityLabel={paused ? `Resume Visual Animation` : `Pause Visual Animation`}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed, reducedMotion && styles.disabled]}
          >
            <Text style={styles.actionText}>{paused ? `▷ Resume` : `Ⅱ Pause`}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tune Visuals"
            accessibilityState={{ expanded: tuning }}
            onPress={() => setTuning((current) => !current)}
            style={({ pressed }) => [styles.tuneButton, tuning && styles.tuneButtonActive, pressed && styles.pressed]}
          >
            <Text style={styles.tuneText}>{tuning ? `−` : `+`} Tune Visuals</Text>
          </Pressable>
        </View>
      </View>

        <View style={[styles.controls, !tuning && styles.hidden]}>
          <View style={styles.controlsHeader}>
            <Text style={styles.controlEyebrow}>DIAL IN YOUR FREQUENCY</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Reset Visualizer Settings" onPress={reset} style={styles.resetButton}>
              <Text style={styles.resetText}>Reset ↺</Text>
            </Pressable>
          </View>
          <View style={styles.adjustmentRow}>
            {([`intensity`, `speed`, `density`] as const).map((key) => (
              <View key={key} style={styles.adjustment}>
                <View style={styles.adjustmentHeader}>
                  <Text style={styles.adjustmentLabel}>{key.toUpperCase()}</Text>
                  <Text style={styles.adjustmentValue}>{key === `density` ? settings[key] : `${settings[key].toFixed(2)}×`}</Text>
                </View>
                <View style={styles.stepper}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => adjustSetting(key, -1)}
                    accessibilityLabel={`Decrease ${key}`}
                    disabled={settings[key] <= visualizerConfig.limits[key].min}
                    style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}
                    accessibilityState={{ disabled: settings[key] <= visualizerConfig.limits[key].min }}
                  >
                    <Text style={[styles.stepText, settings[key] <= visualizerConfig.limits[key].min && styles.disabled]}>−</Text>
                  </Pressable>
                  <View style={styles.meterTrack}>
                    <View style={[styles.meterFill, { width: `${(settings[key] - visualizerConfig.limits[key].min) / (visualizerConfig.limits[key].max - visualizerConfig.limits[key].min) * 100}%` }]} />
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => adjustSetting(key, 1)}
                    accessibilityLabel={`Increase ${key}`}
                    disabled={settings[key] >= visualizerConfig.limits[key].max}
                    style={({ pressed }) => [styles.stepButton, pressed && styles.pressed]}
                    accessibilityState={{ disabled: settings[key] >= visualizerConfig.limits[key].max }}
                  >
                    <Text style={[styles.stepText, settings[key] >= visualizerConfig.limits[key].max && styles.disabled]}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.helper}>{Platform.OS === `web` ? `Your settings are saved in this browser. ` : ``}Speed changes ambient motion and orbit rotation; your audio keeps its original tempo.</Text>
          <View style={styles.audioDivider} />
          <LocalAudio suspended={!appActive} onSignalChange={setLocalSignal} onPlaybackChange={setLocalAudioPlaying} />
        </View>

      <SiteAudio suspended={!appActive} onSignalChange={setSiteSignal} onPlaybackChange={setSiteAudioPlaying} />

      <View style={styles.captionRow}>
        <Text style={styles.caption}>{reducedMotion ? `Animation is off to respect your device’s reduced-motion setting.` : paused ? `Visuals are paused. Press Resume to see the audio move again.` : siteSignal ? audioPlaying ? `All visualizers are reacting to this tab’s audio.` : `Site audio is connected. Play a track in this tab to bring it to life.` : audioPlaying ? `Reacting to your local audio. Change the signal in Tune Visuals.` : Platform.OS === `web` ? `An ambient signal, made to move. Sync site audio or load your own track in Tune Visuals.` : `An ambient signal, made to move. Tune its shape, speed, and energy.`}</Text>
        <Text style={styles.captionFootnote}>{Platform.OS === `web` ? `Use Sync site audio to include Spotify and other players in this tab.` : `Spotify playback is independent.`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: { display: `none` },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.35 },
  panelSmall: { padding: 16 },
  headingCopy: { gap: 5 },
  controls: { gap: 15, paddingTop: 18 },
  tuneButtonActive: { backgroundColor: `#202B17` },
  captionRow: { gap: 4, marginTop: 17 },
  statusDotPaused: { backgroundColor: `#7C8374` },
  statusDotAudio: { backgroundColor: `#F05951` },
  modeButtonActive: { backgroundColor: `#B1F750` },
  modeTextActive: { color: `#11160A` },
  modeGroup: { gap: 3, flexDirection: `row` },
  actionGroup: { gap: 6, flexDirection: `row` },
  adjustmentRow: { gap: 18, flexDirection: `row`, flexWrap: `wrap` },
  signalIcon: { height: 28, gap: 3, alignItems: `center`, flexDirection: `row` },
  signalBar: { width: 3, borderRadius: 1, backgroundColor: `#B1F750` },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: `#B1F750` },
  audioDivider: { height: 1, marginVertical: 3, backgroundColor: `#2B3026` },
  monitor: { marginTop: 25, overflow: `hidden`, backgroundColor: `#0C0E0B` },
  stepper: { height: 44, gap: 9, flexDirection: `row`, alignItems: `center` },
  headingRow: { gap: 13, flexDirection: `row`, alignItems: `center` },
  status: { gap: 7, alignItems: `center`, flexDirection: `row` },
  adjustment: { gap: 7, flex: 1, minWidth: 150, flexBasis: 150 },
  meterTrack: { flex: 1, height: 3, overflow: `hidden`, backgroundColor: `#343C2C` },
  meterFill: { height: `100%`, backgroundColor: `#B1F750` },
  title: { color: `#F0F1E9`, fontSize: 23, letterSpacing: 1, fontFamily: `Anton` },
  stepText: { color: `#DDE5D2`, fontSize: 21, lineHeight: 25, fontFamily: `SpaceGrotesk` },
  tuneText: { color: `#B1F750`, fontSize: 12, fontFamily: `SpaceGrotesk` },
  actionText: { color: `#A8AF9D`, fontSize: 12, fontFamily: `SpaceGrotesk` },
  modeText: { color: `#919A85`, fontSize: 12, fontFamily: `SpaceGrotesk` },
  resetText: { color: `#C6CFBB`, fontSize: 12, fontFamily: `SpaceGrotesk` },
  resetButton: { minHeight: 44, justifyContent: `center`, paddingHorizontal: 8 },
  actionButton: { minHeight: 44, paddingHorizontal: 11, justifyContent: `center` },
  modeButton: { minHeight: 44, paddingHorizontal: 15, borderRadius: 3, justifyContent: `center` },
  stepButton: { width: 44, height: 44, borderWidth: 1, borderColor: `#343C2C`, borderRadius: 3, alignItems: `center`, justifyContent: `center` },
  panel: { width: `100%`, padding: 28, borderWidth: 1, borderColor: `#333A2B`, borderRadius: 6, backgroundColor: `#141713` },
  toolbar: { marginTop: 16, gap: 10, flexWrap: `wrap`, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  header: { gap: 16, flexWrap: `wrap`, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  controlsHeader: { gap: 12, flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  adjustmentHeader: { flexDirection: `row`, alignItems: `center`, justifyContent: `space-between` },
  monitorBottom: { gap: 12, padding: 12, flexDirection: `row`, justifyContent: `space-between` },
  monitorTop: { gap: 8, padding: 12, flexWrap: `wrap`, flexDirection: `row`, justifyContent: `space-between` },
  eyebrow: { color: `#89937D`, fontSize: 10, letterSpacing: 2, fontFamily: `SpaceGrotesk` },
  statusText: { color: `#ACB99C`, fontSize: 10, letterSpacing: 1, fontFamily: `SpaceGrotesk` },
  monitorLabel: { color: `#89937D`, fontSize: 10, letterSpacing: 0.8, fontFamily: `SpaceGrotesk` },
  monitorMeta: { color: `#899B77`, fontSize: 10, letterSpacing: 1, fontFamily: `SpaceGrotesk` },
  controlEyebrow: { color: `#8F9B82`, fontSize: 10, letterSpacing: 1.2, fontFamily: `SpaceGrotesk` },
  adjustmentLabel: { color: `#A9B59B`, fontSize: 10, letterSpacing: 1, fontFamily: `SpaceGrotesk` },
  adjustmentValue: { color: `#CFDBC0`, fontSize: 12, fontFamily: `SpaceGrotesk` },
  helper: { color: `#929B86`, fontSize: 12, lineHeight: 19, fontFamily: `SpaceGrotesk` },
  caption: { color: `#95A087`, fontSize: 12, lineHeight: 19, fontFamily: `SpaceGrotesk` },
  captionFootnote: { color: `#89937D`, fontSize: 12, lineHeight: 19, fontFamily: `SpaceGrotesk` },
  tuneButton: { minHeight: 44, paddingHorizontal: 15, borderWidth: 1, borderColor: `#475A32`, borderRadius: 3, justifyContent: `center` },
});

export default AudioVisualizer;
