import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const fallbackPackages = [
  {
    name: 'AI Starter',
    slug: 'ai-starter',
    positioning: 'For small businesses that need their first organised digital system.',
    description: 'A focused setup for capturing leads, organising client information and reducing manual admin.',
    setup_price_min: null,
    setup_price_max: null,
    monthly_price_min: null,
    monthly_price_max: null,
    display_price: false,
    cta_text: 'Book Consultation',
    features: ['Lead capture flow', 'Basic client database', 'Simple automation map', 'Starter dashboard']
  },
  {
    name: 'AI Growth',
    slug: 'ai-growth',
    positioning: 'For growing teams ready to centralise work and improve visibility.',
    description: 'A stronger operating system with automations, tracking views and cleaner internal workflows.',
    setup_price_min: null,
    setup_price_max: null,
    monthly_price_min: null,
    monthly_price_max: null,
    display_price: false,
    cta_text: 'Book Consultation',
    features: ['Workflow automation', 'Team dashboard', 'Client tracking', 'Consultation pipeline']
  },
  {
    name: 'AI Pro',
    slug: 'ai-pro',
    positioning: 'For established organisations that need dashboards, portals and deeper automation.',
    description: 'A complete digital operating layer for projects, tickets, reporting and client communication.',
    setup_price_min: null,
    setup_price_max: null,
    monthly_price_min: null,
    monthly_price_max: null,
    display_price: false,
    cta_text: 'Book Consultation',
    features: ['Client portal', 'Project tracking', 'Ticket system', 'Advanced dashboards', 'Automation workflows']
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    positioning: 'For organisations that need custom infrastructure and long-term system support.',
    description: 'A tailored transformation package for complex teams, departments and multi-step operations.',
    setup_price_min: null,
    setup_price_max: null,
    monthly_price_min: null,
    monthly_price_max: null,
    display_price: false,
    cta_text: 'Book Consultation',
    features: ['Custom architecture', 'Multi-role access', 'Advanced reporting', 'Integrations', 'Ongoing optimisation']
  }
];

function formatPrice(pkg) {
  if (!pkg.display_price) return 'Custom quote';

  const setupMin = Number(pkg.setup_price_min || 0);
  const setupMax = Number(pkg.setup_price_max || 0);
  const monthlyMin = Number(pkg.monthly_price_min || 0);
  const monthlyMax = Number(pkg.monthly_price_max || 0);

  const setup = setupMin && setupMax ? `Setup R${setupMin.toLocaleString()} - R${setupMax.toLocaleString()}` : '';
  const monthly = monthlyMin && monthlyMax ? `Monthly R${monthlyMin.toLocaleString()} - R${monthlyMax.toLocaleString()}` : '';

  return [setup, monthly].filter(Boolean).join(' • ') || 'Custom quote';
}

function normaliseFeatures(features) {
  if (Array.isArray(features)) return features;
  if (typeof features === 'string') return [features];
  return [];
}

export default function Packages() {
  const [packages, setPackages] = useState(fallbackPackages);
  const [source, setSource] = useState('fallback');

  useEffect(() => {
    let isMounted = true;

    async function loadPackages() {
      const { data, error } = await supabase
        .from('packages')
        .select('name, slug, positioning, description, setup_price_min, setup_price_max, monthly_price_min, monthly_price_max, display_price, cta_text, features, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!isMounted) return;

      if (!error && Array.isArray(data) && data.length > 0) {
        setPackages(data);
        setSource('supabase');
      }
    }

    loadPackages();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="packages" className="section">
      <div className="section-head">
        <p className="eyebrow">Packages</p>
        <h2>Choose the level of system your organisation needs.</h2>
        <p>
          Each package is shaped around your current operations, the systems you already use and the outcome you need.
        </p>
      </div>

      <div className="grid packages-grid">
        {packages.map((pkg) => {
          const isFeatured = String(pkg.name || '').toLowerCase().includes('pro');
          const features = normaliseFeatures(pkg.features);

          return (
            <article className={`card ${isFeatured ? 'featured' : ''}`} key={pkg.slug || pkg.name}>
              <p className="eyebrow">{pkg.positioning || 'Nuvrixa package'}</p>
              <h3>{pkg.name}</h3>
              <p>{pkg.description}</p>
              <div className="price">{formatPrice(pkg)}</div>

              <ul className="clean">
                {features.slice(0, 6).map((feature) => (
                  <li key={feature}><CheckCircle2 size={15} /> {feature}</li>
                ))}
              </ul>

              <a className={isFeatured ? 'primary-btn' : 'secondary-btn'} href="#consultation">
                {pkg.cta_text || 'Book Consultation'}
              </a>
            </article>
          );
        })}
      </div>

      {source === 'fallback' && (
        <p style={{ marginTop: '18px' }}>
          Package preview is currently using fallback content. Live Supabase data will appear once public read policies allow active package access.
        </p>
      )}
    </section>
  );
}
