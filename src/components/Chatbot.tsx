import { FormEvent, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { sendChatMessage, type ChatMessage } from '../api/client';

const initialMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content: 'Hi, I am the Aivanta assistant. Ask me about services, AI integration, or how to start an assessment.',
  },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function openChat() {
    setOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();

    if (!content || sending) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setDraft('');
    setSending(true);
    setError('');

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

  return (
    <div className="chatbot">
      {open ? (
        <section aria-label="Aivanta assistant chat" className="chat-window">
          <header className="chat-header">
            <div className="chat-title">
              <span className="chat-avatar">
                <Bot aria-hidden="true" size={19} />
              </span>
              <div>
                <h2>Aivanta Assistant</h2>
                <p>Online support</p>
              </div>
            </div>
            <button aria-label="Close chat" className="chat-icon-button" onClick={() => setOpen(false)} type="button">
              <X aria-hidden="true" size={18} />
            </button>
          </header>

          <div aria-live="polite" className="chat-messages">
            {messages.map((message, index) => (
              <div className={`chat-message chat-message--${message.role}`} key={`${message.role}-${index}`}>
                {message.content}
              </div>
            ))}
            {sending ? <div className="chat-message chat-message--assistant">Thinking...</div> : null}
          </div>

          {error ? (
            <p className="chat-error" role="alert">
              {error}
            </p>
          ) : null}

          <form className="chat-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="chat-message">
              Message Aivanta assistant
            </label>
            <input
              autoComplete="off"
              id="chat-message"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about AI integration..."
              ref={inputRef}
              value={draft}
            />
            <button aria-label="Send message" className="chat-send" disabled={sending || !draft.trim()} type="submit">
              <Send aria-hidden="true" size={17} />
            </button>
          </form>
        </section>
      ) : null}

      <button aria-label="Open Aivanta assistant chat" className="chat-pill" onClick={openChat} type="button">
        <MessageCircle aria-hidden="true" size={19} />
        <span>Ask Aivanta</span>
      </button>
    </div>
  );
}
