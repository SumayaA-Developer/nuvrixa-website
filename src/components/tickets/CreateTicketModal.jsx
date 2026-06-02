import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../context/AuthContext.jsx';

const initialForm = {
  subject: '',
  description: '',
  priority: 'medium'
};

export default function CreateTicketModal({ open, onClose, onCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!form.subject.trim() || !form.description.trim()) {
      setError('Please add a subject and description.');
      return;
    }

    if (!user?.id) {
      setError('You must be signed in to create a ticket.');
      return;
    }

    setLoading(true);

    const { data, error: insertError } = await supabase
      .from('tickets')
      .insert({
        client_id: user.id,
        subject: form.subject.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: 'open'
      })
      .select('id, client_id, project_id, subject, description, status, priority, assigned_to, last_reply_at, resolved_at, created_at, updated_at')
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message || 'Ticket could not be created.');
      return;
    }

    setForm(initialForm);
    onCreated?.(data);
    onClose?.();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.64)', zIndex: 50, display: 'grid', placeItems: 'center', padding: '20px' }}>
      <form className="card" onSubmit={handleSubmit} style={{ width: 'min(620px, 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
          <div>
            <p className="eyebrow">New Ticket</p>
            <h3>Create support request</h3>
          </div>
          <button className="secondary-btn" type="button" onClick={onClose} aria-label="Close ticket modal">
            <X size={18} />
          </button>
        </div>

        <label>
          Subject
          <input name="subject" value={form.subject} onChange={updateField} placeholder="What do you need help with?" required />
        </label>

        <label>
          Description
          <textarea name="description" value={form.description} onChange={updateField} placeholder="Explain your request clearly." required />
        </label>

        <label>
          Priority
          <select name="priority" value={form.priority} onChange={updateField}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>

        {error && <div className="status error">{error}</div>}

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Ticket'}
        </button>
      </form>
    </div>
  );
}
