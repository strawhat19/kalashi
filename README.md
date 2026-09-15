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
- On web, **Load Your Own Track** reads a local MP3/WAV/M4A or other browser-supported file through the Web Audio API. The waveform and orbit then respond to the actual audio. Files stay on the device and are never uploaded.
- Local audio playback and visual animation have separate pause controls. Spotify audio is independent: its iframe does not expose samples to the visualizer. There is no simulated claim of a live Spotify spectrum.
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

## Landing motion

The web landing uses normal document scrolling. `src/components/motion/AppFrame.css` overrides Expo's native-style document sizing, and the loader never captures pointer input or locks scrolling.

`AppFrame.web.tsx` contains the loader timing: a 220 ms minimum, 320 ms exit, and a 1200 ms maximum wait for fonts. `SplitText.web.tsx` and `SplitText.css` provide one-time character/word reveals as headings enter the viewport. Reduced motion skips both effects; static content remains readable without JavaScript.

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
