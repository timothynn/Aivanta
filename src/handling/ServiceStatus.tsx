import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, RefreshCw, ServerCrash } from 'lucide-react';

export function ServiceStatus() {
  const [state, setState] = useState<'checking' | 'online' | 'offline'>('checking');

  async function check() {
    setState('checking');
    try {
      const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
      const response = await fetch(`${base}/api/health`, { cache: 'no-store' });
      setState(response.ok ? 'online' : 'offline');
    } catch {
      setState('offline');
    }
  }

  useEffect(() => { void check(); }, []);

  const online = state === 'online';
  return (
    <main className="handling-page">
      <section className="handling-card">
        <div className={`handling-icon ${online ? 'handling-icon--info' : 'handling-icon--warning'}`}>
          {online ? <CheckCircle2 size={26} /> : <ServerCrash size={26} />}
        </div>
        <span className="handling-kicker">AIVANTA SERVICE STATUS</span>
        <h1>{state === 'checking' ? 'Checking the service connection…' : online ? 'Aivanta services are reachable.' : 'The application service is unavailable.'}</h1>
        <p>{state === 'checking' ? 'We are checking the public API health endpoint.' : online ? 'The website can reach its configured backend health endpoint.' : 'The website is still available, but the configured backend cannot be reached right now. You can continue browsing, or try again shortly.'}</p>
        <div className="status-indicator"><span className={`status-dot ${online ? 'status-dot--ok' : state === 'checking' ? '' : 'status-dot--error'}`} />{state === 'checking' ? 'Checking…' : online ? 'Backend reachable' : 'Backend unavailable'}</div>
        <div className="handling-actions"><button className="button button--primary" onClick={() => void check()} type="button"><RefreshCw size={17} /> Check again</button><a className="button button--ghost-dark" href="#top"><ArrowLeft size={17} /> Back to Aivanta</a></div>
      </section>
    </main>
  );
}
