import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme/tokens';

export const styles = StyleSheet.create({
  root: { marginTop: 42, paddingTop: 28, borderTopWidth: 1, borderColor: colors.border },
  heading: { gap: 14, marginBottom: 22 },
  intro: { gap: 14 },
  eyebrow: { fontSize: 10, letterSpacing: 2, color: colors.green, fontFamily: fonts.body },
  title: { fontSize: 52, lineHeight: 60, color: colors.white, fontFamily: fonts.display },
  source: { minHeight: 44, paddingVertical: 12, fontSize: 12, color: colors.green, fontFamily: fonts.body },
  list: { borderTopWidth: 1, borderColor: colors.border },
  item: { borderBottomWidth: 1, borderColor: colors.border },
  row: { gap: 12, minHeight: 82, padding: 14, flexDirection: `row`, alignItems: `center`, backgroundColor: colors.ink },
  pressed: { opacity: 0.72, backgroundColor: colors.surface },
  rank: { width: 24, fontSize: 11, color: colors.muted, fontFamily: fonts.body, fontVariant: [`tabular-nums`] },
  firstRank: { color: colors.red },
  name: { flex: 1, fontSize: 18, lineHeight: 25, color: colors.white, fontFamily: fonts.body },
  duration: { fontSize: 11, color: colors.muted, fontFamily: fonts.body, fontVariant: [`tabular-nums`] },
  play: { width: 34, height: 34, borderWidth: 1, borderRadius: 17, alignItems: `center`, justifyContent: `center`, borderColor: colors.border },
  playIcon: { fontSize: 12, marginLeft: 2, color: colors.green },
  note: { marginTop: 16, fontSize: 11, lineHeight: 19, color: colors.muted, fontFamily: fonts.body },
});
