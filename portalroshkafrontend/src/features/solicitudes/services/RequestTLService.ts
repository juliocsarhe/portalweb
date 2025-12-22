import type { SolicitudItem } from '../../../types'

export interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1/admin/teamleader`

export async function getSolicitudesTL(token: string, page = 0, size = 10): Promise<PaginatedResponse<SolicitudItem>> {
  const res = await fetch(`${BASE_URL}/requests?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getSolicitudByIdTL(token: string, id: string): Promise<SolicitudItem> {
  const res = await fetch(`${BASE_URL}/requests/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function aprobarSolicitudTL(token: string, id: string) {
  const res = await fetch(`${BASE_URL}/users/requests/${id}/accept`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function rechazarSolicitudTL(token: string, id: string) {
  const res = await fetch(`${BASE_URL}/users/requests/${id}/reject`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
