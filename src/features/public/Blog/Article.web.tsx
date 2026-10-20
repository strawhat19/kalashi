import './styles.css';
import { Link } from 'expo-router';
import Head from 'expo-router/head';
import { useArticle } from './useBlog';
import BlogCard from './BlogCard.web';
import type { BlogArticle } from './data';
import { journalNumber } from './presentation';
import { useContext, useEffect, useState } from 'react';
import { ArrowIcon } from '../../../components/Icons.web';
import SplitText from '../../../components/motion/SplitText.web';
import { getPublishedArticles, getPublishedSnapshot } from './service';
import { PageIntroContext } from '../../../components/motion/PageIntroContext';
import { scrollToAnchor } from '../../../components/motion/scrollToAnchor.web';
import { blogCategorySlug, articleReadingMinutes, formatEditorialDate } from './data';

const Article = ({ slug }: { slug: string }) => {
  const introReady = useContext(PageIntroContext);
  const { article, error, loading } = useArticle(slug);
  const [published, setPublished] = useState<readonly BlogArticle[]>(getPublishedSnapshot);

  useEffect(() => {
    let current = true;
    void getPublishedArticles().then(records => { if (current) setPublished(records); }).catch(() => undefined);
    return () => { current = false; };
  }, []);

  if (loading) return <div id={`blog-article-loading`} className={`blog-page blog-loading`} role={`status`}>{`Tuning into the journal…`}</div>;
  if (!article) return <div id={`blog-article-unavailable`} className={`blog-page blog-empty`}>
    <Head><title>{`Note Not Found | Kalashi Music`}</title><meta name={`robots`} content={`noindex, follow`} /></Head>
    <p className={`blog-eyebrow`}>{`JOURNAL / SIGNAL NOT FOUND`}</p>
    <h1 id={`blog-article-unavailable-title`}>{error ? `The signal was interrupted.` : `That note isn't here.`}</h1>
    <p role={error ? `alert` : undefined}>{error || `This address does not match a published journal note.`}</p>
    <Link id={`blog-article-back`} href={`/blog`} className={`blog-action`}>{`← Back to the journal`}</Link>
  </div>;

  const related = article.relatedSlugs.flatMap(relatedSlug => {
    const match = published.find(item => item.slug === relatedSlug && item.id !== article.id);
    return match ? [match] : [];
  });

  return <article
    onClick={scrollToAnchor}
    id={`blog-article-${article.slug}`}
    className={`blog-page blog-article`}
    data-category={blogCategorySlug(article.category)}
  >
    <Head>
      <title>{`${article.title} | Kalashi Journal`}</title>
      <meta name={`description`} content={article.excerpt} />
      <meta property={`og:title`} content={article.title} />
      <meta property={`og:type`} content={`article`} />
      <meta property={`og:description`} content={article.excerpt} />
      <meta property={`article:published_time`} content={`${article.publishedAt}T12:00:00Z`} />
    </Head>
    <header data-page-hero id={`blog-article-hero-${article.slug}`} className={`blog-article__hero`}>
      <div className={`blog-issue-rail`}>
        <Link id={`blog-article-breadcrumb-${article.slug}`} href={`/blog`} className={`blog-back`}>{`← THE JOURNAL`}</Link>
        <Link id={`blog-article-category-${article.slug}`} className={`blog-article__category-link`} href={{ pathname: `/blog/category/[category]`, params: { category: blogCategorySlug(article.category) } }}>{article.category}<ArrowIcon size={14} /></Link>
        <span className={`blog-issue-rail__count`}>{`NOTE ${journalNumber(article.number)} / ${articleReadingMinutes(article)} MIN READ`}</span>
      </div>
      <div className={`blog-article__headline`}>
        <h1 id={`blog-article-title-${article.slug}`} className={`blog-article__title`}><SplitText ready={introReady} text={article.title.toUpperCase()} /></h1>
        <span className={`blog-article__folio`} aria-hidden={`true`}>{journalNumber(article.number)}</span>
      </div>
      <div className={`blog-article__deck`}>
        <p className={`blog-eyebrow`}>{`A NOTE FROM OUR WORLD`}</p>
        <p id={`blog-article-excerpt-${article.slug}`} className={`blog-article__excerpt`}>{article.excerpt}</p>
      </div>
    </header>
    <div id={`blog-article-cover-${article.slug}`} className={`blog-article__cover`}>
      <figure id={`blog-article-image-${article.slug}`} className={`blog-article__image`}>
        <img src={article.image.web} alt={article.image.alt} width={1200} height={900} decoding={`async`} />
        <figcaption><span>{article.image.alt}</span><span aria-hidden={`true`}>{`FIG. ${journalNumber(article.number)}`}</span></figcaption>
      </figure>
      <div id={`blog-article-meta-${article.slug}`} className={`blog-article__cover-meta`}>
        <span className={`blog-article__cover-mark`} aria-hidden={`true`}>{`✳`}</span>
        <div className={`blog-article__credit`}><span>{`WORDS`}</span><p>{article.author}</p></div>
        <div className={`blog-article__credit`}><span>{`PUBLISHED`}</span><time dateTime={article.publishedAt}>{formatEditorialDate(article.publishedAt)}</time></div>
        <div className={`blog-article__credit`}><span>{`READING TIME`}</span><p>{`${articleReadingMinutes(article)} minutes / ${journalNumber(article.sections.length)} chapters`}</p></div>
        <a id={`blog-article-start-${article.slug}`} href={`#blog-article-section-${article.slug}-0`} className={`blog-article__start`}>{`START READING`}<span aria-hidden={`true`}>{`↓`}</span></a>
      </div>
    </div>
    <div id={`blog-article-content-${article.slug}`} className={`blog-article__layout`}>
      <aside id={`blog-article-side-${article.slug}`} className={`blog-article__aside`}>
        <nav id={`blog-article-index-${article.slug}`} className={`blog-reading-index`} aria-label={`Chapters in this note`}>
          <p className={`blog-eyebrow`}>{`INSIDE THIS NOTE`}</p>
          <ol>{article.sections.map((section, index) => <li key={section.heading}>
            <a id={`blog-article-index-link-${article.slug}-${index}`} href={`#blog-article-section-${article.slug}-${index}`}><span>{journalNumber(index + 1)}</span>{section.heading}</a>
          </li>)}</ol>
          <a id={`blog-article-index-sources-${article.slug}`} className={`blog-reading-index__sources`} href={`#blog-article-sources-${article.slug}`}>{`Sources & destinations`}<ArrowIcon size={14} /></a>
        </nav>
        <div className={`blog-article__explore`}>
          <p className={`blog-eyebrow`}>{`FOLLOW THE SIGNAL`}</p>
          <Link id={`blog-article-music-${article.slug}`} href={`/music`} className={`blog-side-link`}>{`The Music`}<ArrowIcon size={17} /></Link>
          <Link id={`blog-article-lab-${article.slug}`} href={`/sound-lab`} className={`blog-side-link`}>{`Sound Lab`}<ArrowIcon size={17} /></Link>
        </div>
      </aside>
      <div id={`blog-article-body-${article.slug}`} className={`blog-article__body`}>
        {article.sections.map((section, sectionIndex) => <section key={section.heading} id={`blog-article-section-${article.slug}-${sectionIndex}`} className={`blog-article__section`} aria-labelledby={`blog-article-heading-${article.slug}-${sectionIndex}`}>
          <div className={`blog-article__chapter-heading`}>
            <span className={`blog-article__chapter-number`} aria-hidden={`true`}>{journalNumber(sectionIndex + 1)}</span>
            <h2 id={`blog-article-heading-${article.slug}-${sectionIndex}`}>{section.heading}</h2>
          </div>
          {section.paragraphs.map((paragraph, index) => <p key={index} id={`blog-article-paragraph-${article.slug}-${sectionIndex}-${index}`}>{paragraph}</p>)}
        </section>)}
        <div className={`blog-article__end-mark`} aria-hidden={`true`}><span>{`END OF NOTE`}</span><span>{`K.`}</span></div>
        <section id={`blog-article-sources-${article.slug}`} className={`blog-sources`} aria-labelledby={`blog-article-sources-title-${article.slug}`}>
          <p className={`blog-eyebrow`}>{`THE FOOTNOTES`}</p>
          <h2 id={`blog-article-sources-title-${article.slug}`}>{`Sources & destinations`}</h2>
          <p>{`Artist and catalog destinations are credited below. Listening suggestions are editorial opinion; feature descriptions reflect this site's current controls.`}</p>
          <ol>{article.sources.map((source, index) => <li key={source.href} id={`blog-source-${article.slug}-${index}`}>
            <span className={`blog-source-number`} aria-hidden={`true`}>{journalNumber(index + 1)}</span>
            <div>
              {source.href.startsWith(`/`) ? <Link href={source.href} id={`blog-source-link-${article.slug}-${index}`} className={`blog-source-link`}>{source.title}<ArrowIcon size={15} /></Link> : <a href={source.href} id={`blog-source-link-${article.slug}-${index}`} className={`blog-source-link`} target={`_blank`} rel={`noopener noreferrer`}>{source.title}<ArrowIcon size={15} /></a>}
              <small>{`${source.credit} · Reviewed ${formatEditorialDate(source.reviewedAt)}`}</small>
            </div>
          </li>)}</ol>
        </section>
      </div>
    </div>
    {related.length ? <section id={`blog-article-related-${article.slug}`} className={`blog-related`} aria-labelledby={`blog-article-related-title-${article.slug}`}>
      <div className={`blog-section-heading`}>
        <div><p className={`blog-eyebrow`}>{`THE NEXT FREQUENCY`}</p><h2 id={`blog-article-related-title-${article.slug}`} className={`blog-related__title`}>{`KEEP READING.`}</h2></div>
        <Link id={`blog-article-all-notes-${article.slug}`} href={`/blog`} className={`blog-end-link`}>{`ALL NOTES`}<ArrowIcon size={20} /></Link>
      </div>
      <div className={`blog-grid blog-grid--related`}>{related.map(item => <BlogCard key={item.id} article={item} />)}</div>
    </section> : null}
  </article>;
};

export default Article;
