import { useMemo, useState } from 'react';
import { Clock3 } from 'lucide-react';

const placeholderLogs = [
  {
    id: 'log-1',
    admin_name: 'Demo Admin',
    action_type: 'role_update',
    entity_type: 'profile',
    description: 'Updated a user role.',
    created_at: 'Pending live data'
  },
  {
    id: 'log-2',
    admin_name: 'System Owner',
    action_type: 'user_update',
    entity_type: 'profile',
    description: 'Updated a user profile status.',
    created_at: 'Pending live data'
  },
  {
    id: 'log-3',
    admin_name: 'Demo Admin',
    action_type: 'ticket_update',
    entity_type: 'ticket',
    description: 'Updated a support ticket.',
    created_at: 'Pending live data'
  }
];

export default function AuditLogs() {
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const users = useMemo(() => ['all', ...new Set(placeholderLogs.map((log) => log.admin_name))], []);
  const actions = useMemo(() => ['all', ...new Set(placeholderLogs.map((log) => log.action_type))], []);

  const filteredLogs = useMemo(() => {
    return placeholderLogs.filter((log) => {
      const matchesUser = userFilter === 'all' || log.admin_name === userFilter;
      const matchesAction = actionFilter === 'all' || log.action_type === actionFilter;
      return matchesUser && matchesAction;
    });
  }, [userFilter, actionFilter]);

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Audit Logs</p>
        <h2>Admin activity timeline.</h2>
        <p>Review admin actions and system activity in one place.</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="form-grid">
          <label>
            Filter By User
            <select value={userFilter} onChange={(event) => setUserFilter(event.target.value)}>
              {users.map((user) => (
                <option key={user} value={user}>{user === 'all' ? 'All Users' : user}</option>
              ))}
            </select>
          </label>
          <label>
            Filter By Action Type
            <select value={actionFilter} onChange={(event) => setActionFilter(event.target.value)}>
              {actions.map((action) => (
                <option key={action} value={action}>{action === 'all' ? 'All Actions' : action}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '14px' }}>
        {filteredLogs.map((log) => (
          <article className="card" key={log.id}>
            <p className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock3 size={15} /> {log.created_at}
            </p>
            <h3>{log.action_type}</h3>
            <p>{log.description}</p>
            <p><strong>User:</strong> {log.admin_name}</p>
            <p><strong>Entity:</strong> {log.entity_type}</p>
          </article>
        ))}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Supabase Ready</h3>
        <p>This page is prepared to connect to the admin_actions table for live audit records.</p>
      </div>
    </div>
  );
}
