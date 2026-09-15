# Kalashi Music

An Expo React Native app for Kalashi, a Bangladesh-born, Atlanta-based rapper. The first release focuses on the artist landing page: expressive typography, official release artwork, Spotify listening, and a configurable Sound Lab.

## Run

Use Node **22.13+** or **24.3+** (Node 22.9 is too old for Expo SDK 57).

```sh
npm install
npm run web       # Browser landing
npm start         # Expo dev server / QR code
npm run android   # Connected Android device or emulator
npm run ios       # iOS simulator, macOS required
```

This computer also has a compatible Node 24 runtime at `C:/Users/massa/AppData/Local/OpenAI/Codex/runtimes/cua_node/e7fe122ad3cbcd58/bin`. You can prepend it to your PowerShell PATH for the current terminal before running npm:

```powershell
$env:Path = 'C:/Users/massa/AppData/Local/OpenAI/Codex/runtimes/cua_node/e7fe122ad3cbcd58/bin;' + $env:Path
npm run web
```

No environment variables, Spotify API key, Firebase project, or paid playback SDK are needed for this landing.

## Structure

The structure follows the neighboring MatchXD Expo Router project, with a shared content layer and intentional platform-specific screens.

```text
assets/                         Bundled native fonts and official artwork
public/                         Web artwork, fonts, favicon and SW retirement
src/
  app/                          Thin Expo Router routes and root layout
  components/visualizer/         Universal signal renderer and local audio input
  config/artist.ts               Artist details, releases and Spotify links
  config/visualizer.ts           Visual defaults, colors and adjustment limits
  features/landing/
    LandingScreen.tsx           Native React Native landing
    LandingScreen.web.tsx       Semantic web landing
    LandingScreen.css          Responsive web art direction
  theme/tokens.ts                Shared brand colors and typography
```

## Music and Sound Lab

- The official Spotify artist and album embeds play music on web. Playback availability, previews and sign-in behavior are controlled by Spotify. External Spotify links remain available if the embed is blocked.
- Native buttons open the artist or release in Spotify/the browser.
- Sound Lab starts with clearly labeled **Ambient Motion**. Select **Waveform** or **Orbit**, then **Tune Visuals** to adjust intensity, speed and density. Pause stops the visual animation; Reset restores the defaults.
- The header’s enlarged orbit surrounds a smaller K brand mark without changing the header height. Its radial pulses and traveling red accent stay visibly animated without music. The hero waveform is integrated into the featured-release play card at the bottom right; the whole card opens that release in the embedded Spotify player. Both previews share the main visualizer’s audio source, Pause, and reduced-motion behavior.
- On web, **Load Your Own Track** reads a local MP3/WAV/M4A or other browser-supported file through the Web Audio API. The waveform and orbit then respond to the actual audio. Files stay on the device and are never uploaded.
- **Sync Site Audio** in Sound Lab analyzes real audio from the current browser tab, including embedded players such as Spotify, when the browser supports tab-audio capture. In desktop Chrome/Edge, select this tab and enable **Share tab audio**. This requires HTTPS or localhost and a fresh browser permission prompt per session. Unsupported browsers can still use local tracks and ambient motion. [Browser capture requirements](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia).
- Spotify’s iframe does not expose audio samples directly. Tab audio is analyzed locally through Web Audio, never recorded or uploaded, and never routed back to speakers. **Stop Sync** stops all capture tracks and restores the local-track source. Silence returns the visuals to gentle ambient motion. Local audio playback and visual animation retain separate pause controls.
- Native currently supports the ambient visualizer and tuning. Local-file audio analysis is a web feature.
- Browser preferences are saved locally; native preferences last for the session. The visualizer respects reduced motion and pauses animation when the app is backgrounded.

### Change the visualizer

Edit `src/config/visualizer.ts`:

| Variable | Purpose |
| --- | --- |
| `defaults.mode` | `waveform` or `orbit` |
| `defaults.intensity` | Wave/spectrum amplitude |
| `defaults.speed` | Ambient motion and orbit rotation speed; does not alter music tempo |
| `defaults.density` | Number of sampled visual points |
| `limits` | Minimum, maximum and step for each control |
| `fps` | Animation frame budget |
| `smoothing` | Audio analyser smoothing |
| `accent`, `alert` | Signal colors |
| `storageKey` | Versioned browser preference key |

After changing defaults, press Reset in the app or change `storageKey` to discard previously saved browser preferences.

### Reuse the animated audio border

`AudioBorder.web.tsx` wraps a button, link, or other element with individual spectrum bars radiating outward like the orbit visualizer. A traveling swell keeps the bars gently moving without audio. The decorative border sits behind the child, does not intercept clicks, and does not add layout space. The header Spotify button and each hero Listen on Spotify button use this component; the hero buttons retain their lime fill and dark text.

```tsx
import AudioBorder from './src/components/visualizer/AudioBorder.web';

<AudioBorder state={visualizerState} ready={introReady} radius={999} amplitude={5} gap={1}>
  <button onClick={play}>Play music</button>
</AudioBorder>

// Match a card's rounded corners and let the wrapper fill its container.
<AudioBorder state={visualizerState} radius={16} amplitude={8} style={{ width: '100%' }}>
  <YourCard />
</AudioBorder>
```

Pass the shared `AudioVisualizerState` for live audio and Sound Lab pause controls, or omit `state` for ambient motion. `radius`, `amplitude`, and `gap` use pixels; `speed` defaults to `1`, `color` defaults to the brand lime, and `accentColor` defaults to the orbit's red for two accent bars. The red accents travel around the perimeter half a lap apart, completing a lap in about 17 seconds at the default speed. The wrapper measures itself as content resizes. Leave room outside the element for the pulses and avoid clipping it with an ancestor's `overflow: hidden`. Animation pauses offscreen, in background tabs, and for reduced motion.

## Landing motion

`SiteHeader.web.tsx` defaults to `sticky: true` through `src/config/header.ts`, keeping the header visible while scrolling. Set the config to `false`, or pass `sticky={false}` on an instance. Its measured height updates the page’s anchor offset so section headings stay below the sticky header.

`AudioMarquee.web.tsx` sends bright bars downward from the header's bottom edge without adding header height. Compact responsive heights fit within the whitespace above the Anton wordmark. Square-ended bars use the logo orbit's 64-band signal, distributed across the row without repeated ramps. Green and two red accents match the orbit and button bars. It shares the Sound Lab audio source and Pause control, with the same irregular ambient motion, timing, and audio smoothing as the logo orbit. Both share `ambientSignal.ts` and `miniVisualizerSettings`. Its horizontal drift defaults to `speed={24}` pixels per second, slower than the hero's 72px/s. The strip moves right while the hero wordmark moves left, and both reverse when scrolling upward. Both components subscribe to `scrollDirection.web.ts` so their directions stay coordinated. `reverse={true}` is the default; animation pauses offscreen, in background tabs, and for reduced motion.

`HeroSlider.web.tsx` keeps the original artist scene as slide 1 and adds three release-artwork slides. Grab/drag, swipe, arrow buttons, dots, and keyboard arrows change slides. The original scene determines the slider’s height, so other slides do not move surrounding content. Controls overlay the existing scene.

`src/config/heroSlider.ts` defaults to `autoplay: true` with `intervalMs: 6500`. Set `autoplay` to `false` there for the global default, or override each component:

```tsx
<HeroSlider ready={introReady} onListen={listen} visualizerState={visualizerState} autoplay={false} />
```

Automatic rotation pauses on hover, keyboard focus, dragging, background tabs, offscreen content, and reduced motion. Visitors can also use the slider’s pause button.

The web landing uses normal document scrolling. `src/components/motion/AppFrame.css` overrides Expo's native-style document sizing, and the loader never captures pointer input or locks scrolling.

Landing section links use `scrollToAnchor.web.ts` to scroll and update the URL hash with `history.replaceState`, preserving Expo's history state. They do not create route-history entries or remount the player and landing content. Modified clicks and external links retain normal browser behavior. `AppFrame.web.tsx` keys the loader to `usePathname()` and remembers the current page for this document, so same-path/hash remounts do not replay it. A new pathname or full document load can show the loader.

`PageLoader.web.tsx` runs one continuous intro: a percentage counter with velocity-based vertical blur, a filling progress line, 48 animated spectrum bars, and 12 staggered equalizer shutters. The percentage represents the intro's progress, not network download bytes. It advances to 90%, waits for web fonts (bounded by a 1600 ms timeout), reaches 100%, and reveals the page. The spectrum is a silent ambient animation, independent of Spotify or the Sound Lab's local audio.

Tune `src/config/loader.ts` to change the loading/exit timing, shutter count, skew, stagger, maximum blur, spectrum density, speed, gain, and colors. The defaults finish in about 1.8 seconds after the client starts when fonts are ready. `AppFrame.web.tsx` coordinates the loader exit with the hero text; progress updates stay inside the loader without rerendering the landing page. The overlay stays visible through hydration and exits once, with no independent CSS dismissal timer.

Web fonts are preloaded from `/media/fonts` and checked with the browser Font Loading API. `SplitText.web.tsx` and `SplitText.css` prepare text before paint and provide one-time character/word reveals as headings enter the viewport. Reduced motion skips the intro; a `noscript` fallback keeps static content readable without JavaScript.

`ScrollMarquee.web.tsx` powers the repeating **KALASHI MUSIC** heading and lime frequency strip. The hero opts into `reveal`, a one-time staggered character reveal after the intro, before the marquee starts moving. The rows always travel in opposite directions: scrolling down moves the heading left and the lime strip right; scrolling up reverses both without restarting their position. The ✳ separators rotate with each row's direction. The lime row uses the `reverse` prop. Adjust each row's `speed` prop in `LandingScreen.web.tsx` (pixels per second), plus `--marquee-gap` and `--marquee-symbol-size` in the landing stylesheet. Animation pauses offscreen, in background tabs, and for reduced motion; static text remains readable without JavaScript.

## Checks and web export

```sh
npm run typecheck
npm run lint
npm run build
```

`npm run build` exports the static web app to `dist/`. Serve that directory from the root of a website. A subpath deployment needs an Expo Router base URL configuration and matching asset paths. `npx expo export --platform all` also validates the native JavaScript bundles; it does not build or test signed device binaries.

`eas.json` supplies preview/production build profiles. Set up your own Expo/EAS project and signing credentials before native distribution. No project was published or submitted by this migration.

## Content and migration

The verified initial release selection is **Come Thru**, **MiSSery**, and **Passenger Princess**. Update titles, URLs and images in `src/config/artist.ts` as new music arrives. See `assets/README.md` for source URLs and font licenses.

The copied Next.js/MUI/Smart Garden/QuizList scaffold has been removed from the active app and dependency graph. On this machine the original source and generated dependencies were preserved in the ignored `.legacy-template/` folder; Git history also retains the old tracked source. `public/sw.js` retires the old Next PWA service worker for returning visitors. The old local `.env` is ignored and unused.

## License

Project source retains the repository's [MIT license](LICENSE). Artist imagery and music retain their respective rights; font licenses are included with the fonts.
