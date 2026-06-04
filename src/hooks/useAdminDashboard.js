import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const fallbackMetrics = {
  totalUsers: 0,
  activeProjects: 0,
  openTickets: 0,
  unreadNotifications: 0
};

export function useAdminDashboard() {
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadMetrics() {
      setLoading(true);
      setError(null);

      const [usersResult, projectsResult, ticketsResult, notificationsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }).not('status', 'in', '(completed,cancelled,archived)'),
        supabase.from('tickets').select('id', { count: 'exact', head: true }).not('status', 'in', '(resolved,closed)'),
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('is_read', false)
      ]);

      if (!mounted) return;

      const firstError = usersResult.error || projectsResult.error || ticketsResult.error || notificationsResult.error;

      if (firstError) {
        setMetrics(fallbackMetrics);
        setError(firstError.message || 'Admin dashboard metrics could not be loaded.');
        setLoading(false);
        return;
      }

      setMetrics({
        totalUsers: usersResult.count ?? 0,
        activeProjects: projectsResult.count ?? 0,
        openTickets: ticketsResult.count ?? 0,
        unreadNotifications: notificationsResult.count ?? 0
      });

      setLoading(false);
    }

    loadMetrics();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    totalUsers: metrics.totalUsers,
    activeProjects: metrics.activeProjects,
    openTickets: metrics.openTickets,
    unreadNotifications: metrics.unreadNotifications,
    loading,
    error
  };
}
