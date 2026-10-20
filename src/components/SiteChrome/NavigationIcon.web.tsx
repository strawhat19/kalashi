import type { SiteIconName } from '../../shared/site/routes';

const paths: Record<SiteIconName, string> = {
  blog: `M5 3h14v18H5zM8 7h8M8 11h8M8 15h5`,
  sound: `M4 9v6M8 5v14M12 2v20M16 6v12M20 9v6`,
  story: `M4 4h6l2 2 2-2h6v15h-6l-2 2-2-2H4zM12 6v15`,
  music: `M9 18V5l11-2v13M9 7l11-2M9 18c0 2-6 3-6 0s6-3 6 0Zm11-2c0 2-6 3-6 0s6-3 6 0Z`,
  account: `M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2`,
  contact: `M3 5h18v14H3zM3 6l9 7 9-7`,
  library: `M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z`,
};

const NavigationIcon = ({ name }: { name: SiteIconName }) => (
  <svg width={18} height={18} fill={`none`} viewBox={`0 0 24 24`} aria-hidden={`true`} className={`header-navigation-icon`}>
    <path d={paths[name]} stroke={`currentColor`} strokeWidth={1.5} strokeLinecap={`round`} strokeLinejoin={`round`} />
  </svg>
);

export default NavigationIcon;
