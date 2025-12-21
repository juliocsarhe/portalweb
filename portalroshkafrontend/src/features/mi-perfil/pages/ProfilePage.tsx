import { useState } from 'react'

import { useAuth } from '../../../app/providers/AuthContext'
import EditableField from '../../../shared/ui/components/EditableField'
import UploadImageButton from '../../../shared/ui/components/UploadImageButton'
import ProfileHistory from '@/shared/ui/components/ProfileHistory'
import { ProfileHistoryItem } from '@/features/asignacion-equipo/types/ProfileHistory.types'
import { useProfileHistory } from '@/shared/hooks/useProfileHistory'

function formatDate(d?: string | Date) {
  if (!d) return ''
  const date = typeof d === 'string' ? new Date(d) : d
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

function namesFrom(input: any, key = 'nombre'): string[] {
  if (!input) return []
  if (Array.isArray(input)) {
    return input
      .map((x) =>
        typeof x === 'string' ? x : x && typeof x === 'object' && x[key] ? String(x[key]) : ''
      )
      .filter(Boolean)
  }
  if (typeof input === 'string') return [input]
  if (typeof input === 'object' && input[key]) return [String(input[key])]
  return []
}

// 🔧 función para convertir archivo a Base64
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export default function ProfilePage() {
  const { user, token, refreshUser } = useAuth()
  const { data: history, loading: historyLoading,
    error: historyError, } = useProfileHistory(token ?? undefined)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [phoneLocal, setPhoneLocal] = useState<string | undefined>(user?.telefono)

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">Cargando perfil…</div>
      </div>
    )
  }

  const fullName = `${user?.nombre ?? ''} ${user?.apellido ?? ''}`.trim()
  const email = user?.correo
  const avatarSeed = fullName || email || 'usuario'
  const rolNombre = user?.rol?.nombre
  const cargoNombre = user?.cargo?.nombre
  const getEquipos = user?.equipos || []
  const joinedAt = user?.fechaIngreso
  const diasVac = user?.diasVacaciones
  const diasVacRest = user?.diasVacacionesRestante
  const totalDias = (diasVac ?? 0) + (diasVacRest ?? 0);



  const handleImageChange = async (file: File) => {
    try {
      setIsUploading(true)
      setUploadError(null)
      setSuccessMessage(null)

      console.log('=== FRONTEND DEBUG ===')
      console.log('Archivo:', file.name, file.size, file.type)

      const base64Image = await toBase64(file)
      const cleanBase64 = base64Image.split(',')[1] // solo el puro contenido

      console.log('Base64 longitud:', base64Image.length)
      console.log('Base64 inicia con:', base64Image.substring(0, 30))
      console.log('Contiene data:image:', base64Image.startsWith('data:image'))

      console.log('Usuario actual:', user)

      if (!user) {
        throw new Error('Usuario no está cargado')
      }

      const res = await fetch(`http://localhost:8080/api/v1/usuarios/actualizarfoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // 🔑 token de auth
        },
        body: JSON.stringify({ foto: cleanBase64 }),
      })

      if (!res.ok) {
        throw new Error('Error al actualizar la imagen')
      }

      refreshUser()
      console.log('Usuario desde refresUser:', user)

      setSuccessMessage('Imagen actualizada correctamente')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen')
      console.error('Error al subir la imagen:', err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Fondo */}
        <div
          className="absolute inset-0 bg-brand-blue"
          style={{
            backgroundImage: "url('/src/assets/ilustracion-herov3.svg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-brand-blue/40" />
        </div>

        {/* Contenedor principal */}
        <div className="relative z-10 flex flex-col  p-4">



          {/* Contenido */}
          <div className="flex-1 overflow-auto p-4 md:p-6">
            <div className="overflow-hidden rounded-2xl border border-white/40 dark:border-gray-700 bg-white/50 dark:bg-gray-800/70 
            backdrop-blur-xs shadow-xs">


              <div className="p-6 flex flex-row gap-8 w-full items-start">

                {/* Encabezado responsive */}
                <div className="w-1/3 flex flex-col gap-4">
                  <div className="flex items-center gap-4 min-w-0">

                    {/* {user.fotoBase64 } */}
                    {user.urlPerfil ? (
                      <img
                        src={`data:image/png;base64,${user.urlPerfil}`}
                        alt={fullName}
                        className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover shrink-0 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex
                                   items-center justify-center text-white font-bold text-2xl shrink-0 shadow-sm">
                        {fullName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="text-xl md:text-2xl font-semibold leading-tight text-gray-900 dark:text-gray-100 truncate">
                        {fullName || 'Usuario'}
                      </div>

                      {/* Pills: rol + email */}
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        {rolNombre && (
                          <span className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 bg-white/60 
                        dark:bg-gray-700/70 px-2 py-0.5 text-gray-700 dark:text-gray-200">
                            {rolNombre}
                          </span>
                        )}
                        {email && (
                          <a
                            href={`mailto:${email}`}
                            className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 bg-white/60
                           dark:bg-gray-700/70 px-2 py-0.5 text-gray-700 dark:text-gray-200 hover:underline max-w-full md:max-w-[360px] truncate"
                            title={email}
                          >
                            {email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Botón arriba a la derecha */}
                  <div>
                    <UploadImageButton
                      onImageSelect={handleImageChange}
                      isUploading={isUploading}
                      className="w-auto"
                    />
                  </div>
                </div>

                <div className="w-1/3 flex flex-col gap-3">
                  {/* Cargos */}
                  {cargoNombre && (
                    <div className="flex items-center justify-between rounded-xl  p-3 min-w-0">

                      <div className="flex items-center gap-3 shrink-0">

                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Cargo
                        </span>
                      </div>
                      <span className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 bg-white/70 
                                          dark:bg-gray-800/80 px-1 py-0.5 text-xs text-gray-700 dark:text-gray-200">
                        {cargoNombre}
                      </span>
                    </div>
                  )}

                  {/* Equipos */}
                  {getEquipos.length > 0 && (
                    <div className="flex items-center justify-between rounded-xl border border-gray-300 dark:border-gray-600 bg-white/60 
                                      dark:bg-gray-700/70 backdrop-blur-xs p-3 min-w-0">

                      <div className="flex items-center gap-3 shrink-0">

                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Equipos
                        </span>
                      </div>
                      <span
                        className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 bg-white/70 
                                    dark:bg-gray-800/80px-2 py-0.5 text-xs text-gray-700 dark:text-gray-200 truncate max-w-[180px]"
                        title={namesFrom(getEquipos).join(', ')} // tooltip
                      >
                        {namesFrom(getEquipos).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Teléfono */}
                  <EditableField
                    label=" Teléfono"
                    value={phoneLocal}
                    placeholder="No definido"
                    onSave={async (newPhone) => {
                      try {
                        const res = await fetch(`http://localhost:8080/api/v1/usuarios/me`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                          },
                          body: JSON.stringify({ telefono: newPhone }),
                        })
                        if (!res.ok) {
                          console.error(
                            'Error al actualizar teléfono',
                            res.status,
                            await res.text()
                          )
                          return
                        }
                        setPhoneLocal(newPhone)
                      } catch (err) {
                        console.error('Fallo al guardar teléfono:', err)
                      }
                    }}
                  />

                  {/* Fecha de ingreso */}
                  {joinedAt && (
                    <div className="flex items-center justify-between rounded-xl  dark:border-gray-600 p-3">
                      <div className="flex items-center gap-3">

                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Fecha de ingreso
                        </span>
                      </div>
                      <span className="truncate text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(joinedAt)}
                      </span>
                    </div>
                  )}
                </div>


                {/* Columna derecha (Resumen) */}
                <div className="w-1/3 flex flex-col gap-3">

                  <div className="grid grid-cols-3 gap-3">
                    {typeof diasVac !== 'undefined' && (
                      <div className="rounded-2xl overflow-hidden w-full">

                        <div className="p-4 text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                            {diasVac}
                          </div>
                        </div>
                        <div />
                        <div className="p-3 text-center">
                          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Días vacaciones
                          </div>
                        </div>
                      </div>
                    )}
                    {typeof diasVacRest !== 'undefined' && (
                      <div className="rounded-2xl  overflow-hidden w-full">
                        <div className="p-4 text-center ">
                          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                            {diasVacRest}
                          </div>
                        </div>
                        <div className="h-px w-full" />
                        <div className="p-3 text-center">
                          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Días restantes
                          </div>
                        </div>
                      </div>
                    )}
                    {typeof totalDias !== 'undefined' && (
                      <div className="rounded-2xl  overflow-hidden w-full">
                        <div className="p-4 text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
                            {totalDias}
                          </div>
                        </div>
                        <div className="h-px w-full" />
                        <div className="p-3 text-center">
                          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Días<br />totales
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
         {/*historial*/}


      {historyLoading && (
        <div className="p-4 text-sm ext-red-500">
          Cargando historial del usuario...
        </div>
      )}

      {!historyLoading && !historyError && (
        <div className="relative z-10 p-4">
          <ProfileHistory data={history} />
        </div>
      )}
      </div>

     

    </>
  )

}

// function setUser(arg0: (prev: any) => any) {
//   throw new Error("Function not implemented.");
// }
