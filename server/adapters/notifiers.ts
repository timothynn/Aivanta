import type { AppConfig } from '../config.js';
import type { LeadNotifier, LeadRecord } from '../domain/lead.js';

export class ConsoleLeadNotifier implements LeadNotifier {
  async notifyLeadCreated(lead: LeadRecord): Promise<void> {
    console.info('New Aivanta lead', {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      goals: lead.goals,
    });
  }
}

export class ResendLeadNotifier implements LeadNotifier {
  constructor(private readonly config: AppConfig) {}

  async notifyLeadCreated(lead: LeadRecord): Promise<void> {
    if (!this.config.resendApiKey || !this.config.leadNotificationTo) {
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.config.resendApiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: this.config.leadNotificationFrom,
        to: this.config.leadNotificationTo,
        subject: `New Aivanta lead: ${lead.name}`,
        text: [
          `Name: ${lead.name}`,
          `Email: ${lead.email}`,
          `Company: ${lead.company || 'n/a'}`,
          `Industry: ${lead.industry || 'n/a'}`,
          `Goals: ${lead.goals.join(', ') || 'n/a'}`,
          '',
          lead.message,
        ].join('\n'),
      }),
    });

    if (!response.ok) {
      throw new Error(`Email provider rejected notification with ${response.status}`);
    }
  }
}
