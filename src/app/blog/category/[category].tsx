import { useLocalSearchParams } from 'expo-router';
import Blog from '../../../features/public/Blog';
import { blogCategories, blogCategorySlug } from '../../../features/public/Blog/data';

export const generateStaticParams = () => blogCategories.map(category => ({ category: blogCategorySlug(category) }));

const BlogCategoryPage = () => {
  const { category } = useLocalSearchParams<{ category: string | string[] }>();
  const categorySlug = Array.isArray(category) ? category[0] ?? `` : category ?? ``;
  return <Blog key={categorySlug} initialCategory={categorySlug} />;
};

export default BlogCategoryPage;
