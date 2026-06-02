import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../context/AuthContext.jsx';

const fallbackTickets = [
  {
    id: 'fallback-ticket-1',
    ticket_number: 'NUV-001',
    subject: 'Portal access setup',
    description: 'Placeholder support request.',
    status: 'Open',
    priority: 'Medium'
  },
  {
    id: 'fallback-ticket-2',
    ticket_number: 'NUV-002',
    subject: 'Dashboard content review',
    description: 'Placeholder dashboard review request.',
    status: 'Pending',
    priority: 'Low'
  }
];

const fallbackMessages = [
  {
    id: 'fallback-message-1',
    ticket_id: 'fallback-ticket-1',
    message: 'Your support messages will appear here once Supabase data is connected.'
  }
];

export function useTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(fallbackTickets);
  const [messages, setMessages] = useState(fallbackMessages);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTickets() {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('id, ticket_number, subject, description, priority, status, created_at, updated_at')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (!isMounted) return;

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
        .select('id, ticket_id, sender_id, message, created_at')
        .in('ticket_id', ticketIds)
        .order('created_at', { ascending: true });

      if (!isMounted) return;

      if (messageError || !Array.isArray(messageData)) {
        setMessages(fallbackMessages);
      } else {
        setMessages(messageData);
      }

      setLoading(false);
    }

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  return {
    tickets,
    messages,
    loading,
    error
  };
}
