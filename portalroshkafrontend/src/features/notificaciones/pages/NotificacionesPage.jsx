import NotificationBell from "../components/NotificationBell";
import NotificationPanel from "../components/NotificationPanel";
import { useNotifications } from "../hooks/useNotifications";

export default function NotificacionesPage() {
    const { open, toggleOpen, notifications } = useNotifications();

    return (
    <div className="relative p-4">
        <NotificationBell toggleOpen={toggleOpen} count={notifications.length} />

        {open && <NotificationPanel notifications={notifications} />}
    </div>
    );
}
