/**
 * Doctoralia (Docplanner) API Client
 *
 * API base: https://www.docplanner.com/api/v3/
 * Docs: https://developers.docplanner.com/
 *
 * Core function: sync de agenda pública (buscar slots disponíveis via API Docplanner)
 */

const DOCPLANNER_BASE_URL = 'https://www.docplanner.com/api/v3'

interface DoctoraliaConfig {
  apiKey: string
  clinicId: string
}

interface AvailableSlot {
  start: string
  end: string
  doctorId: string
  doctorName: string
}

interface FacilityInfo {
  id: string
  name: string
  address?: string
  specialties?: string[]
}

/**
 * Validates credentials by fetching facility info from Docplanner API
 */
export async function validateDoctoraliaCredentials(config: DoctoraliaConfig): Promise<FacilityInfo> {
  const response = await fetch(
    `${DOCPLANNER_BASE_URL}/facilities/${config.clinicId}`,
    {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  )

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Doctoralia API error ${response.status}: ${body || response.statusText}`)
  }

  const data = await response.json()
  return {
    id: data.id ?? config.clinicId,
    name: data.name ?? 'Clínica',
    address: data.address?.street,
    specialties: data.specialties?.map((s: { name: string }) => s.name),
  }
}

/**
 * Fetches available appointment slots for the clinic
 */
export async function getAvailableSlots(
  config: DoctoraliaConfig,
  dateFrom: string,
  dateTo: string
): Promise<AvailableSlot[]> {
  const params = new URLSearchParams({ dateFrom, dateTo })
  const response = await fetch(
    `${DOCPLANNER_BASE_URL}/facilities/${config.clinicId}/schedule?${params}`,
    {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        Accept: 'application/json',
      },
    }
  )

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`Doctoralia schedule error ${response.status}: ${body || response.statusText}`)
  }

  const data = await response.json()

  // Normalize response — Docplanner may vary response shape by plan
  const slots: AvailableSlot[] = []
  const doctors: Array<{ id: string; name: string; slots: Array<{ start: string; end: string }> }> =
    data.doctors ?? data.slots ?? []

  for (const doctor of doctors) {
    for (const slot of doctor.slots ?? []) {
      slots.push({
        start: slot.start,
        end: slot.end,
        doctorId: doctor.id,
        doctorName: doctor.name,
      })
    }
  }

  return slots
}
