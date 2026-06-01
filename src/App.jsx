import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Packages from './components/Packages.jsx';
import ConsultationForm from './components/ConsultationForm.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Packages />
        <ConsultationForm />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>Nuvrixa</strong>
            <p>AI-powered business systems, automation, integrations, dashboards and client portals.</p>
          </div>
          <div>
            <p>Built for modern organisations that need clarity, structure and intelligent workflows.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
