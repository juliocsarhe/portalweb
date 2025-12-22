    // src/features/operations/interfaces/IEquipo.ts
    export interface IUsuarioEquipo {
    idUsuario: number
    nombre: string
    apellido: string
    correo?: string
    telefono?: string | null
    }

    export type EstadoEquipo = 'A' | 'I'

    export interface IEquipo {
        idEquipo: number 
        nombre: string 
        fechaCreacion: string
        estado: EstadoEquipo 
    
        lider: IUsuarioEquipo | null
        usuarios: IUsuarioEquipo[]
    }
