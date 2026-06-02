import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

const fallbackProjects = [
  {
    id: 'fallback-project-1',
    project_name: 'Nuvrixa Client Portal Setup',
    status: 'In Progress',
    progress: 45,
    target_date: 'To be confirmed'
  }
];

const fallbackMilestones = [
  { id: 'fallback-milestone-1', title: 'Discovery and workflow mapping', status: 'Complete' },
  { id: 'fallback-milestone-2', title: 'Public website foundation', status: 'Complete' },
  { id: 'fallback-milestone-3', title: 'Authentication and portal shell', status: 'In Progress' },
  { id: 'fallback-milestone-4', title: 'Live Supabase project data', status: 'Upcoming' }
];

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(fallbackProjects);
  const [milestones, setMilestones] = useState(fallbackMilestones);
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
        .select('id, project_name, project_description, status, start_date, target_date, progress')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      if (projectError || !Array.isArray(projectData) || projectData.length === 0) {
        setProjects(fallbackProjects);
        setMilestones(fallbackMilestones);
        setError(projectError?.message || 'No project records found yet. Showing placeholder data.');
        setLoading(false);
        return;
      }

      setProjects(projectData);

      const projectIds = projectData.map((project) => project.id);
      const { data: milestoneData, error: milestoneError } = await supabase
        .from('project_milestones')
        .select('id, project_id, title, description, status, due_date, completed_at')
        .in('project_id', projectIds)
        .order('due_date', { ascending: true });

      if (!isMounted) return;

      if (milestoneError || !Array.isArray(milestoneData)) {
        setMilestones(fallbackMilestones);
      } else {
        setMilestones(milestoneData);
      }

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
    loading,
    error
  };
}
