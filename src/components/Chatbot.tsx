import { FormEvent, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { generateOpportunityBrief, sendChatMessage, trackEvent, type ChatMessage, type OpportunityBrief } from '../api/client';

const initialMessages: ChatMessage[] = [{ role: 'assistant', content: 'Hi, I’m the Aivanta assistant. I can help you explore practical AI opportunities for the software, data, documents, and workflows your business already uses.' }];
const quickPrompts = ['How can AI improve my existing application?', 'What does an AI transformation project look like?', 'Can you help me identify an AI use case?', 'What is an AI transformation assessment?'];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [briefing, setBriefing] = useState(false);
  const [brief, setBrief] = useState<OpportunityBrief | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function openChat() {
    setOpen(true);
    void trackEvent('assistant_opened');
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || sending || briefing) return;
    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setDraft('');
    setSending(true);
    setError('');
    void trackEvent('assistant_message_sent', { turn: String(nextMessages.filter((m) => m.role === 'user').length) });
    try {
      const response = await sendChatMessage(nextMessages.slice(-12));
      setMessages((current) => [...current, response.message]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The assistant is unavailable right now.');
    } finally {
      setSending(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  async function prepareBrief() {
    if (messages.filter((message) => message.role === 'user').length < 2 || briefing) return;
    setBriefing(true); setError('');
    try {
      const nextBrief = await generateOpportunityBrief(messages.slice(-12));
      setBrief(nextBrief);
      sessionStorage.setItem('aivanta-opportunity-brief', JSON.stringify(nextBrief));
      sessionStorage.setItem('aivanta-chat-context', JSON.stringify({ conversation: messages.map((message) => `${message.role.toUpperCase()}: ${message.content}`).join('\n\n'), brief: nextBrief, createdAt: new Date().toISOString() }));
      void trackEvent('assistant_brief_prepared', { opportunities: String(nextBrief.opportunities.length) });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to prepare the opportunity brief.');
    } finally {
      setBriefing(false);
    }
  }

  function continueToContact() {
    void trackEvent('consultation_brief_cta_clicked');
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(draft);
  }

  return (
    <div className="chatbot">
      {open ? (
        <section aria-label="Aivanta assistant chat" className="chat-window">
          <header className="chat-header"><div className="chat-title"><span className="chat-avatar"><Bot aria-hidden="true" size={19} /></span><div><h2>Aivanta Assistant</h2><p>AI transformation guide</p></div></div><button aria-label="Close chat" className="chat-icon-button" onClick={() => setOpen(false)} type="button"><X aria-hidden="true" size={18} /></button></header>
          <div aria-live="polite" className="chat-messages">
            {messages.map((message, index) => <div className={`chat-message chat-message--${message.role}`} key={`${message.role}-${index}`}>{message.content}</div>)}
            {sending ? <div className="chat-message chat-message--assistant chat-thinking"><Sparkles aria-hidden="true" size={14} /> Thinking through the use case…</div> : null}
          </div>

          {messages.length === 1 && !sending && !brief ? <div className="chat-quick-actions" aria-label="Suggested questions">{quickPrompts.map((prompt) => <button className="chat-quick-action" key={prompt} onClick={() => sendMessage(prompt)} type="button">{prompt}</button>)}</div> : null}

          {messages.length > 4 && !brief && !briefing ? <div className="chat-discovery-action"><p>Have enough context to explore this as a real project?</p><button className="button button--primary" onClick={() => void prepareBrief()} type="button">Prepare opportunity brief <Send size={15} /></button></div> : null}

          {brief ? <div className="chat-brief-card"><div><span>AI OPPORTUNITY BRIEF</span><h3>{brief.recommendedStart}</h3></div><p>{brief.summary}</p><div className="chat-brief-grid"><div><small>Existing system</small><strong>{brief.system}</strong></div><div><small>Main pain point</small><strong>{brief.painPoint}</strong></div><div><small>Data sources</small><strong>{brief.dataSources}</strong></div><div><small>Users</small><strong>{brief.users}</strong></div></div><div className="chat-brief-list"><div><small>Potential opportunities</small><ul>{brief.opportunities.map((item) => <li key={item}>{item}</li>)}</ul></div><div><small>Key considerations</small><ul>{brief.considerations.map((item) => <li key={item}>{item}</li>)}</ul></div></div><button className="button button--primary" onClick={continueToContact} type="button">Carry this into a consultation <Send size={15} /></button></div> : null}

          {error ? <p className="chat-error" role="alert">{error}</p> : null}
          <form className="chat-form" onSubmit={handleSubmit}><label className="sr-only" htmlFor="chat-message">Message Aivanta assistant</label><input autoComplete="off" id="chat-message" onChange={(event) => setDraft(event.target.value)} placeholder="Tell me about your application…" ref={inputRef} value={draft} /><button aria-label="Send message" className="chat-send" disabled={sending || briefing || !draft.trim()} type="submit"><Send aria-hidden="true" size={17} /></button></form>
        </section>
      ) : null}
      <button aria-label="Open Aivanta assistant chat" className="chat-pill" onClick={openChat} type="button"><MessageCircle aria-hidden="true" size={19} /><span>Ask Aivanta</span></button>
    </div>
  );
}
