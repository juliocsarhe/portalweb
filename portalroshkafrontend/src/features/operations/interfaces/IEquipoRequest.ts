    // src/features/operations/interfaces/IEquipoRequest.ts
    import type {EstadoEquipo} from './IEquipo'

    export interface IEquipoRequest {
        idLider: number
        nombre: string
        estado: string
        usuarios: number[]  
    }
