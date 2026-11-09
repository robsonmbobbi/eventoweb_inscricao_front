import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
}

export function Card({ title, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface-card border border-line-card rounded-section p-[18px] flex flex-col gap-3.5 ${className}`}
      {...props}
    >
      {title && (
        <span className="font-bold text-[13px] tracking-wide uppercase text-brand">{title}</span>
      )}
      {children}
    </div>
  )
}
