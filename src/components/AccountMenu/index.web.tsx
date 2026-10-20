import './styles.css';
import { Link } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../shared/account/AuthContext';

const AccountMenu = () => {
  const { user, signOut } = useAuth();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(``);
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== `Escape`) return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener(`keydown`, onKeyDown);
    document.addEventListener(`pointerdown`, onPointerDown);
    return () => {
      document.removeEventListener(`keydown`, onKeyDown);
      document.removeEventListener(`pointerdown`, onPointerDown);
    };
  }, [open]);

  if (!user) return null;
  const initial = user.displayName.trim().slice(0, 1).toUpperCase() || `K`;
  const logout = async () => {
    setBusy(true);
    setError(``);
    try { await signOut(); setOpen(false); }
    catch (reason) { setError(reason instanceof Error ? reason.message : `Could Not Sign Out`); }
    finally { setBusy(false); }
  };

  return <div ref={wrapperRef} id={`site-account-menu`} className={`site-account-menu`}>
    <button
      type={`button`}
      ref={triggerRef}
      id={`site-account-trigger`}
      aria-expanded={open}
      aria-controls={`site-account-panel`}
      className={`site-account-menu__trigger`}
      aria-label={`${user.displayName} account menu`}
      onClick={() => setOpen((current) => !current)}
    >
      <span id={`site-account-avatar`} className={`site-account-menu__avatar`} aria-hidden={`true`}>
        {initial}
        {user.photoURL && failedPhoto !== user.photoURL ? <img src={user.photoURL} alt={``} onError={() => setFailedPhoto(user.photoURL)} /> : null}
      </span>
    </button>
    {open ? <div id={`site-account-panel`} className={`site-account-menu__panel`}>
      <div id={`site-account-identity`} className={`site-account-menu__identity`}>
        <div className={`site-account-menu__identity-row`}><strong title={user.displayName}>{user.displayName}</strong><span className={`site-account-menu__role`}>{user.role}</span></div>
        <div className={`site-account-menu__identity-row`}><span title={user.email} className={`site-account-menu__email`}>{user.email}</span></div>
      </div>
      <Link href={`/profile`} id={`site-account-profile`} className={`site-account-menu__link`} onPress={() => setOpen(false)}><span aria-hidden={`true`}>{`◉`}</span>{`Profile`}</Link>
      <Link href={`/settings`} id={`site-account-settings`} className={`site-account-menu__link`} onPress={() => setOpen(false)}><span aria-hidden={`true`}>{`⚙`}</span>{`Settings`}</Link>
      {error ? <p id={`site-account-error`} role={`alert`} className={`site-account-menu__error`}>{error}</p> : null}
      <button type={`button`} id={`site-account-sign-out`} disabled={busy} className={`site-account-menu__link site-account-menu__sign-out`} onClick={() => void logout()}><span aria-hidden={`true`}>{`↪`}</span>{busy ? `Signing Out…` : `Sign Out`}</button>
    </div> : null}
  </div>;
};

export default AccountMenu;
