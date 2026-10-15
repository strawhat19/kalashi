import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { releases } from '../../config/artist';
import { useLibrary } from '../../shared/account/LibraryContext';
import { useLocalWorkspace } from '../../shared/account/LocalWorkspaceContext';
import AccountShell from './AccountShell';
import { Action, AccountLink, Copy, Panel, element, styles } from './ui';

export default function CollectionsScreen() {
  const local = useLocalWorkspace();
  const favorites = useLibrary();
  const [title, setTitle] = useState(``);
  const [message, setMessage] = useState(``);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rename, setRename] = useState(``);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const selected = local.collections.find(item => item.id === selectedId);
  const choose = (id: string, name: string) => { setSelectedId(id); setRename(name); setConfirmRemove(false); setMessage(``); };
  return <AccountShell title={`Your collections.`} description={`Build a rotation of Kalashi albums and singles. Lists stay on this device; they are not backed up, account-owned or shared with friends.`}>
    <Panel id={`collections-create`} title={`+ Start a local collection`}>
      <Copy id={`collections-storage`}>{local.notice}</Copy>
      <TextInput {...element(`collection-title`)} style={styles.input} accessibilityLabel={`New collection title`} placeholder={`Late-night rotation`} placeholderTextColor={`#92978e`} value={title} onChangeText={setTitle} maxLength={80} editable={local.ready} />
      <Action id={`collection-create`} label={`+ Create local collection`} disabled={!local.ready || !title.trim() || local.collections.length >= 100} onPress={() => { if (local.createCollection(title)) { setTitle(``); setMessage(`Collection added locally.`); } }} />
      <Copy id={`collections-limit`}>{`${local.collections.length} / 100 local collections. Titles can be up to 80 characters.`}</Copy>
    </Panel>
    {!!message && <Text {...element(`collection-message`)} style={styles.copy} accessibilityLiveRegion={`polite`}>{message}</Text>}
    {!local.collections.length && <Panel id={`collections-empty`} title={`Make room for your next rotation.`}><Copy id={`collections-empty-copy`}>{`Create your first list above, then add any of the existing releases below. Your album track listings will grow with verified artist content.`}</Copy></Panel>}
    <View {...element(`collection-list`)} style={styles.row}>{local.collections.map(item => <Action key={item.id} id={`select-${item.id}`} label={`${selectedId === item.id ? `●` : `☷`} ${item.title} (${item.releaseIds.length})`} onPress={() => choose(item.id, item.title)} />)}</View>
    {selected && <Panel id={`collection-editor-${selected.id}`} title={selected.title}>
      <TextInput {...element(`collection-rename`, selected.id)} style={styles.input} accessibilityLabel={`Rename selected collection`} value={rename} maxLength={80} onChangeText={setRename} />
      <Action id={`collection-rename-save`} label={`✓ Rename locally`} disabled={!rename.trim() || rename.trim() === selected.title} onPress={() => { local.renameCollection(selected.id, rename); setMessage(`Collection renamed locally.`); }} />
      <Copy id={`collection-membership-copy`}>{`Tap to add or remove releases. Hearts show your separate local favorites.`}</Copy>
      {releases.map((item, index) => <Action key={item.spotifyUrl} id={`collection-release-${index}`} label={`${selected.releaseIds.includes(item.spotifyUrl) ? `✓ Remove` : `+ Add`} ${item.title}${favorites.ids.includes(item.spotifyUrl) ? ` ♥` : ``}`} onPress={() => local.toggleRelease(selected.id, item.spotifyUrl)} />)}
      <Action id={`collection-share`} label={`↗ Shared online lists — not connected`} disabled />
      {confirmRemove ? <><Copy id={`collection-remove-warning`}>{`Delete this local collection? Its list membership cannot be restored. Your favorites stay unchanged.`}</Copy><Action id={`collection-remove-confirm`} label={`× Delete collection`} onPress={() => { local.removeCollection(selected.id); setSelectedId(null); setConfirmRemove(false); setMessage(`Local collection deleted.`); }} /><Action id={`collection-remove-cancel`} label={`← Keep collection`} onPress={() => setConfirmRemove(false)} /></> : <Action id={`collection-remove`} label={`× Delete local collection`} onPress={() => setConfirmRemove(true)} />}
    </Panel>}
    <AccountLink id={`collections-library`} href={`/library`} label={`♡ Open local favorites`} />
  </AccountShell>;
}
