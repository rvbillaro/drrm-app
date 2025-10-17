import { IncidentReport } from '../types';

const INCIDENTS_ENDPOINT = 'http://localhost:5173/backend3/api/incidents.php';

export async function submitIncidentToAdmin(
  report: Omit<IncidentReport, 'id' | 'status'>
): Promise<any> {
  // Map to API contract (snake_case) and send JSON
  const payload: any = {
    incident_type: report.incidentType,
    location: report.location.address,
    description: report.description,
    latitude: report.location.latitude,
    longitude: report.location.longitude,
    // status and priority can be added if provided in future
  };

  const response = await fetch(INCIDENTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  try {
    return await response.json();
  } catch {
    return await response.text();
  }
}
