import { useAuth } from "@/app/providers/AuthContext"
import { useProfileHistory } from "@/shared/hooks/useProfileHistory"
import ProfileHistory from "@/shared/ui/components/ProfileHistory"
import { Button } from "@/shared/ui/components/button"

type props = {
    open: boolean
    onClose: () => void
    usuarioId: number | null
}


export default function UsuarioHistorialModal({ open, onClose, usuarioId }: props) {
    const { token } = useAuth()
    const { data, loading } = useProfileHistory(token ?? undefined, usuarioId ?? undefined)

    if (!open) return null

    return (
        <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="relative w-full max-w-5xl rounded-2xl p-6 bg-white dark:bg-slate-900">

                <div className="flex justify-between mb-4">



                </div>
                                <Button
                                    onClick={onClose}
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 
                                    dark:text-gray-300 dark:hover:text-white">
                                    ✕
                                </Button>

                {loading ? (
                    <p>Cargando historial...</p>
                ) : (
                    <ProfileHistory data={data} />

                )}

            </div>
        </div>

    )

}