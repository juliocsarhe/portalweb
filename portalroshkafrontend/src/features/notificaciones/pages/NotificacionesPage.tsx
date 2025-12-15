import { useAuth } from '../../../app/providers/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationBell from '../components/NotificationBell';
import NotificationPanel from '../components/NotificationPanel';

export default function NotificacionesPage() {
    const { user } = useAuth();
    const { open, toggleOpen, notifications } = useNotifications(user?.correo || '');

    return (
    <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Mis Notificaciones</h1>
        
        <div className="relative">
        <NotificationBell 
            notificationCount={notifications.length}
            onClick={toggleOpen}
        />
        <NotificationPanel 
            notifications={notifications}
            isOpen={open}
        />
        </div>

        <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Historial</h2>
        {notifications.length === 0 ? (
            <p className="text-gray-500">No tienes notificaciones</p>
        ) : (
        <ul className="space-y-2">
            {notifications.map((n, i) => (
                <li key={i} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                {n}
                </li>
            ))}
            </ul>
        )}
        </div>
    </div>
    );
}