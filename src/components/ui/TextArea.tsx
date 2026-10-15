import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { invalid = false, className = '', rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={[
        'rounded-control border px-3 py-3 text-[15px] text-ink-900 outline-none transition-colors resize-none',
        'placeholder:text-ink-400',
        invalid
          ? 'bg-danger-bg border-danger'
          : 'bg-white border-line-input focus:border-brand focus:ring-3 focus:ring-brand/10',
        className,
      ].join(' ')}
      {...props}
    />
  )
})
