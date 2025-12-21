import SelectDropdown from '@/shared/ui/components/SelectDropdown'
import IconButton from '@/shared/ui/components/IconButton'

interface Option {
  value: number
  label: string
}

interface AsignarTareasFiltersProps {
  equipos: Option[]
  proyectos: Option[]
  setIdEquipo: (value?: number) => void
  setIdProyecto: (value?: number) => void
  setSearch: (value: string) => void
  onClear: () => void
}

export default function AsignarTareasFilters({
  equipos,
  proyectos,
  setIdEquipo,
  setIdProyecto,
  setSearch,
  onClear,
}: AsignarTareasFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
      
      <SelectDropdown
        label="Equipo"
        name="idEquipo"
        value=""
        onChange={(e) =>
          setIdEquipo(e.target.value ? Number(e.target.value) : undefined)
        }
        options={equipos}
        placeholder="Todos"
        noMargin
      />

      
      <SelectDropdown
        label="Proyecto"
        name="idProyecto"
        value=""
        onChange={(e) =>
          setIdProyecto(e.target.value ? Number(e.target.value) : undefined)
        }
        options={proyectos}
        placeholder="Todos"
        noMargin
      />

      
              <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Buscar</label>
            <input
          type="text"
          placeholder="Buscar por usuario, equipo o proyecto"
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-hidden focus:ring-2 focus:ring-blue-500
                     bg-white text-gray-900 border-gray-300
                     dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
      </div>
        
      
      <div className="h-full flex items-end">
                <IconButton
          label="Limpiar filtros"
          variant="secondary"
          onClick={onClear}
          className="h-10 text-sm px-4 flex items-center"
        />
      </div>
    </div>
  )
}
