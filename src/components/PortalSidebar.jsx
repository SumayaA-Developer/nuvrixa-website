import { BookOpen, FolderKanban, LayoutDashboard, LifeBuoy, LogOut } from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Project Tracking', icon: FolderKanban },
  { id: 'tickets', label: 'Ticket System', icon: LifeBuoy },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen }
];

export default function PortalSidebar({ activeView = 'dashboard', onNavigate, onSignOut }) {
  return (
    <aside className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <p className="eyebrow">Nuvrixa Portal</p>
        <h3>Client Workspace</h3>
        <p>Manage your project visibility, requests and resources.</p>
      </div>

      <nav style={{ display: 'grid', gap: '10px' }} aria-label="Client portal navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={isActive ? 'primary-btn' : 'secondary-btn'}
              style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px' }}
              onClick={() => onNavigate?.(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="secondary-btn"
        style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}
        onClick={onSignOut}
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
