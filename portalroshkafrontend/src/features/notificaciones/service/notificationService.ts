export async function getNotifications(): Promise<string[]> {
    return [
    "Nuevo mensaje recibido",
    "Se aprobó tu solicitud",
    "Actualización disponible",
    ];
}

export async function markAsRead(id: number): Promise<{ success: boolean }> {
    return { success: true };
}
