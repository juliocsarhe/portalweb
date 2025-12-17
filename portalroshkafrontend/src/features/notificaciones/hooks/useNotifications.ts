import { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/* Tipo de notificación (simple, sin complicar) */
type Notification = {
  message: string;
  idUsuario?: number;
  idSolicitud?: number;
  type?: 'success' | 'error';
};
export const useNotifications = (userId?: number, userRol?: number) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const clientRef = useRef<Client | null>(null);
  const toggleOpen = () => setOpen(o => !o);
  useEffect(() => {


    console.log('🟢 UserId listo:', userId);
    console.log('🟢 UserRol listo:', userRol);

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log(':círculo_verde_grande: Conectado al sistema de notificaciones');
      const topicsUser = [
        'NotificarSolicitudAprobadaEvent',
        'NotificarSolicitudRechazadaEvent',
      ];

      const topicsAdmin = [
        //'topic/notificarsolicitudsaevent',
        'NotificarSolicitudTEvent',
        //'topic/notificarsolicitudtlevent',
        'NotificarSolicitudTEvent',
      ];


      client.subscribe('/topic/notificarsolicitudaprobadaevent', function(message) {
        const notification: Notification = JSON.parse(message.body);

        if (notification.idUsuario && notification.idUsuario !== userId) {
            return; // no es para este usuario
        }

        console.log('Mensaje recibido:', notification);
        setNotifications(prev => [notification, ...prev]);
      });

      client.subscribe('/topic/notificarsolicitudrechazadaevent', function(message) {
        const notification: Notification = JSON.parse(message.body);
        console.log('ID recibido: ', notification.idUsuario);
        console.log('UserID actual: ', userId);
        if (notification.idUsuario !== userId) {
          return; // no es para este usuario
        }

        console.log('Mensaje recibido:', notification);
        setNotifications(prev => [notification, ...prev]);
      });

      client.subscribe('/topic/notificarsolicitudthevent', function(message) {
        const notification: Notification = JSON.parse(message.body);

        console.log('Mensaje recibido:', notification);
        setNotifications(prev => [notification, ...prev]);
      });

      client.subscribe('/topic/notificarsolicitudtlevent', function(message) {
        const notification: Notification = JSON.parse(message.body);

        console.log('Mensaje recibido:', notification);
        setNotifications(prev => [notification, ...prev]);
      });


    };

    client.onStompError = frame => {
      console.error(':x: STOMP error:', frame.headers['message']);
    };
    client.activate();
    return () => {
      client.deactivate();
    };
  }, [userId]);
  return {
    notifications,
    setNotifications,
    open,
    toggleOpen,
  };

};
   
