import type { LeadSubmission } from './lead.js';

export type QualificationLabel = 'early' | 'promising' | 'high-intent';

export type LeadQualification = {
  score: number;
  label: QualificationLabel;
  reasons: string[];
};

export function qualifyLead(input: LeadSubmission): LeadQualification {
  let score = 0;
  const reasons: string[] = [];

  if (input.company) {
    score += 15;
    reasons.push('Company identified');
  }

  if (input.industry) {
    score += 10;
    reasons.push('Industry identified');
  }

  if (input.goals.length > 0) {
    score += Math.min(20, input.goals.length * 5);
    reasons.push('Clear AI interest selected');
  }

  if (input.source === 'homepage_assessment') {
    score += 20;
    reasons.push('Completed the AI transformation assessment');
  }

  if (input.source === 'homepage_chat_discovery') {
    score += 20;
    reasons.push('Completed AI discovery with the assistant');
  }

  if (input.opportunityBrief) {
    score += 20;
    reasons.push('Structured AI opportunity identified');
  }

  if (input.message.length >= 120) {
    score += 10;
    reasons.push('Detailed problem description provided');
  } else if (input.message.length >= 50) {
    score += 5;
    reasons.push('Problem context provided');
  }

  score = Math.min(100, score);
  const label: QualificationLabel = score >= 70 ? 'high-intent' : score >= 45 ? 'promising' : 'early';

  return { score, label, reasons };
}
