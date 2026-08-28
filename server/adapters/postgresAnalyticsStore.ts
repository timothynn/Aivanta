import { Pool } from 'pg';
import type { AnalyticsEvent, AnalyticsStore } from '../domain/analytics.js';

export class PostgresAnalyticsStore implements AnalyticsStore {
  constructor(private readonly pool: Pool) {}

  async recordEvent(event: AnalyticsEvent): Promise<void> {
    await this.pool.query(
      `insert into audit_events (actor_type, event_type, metadata)
       values ($1, $2, $3)`,
      ['visitor', event.name, JSON.stringify({ path: event.path, ...event.metadata })],
    );
  }
}

export class InMemoryAnalyticsStore implements AnalyticsStore {
  readonly events: AnalyticsEvent[] = [];

  async recordEvent(event: AnalyticsEvent): Promise<void> {
    this.events.push(event);
  }
}
