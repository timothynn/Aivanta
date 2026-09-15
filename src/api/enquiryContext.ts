import { z } from 'zod';

const short = z.string().max(240);
export const assessmentSchema = z.object({ system: short, goal: short, data: short, priority: short });
export const chatContextSchema = z.object({
  conversation: z.string().max(50000), createdAt: z.string(),
  brief: z.object({ summary: z.string().max(1000), system: short, users: short, painPoint: z.string().max(1000),
    dataSources: z.string().max(500), opportunities: z.array(short).max(8), recommendedStart: short,
    considerations: z.array(short).max(8) }).optional(),
});
export type AssessmentContext = z.infer<typeof assessmentSchema>;
export type ChatContext = z.infer<typeof chatContextSchema>;
export const contextEvent = 'aivanta-enquiry-context';

export function readContext<T>(key: string, schema: z.ZodType<T>): T | null {
  try { const raw = sessionStorage.getItem(key); return raw ? schema.parse(JSON.parse(raw)) : null; } catch { return null; }
}
export function saveAssessment(context: AssessmentContext) {
  const value = assessmentSchema.parse(context);
  try { sessionStorage.setItem('aivanta-assessment', JSON.stringify(value)); } catch { /* Same-page handoff still works. */ }
  window.dispatchEvent(new CustomEvent(contextEvent, { detail: { assessment: value } }));
}
export function saveChatContext(context: ChatContext) {
  const value = chatContextSchema.parse(context);
  try { sessionStorage.setItem('aivanta-chat-context', JSON.stringify(value)); } catch { /* Same-page handoff still works. */ }
  window.dispatchEvent(new CustomEvent(contextEvent, { detail: { chat: value } }));
}
export function clearEnquiryContext() {
  try { for (const key of ['aivanta-assessment', 'aivanta-chat-context', 'aivanta-opportunity-brief']) sessionStorage.removeItem(key); } catch { /* Optional persistence. */ }
  window.dispatchEvent(new CustomEvent(contextEvent, { detail: { clear: true } }));
}
