import { Boxes, Database, FileText, Globe, LockKeyhole, Workflow } from 'lucide-react';

const integrationItems = [
  ['Applications', 'Work with existing .NET, Java, Node.js, Python, Angular, React, and custom applications.', Boxes],
  ['Data', 'Connect to PostgreSQL, SQL Server, Oracle, APIs, and other structured sources.', Database],
  ['Documents', 'Bring enterprise documents and knowledge stores into grounded AI experiences.', FileText],
  ['APIs & workflows', 'Use defined APIs, webhooks, and workflow boundaries rather than bypassing business rules.', Workflow],
  ['AI services', 'Integrate model providers, RAG, agents, tool calling, and evaluation layers.', Globe],
  ['Security', 'Respect existing identities, permissions, data boundaries, and operational controls.', LockKeyhole],
] as const;

export function Integrations() {
  return (
    <section id="integrations" className="integrations-section">
      <div className="container integrations-inner">
        <div className="integrations-copy">
          <p className="eyebrow">INTEGRATION-FIRST</p>
          <h2>You do not need to replace the software that already works.</h2>
          <p>Aivanta is designed to add an intelligence layer around existing applications, data, documents, and workflows. The goal is practical modernization, not a forced rewrite.</p>
        </div>
        <div className="integration-grid integration-grid--large">
          {integrationItems.map(([title, description, ItemIcon]) => (
            <article key={title}><div className="integration-icon"><ItemIcon size={18} /></div><div><h4>{title}</h4><p>{description}</p></div></article>
          ))}
        </div>
      </div>
    </section>
  );
}
