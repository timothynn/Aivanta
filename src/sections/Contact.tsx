import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../components/Icon';
import { submitLead, trackEvent, type LeadPayload } from '../api/client';
import { assessmentSchema, chatContextSchema, clearEnquiryContext, contextEvent, readContext } from '../api/enquiryContext';

const goalOptions = ['AI integration', 'Document intelligence', 'Agentic workflows', 'Modernization', 'Assessment'];
const initialForm: LeadPayload = { name: '', email: '', company: '', industry: '', message: '', goals: [], source: 'homepage_contact_form' };

export function Contact() {
  const [form, setForm] = useState<LeadPayload>({ ...initialForm, industry: window.location.pathname.startsWith('/logistics') ? 'Logistics' : '' });
  const [assessment, setAssessment] = useState(() => readContext('aivanta-assessment', assessmentSchema));
  const [chat, setChat] = useState(() => readContext('aivanta-chat-context', chatContextSchema));
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const retry = useRef<{ fingerprint: string; id: string } | null>(null);

  useEffect(() => {
    function receive(event: Event) {
      const detail = (event as CustomEvent).detail;
      if (detail?.clear) { setAssessment(null); setChat(null); return; }
      const nextAssessment = assessmentSchema.safeParse(detail?.assessment);
      const nextChat = chatContextSchema.safeParse(detail?.chat);
      if (nextAssessment.success) setAssessment(nextAssessment.data);
      if (nextChat.success) setChat(nextChat.data);
    }
    window.addEventListener(contextEvent, receive);
    return () => window.removeEventListener(contextEvent, receive);
  }, []);

  function field(key: keyof LeadPayload, value: string) { setForm((current) => ({ ...current, [key]: value })); setStatus('idle'); }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true; setStatus('submitting'); setError('');
    const context = [assessment ? `Workflow questionnaire:\nSystem: ${assessment.system}\nGoal: ${assessment.goal}\nData: ${assessment.data}\nNext step: ${assessment.priority}` : '',
      chat ? `Assistant conversation:\n${chat.conversation.slice(-2000)}` : ''].filter(Boolean).join('\n\n');
    const payload: LeadPayload = { ...form, message: [form.message, context].filter(Boolean).join('\n\n').slice(0, 5000),
      source: chat ? 'homepage_chat_discovery' : assessment ? 'homepage_assessment' : window.location.pathname.startsWith('/logistics') ? 'logistics_contact_form' : form.source,
      ...(chat?.brief ? { opportunityBrief: chat.brief } : {}) };
    const fingerprint = JSON.stringify(payload);
    try {
      if (retry.current?.fingerprint !== fingerprint) retry.current = { fingerprint, id: crypto.randomUUID() };
      await submitLead({ ...payload, submissionId: retry.current.id });
      clearEnquiryContext(); retry.current = null;
      void trackEvent('lead_submitted', { source: payload.source, industry: payload.industry || 'unspecified' });
      setForm({ ...initialForm }); setStatus('success');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to submit. Please try again.'); setStatus('error'); }
    finally { inFlight.current = false; }
  }

  return <section id="contact" className="contact-section"><div className="container contact-inner">
    <div className="contact-copy"><p className="eyebrow">START WITH A CONVERSATION</p><h2>Which workflow takes more effort than it should?</h2><p>Tell us what your team does today and which tools you use. We will start with a short introductory conversation and agree any paid assessment separately.</p>
      {assessment && <div className="assessment-context" aria-label="Assessment summary"><div><small>System</small><strong>{assessment.system}</strong></div><div><small>Goal</small><strong>{assessment.goal}</strong></div><div><small>Next step</small><strong>{assessment.priority}</strong></div></div>}
      {chat && <p aria-label="Assistant discovery summary">{chat.brief ? `Opportunity brief: ${chat.brief.recommendedStart}` : 'Your assistant conversation is attached.'}</p>}
      {(assessment || chat) && <button className="button button--ghost" type="button" onClick={clearEnquiryContext}>Remove attached context</button>}
      <div className="contact-note"><Icon name="shield" size={19} /><span>No confidential client data is needed for the first conversation.</span></div>
    </div>
    <form className="lead-form" onSubmit={handleSubmit}><div className="form-grid">
      <label>Name<input autoComplete="name" name="name" minLength={2} maxLength={120} required value={form.name} onChange={(e) => field('name', e.target.value)} /></label>
      <label>Work email<input autoComplete="email" name="email" type="email" maxLength={180} required value={form.email} onChange={(e) => field('email', e.target.value)} /></label>
      <label>Company<input autoComplete="organization" name="company" maxLength={160} value={form.company} onChange={(e) => field('company', e.target.value)} /></label>
      <label>Industry<select name="industry" value={form.industry} onChange={(e) => field('industry', e.target.value)}><option value="">Select one</option>{['Logistics', 'Aviation', 'Professional Services', 'Financial Services', 'Enterprise Software', 'Other'].map((industry) => <option key={industry}>{industry}</option>)}</select></label>
    </div><fieldset><legend>What are you exploring?</legend><div className="goal-options">{goalOptions.map((goal) => <label className="goal-option" key={goal}><input type="checkbox" checked={form.goals.includes(goal)} onChange={() => setForm((current) => ({ ...current, goals: current.goals.includes(goal) ? current.goals.filter((item) => item !== goal) : [...current.goals, goal] }))} /><span>{goal}</span></label>)}</div></fieldset>
      <label>What should AI improve?<textarea name="message" required minLength={10} maxLength={2000} rows={5} value={form.message} onChange={(e) => field('message', e.target.value)} /></label>
      {status === 'success' && <p className="form-status form-status--success" role="status">Request received. Aivanta will follow up by email.</p>}
      {status === 'error' && <p className="form-status form-status--error" role="alert">{error}</p>}
      <button className="button button--primary button--form" type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Sending...' : 'Start a conversation'} <Icon name="arrow" size={18} /></button>
    </form>
  </div></section>;
}
