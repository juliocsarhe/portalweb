/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: There are better ways to do this, we need to deleted this.
import type { ClienteRequest } from '../types'

export function mapFormToClienteRequest(formData: any): ClienteRequest {
  return {
    nombre: formData.nombre?.trim() ?? '',
    correo: formData.correo?.trim() ?? '',
    nroTelefono: formData.nroTelefono?.trim() ?? '',
    ruc: formData.ruc?.trim() ?? '',
  }
}

// normalizar para UI
// export function mapResponseToClienteUI(c: ClienteResponse) {
//   return {
//     ...c,
//     // acá formatear teléfono o fecha si hace falta
//   };
// }
