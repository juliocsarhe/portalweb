import { useNotifications } from '../hooks/useNotifications';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';

interface Props {
    userId?: number;
    userRol?: number;
}

export default function NotificationBell({ userId, userRol }: Props) {
    const { notifications, clearNotifications, open, toggleOpen } = useNotifications(userId, userRol);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, right: 0 });
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setButtonPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
            setIsAnimating(true);
        }
    }, [open]);

    return (
        <>
            {/* Botón de campana */}
            <button 
                ref={buttonRef}
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

            {/* Panel de notificaciones*/}
            {open && createPortal(
                <div 
                    className={`fixed w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg shadow-2xl rounded-xl p-4 border border-gray-200 dark:border-gray-700 z-[9999] max-h-96 overflow-y-auto
                        transform transition-all duration-300 ease-out
                        ${isAnimating ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2'}
                    `}
                    style={{
                        top: `${buttonPosition.top}px`,
                        right: `${buttonPosition.right}px`
                    }}
                >
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            Notificaciones
                        </h3>
                        <button
                            onClick={toggleOpen}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:rotate-90 transition-transform duration-200"
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
                                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white
                                        transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                                    style={{
                                        animation: `slideIn 0.3s ease-out ${i * 0.05}s both`
                                    }}
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
                                clearNotifications();
                                console.log('Notificaciones limpiadas');
                            }}
                            className="mt-3 w-full text-xs text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                        >
                            Marcar todas como leídas
                        </button>
                    )}
                </div>,
                document.body
            )}


            {/* Estilos para la animación */}
            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </>
    );
}
