import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications.js';

export default function NotificationBell({ onToggle }) {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  function handleClick() {
    const next = !open;
    setOpen(next);
    if (onToggle) onToggle(next);
  }

  return (
    <button type="button" className="secondary-btn" onClick={handleClick}>
      <Bell size={18} />
      Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
    </button>
  );
}
