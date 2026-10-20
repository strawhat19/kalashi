import { blogArticles, type BlogArticle } from './data';

export const getPublishedSnapshot = (): readonly BlogArticle[] => (
  blogArticles.filter(article => article.status === `published`)
);

export const getArticleSnapshot = (slug: string): BlogArticle | null => (
  getPublishedSnapshot().find(article => article.slug === slug) ?? null
);

// Static editorial publishing is deliberate; this facade does not imply a CMS.
export const getPublishedArticles = async (): Promise<readonly BlogArticle[]> => getPublishedSnapshot();

export const getPublishedArticle = async (slug: string): Promise<BlogArticle | null> => getArticleSnapshot(slug);
