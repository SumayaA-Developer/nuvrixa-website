import { Clock3 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects.js';

const fallbackUpdates = [
  {
    id: 'fallback-update-1',
    title: 'Portal shell prepared',
    content: 'The client portal structure has been created and is ready for live Supabase data integration.',
    created_at: null
  },
  {
    id: 'fallback-update-2',
    title: 'Authentication layer added',
    content: 'Supabase Auth, protected routes and role-based access have been prepared.',
    created_at: null
  }
];

function formatDate(value) {
  if (!value) return 'Timeline update';
  try {
    return new Intl.DateTimeFormat('en-ZA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function ProjectTimeline({ updates = fallbackUpdates }) {
  const { loading, error } = useProjects();
  const timelineItems = Array.isArray(updates) && updates.length > 0 ? updates : fallbackUpdates;

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="section-head" style={{ marginBottom: '18px' }}>
        <p className="eyebrow">Project Timeline</p>
        <h3>Recent project updates</h3>
        <p>Follow key updates and implementation notes as your Nuvrixa system progresses.</p>
      </div>

      {loading && <p>Loading project timeline...</p>}
      {error && <p>Showing placeholder timeline updates until live project updates are available.</p>}

      <div style={{ display: 'grid', gap: '14px' }}>
        {timelineItems.map((update) => (
          <article className="glass-card card" key={update.id || update.title}>
            <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock3 size={15} /> {formatDate(update.created_at)}
            </p>
            <h3>{update.title}</h3>
            <p>{update.content || update.description || 'No description added yet.'}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
