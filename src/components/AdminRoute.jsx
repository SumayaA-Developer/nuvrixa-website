import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return (
      <section className="section">
        <div className="card">
          <p className="eyebrow">Loading</p>
          <h2>Checking admin access...</h2>
          <p>Please wait while Nuvrixa verifies your role permissions.</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="card">
          <div className="icon-pill">
            <ShieldAlert size={23} />
          </div>
          <p className="eyebrow">Login Required</p>
          <h2>Admin access is protected.</h2>
          <p>Please sign in with an authorised Nuvrixa administrator account.</p>
          <a className="primary-btn" href="#login">Go to Login</a>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="section">
        <div className="card">
          <div className="icon-pill">
            <ShieldAlert size={23} />
          </div>
          <p className="eyebrow">Access Denied</p>
          <h2>You do not have admin permission.</h2>
          <p>This area is reserved for authorised Nuvrixa administrators.</p>
        </div>
      </section>
    );
  }

  return children;
}
