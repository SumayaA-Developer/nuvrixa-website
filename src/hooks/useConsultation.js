import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabase.js';

function splitName(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    surname: parts.slice(1).join(' ') || ''
  };
}

function validateConsultation(form = {}) {
  if (!String(form.fullName || '').trim()) {
    return 'Please add your full name.';
  }

  if (!String(form.email || '').trim()) {
    return 'Please add your email address.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(String(form.email).trim())) {
    return 'Please enter a valid email address.';
  }

  if (!form.popiaConsent) {
    return 'Please accept the POPIA consent checkbox before submitting.';
  }

  return null;
}

function buildConsultationPayload(form = {}) {
  const { firstName, surname } = splitName(form.fullName);
  const companyName = String(form.companyName || '').trim();
  const currentChallenges = String(form.currentChallenges || '').trim();

  return {
    full_name: String(form.fullName || '').trim(),
    first_name: firstName,
    surname,
    email: String(form.email || '').trim(),
    phone: String(form.phone || '').trim() || null,
    company_name: companyName || null,
    business_name: companyName || null,
    industry: String(form.industry || '').trim() || null,
    team_size: form.teamSize || null,
    current_challenges: currentChallenges || null,
    business_challenge: currentChallenges || null,
    desired_outcome: String(form.desiredOutcome || '').trim() || null,
    service_needed: form.serviceNeeded || 'Nuvrixa consultation',
    package_interest: form.packageInterest || null,
    preferred_contact_method: form.preferredContactMethod || 'email',
    popia_consent: true,
    source: form.source || 'website',
    status: 'new'
  };
}

export function useConsultation() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const submitConsultation = useCallback(async (form) => {
    setLoading(true);
    setSuccess(null);
    setError(null);

    const validationError = validateConsultation(form);
    if (validationError) {
      setLoading(false);
      setError(validationError);
      return { ok: false, error: validationError };
    }

    const payload = buildConsultationPayload(form);
    const { error: supabaseError, data } = await supabase
      .from('consultation_bookings')
      .insert(payload)
      .select()
      .single();

    if (supabaseError) {
      const message = supabaseError.message || 'Your request could not be submitted yet.';
      setLoading(false);
      setError(message);
      return { ok: false, error: message };
    }

    const message = 'Consultation request received. Nuvrixa will review your details and follow up.';
    setLoading(false);
    setSuccess(message);
    return { ok: true, data, message };
  }, []);

  return {
    submitConsultation,
    loading,
    success,
    error
  };
}

export { buildConsultationPayload, validateConsultation };
