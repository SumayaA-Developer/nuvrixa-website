import { useMemo, useState } from 'react';

const placeholderUsers = [
  {
    id: 'user-1',
    full_name: 'Demo Client',
    email: 'client@nuvrixa.co.za',
    role: 'client',
    status: 'active'
  },
  {
    id: 'user-2',
    full_name: 'Demo Admin',
    email: 'admin@nuvrixa.co.za',
    role: 'admin',
    status: 'active'
  },
  {
    id: 'user-3',
    full_name: 'Paused Client',
    email: 'paused@nuvrixa.co.za',
    role: 'client',
    status: 'suspended'
  }
];

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState(placeholderUsers);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = `${user.full_name} ${user.email}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter, users]);

  function updateStatus(userId, status) {
    setUsers((current) => current.map((user) => (
      user.id === userId ? { ...user, status } : user
    )));
  }

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">User Management</p>
        <h2>Manage portal users.</h2>
        <p>Search, filter and manage client and admin access. Live Supabase updates will be connected in the governance integration batch.</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="form-grid">
          <label>
            Search Users
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email..." />
          </label>
          <label>
            Filter By Role
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="all">All Roles</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </label>
        </div>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Role</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{user.full_name}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{user.email}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{user.role}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{user.status}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>
                  {user.status === 'active' ? (
                    <button className="secondary-btn" type="button" onClick={() => updateStatus(user.id, 'suspended')}>Suspend</button>
                  ) : (
                    <button className="primary-btn" type="button" onClick={() => updateStatus(user.id, 'active')}>Reactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
