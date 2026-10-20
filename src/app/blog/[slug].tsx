import { useLocalSearchParams } from 'expo-router';
import Article from '../../features/public/Blog/Article';
import { getPublishedArticles } from '../../features/public/Blog/service';

export const generateStaticParams = async () => (
  (await getPublishedArticles()).map(article => ({ slug: article.slug }))
);

const ArticlePage = () => {
  const { slug } = useLocalSearchParams<{ slug: string | string[] }>();
  return <Article slug={Array.isArray(slug) ? slug[0] ?? `` : slug ?? ``} />;
};

export default ArticlePage;
