export interface CanonicalEvent {
  id: string;
  tenant_id: string;
  provider: 'github' | 'gitlab';
  event_type: string;
  previous_hash: string;
  event_hash: string;
  payload: unknown;
}
