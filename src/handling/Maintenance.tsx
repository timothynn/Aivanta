import { Clock3, RefreshCw } from 'lucide-react';

export function Maintenance() {
  return (
    <main className="handling-page">
      <section className="handling-card">
        <div className="handling-icon handling-icon--warning"><Clock3 size={26} /></div>
        <span className="handling-kicker">TEMPORARILY UNAVAILABLE</span>
        <h1>We’re making a few improvements.</h1>
        <p>Aivanta is temporarily unavailable while an update is being applied. Please try again in a little while.</p>
        <div className="handling-actions"><button className="button button--primary" onClick={() => window.location.reload()} type="button"><RefreshCw size={17} /> Try again</button><a className="button button--ghost-dark" href="mailto:hello@aivanta.ai">Contact Aivanta</a></div>
      </section>
    </main>
  );
}
