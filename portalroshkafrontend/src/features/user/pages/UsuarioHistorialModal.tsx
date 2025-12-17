import { useAuth } from "@/app/providers/AuthContext"
import { useProfileHistory } from "@/shared/hooks/useProfileHistory"
import ProfileHistory from "@/shared/ui/components/ProfileHistory"
import { p } from "react-router/dist/development/index-react-server-client-CCjKYJTH"

type props = {
    open: boolean 
    onClose: () => void 
    usuarioId : number | null 
}


export default function UsuarioHistorialModal({open, onClose, usuarioId}: props){
    const { token } = useAuth()
    const { data, loading } = useProfileHistory(token ?? undefined, usuarioId ?? undefined)

    if(!open) return null

    return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-5xl rounded-2xl p-6 bg-white dark:bg-slate-900">
                <div className="flex justify-between mb-4">

                        <h2 className="text-xl font-bold">Historial del usuario</h2>
                        <button onClick={onClose}>X</button>
                </div>

                {loading ? (
                    <p>Cargando historial...</p>
                ): (
                    <ProfileHistory data={data}/>
                )}
                
                </div>
            </div>

    )

}