import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

const fallbackMetrics = {
  activeProjects: 1,
  openTickets: 0,
  recentUpdates: 3,
  articleCount: 8
};

export function useDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      const [projectsResult, ticketsResult, articlesResult, updatesResult] = await Promise.all([
        supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', user.id)
          .neq('status', 'Complete'),
        supabase
          .from('tickets')
          .select('id', { count: 'exact', head: true })
          .eq('client_id', user.id)
          .neq('status', 'Closed'),
        supabase
          .from('knowledge_base_articles')
          .select('id', { count: 'exact', head: true })
          .eq('is_published', true),
        supabase
          .from('project_updates')
          .select('id, projects!inner(client_id)', { count: 'exact', head: true })
          .eq('projects.client_id', user.id)
      ]);

      if (!isMounted) return;

      const firstError = projectsResult.error || ticketsResult.error || articlesResult.error || updatesResult.error;

      if (firstError) {
        setMetrics(fallbackMetrics);
        setError(firstError.message || 'Dashboard metrics could not be loaded. Showing placeholder data.');
        setLoading(false);
        return;
      }

      setMetrics({
        activeProjects: projectsResult.count ?? fallbackMetrics.activeProjects,
        openTickets: ticketsResult.count ?? fallbackMetrics.openTickets,
        recentUpdates: updatesResult.count ?? fallbackMetrics.recentUpdates,
        articleCount: articlesResult.count ?? fallbackMetrics.articleCount
      });
      setLoading(false);
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return {
    activeProjects: metrics.activeProjects,
    openTickets: metrics.openTickets,
    recentUpdates: metrics.recentUpdates,
    articleCount: metrics.articleCount,
    loading,
    error
  };
}
