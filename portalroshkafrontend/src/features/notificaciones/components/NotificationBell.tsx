
import { useNotifications } from '../hooks/useNotifications';

interface Props {
    userId?: number;
}

export default function NotificationBell({ userId }: Props) {
    const { notifications, setNotifications, open, toggleOpen } = useNotifications(userId);

    return (
    <div className="relative">
      {/* Botón de campana */}
        <button 
        onClick={toggleOpen}
        className="relative text-2xl p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
        🔔
        {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notifications.length}
            </span>
        )}
        </button>

      {/* Panel de notificaciones */}
        {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white/90 dark:bg-gray-800/100 backdrop-blur-lg shadow-2xl rounded-xl p-4 border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">
                Notificaciones
            </h3>
            <button
                onClick={toggleOpen}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
        ✕
            </button>
            </div>

            {notifications.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No hay notificaciones
            </p>
            ) : (
            <div className="space-y-2">
                {notifications.map((n, i) => (
                <div
                    key={i}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                >
                    <p>{n.message}</p>
                    {n.idSolicitud && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Solicitud #{n.idSolicitud}
                    </p>
                    )}
                </div>
                ))}
            </div>
            )}

            {notifications.length > 0 && (
            <button
                onClick={() => {
                setNotifications([]);
                console.log('🗑️ Notificaciones limpiadas');
                }}
                className="mt-3 w-full text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
                Marcar todas como leídas
            </button>
        )}
        </div>
        )}
    </div>
    );
}



































































// import { useNotifications } from '../hooks/useNotifications';

// export default function NotificationBell({ userId }: { userId: number }) {
//     const { notifications, setNotifications, open, toggleOpen } =


//     useNotifications(userId);
//     return (
//     <div className="relative">
//         <button onClick={toggleOpen} className="relative">
//         🔔
//         {notifications.length > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
//             {notifications.length}
//             </span>
//         )}
//         </button>
//         <div className={`absolute right-0 mt-2 w-64 ${open ? '' : 'hidden'}`}>
//         <h3 className="font-bold mb-2">Notificaciones</h3>
//         {notifications.length === 0 ? (
//             <p>No hay notificaciones</p>
//         ) : (
//     notifications.map((n, i) => (
//             <p key={i} className="text-sm py-1">
//                 • {n.message}
//             </p>
//             ))
//         )}
//         {notifications.length > 0 && (
//             <button
//             onClick={() => setNotifications([])}
//             className="mt-2 text-xs text-blue-500"
//             >
//             Marcar todas como leídas
//             </button>
//         )}
//         </div>
//     </div>
//     );
// }