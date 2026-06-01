import { useState } from 'react';
import { BrainCircuit, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage({ onLoginSuccess }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Unable to sign in. Please check your details and try again.');
      return;
    }

    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess();
    }
  }

  return (
    <section className="section hero" id="login">
      <div>
        <p className="eyebrow">Client Portal</p>
        <h1>Welcome back to Nuvrixa.</h1>
        <p className="hero-copy">
          Sign in to view your dashboard, project progress, support tickets and knowledge base resources.
        </p>
      </div>

      <form className="card hero-card" onSubmit={handleSubmit}>
        <div className="icon-pill">
          <BrainCircuit size={24} />
        </div>
        <h3>Client Login</h3>
        <p>Use the email and password connected to your Nuvrixa client profile.</p>

        <label>
          Email Address
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            required
          />
        </label>

        {error && <div className="status error">{error}</div>}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'} <LockKeyhole size={17} />
        </button>
      </form>
    </section>
  );
}
