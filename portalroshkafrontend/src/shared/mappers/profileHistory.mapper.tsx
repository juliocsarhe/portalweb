import { ProfileHistoryItem } from "@/features/asignacion-equipo/types/ProfileHistory.types";

export function mapHistorialToProfileHistory(
  apiItems: any[]
): ProfileHistoryItem[] {
  return apiItems.map((apiItem) => ({
    id: String(apiItem.idHistorial),
    proyecto: {
      id: String(apiItem.idProyecto),
      nombre: apiItem.nombreProyecto,
    },
    equipo: {
      id: String(apiItem.idEquipo),
      nombre: apiItem.nombreEquipo,
    },
    tareasRealizadas: apiItem.descripcion,
    tecnologias: [],
    fechaInicio: apiItem.fechaInicio,
    fechaFin: apiItem.fechaFin ?? undefined,
  }));
}
