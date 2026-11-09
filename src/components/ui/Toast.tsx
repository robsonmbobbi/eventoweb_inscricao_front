import type { ReactNode } from 'react'

interface ToastProps {
  children: ReactNode
  onClose: () => void
}

/** Mensagem de erro fixa no topo da viewport, visível em qualquer posição de scroll. */
export function Toast({ children, onClose }: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex justify-center">
      <div
        role="alert"
        aria-live="assertive"
        className="pointer-events-auto flex w-full max-w-lg items-start gap-2.5 rounded-section border border-danger-soft-border bg-danger-soft p-3.5 text-red-900 shadow-lg"
      >
        <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-danger text-[12px] font-bold text-white">
          !
        </span>
        <span className="flex-1 text-[13px] leading-relaxed font-medium">{children}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar mensagem"
          className="flex h-5 w-5 flex-none items-center justify-center rounded-full text-[16px] leading-none text-red-900/70 hover:text-red-900"
        >
          ×
        </button>
      </div>
    </div>
  )
}
