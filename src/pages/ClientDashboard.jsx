import { BookOpen, FolderKanban, LifeBuoy, Newspaper } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const cards = [
  { label: 'Active Projects', value: '1', description: 'System builds currently in progress.', icon: FolderKanban },
  { label: 'Open Tickets', value: '0', description: 'Support requests awaiting action.', icon: LifeBuoy },
  { label: 'Recent Updates', value: '3', description: 'Latest project notes and progress updates.', icon: Newspaper },
  { label: 'Knowledge Base Articles', value: '8', description: 'Guides available to help you use your system.', icon: BookOpen }
];

export default function ClientDashboard() {
  const { profile, user } = useAuth();
  const displayName = profile?.full_name || user?.email || 'Nuvrixa Client';

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Dashboard</p>
        <h2>{displayName}</h2>
        <p>View your project summary, support activity and available Nuvrixa resources.</p>
      </div>

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
        <p>Live project tracking, tickets and knowledge base content will connect to Supabase in the next integration batch.</p>
      </div>
    </div>
  );
}
