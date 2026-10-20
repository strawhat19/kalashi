import { useState } from 'react';
import { Image, Linking, Share, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { releases } from '../../config/artist';
import { useLibrary } from '../../shared/account/LibraryContext';
import { useAuth } from '../../shared/account/AuthContext';
import AccountShell from './AccountShell';
import { RecordMark } from './AccountDecor';
import { pageStyles } from './pageStyles';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

type Filter = `all` | `Album` | `Single` | `saved`;
export default function LibraryScreen() {
  const library = useLibrary();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>(`all`);
  const [query, setQuery] = useState(``);
  const [message, setMessage] = useState(``);
  const [saving, setSaving] = useState(false);
  const items = releases.filter(item => (filter === `all` || (filter === `saved` ? library.ids.includes(item.spotifyUrl) : item.type === filter)) && item.title.toLowerCase().includes(query.trim().toLowerCase()));
  const open = async (url: string) => {
    try { await Linking.openURL(url); } catch { setMessage(`Spotify could not open. Please try again later.`); }
  };
  const share = async (title: string, url: string) => {
    try { await Share.share({ message: `${title} by Kalashi — ${url}` }); }
    catch { setMessage(`Sharing is not available on this device. Use the Spotify link instead.`); }
  };
  const toggleFavorite = async (url: string) => {
    if (saving) return;
    setSaving(true);
    setMessage(``);
    try { if (await library.toggle(url)) setMessage(`Favorites Updated`); }
    finally { setSaving(false); }
  };
  return <AccountShell title={`Your rotation.`} description={`Keep your favorite Kalashi albums and singles close. Pick a record and find your frequency.`}>
    <View {...element(`library-crate-summary`)} style={pageStyles.ribbon}>
      <View {...element(`library-crate-copy`)} style={pageStyles.ribbonCopy}>
        <Text {...element(`library-crate-label`)} style={pageStyles.kicker}>{`PULL UP A RECORD.`}</Text>
        <Copy id={`library-crate-description`}>{`The ones you love deserve a place in the crate.`}</Copy>
      </View>
      <View {...element(`library-crate-stats`)} style={pageStyles.ribbonStats}>
        <View {...element(`library-favorite-count`)}><Text {...element(`library-favorite-total`)} style={pageStyles.largeNumber}>{library.ready && !library.notice ? String(library.ids.length).padStart(2, `0`) : `—`}</Text><Text {...element(`library-favorite-label`)} style={pageStyles.smallLabel}>{`FAVORITES`}</Text></View>
        <View {...element(`library-release-count`)}><Text {...element(`library-release-total`)} style={pageStyles.largeNumber}>{String(releases.length).padStart(2, `0`)}</Text><Text {...element(`library-release-label`)} style={pageStyles.smallLabel}>{`FEATURED RECORDS`}</Text></View>
      </View>
    </View>
    <View {...element(`library-storage-status`)} style={pageStyles.stack}>
      {!!library.notice && <Copy id={`library-storage`}>{library.notice}</Copy>}
      {!user && <AccountLink id={`library-auth`} href={`/sign-in`} label={`↗ Sign in to your account`} />}
    </View>
    <View {...element(`library-tools`)} style={pageStyles.tools}>
    <TextInput {...element(`library-search`)} style={styles.input} accessibilityLabel={`Search Kalashi releases`} placeholder={`Search releases`} placeholderTextColor={`#92978e`} value={query} onChangeText={setQuery} />
    <View {...element(`library-filters`)} style={styles.row}>
      {([{ id: `all`, label: `All releases` }, { id: `Album`, label: `Albums` }, { id: `Single`, label: `Songs / singles` }, { id: `saved`, label: `Favorites` }] as const).map(item => <Action key={item.id} id={`filter-${item.id}`} selected={filter === item.id} label={`${filter === item.id ? `●` : `○`} ${item.label}`} onPress={() => setFilter(item.id)} />)}
    </View>
    </View>
    <Copy id={`library-catalog-note`}>{`Explore the featured releases, keep your favorites here, and open Spotify whenever you’re ready to listen.`}</Copy>
    {!!message && <Text {...element(`library-message`)} accessibilityLiveRegion={`polite`} style={styles.copy}>{message}</Text>}
    {!items.length && <Panel id={`library-empty`} title={`Nothing in this rotation yet.`}><Copy id={`library-empty-description`}>{`Try another search or explore all releases and tap the heart to keep one here.`}</Copy><Action id={`library-reset-filter`} label={`↗ Show all releases`} onPress={() => { setQuery(``); setFilter(`all`); }} /></Panel>}
    <View {...element(`library-catalog`)} style={[pageStyles.recordGrid, width > 980 && pageStyles.recordGridWide]}>
      {items.map((item, index) => {
        const id = item.title.toLowerCase().replace(/[^a-z0-9]+/g, `-`);
        const saved = library.ids.includes(item.spotifyUrl);
        return <View key={item.spotifyUrl} {...element(`library-record`, id)} style={[pageStyles.recordCard, width > 980 && pageStyles.recordCardWide]}>
          <View {...element(`library-record-meta`, id)} style={pageStyles.recordMeta}>
            <Text {...element(`library-record-number`, id)} style={pageStyles.smallLabel}>{`${String(index + 1).padStart(2, `0`)} / ${item.type.toUpperCase()}`}</Text>
            <Text {...element(`library-record-year`, id)} style={pageStyles.kicker}>{saved ? `♥ IN YOUR CRATE` : item.year}</Text>
          </View>
          <View {...element(`library-record-sleeve`, id)} style={pageStyles.recordSleeve}>
            <View {...element(`library-vinyl`, id)} style={pageStyles.vinyl}><RecordMark id={id} /></View>
            <Image {...element(`library-artwork`, id)} source={item.artwork} accessibilityLabel={`${item.title} cover artwork`} style={pageStyles.artwork} />
          </View>
          <Text {...element(`library-record-title`, id)} accessibilityRole={`header`} style={pageStyles.recordTitle}>{item.title}</Text>
          <Copy id={`release-description-${id}`}>{`KALASHI / ${item.year}`}</Copy>
          <View {...element(`library-actions`, id)} style={pageStyles.recordActions}>
            <Action id={`favorite-${id}`} label={saved ? `♥ Remove favorite` : `♡ Save favorite`} disabled={!library.ready || saving} onPress={() => void toggleFavorite(item.spotifyUrl)} />
            <Action id={`play-${id}`} label={`↗ Open Spotify`} onPress={() => void open(item.spotifyUrl)} />
            <Action id={`share-${id}`} label={`↗ Share release`} onPress={() => void share(item.title, item.spotifyUrl)} />
          </View>
        </View>;
      })}
    </View>
  </AccountShell>;
}
