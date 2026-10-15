import { useState } from 'react';
import { Image, Linking, Share, Text, TextInput, View } from 'react-native';
import { releases } from '../../config/artist';
import { useLibrary } from '../../shared/account/LibraryContext';
import AccountShell from './AccountShell';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

type Filter = `all` | `Album` | `Single` | `saved`;
export default function LibraryScreen() {
  const library = useLibrary();
  const [filter, setFilter] = useState<Filter>(`all`);
  const [query, setQuery] = useState(``);
  const [message, setMessage] = useState(``);
  const items = releases.filter(item => (filter === `all` || (filter === `saved` ? library.ids.includes(item.spotifyUrl) : item.type === filter)) && item.title.toLowerCase().includes(query.trim().toLowerCase()));
  const open = async (url: string) => {
    try { await Linking.openURL(url); } catch { setMessage(`Spotify could not open. Please try again later.`); }
  };
  const share = async (title: string, url: string) => {
    try { await Share.share({ message: `${title} by Kalashi — ${url}` }); }
    catch { setMessage(`Sharing is not available on this device. Use the Spotify link instead.`); }
  };
  return <AccountShell title={`Your rotation.`} description={`Keep Kalashi’s albums and singles close. This local library is separate from Spotify saves and any future Kalashi account.`}>
    <Panel id={`library-status`} title={`♡ ${library.ready ? library.ids.length : `…`} local favorites`}>
      <Copy id={`library-storage`}>{library.notice}</Copy>
      <AccountLink id={`library-auth`} href={`/sign-in`} label={`↗ Preview account sign in`} />
    </Panel>
    <TextInput {...element(`library-search`)} style={styles.input} accessibilityLabel={`Search Kalashi releases`} placeholder={`Search releases`} placeholderTextColor={`#92978e`} value={query} onChangeText={setQuery} />
    <View {...element(`library-filters`)} style={styles.row}>
      {([{ id: `all`, label: `All releases` }, { id: `Album`, label: `Albums` }, { id: `Single`, label: `Songs / singles` }, { id: `saved`, label: `Favorites` }] as const).map(item => <Action key={item.id} id={`filter-${item.id}`} label={`${filter === item.id ? `●` : `○`} ${item.label}`} onPress={() => setFilter(item.id)} />)}
    </View>
    <Copy id={`library-catalog-note`}>{`The catalog currently contains the three releases already featured on this site. Album track listings will be added only from verified artist content.`}</Copy>
    {!!message && <Text {...element(`library-message`)} accessibilityLiveRegion={`polite`} style={styles.copy}>{message}</Text>}
    {!items.length && <Panel id={`library-empty`} title={`Nothing in this rotation yet.`}><Copy id={`library-empty-description`}>{`Try another search or explore all releases and tap the heart to keep one here.`}</Copy><Action id={`library-reset-filter`} label={`↗ Show all releases`} onPress={() => { setQuery(``); setFilter(`all`); }} /></Panel>}
    <View {...element(`library-catalog`)} style={styles.stack}>
      {items.map(item => {
        const id = item.title.toLowerCase().replace(/[^a-z0-9]+/g, `-`);
        const saved = library.ids.includes(item.spotifyUrl);
        return <Panel key={item.spotifyUrl} id={`release-${id}`} title={item.title}>
          <Image {...element(`library-artwork`, id)} source={item.artwork} accessibilityLabel={`${item.title} artwork`} style={{ width: 160, height: 160, borderRadius: 8 }} />
          <Copy id={`release-description-${id}`}>{`KALASHI / ${item.type.toUpperCase()} / ${item.year}`}</Copy>
          <View {...element(`library-actions`, id)} style={styles.row}>
            <Action id={`favorite-${id}`} label={saved ? `♥ Remove favorite` : `♡ Save locally`} disabled={!library.ready} onPress={() => library.toggle(item.spotifyUrl)} />
            <Action id={`play-${id}`} label={`↗ Open Spotify`} onPress={() => void open(item.spotifyUrl)} />
            <Action id={`share-${id}`} label={`↗ Share public release`} onPress={() => void share(item.title, item.spotifyUrl)} />
          </View>
        </Panel>;
      })}
    </View>
  </AccountShell>;
}
