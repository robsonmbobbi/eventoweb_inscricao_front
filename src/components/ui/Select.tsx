import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid = false, className = '', children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={[
        'h-[46px] rounded-control border px-3 text-[15px] text-ink-900 outline-none appearance-none',
        invalid
          ? 'bg-danger-bg border-danger'
          : 'bg-white border-line-input focus:border-brand focus:ring-3 focus:ring-brand/10',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </select>
  )
})
