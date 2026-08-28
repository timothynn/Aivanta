import { useEffect, useMemo, useState } from 'react';
import { BarChart3, RefreshCw, ShieldCheck, TrendingUp } from 'lucide-react';
import { getAdminAnalytics, listAdminLeads, updateAdminLeadStatus, type AdminAnalytics, type AdminLead } from './api/adminClient';
import './admin.css';

const statuses: AdminLead['status'][] = ['new', 'contacted', 'qualified', 'closed'];

function percent(value: number, base: number): string {
  if (!base) return '0%';
  return `${Math.round((value / base) * 100)}%`;
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem('aivanta-admin-token') ?? '');
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    if (!token) return;
    setBusy(true); setError('');
    try {
      const [leadData, analyticsData] = await Promise.all([listAdminLeads(token), getAdminAnalytics(token)]);
      sessionStorage.setItem('aivanta-admin-token', token);
      setLeads(leadData); setAnalytics(analyticsData);
      if (!selectedId && leadData[0]) setSelectedId(leadData[0].id);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load the console.'); }
    finally { setBusy(false); }
  }

  useEffect(() => { if (token) void load(); }, []);

  const selected = useMemo(() => leads.find((lead) => lead.id === selectedId) ?? leads[0] ?? null, [leads, selectedId]);
  const counts = statuses.reduce<Record<string, number>>((acc, status) => { acc[status] = leads.filter((lead) => lead.status === status).length; return acc; }, {});

  async function changeStatus(status: AdminLead['status']) {
    if (!selected || !token) return;
    setBusy(true); setError('');
    try {
      const updated = await updateAdminLeadStatus(token, selected.id, status);
      setLeads((current) => current.map((lead) => lead.id === updated.id ? updated : lead));
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to update lead.'); }
    finally { setBusy(false); }
  }

  if (!token || (!leads.length && !error)) {
    return <main className="admin-shell"><section className="admin-login"><ShieldCheck size={30} /><h1>Aivanta Lead Console</h1><p>Enter the server-side admin token configured as <code>ADMIN_TOKEN</code>.</p><input type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Admin token" /><button onClick={() => void load()} type="button">Open console</button>{error ? <p className="admin-error">{error}</p> : null}</section></main>;
  }

  return (
    <main className="admin-shell">
      <div className="admin-topbar"><div><span className="admin-kicker">AIVANTA</span><h1>Lead Console</h1></div><button className="admin-refresh" onClick={() => void load()} type="button"><RefreshCw size={16} /> Refresh</button></div>

      <section className="admin-analytics">
        <div className="admin-analytics-head"><div><span className="admin-kicker">SIGNALS</span><h2>Website & conversion analytics</h2><p>First-party events recorded by the Aivanta site. No visitor message contents are stored as analytics metadata.</p></div><BarChart3 size={22} /></div>
        {analytics ? <>
          <div className="admin-analytics-cards">
            <div><small>Total events</small><strong>{analytics.totalEvents}</strong></div>
            <div><small>Assistant opens</small><strong>{analytics.funnel.assistantOpened}</strong></div>
            <div><small>Briefs prepared</small><strong>{analytics.funnel.briefsPrepared}</strong></div>
            <div><small>Leads submitted</small><strong>{analytics.funnel.leadsSubmitted}</strong></div>
          </div>
          <div className="admin-funnel">
            {[
              ['Page views', analytics.funnel.pageViews, analytics.funnel.pageViews],
              ['Assistant opened', analytics.funnel.assistantOpened, analytics.funnel.pageViews],
              ['Assessment started', analytics.funnel.assessmentsStarted, analytics.funnel.pageViews],
              ['Assessment completed', analytics.funnel.assessmentsCompleted, analytics.funnel.assessmentsStarted],
              ['Brief prepared', analytics.funnel.briefsPrepared, analytics.funnel.assistantOpened],
              ['Lead submitted', analytics.funnel.leadsSubmitted, analytics.funnel.pageViews],
            ].map(([label, value, base]) => <div key={label as string}><span>{label}</span><strong>{value}</strong><small>{percent(Number(value), Number(base))}</small></div>)}
          </div>
          <div className="admin-analytics-lower">
            <div><h3>Top events</h3>{analytics.topEvents.map((event) => <div className="admin-event-row" key={event.name}><span>{event.name}</span><strong>{event.count}</strong></div>)}</div>
            <div><h3>Recent activity</h3>{analytics.recentEvents.map((event, index) => <div className="admin-event-row" key={`${event.name}-${event.createdAt}-${index}`}><span>{event.name} <small>{event.path}</small></span><strong>{new Date(event.createdAt).toLocaleTimeString()}</strong></div>)}</div>
          </div>
        </> : <p className="admin-empty">Analytics are unavailable until the server has a persistent analytics store.</p>}
      </section>

      <div className="admin-stats">{statuses.map((status) => <div key={status}><span>{status}</span><strong>{counts[status] ?? 0}</strong></div>)}</div>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-grid">
        <section className="admin-list"><div className="admin-list-head"><strong>Recent leads</strong><span>{leads.length} shown</span></div>{leads.map((lead) => <button className={`admin-lead ${lead.id === selected?.id ? 'is-selected' : ''}`} key={lead.id} onClick={() => setSelectedId(lead.id)} type="button"><div><strong>{lead.company || lead.name}</strong><small>{lead.industry || 'Industry not specified'} · {lead.source}</small></div><span className={`admin-status admin-status--${lead.status}`}>{lead.status}</span></button>)}</section>
        <section className="admin-detail">{selected ? <><div className="admin-detail-head"><div><span className="admin-kicker">LEAD</span><h2>{selected.company || selected.name}</h2><p>{selected.name} · <a href={`mailto:${selected.email}`}>{selected.email}</a></p></div><select value={selected.status} onChange={(event) => void changeStatus(event.target.value as AdminLead['status'])} disabled={busy}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div><div className="admin-meta"><div><small>Industry</small><strong>{selected.industry || '—'}</strong></div><div><small>Source</small><strong>{selected.source}</strong></div><div><small>Created</small><strong>{new Date(selected.createdAt).toLocaleString()}</strong></div></div><div className="admin-section"><small>Goals</small><div className="admin-tags">{selected.goals.map((goal) => <span key={goal}>{goal}</span>)}</div></div><div className="admin-section"><small>Message / discovery context</small><pre>{selected.message}</pre></div></> : <div className="admin-empty">Select a lead to inspect it.</div>}</section>
      </div>
    </main>
  );
}
