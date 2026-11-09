import type { ReactNode } from 'react'

type AlertVariant = 'info' | 'warning' | 'error'

const variants: Record<AlertVariant, { container: string; icon: string; iconLabel: string }> = {
  info: {
    container: 'bg-brand-tint border-brand-border text-brand-dark',
    icon: 'bg-brand text-white',
    iconLabel: 'i',
  },
  warning: {
    container: 'bg-warn-bg border-warn-border text-warn-text',
    icon: 'bg-warn-accent text-white',
    iconLabel: 'i',
  },
  error: {
    container: 'bg-danger-soft border-danger-soft-border text-red-900',
    icon: 'bg-danger text-white',
    iconLabel: '!',
  },
}

interface AlertProps {
  variant: AlertVariant
  children: ReactNode
}

export function Alert({ variant, children }: AlertProps) {
  const v = variants[variant]
  return (
    <div className={`flex items-start gap-2.5 rounded-section border p-3.5 ${v.container}`}>
      <span
        className={`flex h-5 w-5 flex-none items-center justify-center rounded-full text-[12px] font-bold ${v.icon}`}
      >
        {v.iconLabel}
      </span>
      <span className="text-[13px] leading-relaxed font-medium">{children}</span>
    </div>
  )
}
