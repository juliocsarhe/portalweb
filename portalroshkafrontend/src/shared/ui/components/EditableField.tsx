import React, { useState, useEffect } from 'react'

type EditableFieldProps = {
  label: string
  value?: string
  placeholder?: string
  onSave: (newValue: string) => Promise<void> | void
}

export default function EditableField({ label, value, placeholder, onSave }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value ?? '')

  useEffect(() => {
    setTempValue(value ?? '')
  }, [value])

  const handleSave = async () => {
    await onSave(tempValue)
    setEditing(false)
  }

  return (
    <div className="flex items-center justify-between rounded-xl p-3 min-h-[56px]">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
      </div>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            className="h-7 w-20 px-2 leading-none rounded-sm text-center text-sm text-gray-800 dark:text-gray-200"
          />
          <button
            onClick={handleSave}
            className="h-7 px-3 rounded-sm bg-green-600 text-xs text-white hover:bg-green-700"
          >
            Guardar
          </button>
          <button
            onClick={() => {
              setEditing(false)
              setTempValue(value ?? '')
            }}
            className="h-7 px-3 rounded-sm bg-gray-300 dark:bg-gray-600 px-2 py-1 text-xs text-gray-700 
                       dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="truncate text-sm text-gray-500 dark:text-gray-300">
            {value || placeholder || '—'}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  )
}
