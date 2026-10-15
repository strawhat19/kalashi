import AccountShell from '../features/account/AccountShell';
import { Copy, Panel } from '../features/account/ui';
export default function ConnectionsPage() {
  return <AccountShell title={`Your connections.`} description={`No account or provider is connected. Do not enter API keys or credentials into this preview.`}>
    <Panel id={`connections-status`} title={`Account providers`}><Copy id={`connections-copy`}>{`Google: Not connected\nEmail & password: Not connected\nCloud favorites: Not connected\nSpotify: External listening links only, not a linked account`}</Copy></Panel>
  </AccountShell>;
}
