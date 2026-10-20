import { Link } from 'expo-router';
import type { BlogArticle } from './data';
import { styles } from './styles.native';
import { journalNumber } from './presentation';
import { colors } from '../../../theme/tokens';
import { Image, Pressable, Text, View } from 'react-native';
import { articleReadingMinutes, formatEditorialDate } from './data';

const BlogCard = ({ article, featured = false }: { article: BlogArticle; featured?: boolean }) => {
  const listening = article.category === `Listening`;
  const accent = listening ? colors.white : article.category === `Sound Lab` ? colors.red : colors.green;

  return <Link href={{ pathname: `/blog/[slug]`, params: { slug: article.slug } }} asChild>
    <Pressable
      nativeID={`blog-card-${article.slug}`}
      accessibilityRole={`link`}
      accessibilityLabel={`Read ${article.title}`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View nativeID={`blog-card-media-${article.slug}`} style={[styles.cardMedia, listening && styles.cardMediaPaper]}>
        <Image nativeID={`blog-card-image-${article.slug}`} source={article.image.native} accessibilityLabel={article.image.alt} resizeMode={listening ? `contain` : `cover`} style={[styles.cardImage, listening && styles.cardImageInset]} />
        <Text nativeID={`blog-card-image-label-${article.slug}`} style={[styles.imageTag, { color: accent }]}>{featured ? `COVER NOTE` : `JOURNAL NOTE`}</Text>
        <View nativeID={`blog-card-image-arrow-${article.slug}`} style={styles.imageArrow}><Text accessible={false} style={styles.imageArrowLabel}>{`↗`}</Text></View>
      </View>
      <View nativeID={`blog-card-copy-${article.slug}`} style={styles.cardCopy}>
        <View style={styles.sectionRail}>
          <Text nativeID={`blog-card-category-${article.slug}`} style={[styles.eyebrow, { color: accent }]}>{article.category.toUpperCase()}</Text>
          <Text nativeID={`blog-card-number-${article.slug}`} style={styles.micro}>{`N° ${journalNumber(article.number)}`}</Text>
        </View>
        <Text nativeID={`blog-card-title-${article.slug}`} accessibilityRole={`header`} style={[styles.cardTitle, featured && styles.cardTitleFeatured]}>{article.title.toUpperCase()}</Text>
        <Text nativeID={`blog-card-excerpt-${article.slug}`} style={styles.cardExcerpt}>{article.excerpt}</Text>
        <View nativeID={`blog-card-footer-${article.slug}`} style={styles.cardFooter}>
          <View style={styles.dateline}>
            <Text nativeID={`blog-card-date-${article.slug}`} style={styles.note}>{formatEditorialDate(article.publishedAt)}</Text>
            <Text nativeID={`blog-card-duration-${article.slug}`} style={styles.micro}>{`${articleReadingMinutes(article)} MIN READ`}</Text>
          </View>
          <Text nativeID={`blog-card-read-${article.slug}`} style={[styles.cardRead, { color: accent }]}>{`READ THE NOTE ↗`}</Text>
        </View>
      </View>
    </Pressable>
  </Link>;
};

export default BlogCard;
