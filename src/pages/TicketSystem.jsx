const tickets = [
  {
    ticketNumber: 'NUV-001',
    subject: 'Portal access setup',
    status: 'Open',
    priority: 'Medium'
  },
  {
    ticketNumber: 'NUV-002',
    subject: 'Dashboard content review',
    status: 'Pending',
    priority: 'Low'
  }
];

export default function TicketSystem() {
  return (
    <div>
      <div className="section-head">
        <p className="eyebrow">Ticket System</p>
        <h2>Support requests.</h2>
        <p>Create and track support requests linked to your Nuvrixa system.</p>
      </div>

      <button className="primary-btn" type="button" style={{ marginBottom: '18px' }}>
        Create Ticket
      </button>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px' }}>Ticket Number</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Subject</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticketNumber}>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{ticket.ticketNumber}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{ticket.subject}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{ticket.status}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--line)' }}>{ticket.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Next Integration</h3>
        <p>This page is ready to connect to the Supabase tickets and ticket_messages tables.</p>
      </div>
    </div>
  );
}
