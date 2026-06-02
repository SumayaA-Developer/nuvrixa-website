import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const fallbackCategories = [
  { id: 'fallback-category-1', name: 'Getting Started', slug: 'getting-started', description: 'Start using your Nuvrixa portal.', sort_order: 1, is_active: true },
  { id: 'fallback-category-2', name: 'Client Portal', slug: 'client-portal', description: 'Portal guidance and support.', sort_order: 2, is_active: true },
  { id: 'fallback-category-3', name: 'Project Tracking', slug: 'project-tracking', description: 'Understand project updates and milestones.', sort_order: 3, is_active: true },
  { id: 'fallback-category-4', name: 'Support', slug: 'support', description: 'Support ticket guidance.', sort_order: 4, is_active: true }
];

const fallbackArticles = [
  {
    id: 'fallback-article-1',
    category: 'Getting Started',
    title: 'How to use your Nuvrixa client portal',
    slug: 'how-to-use-your-nuvrixa-client-portal',
    summary: 'A quick guide to your client workspace.',
    content: 'Your portal resources will appear here once live content is published.',
    last_updated: 'Coming soon'
  },
  {
    id: 'fallback-article-2',
    category: 'Project Tracking',
    title: 'Understanding project milestones and updates',
    slug: 'understanding-project-milestones-and-updates',
    summary: 'Learn how milestones and updates are displayed.',
    content: 'Project guidance will appear here once live content is published.',
    last_updated: 'Coming soon'
  },
  {
    id: 'fallback-article-3',
    category: 'Support',
    title: 'How to submit and track a support ticket',
    slug: 'how-to-submit-and-track-a-support-ticket',
    summary: 'Use support tickets to request help.',
    content: 'Support guidance will appear here once live content is published.',
    last_updated: 'Coming soon'
  }
];

function normaliseArticles(articles) {
  return articles.map((article) => ({
    ...article,
    category_name: article.category || 'Knowledge Base',
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
        .from('knowledge_categories')
        .select('id, name, slug, description, sort_order, is_active, created_at, updated_at')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!isMounted) return;

      if (categoryError || !Array.isArray(categoryData) || categoryData.length === 0) {
        setCategories(fallbackCategories);
        setArticles(fallbackArticles);
        setError(categoryError?.message || 'No knowledge categories found. Showing placeholder data.');
        setLoading(false);
        return;
      }

      const { data: articleData, error: articleError } = await supabase
        .from('knowledge_base_articles')
        .select('id, title, slug, category, summary, content, is_published, client_visible, created_at, updated_at')
        .eq('is_published', true)
        .eq('client_visible', true)
        .order('updated_at', { ascending: false });

      if (!isMounted) return;

      setCategories(categoryData);

      if (articleError || !Array.isArray(articleData) || articleData.length === 0) {
        setArticles(fallbackArticles);
        setError(articleError?.message || 'No published articles found. Showing placeholder data.');
      } else {
        setArticles(normaliseArticles(articleData));
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
