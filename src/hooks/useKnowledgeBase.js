import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const fallbackCategories = [
  { id: 'fallback-category-1', name: 'Getting Started', slug: 'getting-started', sort_order: 1 },
  { id: 'fallback-category-2', name: 'Client Portal', slug: 'client-portal', sort_order: 2 },
  { id: 'fallback-category-3', name: 'Project Tracking', slug: 'project-tracking', sort_order: 3 },
  { id: 'fallback-category-4', name: 'Support', slug: 'support', sort_order: 4 }
];

const fallbackArticles = [
  {
    id: 'fallback-article-1',
    category_id: 'fallback-category-1',
    category_name: 'Getting Started',
    title: 'How to use your Nuvrixa client portal',
    slug: 'how-to-use-your-nuvrixa-client-portal',
    last_updated: 'Coming soon'
  },
  {
    id: 'fallback-article-2',
    category_id: 'fallback-category-3',
    category_name: 'Project Tracking',
    title: 'Understanding project milestones and updates',
    slug: 'understanding-project-milestones-and-updates',
    last_updated: 'Coming soon'
  },
  {
    id: 'fallback-article-3',
    category_id: 'fallback-category-4',
    category_name: 'Support',
    title: 'How to submit and track a support ticket',
    slug: 'how-to-submit-and-track-a-support-ticket',
    last_updated: 'Coming soon'
  }
];

function attachCategoryNames(articles, categories) {
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));

  return articles.map((article) => ({
    ...article,
    category_name: article.category_name || categoryMap.get(article.category_id) || 'Knowledge Base',
    last_updated: article.updated_at || article.created_at || article.last_updated || 'Coming soon'
  }));
}

export function useKnowledgeBase() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [articles, setArticles] = useState(fallbackArticles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadKnowledgeBase() {
      setLoading(true);
      setError(null);

      const { data: categoryData, error: categoryError } = await supabase
        .from('knowledge_base_categories')
        .select('id, name, slug, sort_order')
        .order('sort_order', { ascending: true });

      if (!isMounted) return;

      if (categoryError || !Array.isArray(categoryData) || categoryData.length === 0) {
        setCategories(fallbackCategories);
        setArticles(fallbackArticles);
        setError(categoryError?.message || 'No knowledge base categories found. Showing placeholder data.');
        setLoading(false);
        return;
      }

      const { data: articleData, error: articleError } = await supabase
        .from('knowledge_base_articles')
        .select('id, category_id, title, slug, content, is_published, created_at, updated_at')
        .eq('is_published', true)
        .order('updated_at', { ascending: false });

      if (!isMounted) return;

      setCategories(categoryData);

      if (articleError || !Array.isArray(articleData) || articleData.length === 0) {
        setArticles(fallbackArticles);
        setError(articleError?.message || 'No published articles found. Showing placeholder data.');
      } else {
        setArticles(attachCategoryNames(articleData, categoryData));
      }

      setLoading(false);
    }

    loadKnowledgeBase();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    categories,
    articles,
    loading,
    error
  };
}
