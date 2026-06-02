import { useState } from 'react';

const roleOptions = [
  { value: 'client', label: 'Client' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' }
];

const placeholderUsers = [
  { id: 'user-1', full_name: 'Demo Client', email: 'client@nuvrixa.co.za', role: 'client' },
  { id: 'user-2', full_name: 'Demo Admin', email: 'admin@nuvrixa.co.za', role: 'admin' },
  { id: 'user-3', full_name: 'System Owner', email: 'owner@nuvrixa.co.za', role: 'super_admin' }
];

export default function RoleManagement() {
  const [users, setUsers] = useState(placeholderUsers);
  const [draftRoles, setDraftRoles] = useState(() => Object.fromEntries(
    placeholderUsers.map((user) => [user.id, user.role])
  ));
  const [status, setStatus] = useState(null);

  function updateDraftRole(userId, role) {
    setDraftRoles((current) => ({ ...current, [userId]: role }));
    setStatus(null);
  }

  function saveRole(userId) {
    setUsers((current) => current.map((user) => (
      user.id === userId ? { ...user, role: draftRoles[userId] } : user
    )));
    setStatus('Role updated locally. Supabase role updates will be connected in the governance integration batch.');
  }

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Role Management</p>
        <h2>Assign user permissions.</h2>
        <p>Manage Client, Admin and Super Admin access levels for the Nuvrixa portal.</p>
      </div>

      {status && <div className="status">{status}</div>}

      <div className="grid services-grid">
        {users.map((user) => (
          <article className="card" key={user.id}>
            <p className="eyebrow">Current Role: {user.role}</p>
            <h3>{user.full_name}</h3>
            <p>{user.email}</p>

            <label>
              Change Role
              <select value={draftRoles[user.id]} onChange={(event) => updateDraftRole(user.id, event.target.value)}>
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
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
