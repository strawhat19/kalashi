import { useEffect, useState } from 'react';
import type { BlogArticle, BlogCategory } from './data';
import { resolveBlogCategory } from './data';
import { getArticleSnapshot, getPublishedSnapshot, getPublishedArticle, getPublishedArticles } from './service';

export const useBlog = (initialCategory?: string) => {
  const [query, setQuery] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<BlogCategory | `All` | null>(() => resolveBlogCategory(initialCategory));
  const [articles, setArticles] = useState<readonly BlogArticle[]>(getPublishedSnapshot);

  useEffect(() => {
    let current = true;
    void getPublishedArticles().then(records => {
      if (current) setArticles(records);
    }).catch(() => {
      if (current) setError(`The journal could not load. Please try again later.`);
    }).finally(() => {
      if (current) setLoading(false);
    });
    return () => { current = false; };
  }, []);

  const search = query.trim().toLocaleLowerCase();
  const filtered = articles.filter(article => (
    (category === `All` || article.category === category)
    && (!search || `${article.title} ${article.excerpt} ${article.category}`.toLocaleLowerCase().includes(search))
  ));
  const clearFilters = () => { setQuery(``); setCategory(`All`); };

  return { query, error, loading, category, articles, filtered, setQuery, setCategory, clearFilters };
};

export const useArticle = (slug: string) => {
  const [resolved, setResolved] = useState<{ slug: string; error: string; article: BlogArticle | null }>(() => ({ slug, error: ``, article: getArticleSnapshot(slug) }));

  useEffect(() => {
    let current = true;
    void getPublishedArticle(slug).then(article => {
      if (current) setResolved({ slug, article, error: `` });
    }).catch(() => {
      if (current) setResolved({ slug, article: null, error: `This journal note could not load. Please try again later.` });
    });
    return () => { current = false; };
  }, [slug]);

  return {
    loading: resolved.slug !== slug,
    error: resolved.slug === slug ? resolved.error : ``,
    article: resolved.slug === slug ? resolved.article : null,
  };
};
