
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationBell({ userId }: { userId: number }) {
  const { notifications, setNotifications, open, toggleOpen } =


    useNotifications(userId);
  return (
    <div className="relative">
      <button onClick={toggleOpen} className="relative">
        :campana:
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>
      <div className={`absolute right-0 mt-2 w-64 ${open ? '' : 'hidden'}`}>
        <h3 className="font-bold mb-2">Notificaciones</h3>
        {notifications.length === 0 ? (
          <p>No hay notificaciones</p>
        ) : (
          notifications.map((n, i) => (
            <p key={i} className="text-sm py-1">
              • {n.message}
            </p>
          ))
        )}
        {notifications.length > 0 && (
          <button
            onClick={() => setNotifications([])}
            className="mt-2 text-xs text-blue-500"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>
    </div>
  );
}