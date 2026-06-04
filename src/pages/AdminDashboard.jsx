import { Bell, FolderKanban, LifeBuoy, UsersRound } from 'lucide-react';
import { useAdminDashboard } from '../hooks/useAdminDashboard.js';

export default function AdminDashboard() {
  const { totalUsers, activeProjects, openTickets, unreadNotifications, loading, error } = useAdminDashboard();

  const metrics = [
    { label: 'Total Users', value: totalUsers, icon: UsersRound },
    { label: 'Active Projects', value: activeProjects, icon: FolderKanban },
    { label: 'Open Tickets', value: openTickets, icon: LifeBuoy },
    { label: 'Unread Notifications', value: unreadNotifications, icon: Bell }
  ];

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Admin Dashboard</p>
        <h2>Nuvrixa system overview.</h2>
        <p>Monitor users, projects, support activity and notifications from live Supabase data.</p>
      </div>

      {loading && <p>Loading admin metrics...</p>}
      {error && <p>{error}</p>}

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
        <h3>Admin Operations</h3>
        <p>This dashboard is now connected to live Supabase platform metrics.</p>
      </div>
    </div>
  );
}
