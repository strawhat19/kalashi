import BlogCard from './BlogCard';
import { Link } from 'expo-router';
import ReadingTop from './ReadingTop';
import { useBlog } from './useBlog';
import { styles } from './styles.native';
import { colors } from '../../../theme/tokens';
import { useNativeReading } from './useNativeReading';
import { blogCategories, blogCategorySlug } from './data';
import { journalNumber, journalPresentation } from './presentation';
import { Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from 'react-native';

const Blog = ({ initialCategory }: { initialCategory?: string }) => {
  const { width } = useWindowDimensions();
  const { query, error, loading, category, articles, filtered, setQuery, setCategory, clearFilters } = useBlog(initialCategory);
  const { visible, opacity, onScroll, scrollRef, scrollToTop, onHeroLayout } = useNativeReading();
  const presentation = journalPresentation[category ?? `All`];
  const accent = category === `Listening` ? colors.white : category === `Sound Lab` ? colors.red : colors.green;
  const mastheadSize = Math.min(144, Math.max(42, (width - 58) / (presentation.title.length * .54)));

  return <View nativeID={`blog-page`} style={styles.root}>
    <ScrollView ref={scrollRef} nativeID={`blog-scroll`} contentContainerStyle={styles.content} onScroll={onScroll} scrollEventThrottle={32}>
      <View nativeID={`blog-page-hero`} style={styles.hero} onLayout={onHeroLayout}>
        <View nativeID={`blog-issue-rail`} style={styles.issueRail}>
          <Text nativeID={`blog-page-eyebrow`} style={[styles.eyebrow, { color: accent }]}>{`KALASHI / THE JOURNAL`}</Text>
          <Text nativeID={`blog-issue-count`} style={styles.micro}>{`${journalNumber(articles.length)} NOTES / ${journalNumber(blogCategories.length)} CHANNELS`}</Text>
        </View>
        <Text nativeID={`blog-page-title`} style={[styles.masthead, { fontSize: mastheadSize, lineHeight: mastheadSize * 1.14 }]} accessibilityRole={`header`}>{presentation.title}<Text style={{ color: accent }}>{`.`}</Text></Text>
        <View nativeID={`blog-page-caption`} style={styles.heroCaption}>
          <Text accessible={false} style={[styles.asterisk, { color: accent }]}>{`✳`}</Text>
          <Text style={[styles.eyebrow, { color: accent }]}>{presentation.label}</Text>
        </View>
        <Text nativeID={`blog-page-introduction`} style={styles.excerpt}>{presentation.description}</Text>
        <Text nativeID={`blog-page-edition`} style={styles.micro}>{`WORDS. MUSIC. EVERYTHING BETWEEN. / SITE EDITORIAL`}</Text>
      </View>
      <View nativeID={`blog-controls`} style={styles.toolbar}>
        <View style={styles.sectionRail}>
          <Text nativeID={`blog-library-title`} style={[styles.eyebrow, { color: accent }]} accessibilityRole={`header`}>{`THE READING ROOM`}</Text>
          <Text nativeID={`blog-library-coverage`} style={styles.micro}>{`${journalNumber(articles.length)} PUBLISHED NOTES`}</Text>
        </View>
        <View nativeID={`blog-categories`} style={styles.categories} accessibilityLabel={`Filter journal by category`}>
          {([`All`, ...blogCategories] as const).map((item, index) => <Pressable
            key={item}
            accessibilityRole={`button`}
            accessibilityLabel={`${item} notes`}
            onPress={() => setCategory(item)}
            accessibilityState={{ selected: category === item }}
            nativeID={`blog-category-${item.toLowerCase().replace(/\s+/gu, `-`)}`}
            style={[styles.category, category === item && { backgroundColor: accent, borderColor: accent }]}
          >
            <Text accessible={false} style={[styles.categoryIndex, category === item && styles.categoryLabelActive]}>{journalNumber(index)}</Text>
            <Text style={[styles.categoryLabel, category === item && styles.categoryLabelActive]}>{item}</Text>
            <Text style={[styles.categoryCount, category === item && styles.categoryLabelActive]}>{item === `All` ? articles.length : articles.filter(article => article.category === item).length}</Text>
          </Pressable>)}
        </View>
        <View nativeID={`blog-search-field`} style={styles.searchField}>
          <Text accessible={false} style={styles.searchMark}>{`⌕`}</Text>
          <TextInput nativeID={`blog-search`} accessibilityLabel={`Search journal titles and summaries`} placeholder={`Search the notes`} placeholderTextColor={colors.muted} style={styles.search} value={query} onChangeText={setQuery} maxLength={180} returnKeyType={`search`} />
        </View>
        {category && category !== `All` ? <Link nativeID={`blog-category-permalink`} href={{ pathname: `/blog/category/[category]`, params: { category: blogCategorySlug(category) } }} style={[styles.link, { color: accent }]}>{`${category} category page ↗`}</Link> : null}
      </View>
      {loading ? <Text nativeID={`blog-loading`} style={styles.note} accessibilityLiveRegion={`polite`}>{`Tuning into the journal…`}</Text> : error ? <Text nativeID={`blog-error`} style={styles.note} accessibilityRole={`alert`}>{error}</Text> : filtered.length ? <View nativeID={`blog-article-list`} style={styles.stack}>
        <Text nativeID={`blog-results-count`} style={styles.micro} accessibilityLiveRegion={`polite`}>{`${journalNumber(filtered.length)} NOTE${filtered.length === 1 ? `` : `S`}${category !== `All` ? ` / ${category?.toUpperCase()}` : ` / THE COLLECTION`}${query.trim() ? ` / “${query.trim()}”` : ``}`}</Text>
        {filtered.map((article, index) => <BlogCard key={article.id} article={article} featured={index === 0} />)}
        <View nativeID={`blog-library-end`} style={styles.endPanel}>
          <Text accessible={false} style={[styles.endMark, { color: accent }]}>{`K.`}</Text>
          <Text style={styles.endCopy}>{`A different route.\nThe same signal.`}</Text>
          <Link nativeID={`blog-library-music`} href={`/music`} style={[styles.link, { color: accent }]}>{`Back to the music ↗`}</Link>
        </View>
      </View> : <View nativeID={`blog-empty`} style={styles.empty}>
        <Text style={styles.eyebrow}>{`NO SIGNAL / TRY ANOTHER CHANNEL`}</Text>
        <Text nativeID={`blog-empty-title`} style={styles.heading} accessibilityRole={`header`}>{category === null ? `That category isn't here.` : `No notes on that frequency.`}</Text>
        <Text nativeID={`blog-empty-copy`} style={styles.note}>{category === null ? `Choose a category above or explore all the journal notes.` : `Try another word or explore all the journal notes.`}</Text>
        <Pressable nativeID={`blog-clear-filters`} style={styles.action} accessibilityRole={`button`} onPress={clearFilters}><Text style={styles.actionLabel}>{`↺ Clear filters`}</Text></Pressable>
      </View>}
    </ScrollView>
    <ReadingTop id={`blog-scroll-top`} visible={visible} opacity={opacity} onPress={scrollToTop} />
  </View>;
};

export default Blog;
