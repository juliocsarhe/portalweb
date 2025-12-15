import { useNotifications } from '../hooks/useNotifications';

type Props = {
    userEmail: string;
};

export default function NotificationBell({ userEmail }: Props) {
    const { notifications, open, toggleOpen } = useNotifications(userEmail);

    return (
    <div className="relative">
      {/* BOTÓN CAMPANA */}
        <button onClick={toggleOpen} className="relative">
        🔔
        {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.length}
            </span>
        )}
        </button>

      {/* PANEL */}
        <div
        className={`
            absolute right-0 mt-2 w-64
        bg-white/50 dark:bg-gray-900/100
            backdrop-blur-lg shadow-xl rounded-xl p-4
          border border-black/20 dark:border-white/10
          transition-all duration-300 ease-out
          origin-top-right
          ${
            open
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <h3 className="font-bold mb-2 text-gray-900 dark:text-white text-center">
          Notificaciones
        </h3>

        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No hay notificaciones
          </p>
        ) : (
          notifications.map((n, i) => (
            <p key={i} className="text-sm text-gray-900 dark:text-white py-1">
              • {n}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
