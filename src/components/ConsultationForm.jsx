import { useState } from 'react';
import { Send } from 'lucide-react';
import { useConsultation } from '../hooks/useConsultation.js';

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

export default function ConsultationForm() {
  const [form, setForm] = useState(initialForm);
  const { submitConsultation, loading, success, error } = useConsultation();

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await submitConsultation(form);

    if (result.ok) {
      setForm(initialForm);
    }
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

          {(success || error) && (
            <div className={`status ${error ? 'error' : ''}`}>
              {error || success}
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
