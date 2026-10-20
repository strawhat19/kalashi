import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../../theme/tokens';
import { useAuth } from '../../shared/account/AuthContext';
import { listInquiries, subscribeAccountData, updateInquiryStatus, type InquiryRecord } from '../../shared/account/service';
import AccountShell from './AccountShell';
import { pageStyles } from './pageStyles';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

type Snapshot = { scope: string; records: InquiryRecord[]; error: string; ready: boolean };
const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? `Date Unavailable` : new Intl.DateTimeFormat(`en-US`, { year: `numeric`, month: `short`, day: `numeric` }).format(date);
};

const InquiriesScreen = () => {
  const { user } = useAuth();
  const scope = user?.id ?? `guest`;
  const [busy, setBusy] = useState(``);
  const [message, setMessage] = useState(``);
  const [snapshot, setSnapshot] = useState<Snapshot>({ scope: ``, records: [], error: ``, ready: false });
  const current = snapshot.scope === scope;
  const records = current ? snapshot.records : [];
  const loading = !current || !snapshot.ready;
  const error = current ? snapshot.error : ``;

  useEffect(() => {
    let active = true;
    const refresh = () => {
      void listInquiries(scope).then(next => {
        if (active) setSnapshot({ scope, records: next, error: ``, ready: true });
      }).catch(cause => {
        if (active) setSnapshot({ scope, records: [], error: cause instanceof Error ? cause.message : `Your inquiries could not be opened. Please try again`, ready: true });
      });
    };
    refresh();
    const unsubscribe = subscribeAccountData(scope, refresh);
    return () => { active = false; unsubscribe(); };
  }, [scope]);

  const changeStatus = async (inquiry: InquiryRecord, status: InquiryRecord[`status`]) => {
    setBusy(inquiry.id);
    setMessage(``);
    try {
      await updateInquiryStatus(inquiry.id, status, scope);
      setMessage(status === `Archived` ? `Inquiry Archived` : status === `Read` ? `Inquiry Marked As Read` : `Inquiry Restored`);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : `Your inquiry could not be updated. Please try again`); }
    finally { setBusy(``); }
  };

  return <AccountShell title={`Your inquiries.`} description={`Keep the messages and project details you’ve saved in one place.`}>
    <View {...element(`inquiries-toolbar`)} style={pageStyles.dispatchToolbar}>
      <View {...element(`inquiries-summary`)} style={pageStyles.dispatchSummary}>
        <Text {...element(`inquiries-summary-number`)} style={pageStyles.dispatchCount}>{loading || error ? `—` : String(records.length).padStart(2, `0`)}</Text>
        <Text {...element(`inquiries-summary-label`)} style={pageStyles.smallLabel}>{`SAVED DISPATCHES / YOUR ARCHIVE`}</Text>
      </View>
      <AccountLink id={`inquiries-contact`} href={`/contact`} label={`＋ Write an inquiry`} />
      <Text {...element(`inquiries-count`)} style={pageStyles.smallLabel}>{loading ? `OPENING YOUR MESSAGES…` : error ? `ARCHIVE UNAVAILABLE` : `${records.filter(record => record.status === `New`).length} NEW / ${records.filter(record => record.status === `Archived`).length} ARCHIVED`}</Text>
    </View>
    {!!message && <Text {...element(`inquiries-message`)} accessibilityLiveRegion={`polite`} style={styles.copy}>{message}</Text>}
    {loading ? <Panel id={`inquiries-loading`} title={`Opening your messages…`}><Copy id={`inquiries-loading-copy`}>{`Just a moment while your saved inquiries load.`}</Copy></Panel> : error ? <Panel id={`inquiries-error`} title={`Your messages could not be opened`}><Text {...element(`inquiries-error-copy`)} accessibilityRole={`alert`} style={styles.copy}>{error}</Text></Panel> : !records.length ? <Panel id={`inquiries-empty`} title={`Start a conversation.`}><Copy id={`inquiries-empty-copy`}>{`Save a booking, collaboration, press, or general inquiry from Contact. You can return to your notes here.`}</Copy><AccountLink id={`inquiries-empty-contact`} href={`/contact`} label={`↗ Open Contact`} /></Panel> : <View {...element(`inquiries-list`)} style={styles.stack}>
      {records.map(inquiry => <View key={inquiry.id} {...element(`dispatch-envelope`, inquiry.id)}>
        <View {...element(`dispatch-index`, inquiry.id)} style={pageStyles.dispatchIndex}>
          <Text {...element(`dispatch-number`, inquiry.id)} style={pageStyles.dispatchNumber}>{`DISPATCH / ${String(inquiry.number).padStart(4, `0`)}`}</Text>
          <Text {...element(`dispatch-stamp`, inquiry.id)} style={pageStyles.dispatchStamp}>{`SAVED INQUIRY`}</Text>
        </View>
        <Panel id={`inquiry-${inquiry.id}`} eyebrow={inquiry.topic.toUpperCase()} title={inquiry.name}>
        <View {...element(`inquiry-metadata`, inquiry.id)} style={styles.row}>
          <Text {...element(`inquiry-date`, inquiry.id)} style={layout.metadata}>{`#${inquiry.number} · ${formatDate(inquiry.createdAt)}`}</Text>
          <View {...element(`rowStatus`, inquiry.id)} accessibilityLabel={`Status: ${inquiry.status}`} style={layout.status}>
            <View {...element(`statusDotWrap`, inquiry.id)} style={layout.dotWrap}><View {...element(`statusDot`, inquiry.id)} style={[layout.dot, { backgroundColor: inquiry.status === `New` ? colors.green : inquiry.status === `Read` ? colors.muted : colors.red }]} /></View>
            <Text {...element(`statusText`, inquiry.id)} style={layout.metadata}>{inquiry.status}</Text>
          </View>
        </View>
        <Text {...element(`inquiry-email`, inquiry.id)} selectable style={styles.copy}>{inquiry.email}</Text>
        <Text {...element(`inquiry-body`, inquiry.id)} selectable style={layout.message}>{inquiry.message}</Text>
        <View {...element(`actionsCell`, inquiry.id)} style={styles.row}>
          {inquiry.status === `New` ? <Action id={`inquiry-read-${inquiry.id}`} label={`✓ Mark as read`} disabled={!!busy} onPress={() => void changeStatus(inquiry, `Read`)} /> : null}
          <Action id={`inquiry-archive-${inquiry.id}`} label={busy === inquiry.id ? `Saving…` : inquiry.status === `Archived` ? `↺ Restore inquiry` : `▣ Archive inquiry`} disabled={!!busy} onPress={() => void changeStatus(inquiry, inquiry.status === `Archived` ? `New` : `Archived`)} />
        </View>
      </Panel></View>)}
    </View>}
  </AccountShell>;
};

const layout = StyleSheet.create({
  status: { gap: 7, flexDirection: `row`, alignItems: `center` },
  dotWrap: { width: 12, height: 12, alignItems: `center`, justifyContent: `center` },
  dot: { width: 6, height: 6, borderRadius: 3 },
  metadata: { color: colors.muted, fontFamily: fonts.body, fontSize: 12 },
  message: { color: colors.white, fontFamily: fonts.body, fontSize: 16, lineHeight: 27 },
});

export default InquiriesScreen;
