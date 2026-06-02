import { Activity, FolderKanban, LifeBuoy, UsersRound } from 'lucide-react';

const metrics = [
  { label: 'Active Users', value: '12', icon: UsersRound },
  { label: 'Open Tickets', value: '4', icon: LifeBuoy },
  { label: 'Active Projects', value: '6', icon: FolderKanban },
  { label: 'Recent Admin Actions', value: '9', icon: Activity }
];

const recentActions = [
  { action: 'User role reviewed', actor: 'Admin', time: 'Pending live data' },
  { action: 'Ticket status updated', actor: 'Admin', time: 'Pending live data' },
  { action: 'Knowledge base article prepared', actor: 'Admin', time: 'Pending live data' }
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Admin Dashboard</p>
        <h2>Nuvrixa system overview.</h2>
        <p>Monitor users, projects, support activity and recent governance actions.</p>
      </div>

      <div className="grid services-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className="card" key={metric.label}>
              <div className="icon-pill"><Icon size={22} /></div>
              <p className="eyebrow">{metric.label}</p>
              <div className="price">{metric.value}</div>
            </article>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Recent Admin Actions</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {recentActions.map((item) => (
            <article className="glass-card card" key={item.action}>
              <p className="eyebrow">{item.actor}</p>
              <h3>{item.action}</h3>
              <p>{item.time}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
