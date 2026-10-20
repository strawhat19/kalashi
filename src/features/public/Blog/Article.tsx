import BlogCard from './BlogCard';
import ReadingTop from './ReadingTop';
import { useArticle } from './useBlog';
import { styles } from './styles.native';
import { Link, type Href } from 'expo-router';
import { journalNumber } from './presentation';
import { colors } from '../../../theme/tokens';
import { getPublishedSnapshot } from './service';
import { useNativeReading } from './useNativeReading';
import { Image, ScrollView, Text, View } from 'react-native';
import { blogCategorySlug, articleReadingMinutes, formatEditorialDate } from './data';

const Article = ({ slug }: { slug: string }) => {
  const { article, error, loading } = useArticle(slug);
  const { visible, opacity, onScroll, scrollRef, scrollToTop, onHeroLayout } = useNativeReading();

  if (loading) return <View nativeID={`blog-article-loading`} style={styles.empty}><Text accessibilityLiveRegion={`polite`} style={styles.note}>{`Tuning into the journal…`}</Text></View>;
  if (!article) return <View nativeID={`blog-article-unavailable`} style={styles.empty}>
    <Text style={styles.eyebrow}>{`JOURNAL / SIGNAL NOT FOUND`}</Text>
    <Text nativeID={`blog-article-unavailable-title`} style={styles.heading} accessibilityRole={`header`}>{error ? `The signal was interrupted.` : `That note isn't here.`}</Text>
    <Text style={styles.note}>{error || `This address does not match a published journal note.`}</Text>
    <Link nativeID={`blog-article-back`} href={`/blog`} style={styles.link}>{`← Back to the journal`}</Link>
  </View>;

  const listening = article.category === `Listening`;
  const accent = listening ? colors.white : article.category === `Sound Lab` ? colors.red : colors.green;
  const published = getPublishedSnapshot();
  const related = article.relatedSlugs.flatMap(relatedSlug => {
    const match = published.find(item => item.slug === relatedSlug && item.id !== article.id);
    return match ? [match] : [];
  });

  return <View nativeID={`blog-article-${article.slug}`} style={styles.root}>
    <ScrollView ref={scrollRef} nativeID={`blog-article-scroll-${article.slug}`} contentContainerStyle={styles.content} onScroll={onScroll} scrollEventThrottle={32}>
      <View nativeID={`blog-article-hero-${article.slug}`} style={styles.hero} onLayout={onHeroLayout}>
        <View style={styles.issueRail}>
          <Link nativeID={`blog-article-breadcrumb-${article.slug}`} href={`/blog`} style={styles.back}>{`← THE JOURNAL`}</Link>
          <Text style={styles.micro}>{`NOTE ${journalNumber(article.number)} / ${articleReadingMinutes(article)} MIN READ`}</Text>
        </View>
        <Link nativeID={`blog-article-category-${article.slug}`} href={{ pathname: `/blog/category/[category]`, params: { category: blogCategorySlug(article.category) } }} style={[styles.categoryLink, { color: accent }]}>{`${article.category.toUpperCase()} ↗`}</Link>
        <Text nativeID={`blog-article-title-${article.slug}`} style={styles.title} accessibilityRole={`header`}>{article.title.toUpperCase()}</Text>
        <Text style={[styles.eyebrow, { color: accent }]}>{`A NOTE FROM OUR WORLD`}</Text>
        <Text nativeID={`blog-article-excerpt-${article.slug}`} style={styles.excerpt}>{article.excerpt}</Text>
      </View>
      <View nativeID={`blog-article-cover-${article.slug}`} style={[styles.articleMedia, listening && styles.cardMediaPaper]}>
        <Image nativeID={`blog-article-image-${article.slug}`} source={article.image.native} accessibilityLabel={article.image.alt} resizeMode={listening ? `contain` : `cover`} style={[styles.cardImage, listening && styles.cardImageInset]} />
      </View>
      <View nativeID={`blog-article-caption-${article.slug}`} style={styles.sectionRail}>
        <Text style={[styles.note, styles.caption]}>{article.image.alt}</Text>
        <Text style={styles.micro}>{`FIG. ${journalNumber(article.number)}`}</Text>
      </View>
      <View nativeID={`blog-article-meta-${article.slug}`} style={styles.coverMeta}>
        <View style={styles.credit}><Text style={styles.micro}>{`WORDS`}</Text><Text style={styles.creditValue}>{article.author}</Text></View>
        <View style={styles.credit}><Text style={styles.micro}>{`PUBLISHED`}</Text><Text style={styles.creditValue}>{formatEditorialDate(article.publishedAt)}</Text></View>
        <View style={styles.credit}><Text style={styles.micro}>{`READING TIME`}</Text><Text style={styles.creditValue}>{`${articleReadingMinutes(article)} minutes / ${journalNumber(article.sections.length)} chapters`}</Text></View>
      </View>
      <View nativeID={`blog-article-index-${article.slug}`} style={[styles.readingIndex, { borderTopColor: accent }]}>
        <Text style={[styles.eyebrow, { color: accent }]} accessibilityRole={`header`}>{`INSIDE THIS NOTE`}</Text>
        {article.sections.map((section, index) => <View key={section.heading} nativeID={`blog-article-index-item-${article.slug}-${index}`} style={styles.indexRow}>
          <Text style={[styles.chapterNumber, { color: accent }]}>{journalNumber(index + 1)}</Text>
          <Text style={styles.indexLabel}>{section.heading}</Text>
        </View>)}
      </View>
      {article.sections.map((section, sectionIndex) => <View key={section.heading} nativeID={`blog-article-section-${article.slug}-${sectionIndex}`} style={styles.section}>
        <View style={styles.chapterHeading}>
          <Text accessible={false} style={[styles.chapterNumber, { color: accent }]}>{journalNumber(sectionIndex + 1)}</Text>
          <Text nativeID={`blog-article-heading-${article.slug}-${sectionIndex}`} style={[styles.heading, styles.chapterTitle]} accessibilityRole={`header`}>{section.heading.toUpperCase()}</Text>
        </View>
        {section.paragraphs.map((paragraph, index) => <Text key={index} nativeID={`blog-article-paragraph-${article.slug}-${sectionIndex}-${index}`} style={styles.paragraph}>{paragraph}</Text>)}
      </View>)}
      <View nativeID={`blog-article-end-${article.slug}`} style={styles.sectionRail}>
        <Text style={styles.micro}>{`END OF NOTE`}</Text>
        <Text accessible={false} style={[styles.endMark, { color: accent }]}>{`K.`}</Text>
      </View>
      <View nativeID={`blog-article-sources-${article.slug}`} style={styles.sources}>
        <Text style={[styles.eyebrow, { color: accent }]}>{`THE FOOTNOTES`}</Text>
        <Text nativeID={`blog-article-sources-title-${article.slug}`} style={styles.sourceTitle} accessibilityRole={`header`}>{`SOURCES & DESTINATIONS`}</Text>
        <Text nativeID={`blog-article-sources-note-${article.slug}`} style={styles.note}>{`Artist and catalog destinations are credited below. Listening suggestions are editorial opinion; feature descriptions reflect this site's current controls.`}</Text>
        {article.sources.map((source, index) => <View key={source.href} nativeID={`blog-source-${article.slug}-${index}`} style={styles.source}>
          <Text accessible={false} style={styles.micro}>{journalNumber(index + 1)}</Text>
          <View style={styles.sourceCopy}>
            <Link nativeID={`blog-source-link-${article.slug}-${index}`} href={source.href as Href} style={[styles.sourceLink, { color: accent }]}>{`${source.title} ↗`}</Link>
            <Text nativeID={`blog-source-credit-${article.slug}-${index}`} style={styles.note}>{`${source.credit} · Reviewed ${formatEditorialDate(source.reviewedAt)}`}</Text>
          </View>
        </View>)}
      </View>
      <View nativeID={`blog-article-explore-${article.slug}`} style={styles.explore}>
        <Text style={[styles.eyebrow, { color: accent }]}>{`FOLLOW THE SIGNAL`}</Text>
        <Link nativeID={`blog-article-music-${article.slug}`} href={`/music`} style={[styles.link, { color: accent }]}>{`The Music ↗`}</Link>
        <Link nativeID={`blog-article-lab-${article.slug}`} href={`/sound-lab`} style={[styles.link, { color: accent }]}>{`Sound Lab ↗`}</Link>
      </View>
      {related.length ? <View nativeID={`blog-article-related-${article.slug}`} style={styles.stack}>
        <Text style={[styles.eyebrow, { color: accent }]}>{`THE NEXT FREQUENCY`}</Text>
        <Text nativeID={`blog-article-related-title-${article.slug}`} style={styles.relatedTitle} accessibilityRole={`header`}>{`KEEP READING.`}</Text>
        {related.map(item => <BlogCard key={item.id} article={item} />)}
        <Link nativeID={`blog-article-all-notes-${article.slug}`} href={`/blog`} style={[styles.link, { color: accent }]}>{`← All journal notes`}</Link>
      </View> : null}
    </ScrollView>
    <ReadingTop id={`blog-article-scroll-top-${article.slug}`} visible={visible} opacity={opacity} onPress={scrollToTop} />
  </View>;
};

export default Article;
