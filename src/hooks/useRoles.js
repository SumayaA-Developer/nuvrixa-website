import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const fallbackRoles = [
  { id: 'fallback-role-client', name: 'client', description: 'Client portal user' },
  { id: 'fallback-role-admin', name: 'admin', description: 'Admin user' },
  { id: 'fallback-role-super-admin', name: 'super_admin', description: 'Super admin user' }
];

const fallbackUsers = [
  {
    id: 'fallback-user-1',
    full_name: 'Demo Client',
    email: 'client@nuvrixa.co.za',
    role: 'client',
    role_id: 'fallback-role-client'
  }
];

export function useRoles() {
  const [users, setUsers] = useState(fallbackUsers);
  const [roles, setRoles] = useState(fallbackRoles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadRoles() {
      setLoading(true);
      setError(null);

      const [profilesResult, rolesResult, userRolesResult] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email, role, is_active').order('created_at', { ascending: false }),
        supabase.from('roles').select('id, name, description').order('name', { ascending: true }),
        supabase.from('user_roles').select('id, user_id, role_id, created_at')
      ]);

      if (!mounted) return;

      const firstError = profilesResult.error || rolesResult.error || userRolesResult.error;

      if (firstError) {
        setUsers(fallbackUsers);
        setRoles(fallbackRoles);
        setError(firstError.message || 'Role data could not be loaded.');
        setLoading(false);
        return;
      }

      const liveRoles = Array.isArray(rolesResult.data) && rolesResult.data.length > 0 ? rolesResult.data : fallbackRoles;
      const roleById = new Map(liveRoles.map((item) => [item.id, item.name]));
      const assignmentByUserId = new Map((userRolesResult.data || []).map((item) => [item.user_id, item.role_id]));

      const liveUsers = (profilesResult.data || []).map((profile) => {
        const assignedRoleId = assignmentByUserId.get(profile.id);
        return {
          ...profile,
          role_id: assignedRoleId || null,
          role: assignedRoleId ? roleById.get(assignedRoleId) || profile.role : profile.role,
          status: profile.is_active === false ? 'inactive' : 'active'
        };
      });

      setRoles(liveRoles);
      setUsers(liveUsers.length > 0 ? liveUsers : fallbackUsers);
      setLoading(false);
    }

    loadRoles();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    users,
    roles,
    loading,
    error
  };
}
