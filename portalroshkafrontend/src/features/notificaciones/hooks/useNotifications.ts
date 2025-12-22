
import { useState, useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

type Notification = {
  message: string;
  idUsuario?: number;
  idSolicitud?: number;
  type?: 'success' | 'error';
};


let notificationsGlobal: Notification[] = [];

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('notifications');
  if (saved) {
    try {
      notificationsGlobal = JSON.parse(saved);
    } catch (e) {
      console.error('Error cargando notificaciones:', e);
      notificationsGlobal = [];
    }
  }
}

// guardar en el local storage
function saveToStorage(notifications: Notification[]) {
  notificationsGlobal = notifications;
  localStorage.setItem('notifications', JSON.stringify(notifications));
}

export const useNotifications = (userId?: number, userRol?: number) => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsGlobal);
  const [open, setOpen] = useState<boolean>(false);
  const clientRef = useRef<Client | null>(null);
  const toggleOpen = () => setOpen(o => !o);

  useEffect(() => {
    console.log('UserId listo:', userId);
    console.log('UserRol listo:', userRol);

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log('Conectado al sistema de notificaciones');

      //NOTIFICAR SOLICITUD APROBADA
      client.subscribe('/topic/notificarsolicitudaprobadaevent', function(message) {
        const notification: Notification = JSON.parse(message.body);
        console.log('ID recibido: ', notification.idUsuario);
        console.log('UserID actual: ', userId);

        if (notification.idUsuario && notification.idUsuario !== userId) {
            return;
        }

        console.log('Mensaje recibido:', notification);
        const newNotifications = [notification, ...notificationsGlobal];
        saveToStorage(newNotifications);
        setNotifications(newNotifications);
      });

      //NOTIFICAR SOLICITUD RECHAZADA
      client.subscribe('/topic/notificarsolicitudrechazadaevent', function(message) {
        const notification: Notification = JSON.parse(message.body);
        console.log('ID recibido: ', notification.idUsuario);
        console.log('UserID actual: ', userId);

        if (notification.idUsuario && notification.idUsuario !== userId) {
            return;
        }

        console.log('Mensaje recibido:', notification);
        const newNotifications = [notification, ...notificationsGlobal];
        saveToStorage(newNotifications);
        setNotifications(newNotifications);
      });

      //NOTIFICAR TH
      client.subscribe('/topic/notificarsolicitudthevent', function(message) {
        const notification: Notification = JSON.parse(message.body);
        console.log('ID recibido: ', notification.idUsuario);
        console.log('UserID actual: ', userId);

        if (userRol === 1){
          const newNotifications = [notification, ...notificationsGlobal];
          saveToStorage(newNotifications);
          setNotifications(newNotifications);
          return; 
        }

        console.log('Mensaje recibido:', notification);
        const newNotifications = [notification, ...notificationsGlobal];
        saveToStorage(newNotifications);
        setNotifications(newNotifications);
      });

      //NOTIFICAR TL
      client.subscribe('/topic/notificarsolicitudtlevent', function(message) {
        const notification: Notification = JSON.parse(message.body);
        console.log('ID recibido: ', notification.idUsuario);
        console.log('UserID actual: ', userId);

        if (userRol == 6){
          const newNotifications = [notification, ...notificationsGlobal];
          saveToStorage(newNotifications);
          setNotifications(newNotifications);
          return; 
        }

        console.log('Mensaje recibido:', notification);
        const newNotifications = [notification, ...notificationsGlobal];
        saveToStorage(newNotifications);
        setNotifications(newNotifications);
      });

      //NOTIFICAR SA
      client.subscribe('/topic/notificarsolicitudsaevent', function(message){
        const notification: Notification = JSON.parse(message.body);
        console.log('ID recibido: ', notification.idUsuario);
        console.log('UserID actual: ', userId);

        if (userRol == 3){
          const newNotifications = [notification, ...notificationsGlobal];
          saveToStorage(newNotifications);
          setNotifications(newNotifications);
          return; 
        }

        console.log('Mensaje recibido:', notification);
        const newNotifications = [notification, ...notificationsGlobal];
        saveToStorage(newNotifications);
        setNotifications(newNotifications);
      })
    };

    client.onStompError = frame => {
      console.error(':x: STOMP error:', frame.headers['message']);
    };
    
    client.activate();
    
    return () => {
      client.deactivate();
    };
  }, [userId]);

  const clearNotifications = () => {
  saveToStorage([]);
  setNotifications([]);
};

  return {
    notifications,
    setNotifications,
    clearNotifications,
    open,
    toggleOpen,
  };
};
