import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

type Props = { children: ReactNode };
type State = { hasError: boolean; errorId: string };

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorId: '' };

  static getDerivedStateFromError(): State {
    return { hasError: true, errorId: crypto.randomUUID() };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Aivanta UI error', { error, info, errorId: this.state.errorId });
  }

  retry = () => window.location.reload();

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="handling-page">
        <section className="handling-card" role="alert">
          <div className="handling-icon handling-icon--error"><AlertTriangle size={26} /></div>
          <span className="handling-kicker">SOMETHING WENT WRONG</span>
          <h1>We couldn't load this part of Aivanta.</h1>
          <p>The page hit an unexpected problem. Your information hasn't been submitted by this screen. Try reloading, or return to the homepage.</p>
          <div className="handling-actions">
            <button className="button button--primary" onClick={this.retry} type="button"><RefreshCw size={17} /> Reload</button>
            <a className="button button--ghost-dark" href="#top"><ArrowLeft size={17} /> Back to Aivanta</a>
          </div>
          <small className="handling-reference">Reference: {this.state.errorId}</small>
        </section>
      </main>
    );
  }
}
