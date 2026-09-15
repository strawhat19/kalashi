import './LoaderSpectrum.css';
import type { CSSProperties } from 'react';

type LoaderSpectrumProps = {
  barCount?: number;
  className?: string;
};

const LoaderSpectrum = ({ barCount = 48, className = `` }: LoaderSpectrumProps) => {
  const count = Number.isFinite(barCount) ? Math.max(8, Math.min(128, Math.round(barCount))) : 48;
  const bars = Array.from({ length: count }, (_, index) => {
    const position = index / Math.max(1, count - 1);
    const envelope = Math.pow(Math.sin(position * Math.PI), 0.8);
    const texture = (Math.sin(index * 1.41) + Math.cos(index * 0.56) + 2) / 4;
    const duration = 1080 + (index * 137 % 730);
    const accent = index === Math.round(count * 0.31) || index === Math.round(count * 0.73);
    const peak = accent || index === Math.round(count * 0.5);
    const style = {
      height: `${(14 + envelope * (43 + texture * 28)).toFixed(2)}%`,
      [`--loader-bar-dip`]: (0.25 + texture * 0.23).toFixed(3),
      [`--loader-bar-rest`]: (0.48 + texture * 0.22).toFixed(3),
      [`--loader-bar-lift`]: (0.81 + texture * 0.19).toFixed(3),
      [`--loader-bar-swell`]: (0.63 + texture * 0.26).toFixed(3),
      [`--loader-bar-delay`]: `${-((index * 347 + 211) % duration)}ms`,
      [`--loader-bar-duration`]: `${duration}ms`,
    } as CSSProperties;
    return { style, className: `loader-spectrum__bar${peak ? ` loader-spectrum__bar--peak` : ``}${accent ? ` loader-spectrum__bar--accent` : ``}` };
  });

  return (
    <div aria-hidden={`true`} className={`loader-spectrum ${className}`.trim()} style={{ [`--loader-bar-count`]: count } as CSSProperties}>
      {([`base`, `filled`] as const).map((layer) => (
        <div key={layer} className={`loader-spectrum__layer loader-spectrum__layer--${layer}`}>
          {bars.map((bar, index) => <span key={index} style={bar.style} className={bar.className} />)}
        </div>
      ))}
    </div>
  );
};

export default LoaderSpectrum;
