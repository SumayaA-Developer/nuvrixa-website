import { BookOpen, FolderKanban, LifeBuoy, Newspaper } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useDashboard } from '../hooks/useDashboard.js';

export default function ClientDashboard() {
  const { profile, user } = useAuth();
  const { activeProjects, openTickets, recentUpdates, articleCount, loading, error } = useDashboard();
  const displayName = profile?.full_name || user?.email || 'Nuvrixa Client';

  const cards = [
    { label: 'Active Projects', value: activeProjects, description: 'System builds currently in progress.', icon: FolderKanban },
    { label: 'Open Tickets', value: openTickets, description: 'Support requests awaiting action.', icon: LifeBuoy },
    { label: 'Recent Updates', value: recentUpdates, description: 'Latest project notes and progress updates.', icon: Newspaper },
    { label: 'Knowledge Base Articles', value: articleCount, description: 'Guides available to help you use your system.', icon: BookOpen }
  ];

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Dashboard</p>
        <h2>{displayName}</h2>
        <p>View your project summary, support activity and available Nuvrixa resources.</p>
      </div>

      {loading && <p>Loading dashboard metrics...</p>}
      {error && <p>{error}</p>}

      <div className="grid services-grid">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article className="card" key={card.label}>
              <div className="icon-pill"><Icon size={22} /></div>
              <p className="eyebrow">{card.label}</p>
              <div className="price">{card.value}</div>
              <p>{card.description}</p>
            </article>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Current Focus</h3>
        <p>Your client portal is now connected to live Supabase dashboard metrics.</p>
      </div>
    </div>
  );
}
