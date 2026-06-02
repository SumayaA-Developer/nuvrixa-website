import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

const fallbackProjects = [
  {
    id: 'fallback-project-1',
    title: 'Nuvrixa Client Portal Setup',
    description: 'Production portal setup and Supabase alignment.',
    status: 'planning',
    progress_percent: 45,
    due_date: 'To be confirmed',
    client_visible: true
  }
];

const fallbackMilestones = [
  { id: 'fallback-milestone-1', title: 'Discovery and workflow mapping', status: 'complete', description: 'Initial workflow mapping completed.' },
  { id: 'fallback-milestone-2', title: 'Public website foundation', status: 'complete', description: 'Marketing website foundation completed.' },
  { id: 'fallback-milestone-3', title: 'Authentication and portal shell', status: 'in_progress', description: 'Portal access layer in progress.' },
  { id: 'fallback-milestone-4', title: 'Live Supabase project data', status: 'pending', description: 'Live data connection prepared.' }
];

const fallbackUpdates = [
  {
    id: 'fallback-update-1',
    title: 'Portal shell prepared',
    update_text: 'The client portal structure has been created and is ready for live Supabase data integration.',
    created_at: null
  }
];

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(fallbackProjects);
  const [milestones, setMilestones] = useState(fallbackMilestones);
  const [updates, setUpdates] = useState(fallbackUpdates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('id, client_id, package_id, title, description, status, progress_percent, start_date, due_date, completed_at, client_visible, assigned_to, created_at, updated_at')
        .eq('client_id', user.id)
        .eq('client_visible', true)
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (projectError || !Array.isArray(projectData) || projectData.length === 0) {
        setProjects(fallbackProjects);
        setMilestones(fallbackMilestones);
        setUpdates(fallbackUpdates);
        setError(projectError?.message || 'No project records found yet. Showing placeholder data.');
        setLoading(false);
        return;
      }

      setProjects(projectData);

      const projectIds = projectData.map((project) => project.id);

      const [{ data: milestoneData, error: milestoneError }, { data: updateData, error: updateError }] = await Promise.all([
        supabase
          .from('project_milestones')
          .select('id, project_id, title, description, status, due_date, completed_at, sort_order, client_visible, created_at, updated_at')
          .in('project_id', projectIds)
          .eq('client_visible', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('project_updates')
          .select('id, project_id, title, update_text, created_by, client_visible, created_at')
          .in('project_id', projectIds)
          .eq('client_visible', true)
          .order('created_at', { ascending: false })
      ]);

      if (!isMounted) return;

      setMilestones(milestoneError || !Array.isArray(milestoneData) ? fallbackMilestones : milestoneData);
      setUpdates(updateError || !Array.isArray(updateData) ? fallbackUpdates : updateData);
      setLoading(false);
    }

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return {
    projects,
    milestones,
    updates,
    loading,
    error
  };
}
