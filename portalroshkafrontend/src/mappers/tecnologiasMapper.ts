/* eslint-disable @typescript-eslint/no-explicit-any */
//TODO: There are better ways to do this, we need to deleted this.
import type { TecnologiaRequest } from '../types'

export function mapFormToTecnologiaRequest(formData: Record<string, any>): TecnologiaRequest {
  return {
    nombre: formData.nombre ?? '',
    descripcion: formData.descripcion ?? '',
  }
}
