import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

const fallbackNotifications = [
  {
    id: 'fallback-notification-1',
    title: 'Welcome to your Nuvrixa portal',
    message: 'Your notifications will appear here once live activity is available.',
    type: 'info',
    is_read: false,
    action_url: null,
    metadata: {},
    created_at: null,
    read_at: null
  }
];

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(fallbackNotifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    const { data, error: notificationError } = await supabase
      .from('notifications')
      .select('id, user_id, title, message, type, is_read, action_url, metadata, created_at, read_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (notificationError || !Array.isArray(data) || data.length === 0) {
      setNotifications(fallbackNotifications);
      setError(notificationError?.message || 'No notifications found yet. Showing placeholder data.');
      setLoading(false);
      return;
    }

    setNotifications(data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    if (!user?.id) return undefined;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadNotifications, user?.id]);

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.is_read).length;
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    reloadNotifications: loadNotifications
  };
}
