import { useLocalWorkspace } from '../../shared/account/LocalWorkspaceContext';
import { useState } from 'react';
import { useLibrary } from '../../shared/account/LibraryContext';
import AccountShell from './AccountShell';
import { Action, Copy, Panel } from './ui';
export default function SettingsScreen() {
  const library = useLibrary();
  const local = useLocalWorkspace();
  const [confirmWorkspace, setConfirmWorkspace] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [cleared, setCleared] = useState(false);
  return <AccountShell title={`Your settings.`} description={`Control this local preview. No account settings are sent to a server.`}>
    <Panel id={`settings-appearance`} title={`Appearance`}><Copy id={`settings-appearance-copy`}>{`Kalashi’s signature midnight, lime and red theme is active. Account-synced theme preferences are not connected.`}</Copy></Panel>
    <Panel id={`settings-data`} title={`Local library data`}>
      <Copy id={`settings-storage-copy`}>{library.notice}</Copy>
      {confirm ? <><Copy id={`clear-confirm-copy`}>{`Remove every local favorite from this browser or session? This cannot be undone.`}</Copy><Action id={`clear-confirm`} label={`× Remove local favorites`} onPress={() => { library.clear(); setConfirm(false); setCleared(true); }} /><Action id={`clear-cancel`} label={`← Keep favorites`} onPress={() => setConfirm(false)} /></> : <Action id={`clear-request`} label={`× Clear local favorites`} disabled={!library.ready || !library.ids.length} onPress={() => setConfirm(true)} />}
      {cleared && <Copy id={`clear-result`}>{`Local favorites cleared. No cloud records were changed.`}</Copy>}
    </Panel>
    <Panel id={`settings-workspace`} title={`Local collections & display profile`}>
      <Copy id={`settings-workspace-copy`}>{local.notice}</Copy>
      {confirmWorkspace ? <><Copy id={`workspace-clear-warning`}>{`Delete all local lists and your local display profile? This cannot be undone. Favorites remain separate.`}</Copy><Action id={`workspace-clear-confirm`} label={`× Clear local workspace`} onPress={() => { local.clear(); setConfirmWorkspace(false); }} /><Action id={`workspace-clear-cancel`} label={`← Keep local workspace`} onPress={() => setConfirmWorkspace(false)} /></> : <Action id={`workspace-clear`} label={`× Clear lists & display profile`} disabled={!local.ready} onPress={() => setConfirmWorkspace(true)} />}
    </Panel>
    <Panel id={`settings-security`} title={`Account & security`}>
      <Copy id={`settings-security-copy`}>{`Google linking, email verification, password changes and account deletion require the future authenticated service. No account currently exists in this preview.`}</Copy>
      <Action id={`delete-account`} label={`× Delete account — unavailable`} disabled />
    </Panel>
  </AccountShell>;
}
