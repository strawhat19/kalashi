import './AccountShell.css';
import './AccountDecor/styles.css';
import './AccountPages.css';
import Head from 'expo-router/head';
import { Link, usePathname } from 'expo-router';
import { useContext, useEffect, useState, type CSSProperties, type PropsWithChildren } from 'react';
import { accountRoutes } from '../../shared/account/routes';
import { useAuth } from '../../shared/account/AuthContext';
import { useAccountNavigation } from '../../shared/account/NavigationContext';
import { getAccountPresentation } from './presentation';
import { PageIntroContext } from '../../components/motion/PageIntroContext';

const profileRoute = accountRoutes.find((item) => item.href === `/profile`)!;
const libraryRoutes = accountRoutes.filter((item) => item.href === `/library` || item.href === `/collections` || item.href === `/settings`);
const navigationIcons: Record<string, string> = {
  '/profile': `M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M4 21v-2a8 8 0 0 1 16 0v2`,
  '/library': `M12 21 3.8 13a5.6 5.6 0 0 1 8.2-7.6A5.6 5.6 0 0 1 20.2 13z`,
  '/settings': `M4 6h16M4 12h16M4 18h16M9 3v6M15 9v6M9 15v6`,
  '/collections': `M3 5h7l2 3h9v12H3zM3 8h9`,
};

const AccountShell = ({ title, description, children }: PropsWithChildren<{ title: string; description: string }>) => {
  const path = usePathname();
  const presentation = getAccountPresentation(path);
  const introReady = useContext(PageIntroContext);
  const { user, loading } = useAuth();
  const [mobile, setMobile] = useState(false);
  const { collapsed, ready, notice, toggle } = useAccountNavigation();
  const identity = loading ? `Loading Account…` : user ? user.displayName.trim() || `Listener` : `Guest`;
  const initial = loading ? `…` : user?.displayName.trim().slice(0, 1).toUpperCase() || `K`;
  const profileHref = user || loading ? `/profile` : `/sign-in`;
  const railWidth = collapsed ? `56px` : `var(--site-brand-extent, 204px)`;

  useEffect(() => {
    const root = document.documentElement;
    const breakpoint = window.matchMedia(`(min-width: 651px)`);
    const updateLayout = () => {
      setMobile(!breakpoint.matches);
      root.style.setProperty(`--account-rail-width`, breakpoint.matches ? railWidth : `0px`);
    };
    updateLayout();
    breakpoint.addEventListener(`change`, updateLayout);
    return () => {
      breakpoint.removeEventListener(`change`, updateLayout);
      root.style.removeProperty(`--account-rail-width`);
    };
  }, [railWidth]);

  const renderLink = (item: typeof accountRoutes[number]) => {
    const label = item.label.slice(item.label.indexOf(` `) + 1);
    const id = item.href.slice(1);
    const href = item.href === `/profile` ? profileHref : item.href;
    const active = path === href || (item.href === `/profile` && !!user && path === `/connections`);
    return (
      <Link key={item.href} href={href} asChild>
        <a
          title={label}
          aria-label={label}
          id={`account-nav-link-${id}`}
          aria-current={active ? `page` : undefined}
          className={`account-sidebar__link${active ? ` is-active` : ``}`}
        >
          <svg id={`account-nav-icon-${id}`} width={18} height={18} viewBox={`0 0 24 24`} aria-hidden={`true`}>
            <path d={navigationIcons[item.href]} fill={`none`} stroke={`currentColor`} strokeWidth={1.6} strokeLinecap={`round`} strokeLinejoin={`round`} />
          </svg>
          <span id={`account-nav-label-${id}`} className={`account-sidebar__label`}>{label}</span>
        </a>
      </Link>
    );
  };

  return (
    <div
      id={`account-shell`}
      data-intro-ready={introReady}
      data-account-page={presentation.key}
      className={`account-shell account-page--${presentation.key}${collapsed ? ` is-collapsed` : ``}`}
      style={{ [`--account-accent`]: presentation.accent, [`--account-layout-width`]: railWidth } as CSSProperties}
    >
      <Head>
        <title>{`${title} | Kalashi Music`}</title>
        <meta name={`robots`} content={`noindex, nofollow`} />
        <meta name={`description`} content={description} />
      </Head>
      <aside id={`account-sidebar`} className={`account-sidebar`} aria-label={`Account navigation`}>
        <div id={`account-navigation-wrap`} className={`account-sidebar__navigation-wrap`}>
          <nav
            id={`account-navigation`}
            className={`account-navigation`}
            inert={mobile && collapsed}
            aria-label={`Account and library`}
            aria-hidden={mobile && collapsed ? true : undefined}
          >
            <div id={`account-nav-group`} className={`account-navigation__group`}>
              <h2 id={`account-nav-heading`} className={`account-navigation__heading`}>{`ACCOUNT`}</h2>
              {renderLink(profileRoute)}
            </div>
            <div id={`library-nav-group`} className={`account-navigation__group`}>
              <h2 id={`library-nav-heading`} className={`account-navigation__heading`}>{`LIBRARY`}</h2>
              {libraryRoutes.map(renderLink)}
            </div>
          </nav>
        </div>
        <div id={`account-sidebar-bottom`} className={`account-sidebar__bottom`}>
          {notice ? <p id={`navigation-storage-notice`} role={`alert`} className={`account-sidebar__notice`} title={notice}>
            <span id={`navigation-storage-icon`} className={`account-sidebar__notice-icon`} aria-hidden={`true`}>{`ⓘ`}</span>
            <span id={`navigation-storage-copy`} className={`account-sidebar__notice-copy`}>{notice}</span>
          </p> : null}
          <div id={`account-sidebar-controls`} className={`account-sidebar__controls`}>
            <Link href={profileHref} asChild>
              <a
                title={identity}
                id={`sidebar-profile-action`}
                aria-busy={loading}
                aria-label={loading ? `Loading account` : user ? `${identity} profile` : `Sign in`}
                className={`account-sidebar__identity`}
              >
                <span id={`sidebar-profile-avatar`} className={`account-sidebar__avatar`} aria-hidden={`true`}>{initial}</span>
                <span id={`sidebar-profile-label`} className={`account-sidebar__label`}>{identity}</span>
              </a>
            </Link>
            <button
              type={`button`}
              disabled={!ready}
              id={`sidebar-toggle`}
              onClick={toggle}
              aria-expanded={!collapsed}
              aria-controls={`account-navigation`}
              className={`account-sidebar__toggle`}
              aria-describedby={notice ? `navigation-storage-notice` : undefined}
              title={collapsed ? `Expand navigation` : `Collapse navigation`}
              aria-label={collapsed ? `Expand navigation` : `Collapse navigation`}
            >
              <svg id={`sidebar-toggle-chevron`} width={18} height={18} viewBox={`0 0 24 24`} aria-hidden={`true`}>
                <path d={`m15 6-6 6 6 6`} fill={`none`} stroke={`currentColor`} strokeWidth={1.6} strokeLinecap={`round`} strokeLinejoin={`round`} />
              </svg>
            </button>
          </div>
        </div>
      </aside>
      <section id={`account-content`} className={`account-content`} aria-labelledby={`account-title`}>
        <header id={`account-page-heading`} className={`account-page-heading`}>
          <div id={`account-heading-folio`} className={`account-heading-folio`}>
            <p id={`account-eyebrow`} className={`account-mode`}>{presentation.eyebrow}</p>
            <span id={`account-page-number`} className={`account-page-number`}>{`${presentation.number} / K`}</span>
          </div>
          <span id={`account-heading-word`} className={`account-heading-word`} aria-hidden={`true`}>{presentation.word}</span>
          <h1 id={`account-title`} className={`account-title`}>{title}</h1>
          <p id={`account-description`} className={`account-description`}>{description}</p>
        </header>
        <div id={`account-page-panels`} className={`account-page-panels`}>{children}</div>
      </section>
    </div>
  );
};

export default AccountShell;
