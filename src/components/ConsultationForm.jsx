import { useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase.js';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  industry: '',
  teamSize: '',
  currentChallenges: '',
  desiredOutcome: '',
  popiaConsent: false
};

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    surname: parts.slice(1).join(' ') || ''
  };
}

export default function ConsultationForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(null);

    if (!form.fullName.trim() || !form.email.trim()) {
      setStatus({ type: 'error', message: 'Please add your full name and email address.' });
      return;
    }

    if (!form.popiaConsent) {
      setStatus({ type: 'error', message: 'Please accept the POPIA consent checkbox before submitting.' });
      return;
    }

    setLoading(true);
    const { firstName, surname } = splitName(form.fullName);

    const payload = {
      full_name: form.fullName.trim(),
      first_name: firstName,
      surname: surname,
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      company_name: form.companyName.trim() || null,
      business_name: form.companyName.trim() || null,
      industry: form.industry.trim() || null,
      team_size: form.teamSize || null,
      current_challenges: form.currentChallenges.trim() || null,
      business_challenge: form.currentChallenges.trim() || null,
      desired_outcome: form.desiredOutcome.trim() || null,
      service_needed: 'Nuvrixa consultation',
      preferred_contact_method: 'email',
      popia_consent: true,
      source: 'website',
      status: 'new'
    };

    const { error } = await supabase.from('consultation_bookings').insert(payload);
    setLoading(false);

    if (error) {
      setStatus({
        type: 'error',
        message: 'Your request could not be submitted yet. Please check Supabase public insert policies for consultation bookings.'
      });
      return;
    }

    setForm(initialForm);
    setStatus({
      type: 'success',
      message: 'Consultation request received. Nuvrixa will review your details and follow up.'
    });
  }

  return (
    <section id="consultation" className="section">
      <div className="form-wrap">
        <div className="section-head">
          <p className="eyebrow">Book Consultation</p>
          <h2>Let’s map your system before we build it.</h2>
          <p>
            Tell us what is currently scattered, manual or difficult to manage. Nuvrixa will use this to understand the best system direction for your organisation.
          </p>
          <div className="glass-card card">
            <h3>What happens next?</h3>
            <ul className="clean">
              <li>We review your current challenges.</li>
              <li>We identify the best package direction.</li>
              <li>We map the workflows, dashboards and portal needs.</li>
              <li>You receive a clear implementation recommendation.</li>
            </ul>
          </div>
        </div>

        <form className="card" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Full Name
              <input name="fullName" value={form.fullName} onChange={updateField} placeholder="Your full name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={updateField} placeholder="Optional" />
            </label>
            <label>
              Company Name
              <input name="companyName" value={form.companyName} onChange={updateField} placeholder="Business or organisation" />
            </label>
            <label>
              Industry
              <input name="industry" value={form.industry} onChange={updateField} placeholder="Education, NPO, retail, services..." />
            </label>
            <label>
              Team Size
              <select name="teamSize" value={form.teamSize} onChange={updateField}>
                <option value="">Select team size</option>
                <option value="1-5">1-5</option>
                <option value="6-15">6-15</option>
                <option value="16-50">16-50</option>
                <option value="51+">51+</option>
              </select>
            </label>
          </div>

          <label>
            Current Challenges
            <textarea name="currentChallenges" value={form.currentChallenges} onChange={updateField} placeholder="What is currently manual, scattered or difficult to track?" />
          </label>

          <label>
            Desired Outcome
            <textarea name="desiredOutcome" value={form.desiredOutcome} onChange={updateField} placeholder="What should the finished system help you achieve?" />
          </label>

          <label style={{ display: 'flex', gridTemplateColumns: 'auto 1fr', alignItems: 'center', gap: '10px' }}>
            <input
              style={{ width: 'auto' }}
              name="popiaConsent"
              type="checkbox"
              checked={form.popiaConsent}
              onChange={updateField}
            />
            I consent to Nuvrixa storing and using my submitted information to respond to this consultation request.
          </label>

          {status && (
            <div className={`status ${status.type === 'error' ? 'error' : ''}`}>
              {status.message}
            </div>
          )}

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Consultation Request'} <Send size={17} />
          </button>
        </form>
      </div>
    </section>
  );
}
