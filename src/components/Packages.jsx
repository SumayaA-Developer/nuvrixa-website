import { CheckCircle2 } from 'lucide-react';
import { usePackages } from '../hooks/usePackages.js';
import { formatPrice, normaliseFeatures } from '../utils/packageHelpers.js';

export default function Packages() {
  const { packages, loading, error } = usePackages();

  return (
    <section id="packages" className="section">
      <div className="section-head">
        <p className="eyebrow">Packages</p>
        <h2>Choose the level of system your organisation needs.</h2>
        <p>
          Each package is shaped around your current operations, the systems you already use and the outcome you need.
        </p>
      </div>

      {loading && <p>Loading package information...</p>}

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
                  <li key={feature}>
                    <CheckCircle2 size={15} /> {feature}
                  </li>
                ))}
              </ul>

              <a className={isFeatured ? 'primary-btn' : 'secondary-btn'} href="#consultation">
                {pkg.cta_text || 'Book Consultation'}
              </a>
            </article>
          );
        })}
      </div>

      {error && (
        <p style={{ marginTop: '18px' }}>
          Package preview is using fallback content. Live Supabase data will appear once public read policies allow active package access.
        </p>
      )}
    </section>
  );
}
