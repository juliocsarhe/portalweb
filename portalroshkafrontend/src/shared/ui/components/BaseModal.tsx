import React from 'react'

interface BaseModalProps {
  show: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
  width?: string
  footer?: React.ReactNode
}

const BaseModal: React.FC<BaseModalProps> = ({
  show,
  title,
  onClose,
  children,
  width = 'max-w-lg',
  footer,
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/40 flex items-center justify-center z-50">
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${width} p-6`}
      >
        {/* Botón de cerrar flotante */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          ✖
        </button>

        {/* Header */}
        {title && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
        )}

        {/* Body */}
        <div className="overflow-y-auto max-h-[70vh] text-black dark:text-white">{children}</div>

        {/* Footer */}
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}

export default BaseModal
