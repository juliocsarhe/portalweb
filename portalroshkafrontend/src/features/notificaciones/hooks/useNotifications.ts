import { useState } from "react";

export function useNotifications() {
    const [open, setOpen] = useState(false);
    const[notifications,setNotifications] = useState([
            "Nuevo mensaje recibido",
    "Se aprobó tu solicitud",
    "Actualización disponible",
    "Recordatorio de reunión",
    "Nuevo comentario en tu publicación",
        "Tu perfil ha sido visto 10 veces",
        "Tienes una nueva solicitud de amistad",
        "Tu contraseña será expirada pronto",
        "Se ha asignado una nueva tarea",
        "Tu suscripción se ha renovado exitosamente",
    ]);


    const toggleOpen = () => setOpen(!open);

    
    return { 
        open,
        toggleOpen,
        notifications
        };
}
