export default function NotificationBell({ notificationCount, onClick }: Props) {
    return (
    <button
        onClick={onClick}
    className={`relative text-2xl p-3 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 
        ${notificationCount > 0 ? 'animate-bell' : ''}`}
    >
        🔔
        {notificationCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notificationCount}
        </span>
        )}
    </button>
    );
}
