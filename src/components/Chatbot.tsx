import { FormEvent, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { sendChatMessage, trackEvent, type ChatMessage } from '../api/client';

const initialMessages: ChatMessage[] = [{ role: 'assistant', content: 'Hi, I’m the Aivanta assistant. I can help you explore practical AI opportunities for the software, data, documents, and workflows your business already uses.' }];
const quickPrompts = ['How can AI improve my existing application?', 'What does an AI transformation project look like?', 'Can you help me identify an AI use case?', 'What is an AI transformation assessment?'];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function openChat() {
    setOpen(true);
    void trackEvent('assistant_opened');
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || sending) return;
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

  function prepareBrief() {
    sessionStorage.setItem('aivanta-chat-discovery', JSON.stringify(messages));
    void trackEvent('assistant_brief_prepared', { messages: String(messages.length) });
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
          <header className="chat-header">
            <div className="chat-title"><span className="chat-avatar"><Bot aria-hidden="true" size={19} /></span><div><h2>Aivanta Assistant</h2><p>AI transformation guide</p></div></div>
            <button aria-label="Close chat" className="chat-icon-button" onClick={() => setOpen(false)} type="button"><X aria-hidden="true" size={18} /></button>
          </header>

          <div aria-live="polite" className="chat-messages">
            {messages.map((message, index) => <div className={`chat-message chat-message--${message.role}`} key={`${message.role}-${index}`}>{message.content}</div>)}
            {sending ? <div className="chat-message chat-message--assistant chat-thinking"><Sparkles aria-hidden="true" size={14} /> Thinking through the use case…</div> : null}
          </div>

          {messages.length === 1 && !sending ? <div className="chat-quick-actions" aria-label="Suggested questions">{quickPrompts.map((prompt) => <button className="chat-quick-action" key={prompt} onClick={() => sendMessage(prompt)} type="button">{prompt}</button>)}</div> : null}
          {messages.length > 4 && !sending ? <div className="chat-discovery-action"><p>Have enough context to explore this as a real project?</p><button className="button button--primary" onClick={prepareBrief} type="button">Prepare consultation brief <Send size={15} /></button></div> : null}
          {error ? <p className="chat-error" role="alert">{error}</p> : null}

          <form className="chat-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="chat-message">Message Aivanta assistant</label>
            <input autoComplete="off" id="chat-message" onChange={(event) => setDraft(event.target.value)} placeholder="Tell me about your application…" ref={inputRef} value={draft} />
            <button aria-label="Send message" className="chat-send" disabled={sending || !draft.trim()} type="submit"><Send aria-hidden="true" size={17} /></button>
          </form>
        </section>
      ) : null}
      <button aria-label="Open Aivanta assistant chat" className="chat-pill" onClick={openChat} type="button"><MessageCircle aria-hidden="true" size={19} /><span>Ask Aivanta</span></button>
    </div>
  );
}
