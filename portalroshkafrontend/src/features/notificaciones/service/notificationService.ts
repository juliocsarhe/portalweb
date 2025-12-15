
// para el futuro necesitas REST API xd

export async function markAsRead(notificationId: number): Promise<boolean> {
    try {
    const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}/read`, {
        method: 'PUT'
    });
    return response.ok;
    } catch (error) {
    console.error('Error al marcar como leída:', error);
    return false; }
}