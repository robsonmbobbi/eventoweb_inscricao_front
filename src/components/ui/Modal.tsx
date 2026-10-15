import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  icon?: ReactNode
}

export function Modal({ title, description, confirmLabel, onConfirm, icon = '!' }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-6">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-card bg-white p-6 shadow-modal">
        <div className="flex h-11 w-11 items-center justify-center rounded-section bg-danger-soft text-[22px] font-bold text-danger">
          {icon}
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-[19px] font-bold text-ink-900">{title}</h4>
          <p className="text-[14px] leading-relaxed text-ink-500">{description}</p>
        </div>
        <Button onClick={onConfirm} fullWidth>
          {confirmLabel}
        </Button>
      </div>
    </div>
  )
}
