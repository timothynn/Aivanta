import { z } from 'zod';

export const analyticsEventSchema = z.object({
  name: z.string().trim().min(1).max(80),
  path: z.string().trim().max(240).default(''),
  metadata: z.record(z.string(), z.string().max(240)).default({}),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

export type AnalyticsStore = {
  recordEvent(event: AnalyticsEvent): Promise<void>;
};

export function createAnalytics(store: AnalyticsStore) {
  return async function record(input: unknown): Promise<void> {
    await store.recordEvent(analyticsEventSchema.parse(input));
  };
}
