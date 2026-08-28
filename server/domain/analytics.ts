import { z } from 'zod';

export const analyticsEventSchema = z.object({
  name: z.string().trim().min(1).max(80),
  path: z.string().trim().max(240).default(''),
  metadata: z.record(z.string(), z.string().max(240)).default({}),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

export type AnalyticsSummary = {
  totalEvents: number;
  uniqueEventNames: number;
  topEvents: Array<{ name: string; count: number }>;
  recentEvents: Array<{ name: string; path: string; createdAt: string }>;
  funnel: {
    pageViews: number;
    assistantOpened: number;
    assessmentsStarted: number;
    assessmentsCompleted: number;
    briefsPrepared: number;
    leadsSubmitted: number;
  };
};

export type AnalyticsStore = {
  recordEvent(event: AnalyticsEvent): Promise<void>;
  getSummary(): Promise<AnalyticsSummary>;
};

export function createAnalytics(store: AnalyticsStore) {
  return async function record(input: unknown): Promise<void> {
    await store.recordEvent(analyticsEventSchema.parse(input));
  };
}
