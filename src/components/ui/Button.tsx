import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary: 'bg-brand text-white hover:bg-brand-dark',
    secondary: 'bg-white border border-line-input text-ink-700 hover:bg-surface-subtle',
  }

  return (
    <button
      className={[
        'h-[50px] rounded-control px-6 font-semibold text-[16px] transition-colors',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}
