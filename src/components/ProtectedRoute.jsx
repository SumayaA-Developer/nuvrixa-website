import { LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, fallback }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="section">
        <div className="card">
          <p className="eyebrow">Loading</p>
          <h2>Checking your session...</h2>
          <p>Please wait while Nuvrixa verifies your portal access.</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return fallback || (
      <section className="section">
        <div className="card">
          <div className="icon-pill">
            <LockKeyhole size={23} />
          </div>
          <p className="eyebrow">Login Required</p>
          <h2>Client portal access is protected.</h2>
          <p>Please sign in with your Nuvrixa client account to view this area.</p>
          <a className="primary-btn" href="#login">Go to Login</a>
        </div>
      </section>
    );
  }

  return children;
}
