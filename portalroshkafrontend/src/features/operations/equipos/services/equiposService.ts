export async function fetchUsuariosDisponibles(token: string) {
    const res = await fetch("http://localhost:8080/api/v1/admin/operations/usuarios-disponibles", {
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Error al cargar usuarios disponibles");
    }

    return res.json();
}
    