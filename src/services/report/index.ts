import { IncidentReport } from '../../types';
import { apiFetch } from './client';

export async function submitIncidentReport(
  report: Omit<IncidentReport, 'id' | 'status'>
): Promise<{ id: string; message: string }> {
  const resp = await apiFetch('/reports.php', {
    method: 'POST',
    body: JSON.stringify(report),
  });
  return resp.json();
}
