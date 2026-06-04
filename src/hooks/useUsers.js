import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const fallbackUsers = [
  {
    id: 'fallback-user-1',
    full_name: 'Demo Client',
    email: 'client@nuvrixa.co.za',
    role: 'client',
    status: 'active',
    is_active: true
  }
];

export function useUsers({ search = '', role = 'all' } = {}) {
  const [rawUsers, setRawUsers] = useState(fallbackUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      setLoading(true);
      setError(null);

      const { data, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, is_active, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (!mounted) return;

      if (profilesError || !Array.isArray(data) || data.length === 0) {
        setRawUsers(fallbackUsers);
        setError(profilesError?.message || 'No users found yet. Showing placeholder data.');
        setLoading(false);
        return;
      }

      setRawUsers(data.map((user) => ({
        ...user,
        status: user.is_active === false ? 'suspended' : 'active'
      })));
      setLoading(false);
    }

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const users = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rawUsers.filter((user) => {
      const matchesSearch = !query || `${user.full_name || ''} ${user.email || ''}`.toLowerCase().includes(query);
      const matchesRole = role === 'all' || user.role === role;
      return matchesSearch && matchesRole;
    });
  }, [rawUsers, search, role]);

  return {
    users,
    loading,
    error
  };
}
