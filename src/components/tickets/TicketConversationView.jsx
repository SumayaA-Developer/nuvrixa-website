import { useMemo, useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTickets } from '../../hooks/useTickets.js';

function formatDate(value) {
  if (!value) return 'Pending timestamp';
  try {
    return new Intl.DateTimeFormat('en-ZA', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function TicketConversationView({ ticket, onReplySent }) {
  const { user, profile } = useAuth();
  const { messages } = useTickets();
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ticketMessages = useMemo(() => {
    if (!ticket?.id) return [];
    return messages.filter((message) => message.ticket_id === ticket.id);
  }, [messages, ticket?.id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!ticket?.id) {
      setError('Please select a ticket before replying.');
      return;
    }

    if (!reply.trim()) {
      setError('Please type a reply before sending.');
      return;
    }

    if (!user?.id) {
      setError('You must be signed in to reply.');
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase
      .from('ticket_messages')
      .insert({
        ticket_id: ticket.id,
        sender_id: user.id,
        message: reply.trim()
      });

    setLoading(false);

    if (insertError) {
      setError(insertError.message || 'Reply could not be sent.');
      return;
    }

    setReply('');
    onReplySent?.();
  }

  if (!ticket) {
    return (
      <div className="card">
        <p className="eyebrow">Conversation</p>
        <h3>Select a ticket</h3>
        <p>Choose a support ticket to view its conversation history.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: '20px' }}>
      <div className="section-head" style={{ marginBottom: '18px' }}>
        <p className="eyebrow">Ticket Conversation</p>
        <h3>{ticket.ticket_number || ticket.ticketNumber} — {ticket.subject}</h3>
        <p>Status: {ticket.status} • Priority: {ticket.priority}</p>
      </div>

      <div style={{ display: 'grid', gap: '12px', marginBottom: '18px' }}>
        {ticketMessages.length === 0 && (
          <p>No messages have been added to this ticket yet.</p>
        )}

        {ticketMessages.map((message) => {
          const isCurrentUser = message.sender_id === user?.id;
          const sender = isCurrentUser ? (profile?.full_name || 'You') : 'Nuvrixa Support';

          return (
            <article className="glass-card card" key={message.id}>
              <p className="eyebrow">{sender}</p>
              <p>{message.message}</p>
              <small>{formatDate(message.created_at)}</small>
            </article>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <label>
          Reply
          <textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            placeholder="Type your reply..."
          />
        </label>

        {error && <div className="status error">{error}</div>}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reply'} <Send size={17} />
        </button>
      </form>
    </div>
  );
}
