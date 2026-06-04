import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useRoles } from '../hooks/useRoles.js';

export default function RoleManagement() {
  const { users, roles, loading, error } = useRoles();
  const [draftRoles, setDraftRoles] = useState({});
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setDraftRoles(Object.fromEntries(users.map((user) => [user.id, user.role_id || ''])));
  }, [users]);

  function updateDraftRole(userId, roleId) {
    setDraftRoles((current) => ({ ...current, [userId]: roleId }));
    setStatus(null);
  }

  async function saveRole(userId) {
    const roleId = draftRoles[userId];

    if (!roleId) {
      setStatus('Please choose a role before saving.');
      return;
    }

    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      setStatus(deleteError.message || 'Existing role could not be updated.');
      return;
    }

    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleId });

    if (insertError) {
      setStatus(insertError.message || 'Role could not be saved.');
      return;
    }

    const selectedRole = roles.find((role) => role.id === roleId);
    if (selectedRole?.name) {
      await supabase
        .from('profiles')
        .update({ role: selectedRole.name })
        .eq('id', userId);
    }

    setStatus('Role saved successfully. Refresh the page to confirm the updated assignment.');
  }

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Role Management</p>
        <h2>Assign user permissions.</h2>
        <p>Manage Client, Admin and Super Admin access levels using live Supabase role records.</p>
      </div>

      {loading && <p>Loading roles...</p>}
      {error && <p>{error}</p>}
      {status && <p>{status}</p>}

      <div className="grid services-grid">
        {users.map((user) => (
          <article className="card" key={user.id}>
            <p className="eyebrow">Current Role: {user.role || 'unassigned'}</p>
            <h3>{user.full_name || 'Unnamed User'}</h3>
            <p>{user.email}</p>

            <label>
              Change Role
              <select value={draftRoles[user.id] || ''} onChange={(event) => updateDraftRole(user.id, event.target.value)}>
                <option value="">Choose role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </label>

            <button className="primary-btn" type="button" onClick={() => saveRole(user.id)}>
              Save Role
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
