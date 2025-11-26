/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: There are better ways to do this, we need to deleted this.

import type { CargoInsert } from '../types'

export function mapFormToCargoInsert(formData: any): CargoInsert {
  return {
    nombre: (formData.nombre ?? '').toString().trim(),
  }
}
