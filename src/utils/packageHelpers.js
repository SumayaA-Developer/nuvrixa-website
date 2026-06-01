export function formatPrice(pkg = {}) {
  if (!pkg.display_price) return 'Custom quote';

  const setupMin = Number(pkg.setup_price_min || 0);
  const setupMax = Number(pkg.setup_price_max || 0);
  const monthlyMin = Number(pkg.monthly_price_min || 0);
  const monthlyMax = Number(pkg.monthly_price_max || 0);

  const setup = setupMin && setupMax
    ? `Setup R${setupMin.toLocaleString()} - R${setupMax.toLocaleString()}`
    : '';

  const monthly = monthlyMin && monthlyMax
    ? `Monthly R${monthlyMin.toLocaleString()} - R${monthlyMax.toLocaleString()}`
    : '';

  return [setup, monthly].filter(Boolean).join(' • ') || 'Custom quote';
}

export function normaliseFeatures(features) {
  if (Array.isArray(features)) return features.filter(Boolean);
  if (typeof features === 'string') {
    return features
      .split(/\n|,|;/)
      .map((feature) => feature.trim())
      .filter(Boolean);
  }
  return [];
}

export function getFeaturedPackage(packages = []) {
  return packages.find((pkg) => String(pkg.name || '').toLowerCase().includes('pro')) || packages[0] || null;
}

export function sortPackages(packages = []) {
  return [...packages].sort((a, b) => {
    const aOrder = Number.isFinite(Number(a.sort_order)) ? Number(a.sort_order) : 999;
    const bOrder = Number.isFinite(Number(b.sort_order)) ? Number(b.sort_order) : 999;
    return aOrder - bOrder || String(a.name || '').localeCompare(String(b.name || ''));
  });
}
