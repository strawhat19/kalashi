import { useState } from 'react';
import { Image, Platform, Pressable, Share, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { releases } from '../../config/artist';
import { useLibrary } from '../../shared/account/LibraryContext';
import { useLocalWorkspace } from '../../shared/account/LocalWorkspaceContext';
import AccountShell from './AccountShell';
import { Cassette } from './AccountDecor';
import { pageStyles } from './pageStyles';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

export default function CollectionsScreen() {
  const local = useLocalWorkspace();
  const favorites = useLibrary();
  const { width } = useWindowDimensions();
  const [title, setTitle] = useState(``);
  const [message, setMessage] = useState(``);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rename, setRename] = useState(``);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const selected = local.collections.find(item => item.id === selectedId);
  const choose = (id: string, name: string) => { setSelectedId(id); setRename(name); setConfirmRemove(false); setMessage(``); };
  const saveCollection = async (operation: () => Promise<boolean>, message: string, onSaved?: () => void) => {
    if (saving) return;
    setSaving(true);
    setMessage(``);
    try {
      if (await operation()) { onSaved?.(); setMessage(message); }
    } finally { setSaving(false); }
  };
  const shareCollection = async () => {
    if (!selected) return;
    const records = releases.filter((item) => selected.releaseIds.includes(item.spotifyUrl));
    const message = [selected.title, `KALASHI MUSIC`, ...records.map((item) => `${item.title} — ${item.spotifyUrl}`)].join(`\n\n`);
    try {
      if (Platform.OS === `web` && typeof navigator !== `undefined` && !navigator.share && navigator.clipboard) {
        await navigator.clipboard.writeText(message);
        setMessage(`Collection Copied`);
      } else {
        const result = await Share.share({ message });
        if (result.action === Share.sharedAction) setMessage(`Collection Shared`);
      }
    } catch { setMessage(`Could Not Share Collection — Please Try Again`); }
  };
  return <AccountShell title={`Your collections.`} description={`A record for every mood. Build a rotation, give it a name, and make it yours.`}>
    <View {...element(`collections-workbench`)} style={[pageStyles.split, width > 1150 && pageStyles.splitWide]}>
    <View {...element(`collections-sleeves-column`)} style={pageStyles.column}>
    <Panel id={`collections-create`} number={`01`} eyebrow={`A SIDE FOR EVERY MOOD`} title={`Make a mixtape.`}>
      {!!local.notice && <Copy id={`collections-storage`}>{local.notice}</Copy>}
      <TextInput {...element(`collection-title`)} style={styles.input} accessibilityLabel={`New collection title`} placeholder={`Late-night rotation`} placeholderTextColor={`#92978e`} value={title} onChangeText={setTitle} maxLength={80} editable={local.ready && !saving} />
      <Action id={`collection-create`} label={`+ Create collection`} disabled={!local.ready || saving || !title.trim() || local.collections.length >= 100} onPress={() => void saveCollection(() => local.createCollection(title), `Collection Created`, () => setTitle(``))} />
      <Copy id={`collections-limit`}>{`${local.collections.length} / 100 collections · Up to 80 characters per title`}</Copy>
    </Panel>
    {!!message && <Text {...element(`collection-message`)} style={styles.copy} accessibilityLiveRegion={`polite`}>{message}</Text>}
    {!local.collections.length && <Panel id={`collections-empty`} title={`Make room for your next rotation.`}><Copy id={`collections-empty-copy`}>{`Create your first collection above, then add the releases you want to hear again.`}</Copy></Panel>}
    <View {...element(`collection-list`)} style={pageStyles.cassetteGrid}>{local.collections.map((item, index) => <Pressable
      key={item.id}
      disabled={saving}
      {...element(`collection-sleeve`, item.id)}
      accessibilityRole={`button`}
      accessibilityLabel={`Edit ${item.title}, ${item.releaseIds.length} releases`}
      accessibilityState={{ disabled: saving, selected: selectedId === item.id }}
      onPress={() => choose(item.id, item.title)}
      style={[pageStyles.cassetteChoice, selectedId === item.id && pageStyles.cassetteChoiceSelected]}
    >
      <Cassette id={item.id} title={item.title} number={String(index + 1).padStart(2, `0`)} />
      <View {...element(`collection-sleeve-caption`, item.id)} style={pageStyles.cassetteCaption}>
        <Text {...element(`collection-sleeve-title`, item.id)} style={pageStyles.cassetteTitle}>{item.title}</Text>
        <Text {...element(`collection-sleeve-count`, item.id)} style={pageStyles.cassetteCount}>{`${item.releaseIds.length} RECORD${item.releaseIds.length === 1 ? `` : `S`} ↗`}</Text>
      </View>
    </Pressable>)}</View>
    </View>
    <View {...element(`collections-editor-column`)} style={pageStyles.column}>
    {selected ? <Panel id={`collection-editor-${selected.id}`} number={`02`} eyebrow={`THE TRACK LIST`} title={selected.title}>
      <TextInput {...element(`collection-rename`, selected.id)} style={styles.input} accessibilityLabel={`Rename selected collection`} value={rename} maxLength={80} editable={!saving} onChangeText={setRename} />
      <Action id={`collection-rename-save`} label={`✓ Save name`} disabled={saving || !rename.trim() || rename.trim() === selected.title} onPress={() => void saveCollection(() => local.renameCollection(selected.id, rename), `Collection Renamed`)} />
      <Copy id={`collection-membership-copy`}>{`Tap to add or remove releases. Hearts show your favorites.`}</Copy>
      <View {...element(`collection-membership`, selected.id)} style={pageStyles.membership}>
      {releases.map((item, index) => <View key={item.spotifyUrl} {...element(`collection-membership-row`, `${selected.id}-${index}`)} style={pageStyles.membershipRow}>
        <Image {...element(`collection-membership-artwork`, `${selected.id}-${index}`)} source={item.artwork} accessibilityLabel={`${item.title} cover artwork`} style={pageStyles.membershipArtwork} />
        <View {...element(`collection-membership-action`, `${selected.id}-${index}`)} style={pageStyles.membershipAction}><Action id={`collection-release-${index}`} selected={selected.releaseIds.includes(item.spotifyUrl)} label={`${selected.releaseIds.includes(item.spotifyUrl) ? `✓ Remove` : `+ Add`} ${item.title}${favorites.ids.includes(item.spotifyUrl) ? ` ♥` : ``}`} disabled={saving} onPress={() => void saveCollection(() => local.toggleRelease(selected.id, item.spotifyUrl), `Collection Updated`)} /></View>
      </View>)}
      </View>
      <Action id={`collection-share`} label={`↗ Share collection`} disabled={saving || !selected.releaseIds.length} onPress={() => void shareCollection()} />
      {confirmRemove ? <><Copy id={`collection-remove-warning`}>{`Delete this collection? This cannot be undone. Your favorites stay unchanged.`}</Copy><Action id={`collection-remove-confirm`} label={`× Delete collection`} disabled={saving} onPress={() => void saveCollection(() => local.removeCollection(selected.id), `Collection Deleted`, () => { setSelectedId(null); setConfirmRemove(false); })} /><Action id={`collection-remove-cancel`} label={`← Keep collection`} disabled={saving} onPress={() => setConfirmRemove(false)} /></> : <Action id={`collection-remove`} label={`× Delete collection`} disabled={saving} onPress={() => setConfirmRemove(true)} />}
    </Panel> : <View {...element(`collection-editor-waiting`)} style={pageStyles.stack}><Cassette id={`blank`} title={`YOUR NEXT ROTATION`} number={`—`} /><Copy id={`collection-editor-waiting-copy`}>{local.collections.length ? `Choose a sleeve to rename it, add records, and make it yours.` : `Give your first mixtape a name. The track list starts here.`}</Copy></View>}
    </View>
    </View>
    <AccountLink id={`collections-library`} href={`/library`} label={`♡ Open favorites`} />
  </AccountShell>;
}
