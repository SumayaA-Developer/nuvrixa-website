import { supabase } from '../lib/supabase.js';
import { useNotifications } from '../hooks/useNotifications.js';

function formatDate(value) {
  if (!value) return 'Just now';
  try {
    return new Intl.DateTimeFormat('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function NotificationCenter({ open = true }) {
  const { notifications, loading, error, reloadNotifications } = useNotifications();

  if (!open) return null;

  async function markAsRead(notification) {
    if (!notification?.id || notification.is_read) return;

    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notification.id);

    if (reloadNotifications) reloadNotifications();
  }

  return (
    <aside className="card" style={{ marginTop: '18px' }}>
      <p className="eyebrow">Notifications</p>
      <h3>Recent activity</h3>

      {loading && <p>Loading notifications...</p>}
      {error && <p>{error}</p>}
      {!loading && notifications.length === 0 && <p>No notifications yet.</p>}

      <div style={{ display: 'grid', gap: '12px' }}>
        {notifications.map((notification) => (
          <article className="card" key={notification.id}>
            <p className="eyebrow">{notification.type || 'info'} - {notification.is_read ? 'Read' : 'Unread'}</p>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <small>{formatDate(notification.created_at)}</small>

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              {!notification.is_read && (
                <button className="secondary-btn" type="button" onClick={() => markAsRead(notification)}>
                  Mark as read
                </button>
              )}

              {notification.action_url && (
                <a className="primary-btn" href={notification.action_url}>Open</a>
              )}
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
