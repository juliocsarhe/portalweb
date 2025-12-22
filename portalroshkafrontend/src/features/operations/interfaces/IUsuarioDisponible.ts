export interface IUsuarioDisponible {
    idUsuario: number;
    nombre: string;
    apellido: string;
    correo: string;
    idRol: number;
    rolNombre: string;
    idCargo?: number;
    cargoNombre?: string;
    telefono?: string;
    disponibilidad?: number;
}
