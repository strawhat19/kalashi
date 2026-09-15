type IconProps = { size?: number; className?: string };

export const ArrowIcon = ({ size = 20, className }: IconProps) => <svg width={size} height={size} className={className} viewBox={`0 0 24 24`} fill={`none`} aria-hidden={`true`}><path d={`M5 19 19 5M5 5h14v14`} stroke={`currentColor`} strokeWidth={`1.7`} /></svg>;
export const PlayIcon = ({ size = 20, className }: IconProps) => <svg width={size} height={size} className={className} viewBox={`0 0 24 24`} fill={`currentColor`} aria-hidden={`true`}><path d={`m8 5 12 7-12 7z`} /></svg>;
export const SpotifyIcon = ({ size = 23, className }: IconProps) => <svg width={size} height={size} className={className} viewBox={`0 0 24 24`} aria-hidden={`true`}><circle cx={`12`} cy={`12`} r={`11`} fill={`currentColor`} /><g fill={`none`} stroke={`var(--icon-cutout, #090a09)`} strokeLinecap={`round`}><path d={`M6 8.7c4.2-1.1 8.5-.7 12 1.1`} strokeWidth={`1.8`} /><path d={`M6.8 12.1c3.7-.9 7.2-.5 10.2 1`} strokeWidth={`1.6`} /><path d={`M7.5 15.3c3-.7 5.8-.3 8.2.8`} strokeWidth={`1.4`} /></g></svg>;
export const BrandMark = ({ size = 37, className }: IconProps) => <svg width={size} height={size} className={className} viewBox={`0 0 40 40`} fill={`none`} aria-hidden={`true`}><path d={`M3 4h8v13L26 4h11L19 20l18 16H25L11 23v13H3z`} fill={`currentColor`} /><path d={`M30 0h7v3h-7z`} fill={`#e84939`} /></svg>;

const orbitBrandRays = Array.from({ length: 48 }, (_, index) => {
  const angle = index / 48 * Math.PI * 2 - Math.PI / 2;
  const energy = (Math.sin(index * 0.47) + Math.cos(index * 0.83) + 2) / 4;
  const radius = 85 + energy * 24;
  return {
    x1: 120 + Math.cos(angle) * 79,
    y1: 120 + Math.sin(angle) * 79,
    x2: 120 + Math.cos(angle) * radius,
    y2: 120 + Math.sin(angle) * radius,
    accent: index === 6 || index === 28,
    opacity: 0.58 + energy * 0.42,
  };
});

// Static companion to the animated header orbit. Preserve the original K paths.
export const OrbitBrandMark = ({ size = 48, className }: IconProps) => <svg width={size} height={size} className={className} viewBox={`0 0 240 240`} fill={`none`} aria-hidden={`true`}>
  <circle cx={120} cy={120} r={113} stroke={`currentColor`} strokeOpacity={0.13} />
  <circle cx={120} cy={120} r={77} stroke={`currentColor`} strokeOpacity={0.35} strokeWidth={1.4} />
  <circle cx={120} cy={120} r={72} stroke={`currentColor`} strokeOpacity={0.3} strokeWidth={1.2} />
  {orbitBrandRays.map((ray, index) => <line key={index} x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} stroke={ray.accent ? `#e84939` : `currentColor`} strokeWidth={index % 4 === 0 ? 3.2 : 2.3} strokeOpacity={ray.opacity} strokeLinecap={`round`} />)}
  <circle cx={182.3538} cy={84} r={3.2} fill={`#e84939`} />
  <g transform={`translate(64 69.6) scale(2.8)`}>
    <path d={`M3 4h8v13L26 4h11L19 20l18 16H25L11 23v13H3z`} fill={`currentColor`} />
    <path d={`M30 0h7v3h-7z`} fill={`#e84939`} />
  </g>
</svg>;
