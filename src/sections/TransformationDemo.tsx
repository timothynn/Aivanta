import { useMemo, useState } from 'react';
import { ArrowRight, Bot, Database, FileText, Gauge, Layers3, Search, Workflow } from 'lucide-react';
import { Icon } from '../components/Icon';

const systems = [
  {
    id: 'custom',
    name: 'Custom application',
    label: 'CUSTOM APP',
    description: 'Your internal portal, workflow system, or line-of-business application.',
    source: ['Users', 'Data', 'Workflows', 'Documents'],
    ai: ['AI assistant', 'Smart search', 'Workflow agent', 'Recommendations'],
    outcome: 'A guided application that helps users find information and complete work faster.',
  },
  {
    id: 'crm',
    name: 'CRM',
    label: 'CRM',
    description: 'Customer records, sales activity, notes, tickets, and account history.',
    source: ['Contacts', 'Accounts', 'Tickets', 'Notes'],
    ai: ['Account assistant', 'Call summaries', 'Next-best action', 'Draft replies'],
    outcome: 'Relationship teams get context and suggested next actions without leaving the CRM.',
  },
  {
    id: 'dms',
    name: 'Document system',
    label: 'DMS',
    description: 'Policies, manuals, reports, contracts, procedures, and other enterprise content.',
    source: ['Documents', 'Revisions', 'Metadata', 'Permissions'],
    ai: ['Document Q&A', 'Compare revisions', 'Evidence retrieval', 'Summaries'],
    outcome: 'Teams can ask questions across business documents and quickly trace answers to source material.',
  },
  {
    id: 'erp',
    name: 'ERP / operations',
    label: 'ERP',
    description: 'Operational data, transactions, inventory, planning, and process status.',
    source: ['Transactions', 'Inventory', 'Orders', 'Processes'],
    ai: ['Operations copilot', 'Anomaly signals', 'Forecasts', 'Task orchestration'],
    outcome: 'Operational teams get a conversational layer over complex processes and business data.',
  },
] as const;

const capabilityMeta = [
  ['AI assistant', 'Ask questions in plain language and get context-aware help.', Bot],
  ['Smart search', 'Retrieve relevant information across existing systems and knowledge.', Search],
  ['Workflow agent', 'Let AI prepare and coordinate bounded multi-step work.', Workflow],
  ['Recommendations', 'Surface useful next actions from the context already in your application.', Gauge],
] as const;

export function TransformationDemo() {
  const [activeId, setActiveId] = useState<(typeof systems)[number]['id']>('custom');
  const active = useMemo(() => systems.find((system) => system.id === activeId) ?? systems[0], [activeId]);

  return (
    <section id="demo" className="transformation-demo-section">
      <div className="container">
        <div className="section-heading demo-heading">
          <p className="eyebrow">SEE THE TRANSFORMATION</p>
          <h2>Start with the software you already have.</h2>
          <p>
            Pick a common enterprise system and see the kinds of AI capabilities Aivanta can layer into the
            application without replacing its core data and workflows.
          </p>
        </div>

        <div className="demo-shell">
          <aside className="demo-sidebar" aria-label="Existing system selector">
            <div className="demo-sidebar-title">Your existing system</div>
            {systems.map((system) => (
              <button
                className={`demo-system ${system.id === activeId ? 'demo-system--active' : ''}`}
                key={system.id}
                onClick={() => setActiveId(system.id)}
                type="button"
              >
                <span className="demo-system-icon">
                  {system.id === 'custom' ? <Layers3 size={18} /> : system.id === 'crm' ? <Database size={18} /> : system.id === 'dms' ? <FileText size={18} /> : <Workflow size={18} />}
                </span>
                <span>
                  <strong>{system.name}</strong>
                  <small>{system.label}</small>
                </span>
                <ArrowRight className="demo-system-arrow" size={16} />
              </button>
            ))}
          </aside>

          <div className="demo-main">
            <div className="demo-overview">
              <div>
                <span className="demo-kicker">{active.label}</span>
                <h3>{active.name}</h3>
                <p>{active.description}</p>
              </div>
              <div className="demo-journey" aria-label="Transformation journey">
                <div className="demo-journey-node">
                  <Layers3 size={20} />
                  <span>Existing system</span>
                </div>
                <ArrowRight className="demo-journey-arrow" size={20} />
                <div className="demo-journey-node demo-journey-node--ai">
                  <Bot size={20} />
                  <span>AI layer</span>
                </div>
                <ArrowRight className="demo-journey-arrow" size={20} />
                <div className="demo-journey-node">
                  <Gauge size={20} />
                  <span>Better outcomes</span>
                </div>
              </div>
            </div>

            <div className="demo-columns">
              <div className="demo-column">
                <div className="demo-column-label">Already in your system</div>
                <div className="demo-chip-grid">
                  {active.source.map((item) => <div className="demo-chip demo-chip--source" key={item}><Icon name="layers" size={15} />{item}</div>)}
                </div>
              </div>
              <div className="demo-column demo-column--ai">
                <div className="demo-column-label">Add an AI capability</div>
                <div className="demo-capability-list">
                  {active.ai.map((item) => {
                    const capability = capabilityMeta.find(([name]) => name === item);
                    const CapabilityIcon = capability?.[2] ?? Bot;
                    const description = capability?.[1] ?? 'A focused AI capability connected to your existing application.';
                    return (
                      <button className="demo-capability" key={item} type="button">
                        <span className="demo-capability-icon"><CapabilityIcon size={18} /></span>
                        <span><strong>{item}</strong><small>{description}</small></span>
                        <ArrowRight size={15} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="demo-outcome">
              <div className="demo-outcome-mark"><Bot size={21} /></div>
              <div>
                <span>What changes for the team</span>
                <p>{active.outcome}</p>
              </div>
              <a className="button button--primary" href="#contact">Discuss this use case <ArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
