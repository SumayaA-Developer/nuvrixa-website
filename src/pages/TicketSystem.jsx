import { useState } from 'react';
import { useTickets } from '../hooks/useTickets.js';
import CreateTicketModal from '../components/tickets/CreateTicketModal.jsx';
import TicketConversationView from '../components/tickets/TicketConversationView.jsx';

export default function TicketSystem() {
  const { tickets, loading, error, reloadTickets } = useTickets();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  function handleCreated(ticket) {
    setSelectedTicket(ticket);
    reloadTickets?.();
  }

  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Ticket System</p>
        <h2>Support requests.</h2>
        <p>Create and track support requests linked to your Nuvrixa system.</p>
      </div>

      <button className="primary-btn" type="button" style={{ marginBottom: '18px' }} onClick={() => setModalOpen(true)}>
        Create Ticket
      </button>

      {loading && <p>Loading tickets...</p>}
      {error && <p>{error}</p>}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px' }}>Subject</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Priority</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{ticket.subject}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{ticket.status}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{ticket.priority}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>
                  <button className="secondary-btn" type="button" onClick={() => setSelectedTicket(ticket)}>
                    View Conversation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TicketConversationView ticket={selectedTicket} onReplySent={reloadTickets} />

      <CreateTicketModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
    </div>
  );
}
