interface Props {
    notifications: string[];
}

export default function NotificationPanel({ notifications }: Props) {
    return (
    <div className="absolute right-0 mt-4 w-80 bg-white shadow-lg border p-4 rounded-md z-50">
        <h3 className="text-lg font-semibold mb-2">Notificaciones</h3>

        {notifications.length === 0 ? (
        <p className="text-gray-500">No hay notificaciones.</p>
        ) : (
        <ul className="space-y-2">
            {notifications.map((noti, index) => (
            <li
                key={index}
                className="p-3 bg-gray-100 rounded-md border border-gray-200"
            >
                {noti}
            </li>
            ))}
        </ul>
        )}
    </div>
    );
}
