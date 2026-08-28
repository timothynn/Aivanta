import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Database, Layers3, Rocket, Sparkles } from 'lucide-react';
import { trackEvent } from '../api/client';

const systems = ['Custom application', 'CRM', 'Document system', 'ERP / operations'];
const goals = ['Save time on repetitive work', 'Make information easier to find', 'Improve customer or employee support', 'Automate parts of a workflow'];
const dataSources = ['Database', 'Documents', 'APIs', 'Email / files'];
const priorities = ['Explore options', 'Pilot one workflow', 'Modernize an existing product', 'Build an AI capability'];

export function Assessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ system: '', goal: '', data: '', priority: '' });
  const canContinue = [answers.system, answers.goal, answers.data, answers.priority][step] !== '';
  const result = useMemo(() => ({
    title: answers.priority === 'Pilot one workflow' ? 'A focused AI pilot' : 'An AI transformation assessment',
    body: answers.system ? `For a ${answers.system.toLowerCase()}, Aivanta would start by mapping where ${answers.goal.toLowerCase()} can be improved using your existing ${answers.data.toLowerCase()}.` : 'Aivanta starts with your existing application, data, documents, and workflows rather than a platform rewrite.',
  }), [answers]);

  function choose(value: string) {
    const fields = ['system', 'goal', 'data', 'priority'] as const;
    setAnswers((current) => ({ ...current, [fields[step]]: value }));
    if (step === 0) void trackEvent('assessment_started', { system: value });
  }

  function startConversation() {
    sessionStorage.setItem('aivanta-assessment', JSON.stringify(answers));
    void trackEvent('assessment_completed', { system: answers.system, priority: answers.priority });
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <section id="assessment" className="assessment-section">
      <div className="container">
        <div className="section-heading assessment-heading"><p className="eyebrow">AI TRANSFORMATION ASSESSMENT</p><h2>See what an AI-first roadmap could look like for your software.</h2><p>Answer four quick questions. We will use your answers to frame a practical starting point for an assessment.</p></div>
        <div className="assessment-shell">
          <aside className="assessment-progress"><div className="assessment-progress-title">Your assessment</div>{['Existing system', 'Business goal', 'Available data', 'Next step'].map((label, index) => <div className={`assessment-step ${index === step ? 'is-active' : ''} ${index < step ? 'is-done' : ''}`} key={label}><span>{index < step ? <CheckCircle2 size={15} /> : index + 1}</span><div><strong>{label}</strong><small>{index < step ? 'Complete' : index === step ? 'Current' : 'Up next'}</small></div></div>)}</aside>
          <div className="assessment-main">
            {step < 4 ? <><div className="assessment-main-head"><span>STEP {step + 1} OF 4</span><div><i style={{ width: `${((step + 1) / 4) * 100}%` }} /></div></div><h3>{['What are you starting with?', 'What matters most?', 'Where does useful information live?', 'What are you ready to do?'][step]}</h3><p className="assessment-question-copy">{['Choose the system closest to what your team already uses.', 'Pick the outcome you would most like AI to improve.', 'Select the information sources an AI capability could work with.', 'Choose the most realistic next step for your organization.'][step]}</p><div className="assessment-options">{(step === 0 ? systems : step === 1 ? goals : step === 2 ? dataSources : priorities).map((item) => { const selected = [answers.system, answers.goal, answers.data, answers.priority][step] === item; return <button key={item} className={`assessment-option ${selected ? 'is-selected' : ''}`} onClick={() => choose(item)} type="button"><span className="assessment-option-icon">{step === 0 ? <Layers3 size={18} /> : step === 1 ? <Sparkles size={18} /> : <Rocket size={18} />}</span><span>{item}</span><ArrowRight size={16} /></button>; })}</div><div className="assessment-actions"><button className="button button--ghost-dark" disabled={step === 0} onClick={() => setStep((value) => value - 1)} type="button">Back</button><button className="button button--primary" disabled={!canContinue} onClick={() => setStep((value) => value + 1)} type="button">{step === 3 ? 'See recommendation' : 'Continue'} <ArrowRight size={17} /></button></div></> : <div className="assessment-result"><div className="assessment-result-mark"><CheckCircle2 size={28} /></div><span className="assessment-kicker">YOUR STARTING POINT</span><h3>{result.title}</h3><p>{result.body}</p><div className="assessment-result-grid"><div><small>System</small><strong>{answers.system}</strong></div><div><small>Goal</small><strong>{answers.goal}</strong></div><div><small>Data</small><strong>{answers.data}</strong></div><div><small>Next step</small><strong>{answers.priority}</strong></div></div><div className="assessment-result-actions"><button className="button button--primary" onClick={startConversation} type="button">Continue to assessment <ArrowRight size={17} /></button><button className="button button--ghost-dark" onClick={() => setStep(0)} type="button">Start again</button></div></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
