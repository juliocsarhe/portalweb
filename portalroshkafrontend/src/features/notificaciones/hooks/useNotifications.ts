import { useState } from "react";

export function useNotifications() {
    const [open, setOpen] = useState(false);

    const notifications = [
    "Nuevo mensaje recibido",
    "Se aprobó tu solicitud",
    "Actualización disponible",
    ];

    const toggleOpen = () => setOpen(!open);

    return { open, toggleOpen, notifications };
}
