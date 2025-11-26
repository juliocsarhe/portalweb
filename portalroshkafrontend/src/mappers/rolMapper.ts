/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: There are better ways to do this, we need to deleted this.
import type { RolInsert } from '../types'

export function mapFormToRolInsert(formData: any): RolInsert {
  return {
    nombre: (formData.nombre ?? '').toString().trim(),
  }
}
