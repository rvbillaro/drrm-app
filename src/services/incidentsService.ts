import { IncidentReport } from '../types';

const INCIDENTS_ENDPOINT = 'http://192.168.8.118/api/reports.php';

export async function submitIncidentToAdmin(
  report: Omit<IncidentReport, 'id' | 'status'>,
  userId?: string
): Promise<any> {
  // Map to API contract (camelCase to match backend)
  const payload: any = {
    userId: userId,
    incidentType: report.incidentType,
    description: report.description,
    location: {
      address: report.location.address,
      latitude: report.location.latitude,
      longitude: report.location.longitude,
    },
    mediaFiles: report.mediaFiles || [],
    timestamp: new Date().toISOString(),
  };

  const response = await fetch(INCIDENTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  // Get the response text first, then try to parse as JSON
  const responseText = await response.text();
  
  try {
    return JSON.parse(responseText);
  } catch {
    // If not JSON, return the text as is
    return responseText;
  }
}
