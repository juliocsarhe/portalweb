interface Props {
    toggleOpen: () => void;
    count: number;
}

export default function NotificationBell({ toggleOpen, count }: Props) {
    return (
    <button
        onClick={toggleOpen}
        className="relative bg-blue-600 text-white px-4 py-2 rounded-md"
    >
        🔔 Notificaciones

        {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
            {count}
        </span>
        )}
    </button>
    );
}
