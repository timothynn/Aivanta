import { ArrowLeft, SearchX } from 'lucide-react';

export function NotFound() {
  return (
    <main className="handling-page">
      <section className="handling-card">
        <div className="handling-icon handling-icon--info"><SearchX size={26} /></div>
        <span className="handling-kicker">404 · PAGE NOT FOUND</span>
        <h1>This page isn't part of Aivanta.</h1>
        <p>The address may be outdated or the page may have moved. Return to the main site and continue exploring.</p>
        <div className="handling-actions"><a className="button button--primary" href="#top"><ArrowLeft size={17} /> Back to Aivanta</a></div>
      </section>
    </main>
  );
}
