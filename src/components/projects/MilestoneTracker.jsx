import { useProjects } from '../../hooks/useProjects.js';

function getBadge(status) {
  const value = String(status || '').toLowerCase();
  if (value.includes('complete')) return 'Complete';
  if (value.includes('progress')) return 'In Progress';
  return 'Upcoming';
}

export default function MilestoneTracker() {
  const { milestones, loading, error } = useProjects();

  const total = milestones.length || 1;
  const completed = milestones.filter((item) => getBadge(item.status) === 'Complete').length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="section-head" style={{ marginBottom: '18px' }}>
        <p className="eyebrow">Milestone Tracker</p>
        <h3>Implementation progress</h3>
        <p>Monitor completed, active and upcoming milestones for your project.</p>
      </div>

      {loading && <p>Loading milestones...</p>}
      {error && <p>Showing placeholder milestones until live project records are available.</p>}

      <div style={{ marginBottom: '18px' }}>
        <p><strong>{percentage}% Complete</strong></p>
        <progress value={percentage} max="100" style={{ width: '100%' }} />
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {milestones.map((milestone) => (
          <article className="glass-card card" key={milestone.id || milestone.title}>
            <p className="eyebrow">{getBadge(milestone.status)}</p>
            <h3>{milestone.title}</h3>
            <p>{milestone.description || 'Milestone details will appear here.'}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
