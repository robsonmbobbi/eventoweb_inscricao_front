import type { ReactNode } from 'react'

type BadgeVariant = 'adulto' | 'infantil' | 'neutro' | 'aviso' | 'sucesso'

const variants: Record<BadgeVariant, string> = {
  adulto: 'bg-brand-tint text-brand',
  infantil: 'bg-child-bg text-child-text border border-child-border',
  neutro: 'bg-surface-muted text-ink-400',
  aviso: 'bg-warn-bg text-warn-text border border-warn-border',
  sucesso: 'bg-success-bg text-success',
}

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex self-start items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${variants[variant]}`}
    >
      {children}
    </span>
  )
}
