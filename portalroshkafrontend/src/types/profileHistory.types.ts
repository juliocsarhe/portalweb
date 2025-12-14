

export type ProfileHistoryItem = {
    id:string
    proyecto:{
        id:string
        nombre:string
    }
    equipo:{
        id:string
        nombre:string
    }
    tareasRealizadas:string
    tecnologias:string[]

    fechaInicio:string
    fechaFin?:string
}