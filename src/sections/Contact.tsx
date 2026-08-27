import { FormEvent, useState } from 'react';
import { Icon } from '../components/Icon';
import { submitLead, type LeadPayload } from '../api/client';

const goalOptions = ['AI integration', 'Document intelligence', 'Agentic workflows', 'Modernization', 'Assessment'];

const initialForm: LeadPayload = {
  name: '',
  email: '',
  company: '',
  industry: '',
  message: '',
  goals: [],
  source: 'homepage_contact_form',
};

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export function Contact() {
  const [form, setForm] = useState<LeadPayload>(initialForm);
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function updateField(field: keyof LeadPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleGoal(goal: string) {
    setForm((current) => ({
      ...current,
      goals: current.goals.includes(goal) ? current.goals.filter((item) => item !== goal) : [...current.goals, goal],
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState('submitting');
    setErrorMessage('');

    try {
      await submitLead(form);
      setForm(initialForm);
      setSubmissionState('success');
    } catch (error) {
      setSubmissionState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit the request. Please try again.');
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-inner">
        <div className="contact-copy">
          <p className="eyebrow">Start Here</p>
          <h2>Your software already works. Let&apos;s make it intelligent.</h2>
          <p>
            Share the workflow, application, or knowledge problem you want to improve. The first step is a focused
            assessment, not a platform rewrite.
          </p>
          <div className="contact-note">
            <Icon name="shield" size={19} />
            <span>No confidential client data is needed for the first conversation.</span>
          </div>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Name
              <input
                autoComplete="name"
                name="name"
                onChange={(event) => updateField('name', event.target.value)}
                required
                value={form.name}
              />
            </label>
            <label>
              Work email
              <input
                autoComplete="email"
                name="email"
                onChange={(event) => updateField('email', event.target.value)}
                required
                type="email"
                value={form.email}
              />
            </label>
            <label>
              Company
              <input
                autoComplete="organization"
                name="company"
                onChange={(event) => updateField('company', event.target.value)}
                value={form.company}
              />
            </label>
            <label>
              Industry
              <select name="industry" onChange={(event) => updateField('industry', event.target.value)} value={form.industry}>
                <option value="">Select one</option>
                <option>Aviation</option>
                <option>Professional Services</option>
                <option>Financial Services</option>
                <option>Logistics</option>
                <option>Enterprise Software</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <fieldset>
            <legend>What are you exploring?</legend>
            <div className="goal-options">
              {goalOptions.map((goal) => (
                <label className="goal-option" key={goal}>
                  <input checked={form.goals.includes(goal)} onChange={() => toggleGoal(goal)} type="checkbox" />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            What should AI improve?
            <textarea
              name="message"
              onChange={(event) => updateField('message', event.target.value)}
              required
              rows={5}
              value={form.message}
            />
          </label>

          {submissionState === 'success' ? (
            <p className="form-status form-status--success" role="status">
              Request received. Aivanta will follow up by email.
            </p>
          ) : null}
          {submissionState === 'error' ? (
            <p className="form-status form-status--error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button className="button button--primary button--form" disabled={submissionState === 'submitting'} type="submit">
            {submissionState === 'submitting' ? 'Sending...' : 'Start a conversation'} <Icon name="arrow" size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}
