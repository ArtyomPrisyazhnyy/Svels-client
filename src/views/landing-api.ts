import { apiRequest } from '@/shared/api/api-client';

export interface LeadPayload {
  name: string;
  phone: string;
  contactTelegram: boolean;
  contactWhatsapp: boolean;
  contactViber: boolean;
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  await apiRequest<{ id: string }>('/leads', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
