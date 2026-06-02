import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

const fallbackTickets = [
  {
    id: 'fallback-ticket-1',
    subject: 'Portal access setup',
    description: 'Placeholder support request.',
    status: 'open',
    priority: 'medium',
    created_at: null,
    updated_at: null
  },
  {
    id: 'fallback-ticket-2',
    subject: 'Dashboard content review',
    description: 'Placeholder dashboard review request.',
    status: 'open',
    priority: 'low',
    created_at: null,
    updated_at: null
  }
];

const fallbackMessages = [
  {
    id: 'fallback-message-1',
    ticket_id: 'fallback-ticket-1',
    sender_id: null,
    message: 'Your support messages will appear here once Supabase data is connected.',
    is_internal: false,
    attachments: [],
    created_at: null
  }
];

export function useTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(fallbackTickets);
  const [messages, setMessages] = useState(fallbackMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTickets = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    const { data: ticketData, error: ticketError } = await supabase
      .from('tickets')
      .select('id, client_id, project_id, subject, description, status, priority, assigned_to, last_reply_at, resolved_at, created_at, updated_at, title, category, escalated_to, closed_at')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (ticketError || !Array.isArray(ticketData) || ticketData.length === 0) {
      setTickets(fallbackTickets);
      setMessages(fallbackMessages);
      setError(ticketError?.message || 'No tickets found yet. Showing placeholder data.');
      setLoading(false);
      return;
    }

    setTickets(ticketData);

    const ticketIds = ticketData.map((ticket) => ticket.id);
    const { data: messageData, error: messageError } = await supabase
      .from('ticket_messages')
      .select('id, ticket_id, sender_id, message, is_internal, attachments, created_at')
      .in('ticket_id', ticketIds)
      .eq('is_internal', false)
      .order('created_at', { ascending: true });

    setMessages(messageError || !Array.isArray(messageData) ? fallbackMessages : messageData);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return {
    tickets,
    messages,
    loading,
    error,
    reloadTickets: loadTickets
  };
}
