import './styles.css';
import Head from 'expo-router/head';
import { Link } from 'expo-router';
import { artist } from '../../../config/artist';
import { useContext, useEffect } from 'react';
import SplitText from '../../../components/motion/SplitText.web';
import AudioVisualizer from '../../../components/visualizer/AudioVisualizer';
import { PageIntroContext } from '../../../components/motion/PageIntroContext';
import { ArrowIcon } from '../../../components/Icons.web';
import { scrollToAnchor } from '../../../components/motion/scrollToAnchor.web';
import { ambientSiteAudio, useSiteAudio } from '../../../shared/site/SiteAudioContext';

const SoundLab = () => {
  const ready = useContext(PageIntroContext);
  const { visualizerState, setVisualizerState } = useSiteAudio();
  useEffect(() => () => setVisualizerState(ambientSiteAudio), [setVisualizerState]);

  return <div id={`sound-lab-page`} className={`sound-lab-page`} onClick={scrollToAnchor}>
    <Head><title>{`Sound Lab | Kalashi Music`}</title><meta name={`description`} content={`Shape your frequency in Kalashi’s interactive Sound Lab. Explore visual modes, tune the movement, or visualize your own local audio.`} /></Head>
    <header id={`sound-lab-page-hero`} className={`sound-lab-hero`} data-page-hero>
      <div id={`sound-lab-hero-copy`} className={`sound-lab-hero__copy`}>
        <p id={`sound-lab-page-eyebrow`} className={`sound-lab-eyebrow`}>{`KALASHI EXPERIMENTAL / INSTRUMENT 02`}</p>
        <h1 id={`sound-lab-page-title`}><SplitText ready={ready} text={`SOUND IS`} /><span><SplitText ready={ready} text={`A MATERIAL.`} delay={100} /></span></h1>
        <p id={`sound-lab-intro`} className={`sound-lab-description`}>{`Give it a shape. Change the pressure. Somewhere between a listening room and a little controlled chaos.`}</p>
        <div id={`sound-lab-hero-links`} className={`sound-lab-hero__links`}><a id={`sound-lab-enter-console`} className={`sound-lab-button`} href={`#sound-lab-controls`}>{`Enter the console`}<ArrowIcon size={18} /></a><a id={`sound-lab-open-guide`} href={`#sound-lab-guide`}>{`First time here?`}<span>{`↘`}</span></a></div>
      </div>
      <div id={`sound-lab-instrument`} className={`lab-instrument`}>
        <div className={`lab-instrument__caption`}><span>{`SIGNAL ROUTING`}</span><span>{`K—02`}</span></div>
        <svg id={`sound-lab-routing-diagram`} className={`lab-instrument__diagram`} viewBox={`0 0 500 400`} fill={`none`} aria-hidden={`true`}>
          <defs><pattern id={`lab-routing-grid`} width={25} height={25} patternUnits={`userSpaceOnUse`}><path d={`M25 0H0V25`} stroke={`#b1f75012`} strokeWidth={1} /></pattern></defs>
          <rect width={500} height={400} fill={`url(#lab-routing-grid)`} />
          <circle cx={250} cy={200} r={145} stroke={`#68785a`} strokeWidth={.6} /><circle cx={250} cy={200} r={110} stroke={`#b1f750`} strokeWidth={1} /><circle cx={250} cy={200} r={68} stroke={`#b1f75033`} strokeDasharray={`3 7`} />
          <path d={`M0 300H90C130 300 130 200 180 200H320C370 200 370 95 410 95H500`} stroke={`#b1f750`} strokeWidth={1.5} /><path d={`M0 95H75C140 95 135 260 200 260H300C365 260 360 330 430 330H500`} stroke={`#e84939`} strokeWidth={1.2} />
          <path d={`M250 20V90M250 310V380M70 200H140M360 200H430`} stroke={`#b1f75044`} /><circle cx={250} cy={200} r={8} fill={`#b1f750`} /><circle cx={180} cy={200} r={4} fill={`#090a09`} stroke={`#b1f750`} /><circle cx={300} cy={260} r={4} fill={`#e84939`} />
          <g fill={`#a6b397`} fontFamily={`monospace`} fontSize={8} letterSpacing={1.5}><text x={30} y={83}>{`INPUT / 01`}</text><text x={390} y={80}>{`OUTPUT / ∞`}</text><text x={215} y={366}>{`NO FIXED FORM`}</text></g>
        </svg>
        <div id={`sound-lab-instrument-state`} className={`lab-instrument__state`} role={`status`}><span className={`lab-instrument__light${visualizerState.active ? ` is-active` : ``}`} /><span>{visualizerState.audioPlaying ? `AUDIO REACTIVE` : visualizerState.active ? `AMBIENT SIGNAL` : `VISUALS AT REST`}</span><span>{`YOUR SOUND / YOUR SIGNAL`}</span></div>
      </div>
    </header>
    <div id={`sound-lab-session-strip`} className={`lab-session-strip`}><span><i />{`DESIGNED FOR EXPLORING`}</span><span>{`01 SOURCE → 02 SHAPE → 03 FEEL`}</span><span>{`NO RIGHT WAY TO PLAY`}</span></div>
    <section id={`sound-lab-controls`} aria-label={`Interactive audio visualizer`} className={`sound-lab-workspace`}>
      <div id={`sound-lab-console-heading`} className={`lab-console-heading`}><div><p className={`sound-lab-eyebrow`}>{`THE WORKBENCH`}</p><h2>{`MAKE A LITTLE NOISE.`}</h2></div><span>{`EXPERIMENT / REPEAT`}</span></div>
      <div id={`sound-lab-console-case`} className={`lab-console-case`}>{[0, 1, 2, 3].map(index => <span key={index} id={`sound-lab-case-screw-${index}`} className={`lab-console-case__screw lab-console-case__screw--${index}`} aria-hidden={`true`} />)}<AudioVisualizer onStateChange={setVisualizerState} /></div>
      <div className={`lab-console-footer`}><span>{`YOUR FILES STAY ON YOUR DEVICE`}</span><span>{`PAUSE. RESET. START AGAIN.`}</span></div>
    </section>
    <div id={`sound-lab-lower-deck`} className={`sound-lab-lower-deck`}>
    <section id={`sound-lab-player`} className={`sound-lab-player`} aria-labelledby={`sound-lab-player-title`}>
      <div className={`sound-lab-deck-heading`}><span>{`INPUT A / SPOTIFY`}</span><h2 id={`sound-lab-player-title`}>{`ADD THE SOUND.`}</h2></div>
      <iframe id={`sound-lab-spotify-player`} src={artist.spotifyEmbed} title={`Kalashi on Spotify — Sound Lab player`} width={`100%`} height={352} loading={`lazy`} allow={`autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture`} />
      <p id={`sound-lab-player-note`}>{`Start playback here, then use Sync Site Audio above and share this tab with audio when your browser supports it. Spotify controls playback and availability. You can also visualize a local audio file without tab sharing.`}</p>
    </section>
    <section id={`sound-lab-guide`} className={`sound-lab-guide`} aria-labelledby={`sound-lab-guide-title`}>
      <div className={`sound-lab-deck-heading`}><span>{`A SMALL FIELD MANUAL`}</span><h2 id={`sound-lab-guide-title`}>{`THREE WAYS IN.`}</h2></div>
      <div className={`sound-lab-guide-grid`}>
        <article id={`sound-lab-guide-ambient`}><span>{`01 / JUST EXPLORE`}</span><h3>{`Start with a signal`}</h3><p>{`The ambient motion works without playing a track. Change the visual mode, adjust density, and slow things down whenever you like.`}</p></article>
        <article id={`sound-lab-guide-local`}><span>{`02 / BRING YOUR SOUND`}</span><h3>{`Choose a local file`}</h3><p>{`The browser plays the audio you choose on your device. This site does not upload the file. Use music you have permission to play.`}</p></article>
        <article id={`sound-lab-guide-sync`}><span>{`03 / FEEL IT TOGETHER`}</span><h3>{`Sync site audio`}</h3><p>{`On browsers that support tab audio sharing, choose this tab and enable its audio. You control the sharing prompt and can stop the session at any time. Spotify playback is handled separately.`}</p></article>
      </div>
    </section>
    </div>
    <div id={`sound-lab-page-links`} className={`sound-lab-page-links`}><div><p className={`sound-lab-eyebrow`}>{`GOOD EXPERIMENTS START WITH GOOD MUSIC.`}</p><h2>{`KEEP THE SIGNAL GOING.`}</h2></div><Link id={`sound-lab-listen-link`} href={`/music`}>{`Dig into the records`}<ArrowIcon size={22} /></Link><Link id={`sound-lab-help-link`} href={`/support`}>{`Read the field guide`}<ArrowIcon size={17} /></Link></div>
  </div>;
};

export default SoundLab;
