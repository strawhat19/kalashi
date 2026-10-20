import { Link } from 'expo-router';
import { styles } from '../styles.native';
import type { NativePageProps } from '../native.types';
import { useSupport, supportCategories } from './useSupport';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const Support = ({ onHeroLayout }: NativePageProps) => {
  const { open, query, reset, toggle, setQuery, category, questions, setCategory } = useSupport();
  return <>
    <View nativeID={`support-hero`} style={styles.fieldHero} onLayout={event => onHeroLayout(event.nativeEvent.layout.height)}><Text nativeID={`support-eyebrow`} style={styles.fieldEyebrow}>{`THE LISTENER’S FIELD GUIDE`}</Text><Text nativeID={`support-title`} accessibilityRole={`header`} style={styles.fieldTitle}>{`BACK TO
YOUR SOUND.`}</Text><Text nativeID={`support-description`} style={styles.fieldDescription}>{`A few good answers. Less searching around. More finding your frequency.`}</Text><Text style={styles.fieldArrow} accessible={false}>{`↙`}</Text></View>
    <View nativeID={`support-body`} style={styles.body}>
      <Text nativeID={`support-search-label`} style={styles.micro}>{`WHAT DO YOU NEED?`}</Text><TextInput nativeID={`support-search`} accessibilityLabel={`Search the guide`} value={query} onChangeText={setQuery} placeholder={`Search the guide…`} placeholderTextColor={`#92978e`} autoCapitalize={`none`} autoCorrect={false} returnKeyType={`search`} style={styles.searchInput} />
      <ScrollView nativeID={`support-categories`} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>{supportCategories.map((item, index) => <Pressable key={item} nativeID={`support-category-${index}`} accessibilityRole={`button`} accessibilityLabel={`${item} help topics`} accessibilityState={{ selected: category === item }} onPress={() => setCategory(item)} style={[styles.category, category === item && styles.categoryActive]}><Text style={[styles.categoryText, category === item && styles.lime]}>{`${item} ${category === item ? `↗` : `+`}`}</Text></Pressable>)}</ScrollView>
      <View style={styles.results}><Text style={styles.micro}>{category === `All` ? `THE ESSENTIALS` : category.toUpperCase()}</Text><Text nativeID={`support-result-count`} accessibilityLiveRegion={`polite`} style={styles.micro}>{`${questions.length} ANSWER${questions.length === 1 ? `` : `S`}`}</Text></View>
      <View nativeID={`support-questions`} style={styles.questions}>{questions.map(question => <View key={question.id} nativeID={question.id} style={styles.question}><Pressable nativeID={`${question.id}-toggle`} accessibilityRole={`button`} accessibilityLabel={question.title} accessibilityState={{ expanded: open.includes(question.index) }} onPress={() => toggle(question.index)} style={styles.questionButton}><Text style={styles.micro}>{`0${question.index + 1}`}</Text><Text style={[styles.questionTitle, open.includes(question.index) && styles.lime]}>{question.title}</Text><Text style={styles.questionToggle}>{open.includes(question.index) ? `−` : `+`}</Text></Pressable>{open.includes(question.index) ? <View nativeID={`${question.id}-answer`} style={styles.answer}>{question.paragraphs.map((paragraph, index) => <Text key={index} nativeID={`${question.id}-paragraph-${index}`} style={styles.paragraph}>{paragraph}</Text>)}</View> : null}</View>)}</View>
      {questions.length === 0 ? <View nativeID={`support-empty`} style={styles.empty}><Text accessibilityRole={`header`} style={styles.sectionTitle}>{`A different frequency.`}</Text><Text style={styles.paragraph}>{`No answers match that search. Try another word or explore every topic.`}</Text><Pressable nativeID={`support-reset`} accessibilityRole={`button`} onPress={reset} style={styles.resetButton}><Text style={styles.resetText}>{`↗ Show All Topics`}</Text></Pressable></View> : null}
      <Link nativeID={`support-contact-link`} href={`/contact`} style={styles.link}>{`A different question? Put it into words ↗`}</Link>
    </View>
  </>;
};

export default Support;
