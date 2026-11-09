import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

export function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-semibold text-[12px] text-ink-700">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      {children}
      {error && <span className="font-medium text-[12px] text-danger">{error}</span>}
      {!error && hint && <span className="text-[12px] text-ink-500">{hint}</span>}
    </label>
  )
}
