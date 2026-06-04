import { useState } from 'react';
import { useUsers } from '../hooks/useUsers.js';

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { users, loading, error } = useUsers({ search, role: roleFilter });

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">User Management</p>
        <h2>Portal profiles</h2>
        <p>View and filter profile records from Supabase.</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="form-grid">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" />
          </label>
          <label>
            Role
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </label>
        </div>
      </div>

      {loading && <p>Loading records...</p>}
      {error && <p>{error}</p>}

      <div className="grid services-grid">
        {users.map((item) => (
          <article className="card" key={item.id}>
            <p className="eyebrow">{item.role}</p>
            <h3>{item.full_name || 'Unnamed profile'}</h3>
            <p>{item.email}</p>
            <p>{item.status}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
