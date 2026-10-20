import { StyleSheet } from 'react-native';
import { colors, fonts } from '../../../../theme/tokens';

export const styles = StyleSheet.create({
  root: { gap: 16, padding: 24, borderWidth: 1, borderTopWidth: 5, borderColor: `#38432f`, borderTopColor: colors.green, backgroundColor: colors.ink },
  kicker: { color: colors.muted, fontSize: 10, letterSpacing: 1.5, fontFamily: fonts.body },
  title: { color: colors.white, fontSize: 36, fontFamily: fonts.display },
  copy: { color: colors.muted, fontSize: 14, lineHeight: 23, fontFamily: fonts.body },
  label: { marginTop: 8, color: colors.white, fontSize: 13, fontFamily: fonts.body },
  topics: { gap: 8, flexWrap: `wrap`, flexDirection: `row` },
  topic: { minHeight: 44, paddingHorizontal: 13, justifyContent: `center`, borderWidth: 1, borderColor: colors.border },
  topicActive: { borderColor: colors.green, backgroundColor: colors.surface },
  topicText: { color: colors.muted, fontSize: 12, fontFamily: fonts.body },
  topicTextActive: { color: colors.green },
  input: { minHeight: 48, paddingVertical: 13, color: colors.white, borderBottomWidth: 1, borderColor: `#525b49`, backgroundColor: `transparent`, fontFamily: fonts.body, fontSize: 14 },
  message: { minHeight: 160, textAlignVertical: `top` },
  action: { alignItems: `center`, justifyContent: `center`, minHeight: 48, marginTop: 10, padding: 14, borderRadius: 28, backgroundColor: colors.green },
  actionText: { color: colors.black, fontSize: 14, fontFamily: fonts.body },
  secondaryAction: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.black },
  secondaryActionText: { color: colors.green },
  disabled: { opacity: .6 },
  pressed: { opacity: .75 },
  status: { color: colors.muted, fontSize: 11, lineHeight: 19, fontFamily: fonts.body },
  savedLink: { minHeight: 44, paddingVertical: 12, color: colors.green, fontSize: 13, fontFamily: fonts.body },
});
