import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const fallbackPackages = [
  { id: 'fallback-package-1', name: 'AI Starter', monthly_price_min: 0, monthly_price_max: 0, is_active: true },
  { id: 'fallback-package-2', name: 'AI Growth', monthly_price_min: 0, monthly_price_max: 0, is_active: true }
];

const fallbackSubscriptions = [
  {
    id: 'fallback-subscription-1',
    status: 'pending',
    profile_id: null,
    package_id: 'fallback-package-1',
    created_at: null,
    current_period_start: null,
    current_period_end: null
  }
];

const fallbackPayments = [
  {
    id: 'fallback-payment-1',
    status: 'pending',
    amount: 0,
    currency: 'ZAR',
    created_at: null,
    subscription_id: 'fallback-subscription-1'
  }
];

export function useBilling() {
  const [packages, setPackages] = useState(fallbackPackages);
  const [subscriptions, setSubscriptions] = useState(fallbackSubscriptions);
  const [payments, setPayments] = useState(fallbackPayments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadBilling() {
      setLoading(true);
      setError(null);

      const [packagesResult, subscriptionsResult, paymentsResult] = await Promise.all([
        supabase.from('packages').select('*').order('sort_order', { ascending: true }),
        supabase.from('subscriptions').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false })
      ]);

      if (!mounted) return;

      const firstError = packagesResult.error || subscriptionsResult.error || paymentsResult.error;

      if (firstError) {
        setPackages(fallbackPackages);
        setSubscriptions(fallbackSubscriptions);
        setPayments(fallbackPayments);
        setError(firstError.message || 'Billing data could not be loaded.');
        setLoading(false);
        return;
      }

      setPackages(Array.isArray(packagesResult.data) && packagesResult.data.length > 0 ? packagesResult.data : fallbackPackages);
      setSubscriptions(Array.isArray(subscriptionsResult.data) && subscriptionsResult.data.length > 0 ? subscriptionsResult.data : fallbackSubscriptions);
      setPayments(Array.isArray(paymentsResult.data) && paymentsResult.data.length > 0 ? paymentsResult.data : fallbackPayments);
      setLoading(false);
    }

    loadBilling();

    return () => {
      mounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const activeSubscriptions = subscriptions.filter((item) => ['active', 'trialing'].includes(item.status)).length;
    const failedPayments = payments.filter((item) => ['failed', 'declined'].includes(item.status)).length;
    const totalRevenue = payments
      .filter((item) => ['paid', 'successful', 'completed'].includes(item.status))
      .reduce((sum, item) => sum + Number(item.amount || item.amount_paid || item.total || 0), 0);

    return {
      activeSubscriptions,
      failedPayments,
      totalRevenue,
      packageCount: packages.length,
      paymentCount: payments.length
    };
  }, [packages, payments, subscriptions]);

  return {
    packages,
    subscriptions,
    payments,
    metrics,
    loading,
    error
  };
}
