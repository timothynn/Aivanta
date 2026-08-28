import { Pool } from 'pg';
import type { AnalyticsEvent, AnalyticsStore, AnalyticsSummary } from '../domain/analytics.js';

function emptySummary(): AnalyticsSummary {
  return {
    totalEvents: 0,
    uniqueEventNames: 0,
    topEvents: [],
    recentEvents: [],
    funnel: {
      pageViews: 0,
      assistantOpened: 0,
      assessmentsStarted: 0,
      assessmentsCompleted: 0,
      briefsPrepared: 0,
      leadsSubmitted: 0,
    },
  };
}

export class PostgresAnalyticsStore implements AnalyticsStore {
  constructor(private readonly pool: Pool) {}

  async recordEvent(event: AnalyticsEvent): Promise<void> {
    await this.pool.query(
      `insert into audit_events (actor_type, event_type, metadata)
       values ($1, $2, $3)`,
      ['visitor', event.name, JSON.stringify({ path: event.path, ...event.metadata })],
    );
  }

  async getSummary(): Promise<AnalyticsSummary> {
    const [totals, names, topEvents, recentEvents, funnel] = await Promise.all([
      this.pool.query<{ count: string }>(`select count(*)::text as count from audit_events where actor_type = 'visitor'`),
      this.pool.query<{ count: string }>(`select count(distinct event_type)::text as count from audit_events where actor_type = 'visitor'`),
      this.pool.query<{ event_type: string; count: string }>(`select event_type, count(*)::text as count from audit_events where actor_type = 'visitor' group by event_type order by count(*) desc limit 8`),
      this.pool.query<{ event_type: string; path: string; created_at: Date }>(`select event_type, coalesce(metadata->>'path', '') as path, created_at from audit_events where actor_type = 'visitor' order by created_at desc limit 12`),
      this.pool.query<{ event_type: string; count: string }>(`select event_type, count(*)::text as count from audit_events where actor_type = 'visitor' and event_type in ('page_view','assistant_opened','assessment_started','assessment_completed','assistant_brief_prepared','lead_submitted') group by event_type`),
    ]);

    const result = emptySummary();
    result.totalEvents = Number(totals.rows[0]?.count ?? 0);
    result.uniqueEventNames = Number(names.rows[0]?.count ?? 0);
    result.topEvents = topEvents.rows.map((row) => ({ name: row.event_type, count: Number(row.count) }));
    result.recentEvents = recentEvents.rows.map((row) => ({ name: row.event_type, path: row.path, createdAt: row.created_at.toISOString() }));
    for (const row of funnel.rows) {
      const count = Number(row.count);
      if (row.event_type === 'page_view') result.funnel.pageViews = count;
      if (row.event_type === 'assistant_opened') result.funnel.assistantOpened = count;
      if (row.event_type === 'assessment_started') result.funnel.assessmentsStarted = count;
      if (row.event_type === 'assessment_completed') result.funnel.assessmentsCompleted = count;
      if (row.event_type === 'assistant_brief_prepared') result.funnel.briefsPrepared = count;
      if (row.event_type === 'lead_submitted') result.funnel.leadsSubmitted = count;
    }
    return result;
  }
}

export class InMemoryAnalyticsStore implements AnalyticsStore {
  readonly events: AnalyticsEvent[] = [];

  async recordEvent(event: AnalyticsEvent): Promise<void> {
    this.events.push(event);
  }

  async getSummary(): Promise<AnalyticsSummary> {
    const counts = new Map<string, number>();
    for (const event of this.events) counts.set(event.name, (counts.get(event.name) ?? 0) + 1);
    return {
      totalEvents: this.events.length,
      uniqueEventNames: counts.size,
      topEvents: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count })),
      recentEvents: this.events.slice(-12).reverse().map((event) => ({ name: event.name, path: event.path, createdAt: new Date().toISOString() })),
      funnel: {
        pageViews: counts.get('page_view') ?? 0,
        assistantOpened: counts.get('assistant_opened') ?? 0,
        assessmentsStarted: counts.get('assessment_started') ?? 0,
        assessmentsCompleted: counts.get('assessment_completed') ?? 0,
        briefsPrepared: counts.get('assistant_brief_prepared') ?? 0,
        leadsSubmitted: counts.get('lead_submitted') ?? 0,
      },
    };
  }
}
