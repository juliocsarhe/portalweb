import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
type Notification = {
  idUsuario?: number | null;
  idSolicitud?: number;
  message: string;
};
export function useNotifications(userId?: number) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(o => !o);
  useEffect(() => {
    if (!userId) return;
    const client = new Client({
      brokerURL: 'ws://26.73.68.190:8080/ws',
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      console.log(':círculo_verde_grande: WebSocket conectado');
      const topics = [
        // :candado_cerrado_con_llave: SOLO USUARIO
        '/topic/notificarsolicitudaprobadaevent',
        '/topic/notificarsolicitudrechazadaevent',
        // :tierra_áfrica: GLOBALES
        '/topic/notificacionglobal',
      ];
      topics.forEach(topic => {
        client.subscribe(topic, msg => {
          const data: Notification = JSON.parse(msg.body);
          // :candado_cerrado_con_llave: Filtrado por usuario
          if (data.idUsuario && data.idUsuario !== userId) {
            return; // no es para este usuario
          }
          setNotifications(prev => [data, ...prev]);
        });
      });
    };
    client.activate();
    return () => client.deactivate();
  }, [userId]);
  return { notifications, setNotifications, open, toggleOpen };
}