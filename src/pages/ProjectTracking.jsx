import { useProjects } from '../hooks/useProjects.js';
import MilestoneTracker from '../components/projects/MilestoneTracker.jsx';
import ProjectTimeline from '../components/projects/ProjectTimeline.jsx';

function formatDate(value) {
  if (!value) return 'To be confirmed';
  try {
    return new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium' }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function ProjectTracking() {
  const { projects, loading, error } = useProjects();

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Project Tracking</p>
        <h2>Your project progress.</h2>
        <p>Track the status, progress and milestones linked to your Nuvrixa system build.</p>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p>{error}</p>}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px' }}>Project</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Progress</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{project.title || project.name}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{project.status}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{project.progress_percent ?? 0}%</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{formatDate(project.due_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MilestoneTracker />
      <ProjectTimeline />
    </div>
  );
}
