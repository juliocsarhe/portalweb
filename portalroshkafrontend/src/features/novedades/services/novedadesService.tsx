import { InsertDto, NovedadesUpdateDto, NovedadesResponseDto, NovedadesDefaultResponseDto } from '@/types'

const API_URL = '/api/v1/admin/th/novedades'

export const novedadesService = {
  getAll: async (): Promise<NovedadesResponseDto[]> => {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Error al obtener novedades')
    return res.json()
  },

  create: async (dto: InsertDto): Promise<NovedadesDefaultResponseDto> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw new Error('Error al crear novedad')
    return res.json()
  },

  update: async (dto: NovedadesUpdateDto): Promise<NovedadesDefaultResponseDto> => {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    if (!res.ok) throw new Error('Error al actualizar novedad')
    return res.json()
  },

  delete: async (id: number): Promise<NovedadesDefaultResponseDto> => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al eliminar novedad')
    return res.json()
  },
}
