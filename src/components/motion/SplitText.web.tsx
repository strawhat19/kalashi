import './SplitText.css';
import { useRef, useEffect, type CSSProperties } from 'react';

type SplitTextProps = {
  text: string;
  delay?: number;
  ready?: boolean;
  className?: string;
  by?: `characters` | `words`;
};

const SplitText = ({ text, delay = 0, ready = true, className = ``, by = `words` }: SplitTextProps) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  let unitIndex = 0;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const preference = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    let observer: IntersectionObserver | undefined;
    const reveal = (animate: boolean) => {
      element.dataset.splitRevealed = `true`;
      element.dataset.splitState = animate ? `visible` : `static`;
      observer?.disconnect();
    };
    const onPreferenceChange = () => {
      if (preference.matches) reveal(false);
    };

    if (preference.matches || !(`IntersectionObserver` in window)) reveal(false);
    else if (element.dataset.splitRevealed !== `true`) {
      element.dataset.splitState = `waiting`;
      observer = new IntersectionObserver((entries) => {
        if (ready && entries.some((entry) => entry.isIntersecting)) reveal(true);
      }, { threshold: 0.1 });
      observer.observe(element);
    }
    preference.addEventListener(`change`, onPreferenceChange);
    return () => {
      observer?.disconnect();
      preference.removeEventListener(`change`, onPreferenceChange);
    };
  }, [ready]);

  const unit = (value: string) => {
    const index = unitIndex++;
    const style = { [`--split-delay`]: `${Math.max(0, delay) + index * (by === `characters` ? 35 : 70)}ms` } as CSSProperties;
    return <span style={style} className={`split-text__unit`}>{value}</span>;
  };

  return <span ref={elementRef} className={`split-text ${className}`.trim()}>
    <span className={`split-text__label`}>{text}</span>
    <span aria-hidden={`true`} className={`split-text__visual`}>
      {text.split(/(\s+)/u).map((word, index) => /^\s+$/u.test(word) ? word : (
        <span key={index} className={`split-text__word${by === `words` ? ` split-text__mask` : ``}`}>
          {by === `words` ? unit(word) : Array.from(word).map((character, characterIndex) => (
            <span key={characterIndex} className={`split-text__mask`}>{unit(character)}</span>
          ))}
        </span>
      ))}
    </span>
  </span>;
};

export default SplitText;
