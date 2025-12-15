import { Client } from '@stomp/stompjs';
import { useEffect, useState } from 'react';

export function useNotifications(userEmail: string) {
    const [notifications, setNotifications] = useState<string[]>([]);
    const [open, setOpen] = useState(false);

    const toggleOpen = () => setOpen(o => !o);

    useEffect(() => {
    if (!userEmail) return;

    const client = new Client({
        brokerURL: 'ws://localhost:8080/ws',
        reconnectDelay: 5000,
        
        onConnect: () => {
        console.log('Conectado a WebSocket para:', userEmail);

        //  ESTO ES LO QUE ENVÍA TU BACKEND (línea 66 de NotificationService.java)
        // template.convertAndSendToUser(usuarioCorreo, "/topic/notification", message);
        client.subscribe(`/user/${userEmail}/topic/notification`, msg => {
            console.log('📬 Notificación recibida:', msg.body);
            setNotifications(prev => [...prev, msg.body]);
        });

        //  Notificaciones broadcast (por si las usan después)
        client.subscribe('/topic/notification', msg => {
            console.log(' Broadcast recibido:', msg.body);
            setNotifications(prev => [...prev, msg.body]);
        });
        },
        
    onStompError: (frame) => {
        console.error('Error STOMP:', frame);
        console.error('Detalles:', frame.headers['message']);
    },
        
        onWebSocketError: (error) => {
        console.error(' Error de WebSocket:', error);
        },
    });

    client.activate();
    
    return () => {
        console.log(' Desconectando WebSocket');
        client.deactivate();
    };
    }, [userEmail]);

    return { notifications, open, toggleOpen };
}