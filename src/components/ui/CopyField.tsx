import { useState } from 'react'
import { Button } from './Button'

interface CopyFieldProps {
  label: string
  value: string
  copyLabel?: string
}

export function CopyField({ label, value, copyLabel = 'Copiar' }: CopyFieldProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-[13px] font-semibold text-ink-700">{label}</span>
      <div className="flex gap-2">
        <div className="h-[50px] flex-1 overflow-hidden rounded-control border border-line-input bg-surface-subtle px-3 flex items-center whitespace-nowrap font-mono text-[13px] text-ink-700">
          {value}
        </div>
        <Button type="button" onClick={handleCopy} className="flex-none">
          {copied ? 'Copiado!' : copyLabel}
        </Button>
      </div>
    </div>
  )
}
