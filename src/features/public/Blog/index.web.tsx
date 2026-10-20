import './styles.css';
import { Link } from 'expo-router';
import Head from 'expo-router/head';
import { useContext } from 'react';
import { useBlog } from './useBlog';
import BlogCard from './BlogCard.web';
import { journalNumber, journalPresentation } from './presentation';
import { ArrowIcon } from '../../../components/Icons.web';
import SplitText from '../../../components/motion/SplitText.web';
import { PageIntroContext } from '../../../components/motion/PageIntroContext';
import { blogCategories, blogCategorySlug, formatEditorialDate, resolveBlogCategory } from './data';

const Blog = ({ initialCategory }: { initialCategory?: string }) => {
  const introReady = useContext(PageIntroContext);
  const routeCategory = resolveBlogCategory(initialCategory);
  const { query, error, loading, category, articles, filtered, setQuery, setCategory, clearFilters } = useBlog(initialCategory);
  const presentation = journalPresentation[category ?? `All`];
  const categorySlug = category && category !== `All` ? blogCategorySlug(category) : `all`;
  const latestDate = articles[0]?.publishedAt;

  return <div id={`blog-page`} className={`blog-page blog-index`} data-category={categorySlug}>
    <Head>
      <title>{`${routeCategory && routeCategory !== `All` ? `${routeCategory} | ` : ``}The Journal | Kalashi Music`}</title>
      <meta name={`description`} content={`Listening guides, artist-world notes and practical Sound Lab tips from the Kalashi site editorial.`} />
      {routeCategory === null ? <meta name={`robots`} content={`noindex, follow`} /> : null}
    </Head>
    <header data-page-hero id={`blog-page-hero`} className={`blog-hero`}>
      <div id={`blog-issue-rail`} className={`blog-issue-rail`}>
        <p className={`blog-eyebrow`}>{`KALASHI / THE JOURNAL`}</p>
        <span className={`blog-issue-rail__edition`}>{`WORDS. MUSIC. EVERYTHING BETWEEN.`}</span>
        <span className={`blog-issue-rail__count`}>{`${journalNumber(articles.length)} NOTES / ${journalNumber(blogCategories.length)} CHANNELS`}</span>
      </div>
      <h1 id={`blog-page-title`} className={`blog-masthead`}>
        <SplitText by={`characters`} ready={introReady} text={presentation.title} />
        <span className={`blog-masthead__stop`} aria-hidden={`true`}>{`.`}</span>
      </h1>
      <div id={`blog-page-introduction`} className={`blog-hero__introduction`}>
        <div className={`blog-hero__caption`}>
          <span className={`blog-hero__asterisk`} aria-hidden={`true`}>{`✳`}</span>
          <p id={`blog-page-eyebrow`} className={`blog-eyebrow`}>{presentation.label}</p>
        </div>
        <p className={`blog-hero__description`}>{presentation.description}</p>
        <div className={`blog-hero__edition`}>
          <span>{`SITE EDITORIAL`}</span>
          {latestDate ? <time dateTime={latestDate}>{formatEditorialDate(latestDate)}</time> : null}
          {category && category !== `All` ? <Link
            id={`blog-category-permalink`}
            className={`blog-category-permalink`}
            href={{ pathname: `/blog/category/[category]`, params: { category: blogCategorySlug(category) } }}
          >{`Category page`}<ArrowIcon size={15} /></Link> : null}
        </div>
      </div>
    </header>
    <section id={`blog-library`} className={`blog-library`} aria-labelledby={`blog-library-title`}>
      <div id={`blog-library-heading`} className={`blog-section-heading`}>
        <h2 id={`blog-library-title`} className={`blog-eyebrow`}>{`THE READING ROOM`}</h2>
        <span id={`blog-library-coverage`} className={`blog-coverage`}>{loading ? `TUNING IN` : `${journalNumber(articles.length)} PUBLISHED NOTES / OPEN TO EVERYONE`}</span>
      </div>
      <div id={`blog-library-controls`} className={`blog-controls`}>
        <div id={`blog-categories`} className={`blog-categories`} role={`group`} aria-label={`Filter journal by category`}>
          {([`All`, ...blogCategories] as const).map((item, index) => <button
            key={item}
            type={`button`}
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            data-category={item === `All` ? `all` : blogCategorySlug(item)}
            id={`blog-category-${item.toLowerCase().replace(/\s+/gu, `-`)}`}
            className={`blog-category${category === item ? ` is-active` : ``}`}
          ><span className={`blog-category__index`}>{journalNumber(index)}</span>{item}<span className={`blog-category__count`}>{item === `All` ? articles.length : articles.filter(article => article.category === item).length}</span></button>)}
        </div>
        <label id={`blog-search-label`} className={`blog-search`} htmlFor={`blog-search`}>
          <span className={`blog-search__label`}>{`Search journal titles and summaries`}</span>
          <svg id={`blog-search-icon`} width={18} height={18} viewBox={`0 0 24 24`} fill={`none`} aria-hidden={`true`}>
            <circle cx={10.5} cy={10.5} r={6.5} stroke={`currentColor`} strokeWidth={1.5} />
            <path d={`m16 16 5 5`} stroke={`currentColor`} strokeWidth={1.5} />
          </svg>
          <input id={`blog-search`} className={`blog-search__input`} value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search the notes`} type={`search`} maxLength={180} />
        </label>
      </div>
      {loading ? <div id={`blog-loading`} className={`blog-loading`} role={`status`}>{`Tuning into the journal…`}</div> : error ? <p id={`blog-error`} className={`blog-empty`} role={`alert`}>{error}</p> : filtered.length ? <>
        <div className={`blog-results-rail`}>
          <p id={`blog-results-count`} className={`blog-results-count`} role={`status`}>{`${journalNumber(filtered.length)} note${filtered.length === 1 ? `` : `s`}${category !== `All` ? ` in ${category}` : ` in the collection`}${query.trim() ? ` matching “${query.trim()}”` : ``}`}</p>
          <span aria-hidden={`true`}>{`SCROLL TO EXPLORE ↓`}</span>
        </div>
        <div id={`blog-article-grid`} className={`blog-grid`}>{filtered.map((article, index) => <BlogCard key={article.id} article={article} featured={index === 0} />)}</div>
        <div id={`blog-library-end`} className={`blog-library-end`}>
          <span className={`blog-library-end__mark`} aria-hidden={`true`}>{`K.`}</span>
          <p>{`A different route. The same signal.`}<span>{`The music is always a good place to go next.`}</span></p>
          <Link id={`blog-library-music`} href={`/music`} className={`blog-end-link`}>{`BACK TO THE MUSIC`}<ArrowIcon size={22} /></Link>
        </div>
      </> : <div id={`blog-empty`} className={`blog-empty`} role={`status`}>
        <p className={`blog-eyebrow`}>{`NO SIGNAL / TRY ANOTHER CHANNEL`}</p>
        <h3 id={`blog-empty-title`}>{category === null ? `That category isn't here.` : `No notes on that frequency.`}</h3>
        <p>{category === null ? `Choose a category above or explore all the journal notes.` : `Try another word or explore all the journal notes.`}</p>
        <button id={`blog-clear-filters`} type={`button`} className={`blog-action`} onClick={clearFilters}>{`↺ Clear filters`}</button>
      </div>}
    </section>
  </div>;
};

export default Blog;
