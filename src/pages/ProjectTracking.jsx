const projects = [
  {
    project: 'Nuvrixa Client Portal Setup',
    status: 'In Progress',
    progress: '45%',
    targetDate: 'To be confirmed'
  }
];

const milestones = [
  { title: 'Discovery and workflow mapping', status: 'Complete' },
  { title: 'Public website foundation', status: 'Complete' },
  { title: 'Authentication and portal shell', status: 'In Progress' },
  { title: 'Live Supabase project data', status: 'Upcoming' }
];

export default function ProjectTracking() {
  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Project Tracking</p>
        <h2>Your project progress.</h2>
        <p>Track the status, progress and milestones linked to your Nuvrixa system build.</p>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px' }}>Project</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Progress</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Target Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((item) => (
              <tr key={item.project}>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{item.project}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{item.status}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{item.progress}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{item.targetDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid services-grid" style={{ marginTop: '20px' }}>
        {milestones.map((milestone) => (
          <article className="card" key={milestone.title}>
            <p className="eyebrow">{milestone.status}</p>
            <h3>{milestone.title}</h3>
          </article>
        ))}
      </div>
    </div>
  );
}
