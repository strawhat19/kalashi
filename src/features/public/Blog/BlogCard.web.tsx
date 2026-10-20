import { Link } from 'expo-router';
import type { BlogArticle } from './data';
import { journalNumber } from './presentation';
import { ArrowIcon } from '../../../components/Icons.web';
import { blogCategorySlug, articleReadingMinutes, formatEditorialDate } from './data';

const BlogCard = ({ article, featured = false }: { article: BlogArticle; featured?: boolean }) => (
  <article id={`blog-card-${article.slug}`} data-category={blogCategorySlug(article.category)} className={`blog-card${featured ? ` blog-card--featured` : ``}`}>
    <Link
      id={`blog-card-link-${article.slug}`}
      className={`blog-card__link`}
      aria-labelledby={`blog-card-title-${article.slug}`}
      href={{ pathname: `/blog/[slug]`, params: { slug: article.slug } }}
    >
      <div id={`blog-card-image-${article.slug}`} className={`blog-card__image`}>
        <img src={article.image.web} alt={article.image.alt} width={800} height={800} decoding={`async`} loading={featured ? `eager` : `lazy`} />
        <span id={`blog-card-image-label-${article.slug}`} className={`blog-card__image-label`}>{featured ? `COVER NOTE` : `JOURNAL NOTE`}</span>
        <span className={`blog-card__image-arrow`} aria-hidden={`true`}><ArrowIcon size={27} /></span>
      </div>
      <div id={`blog-card-copy-${article.slug}`} className={`blog-card__copy`}>
        <div className={`blog-card__topline`}>
          <p id={`blog-card-category-${article.slug}`} className={`blog-eyebrow`}>{article.category}</p>
          <span id={`blog-card-number-${article.slug}`} className={`blog-card__number`}>{`N° ${journalNumber(article.number)}`}</span>
        </div>
        <h2 id={`blog-card-title-${article.slug}`} className={`blog-card__title`}>{article.title}</h2>
        <p id={`blog-card-excerpt-${article.slug}`} className={`blog-card__excerpt`}>{article.excerpt}</p>
        <div id={`blog-card-footer-${article.slug}`} className={`blog-card__footer`}>
          <div className={`blog-card__dateline`}>
            <time dateTime={article.publishedAt}>{formatEditorialDate(article.publishedAt)}</time>
            <span>{`${articleReadingMinutes(article)} MIN READ`}</span>
          </div>
          <span className={`blog-card__read`}>{`READ THE NOTE`}<ArrowIcon size={18} /></span>
        </div>
      </div>
    </Link>
  </article>
);

export default BlogCard;
