import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { getFeaturedPackage, sortPackages } from '../utils/packageHelpers.js';

export const fallbackPackages = [
  {
    name: 'AI Starter',
    slug: 'ai-starter',
    sort_order: 1,
    positioning: 'For small businesses that need their first organised digital system.',
    description: 'A focused setup for capturing leads, organising client information and reducing manual admin.',
    display_price: false,
    cta_text: 'Book Consultation',
    features: ['Lead capture flow', 'Basic client database', 'Simple automation map', 'Starter dashboard']
  },
  {
    name: 'AI Growth',
    slug: 'ai-growth',
    sort_order: 2,
    positioning: 'For growing teams ready to centralise work and improve visibility.',
    description: 'A stronger operating system with automations, tracking views and cleaner internal workflows.',
    display_price: false,
    cta_text: 'Book Consultation',
    features: ['Workflow automation', 'Team dashboard', 'Client tracking', 'Consultation pipeline']
  },
  {
    name: 'AI Pro',
    slug: 'ai-pro',
    sort_order: 3,
    positioning: 'For established organisations that need dashboards, portals and deeper automation.',
    description: 'A complete digital operating layer for projects, tickets, reporting and client communication.',
    display_price: false,
    cta_text: 'Book Consultation',
    features: ['Client portal', 'Project tracking', 'Ticket system', 'Advanced dashboards', 'Automation workflows']
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    sort_order: 4,
    positioning: 'For organisations that need custom infrastructure and long-term system support.',
    description: 'A tailored transformation package for complex teams, departments and multi-step operations.',
    display_price: false,
    cta_text: 'Book Consultation',
    features: ['Custom architecture', 'Multi-role access', 'Advanced reporting', 'Integrations', 'Ongoing optimisation']
  }
];

export function usePackages() {
  const [packages, setPackages] = useState(() => sortPackages(fallbackPackages));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPackages() {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('packages')
        .select('name, slug, positioning, description, setup_price_min, setup_price_max, monthly_price_min, monthly_price_max, display_price, cta_text, features, monthly_includes, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!isMounted) return;

      if (supabaseError || !Array.isArray(data) || data.length === 0) {
        setPackages(sortPackages(fallbackPackages));
        setError(supabaseError?.message || 'No active packages returned from Supabase. Using fallback packages.');
        setLoading(false);
        return;
      }

      setPackages(sortPackages(data));
      setLoading(false);
    }

    loadPackages();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredPackage = useMemo(() => getFeaturedPackage(packages), [packages]);

  return {
    packages,
    featuredPackage,
    loading,
    error
  };
}
