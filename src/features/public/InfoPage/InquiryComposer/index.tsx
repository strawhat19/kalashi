import { Link } from 'expo-router';
import { useInquiry, inquiryTopics } from './useInquiry';
import { Pressable, Share, Text, TextInput, View } from 'react-native';
import { styles } from './styles.native';

const InquiryComposer = () => {
  const { fields, status, saved, saving, setStatus, updateField, prepareInquiry, saveCurrentInquiry } = useInquiry();
  const shareInquiry = async () => {
    const message = prepareInquiry();
    if (!message) return;
    try {
      const result = await Share.share({ message, title: `Kalashi ${fields.topic} Inquiry` });
      setStatus(result.action === Share.sharedAction
        ? `Share Complete`
        : `Sharing Canceled`);
    } catch {
      setStatus(`Could Not Share Inquiry — Please Try Again`);
    }
  };

  return <View nativeID={`contact-inquiry-composer`} style={styles.root}>
    <Text nativeID={`contact-inquiry-kicker`} style={styles.kicker}>{`YOUR NEXT CONNECTION`}</Text>
    <Text nativeID={`contact-inquiry-title`} accessibilityRole={`header`} style={styles.title}>{`Start with an idea.`}</Text>
    <Text nativeID={`contact-inquiry-disclosure`} style={styles.copy}>{`Keep the details together. Save your inquiry or share a copy for your records.`}</Text>
    <Text nativeID={`contact-topic-label`} style={styles.label}>{`What’s on your mind?`}</Text>
    <View nativeID={`contact-topic-options`} style={styles.topics}>
      {inquiryTopics.map((topic, index) => <Pressable key={topic} disabled={saving} nativeID={`contact-topic-option-${index}`} accessibilityRole={`radio`} accessibilityLabel={topic} accessibilityState={{ disabled: saving, checked: fields.topic === topic }} onPress={() => updateField(`topic`, topic)} style={[styles.topic, fields.topic === topic && styles.topicActive]}>
        <Text nativeID={`contact-topic-text-${index}`} style={[styles.topicText, fields.topic === topic && styles.topicTextActive]}>{topic}</Text>
      </Pressable>)}
    </View>
    <Text nativeID={`contact-name-label`} style={styles.label}>{`Your name`}</Text>
    <TextInput editable={!saving} nativeID={`contact-name`} accessibilityLabel={`Your name`} autoComplete={`name`} maxLength={80} placeholder={`What should we call you?`} placeholderTextColor={`#777f6f`} style={styles.input} value={fields.name} onChangeText={(value) => updateField(`name`, value)} />
    <Text nativeID={`contact-email-label`} style={styles.label}>{`Reply email`}</Text>
    <TextInput editable={!saving} nativeID={`contact-email`} accessibilityLabel={`Reply email`} autoComplete={`email`} autoCapitalize={`none`} keyboardType={`email-address`} maxLength={254} placeholder={`you@example.com`} placeholderTextColor={`#777f6f`} style={styles.input} value={fields.email} onChangeText={(value) => updateField(`email`, value)} />
    <Text nativeID={`contact-message-label`} style={styles.label}>{`Tell us the idea`}</Text>
    <TextInput multiline editable={!saving} nativeID={`contact-message`} accessibilityLabel={`Tell us the idea`} maxLength={5000} placeholder={`The project, the date, the place. Give the idea some room.`} placeholderTextColor={`#777f6f`} style={[styles.input, styles.message]} value={fields.message} onChangeText={(value) => updateField(`message`, value)} />
    <Pressable disabled={saving} nativeID={`contact-save-inquiry`} accessibilityRole={`button`} accessibilityState={{ disabled: saving, busy: saving }} onPress={() => void saveCurrentInquiry()} style={({ pressed }) => [styles.action, saving && styles.disabled, pressed && styles.pressed]}>
      <Text nativeID={`contact-save-label`} style={styles.actionText}>{saving ? `Saving…` : `✓ Save Inquiry`}</Text>
    </Pressable>
    <Pressable disabled={saving} nativeID={`contact-share-inquiry`} accessibilityRole={`button`} accessibilityState={{ disabled: saving }} onPress={() => void shareInquiry()} style={({ pressed }) => [styles.action, styles.secondaryAction, saving && styles.disabled, pressed && styles.pressed]}>
      <Text nativeID={`contact-share-label`} style={[styles.actionText, styles.secondaryActionText]}>{`↗ Share Inquiry`}</Text>
    </Pressable>
    <Text nativeID={`contact-inquiry-status`} accessibilityLiveRegion={`polite`} style={styles.status}>{status || `Add a few details to save your inquiry.`}</Text>
    {saved && !saving ? <Link href={`/profile/inquiries`} nativeID={`contact-saved-inquiries`} style={styles.savedLink}>{`↗ View Saved Inquiries`}</Link> : null}
  </View>;
};

export default InquiryComposer;
