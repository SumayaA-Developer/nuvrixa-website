import { ArrowRight, LayoutDashboard, LockKeyhole, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="section hero">
      <div>
        <p className="eyebrow">AI-powered business systems</p>
        <h1>Build the system your organisation actually needs.</h1>
        <p className="hero-copy">
          Nuvrixa designs intelligent digital systems that bring your operations, client information,
          dashboards, automation, integrations and support workflows into one clear hub.
        </p>

        <div className="hero-actions">
          <a className="primary-btn" href="#consultation">
            Book a Consultation <ArrowRight size={18} />
          </a>
          <a className="secondary-btn" href="#services">Explore Services</a>
        </div>
      </div>

      <aside className="hero-card" aria-label="Nuvrixa system preview">
        <div className="icon-pill">
          <Sparkles size={24} />
        </div>
        <h3>One connected business operating hub</h3>
        <p>
          Replace scattered spreadsheets, WhatsApp threads and manual admin with structured workflows,
          secure client portals and real-time visibility.
        </p>

        <div className="metric-grid">
          <div className="metric">
            <LayoutDashboard size={21} />
            <strong>360°</strong>
            <span>Operational visibility</span>
          </div>
          <div className="metric">
            <LockKeyhole size={21} />
            <strong>Secure</strong>
            <span>Client access flows</span>
          </div>
          <div className="metric">
            <strong>AI</strong>
            <span>Automation-ready workflows</span>
          </div>
          <div className="metric">
            <strong>Live</strong>
            <span>Dashboards and reporting</span>
          </div>
        </div>
      </aside>
    </section>
  );
}
