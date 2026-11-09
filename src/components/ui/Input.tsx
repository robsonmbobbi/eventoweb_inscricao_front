import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, disabled, className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      disabled={disabled}
      className={[
        'h-[46px] rounded-control border px-3 text-[15px] text-ink-900 outline-none transition-colors',
        'placeholder:text-ink-400',
        disabled
          ? 'bg-surface-muted border-line-card text-ink-350 cursor-not-allowed'
          : invalid
            ? 'bg-danger-bg border-danger'
            : 'bg-white border-line-input focus:border-brand focus:ring-3 focus:ring-brand/10',
        className,
      ].join(' ')}
      {...props}
    />
  )
})
