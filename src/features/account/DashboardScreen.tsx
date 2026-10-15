import { useState } from 'react';
import { Text, View } from 'react-native';
import { ownerAccess } from '../../shared/account/contract';
import AccountShell from './AccountShell';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

type Tab = `Overview` | `Analytics` | `Releases` | `Users` | `Feedback` | `Features` | `Health`;
export default function DashboardScreen({ preview = false }: { preview?: boolean }) {
  const [tab, setTab] = useState<Tab>(`Overview`);
  const [range, setRange] = useState(`7 days`);
  if (!preview && !ownerAccess) return <AccountShell title={`Owner dashboard.`} description={`Owner verification is required. There is no signed-in user or trusted role in this frontend build.`}>
    <Panel id={`dashboard-locked`} title={`◈ Access not connected`}>
      <Copy id={`dashboard-locked-copy`}>{`No users, traffic reports, revenue, or private records have been loaded. This page does not grant owner access.`}</Copy>
      <AccountLink id={`dashboard-sign-in`} href={`/sign-in`} label={`↗ Sign in preview`} />
      <AccountLink id={`dashboard-layout-preview`} href={`/preview/dashboard`} label={`◈ View empty dashboard design`} />
    </Panel>
  </AccountShell>;
  return <AccountShell title={`Studio dashboard.`} description={`DESIGN PREVIEW ONLY. Public empty layout, not an authenticated admin session. No real account or analytics data is shown.`}>
    <View {...element(`dashboard-tabs`)} style={styles.row}>
      {([`Overview`, `Analytics`, `Releases`, `Users`, `Feedback`, `Features`, `Health`] as const).map(item => <Action key={item} id={`dashboard-tab-${item.toLowerCase()}`} label={`${item === tab ? `●` : `○`} ${item}`} onPress={() => setTab(item)} />)}
    </View>
    {(tab === `Overview` || tab === `Analytics`) && <>
      <Panel id={`dashboard-traffic`} title={`Traffic & audience`}>
        <View {...element(`analytics-range`)} style={styles.row}>{[`7 days`, `30 days`, `90 days`].map(item => <Action key={item} id={`range-${item.replace(` `, `-`)}`} label={`${range === item ? `●` : `○`} ${item}`} onPress={() => setRange(item)} />)}</View>
        <Copy id={`analytics-range-description`}>{`${range} selected for layout preview only. No report request is made.`}</Copy>
        <View {...element(`analytics-kpis`)} style={styles.row}>{[`Visitors`, `Page views`, `Favorites`, `Returning listeners`].map((item, index) => <View key={item} {...element(`analytics-kpi`, `${index}`)} style={[styles.panel, { minWidth: 160, flexGrow: 1 }]}><Text {...element(`analytics-kpi-label`, `${index}`)} style={styles.label}>{item}</Text><Text {...element(`analytics-kpi-value`, `${index}`)} style={styles.subtitle}>{`—`}</Text></View>)}</View>
        <View {...element(`analytics-empty-chart`)} style={[styles.panel, { minHeight: 160, justifyContent: `center` }]}><Copy id={`analytics-empty-copy`}>{`Trend chart unavailable. Connect authorized reporting after verified owner access is implemented.`}</Copy></View>
      </Panel>
      <Panel id={`dashboard-breakdown`} title={`Sources, pages & devices`}><Copy id={`dashboard-breakdown-copy`}>{`No report data. Provider credentials must remain server-side, with owner authorization enforced on every request.`}</Copy><Action id={`analytics-export`} label={`↓ Export report — unavailable`} disabled /></Panel>
    </>}
    {tab === `Releases` && <Panel id={`dashboard-releases`} title={`Release management`}><Copy id={`dashboard-releases-copy`}>{`Public catalog remains source-controlled. Future owner tools will manage verified albums, songs, artwork and publishing state. No content writes are enabled.`}</Copy><Action id={`release-add`} label={`+ Add release — unavailable`} disabled /></Panel>}
    {tab === `Users` && <Panel id={`dashboard-users`} title={`Listeners & roles`}><Copy id={`dashboard-users-copy`}>{`No user records loaded. Roles must come from verified server authorization, never local storage or a matching email address.`}</Copy><Action id={`users-manage`} label={`◈ Manage roles — unavailable`} disabled /></Panel>}
    {tab === `Feedback` && <Panel id={`dashboard-feedback`} title={`Listener feedback`}><Copy id={`dashboard-feedback-copy`}>{`No messages loaded. Future moderation will include report, review and response states with an audit trail.`}</Copy><Action id={`feedback-refresh`} label={`↻ Load feedback — unavailable`} disabled /></Panel>}
    {tab === `Features` && <Panel id={`dashboard-features`} title={`Owner feature settings`}><Copy id={`dashboard-features-copy`}>{`Account sign-in, cloud favorites, shared collections and reporting remain disabled in this source preview. Feature switches will require trusted owner authorization and confirmed persisted settings.`}</Copy><Action id={`features-save`} label={`✓ Save settings — unavailable`} disabled /></Panel>}
    {(tab === `Health` || tab === `Overview`) && <Panel id={`dashboard-health`} title={`Integration health`}><Copy id={`dashboard-health-copy`}>{`Firebase Auth: Not connected\nFirestore: Not connected\nOwner verification: Not connected\nInternal Vercel reports: Not connected\nPayments: Not configured`}</Copy></Panel>}
    <AccountLink id={`dashboard-exit-preview`} href={`/dashboard`} label={`← Return to locked dashboard`} />
  </AccountShell>;
}
