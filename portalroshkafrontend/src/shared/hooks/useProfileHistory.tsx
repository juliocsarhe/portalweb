import { ProfileHistoryItem } from "@/types/profileHistory.types";
import { useEffect, useState } from "react";
import { mapHistorialToProfileHistory } from "../mappers/profileHistory.mapper";


export function useProfileHistory(token?:string){

    const[data, setData] = useState<ProfileHistoryItem[]>([])
    const[loading, setLoading] = useState(true)
    const[error, setError] = useState<string | null>(null)


    useEffect(()=>{
        if (!token) {
            setLoading(false)
            return}
        const fetchHistory = async () => {
            try {
                setLoading(true)
                const res = await fetch (
                    'http://localhost:8080/api/v1/profile/historial',
                    {
                        headers:{
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if(!res.ok){
                    throw new Error('Error al cargar el Historial')
                }

                const json = await res.json()

                const mapped = mapHistorialToProfileHistory(json);
                setData(mapped);
                
            } catch (err) {
                setError (err instanceof Error ? err.message : 'Error desconocido')
            }   finally{
                setLoading(false)
            }
            }
            fetchHistory()
    },[token])

    return {data, loading, error}
}