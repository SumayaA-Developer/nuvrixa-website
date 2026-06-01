import { BrainCircuit } from 'lucide-react';

export default function Navbar() {
  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Packages', href: '#packages' },
    { label: 'Book Consultation', href: '#consultation' }
  ];

  return (
    <header className="navbar">
      <div className="nav-inner">
        <a className="brand" href="#home" aria-label="Nuvrixa home">
          <span className="brand-mark">
            <BrainCircuit size={24} />
          </span>
          <span>
            Nuvrixa
            <small>AI Business Systems</small>
          </span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <a className="nav-cta" href="#consultation">Start Project</a>
      </div>
    </header>
  );
}
