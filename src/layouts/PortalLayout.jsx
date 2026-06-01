import PortalSidebar from '../components/PortalSidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function PortalLayout({ activeView, onNavigate, children }) {
  const { profile, user, signOut } = useAuth();
  const displayName = profile?.full_name || user?.email || 'Nuvrixa Client';

  return (
    <div className="app-shell">
      <div className="section" style={{ paddingTop: '34px' }}>
        <div className="form-wrap" style={{ alignItems: 'stretch' }}>
          <PortalSidebar activeView={activeView} onNavigate={onNavigate} onSignOut={signOut} />

          <main className="card" style={{ minHeight: '72vh' }}>
            <div className="section-head" style={{ marginBottom: '24px' }}>
              <p className="eyebrow">Client Portal</p>
              <h2>Welcome, {displayName}</h2>
              <p>Track your Nuvrixa system build, support requests, updates and knowledge base resources.</p>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
