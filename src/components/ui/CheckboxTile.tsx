interface CheckboxTileProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxTile({ label, checked, onChange }: CheckboxTileProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'flex items-center gap-2.5 rounded-control border px-3 py-3 text-left transition-colors',
        checked ? 'border-[1.5px] border-brand bg-brand-tint' : 'border-line-input bg-white',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-5 w-5 flex-none items-center justify-center rounded-[6px] text-[11px] font-bold text-white',
          checked ? 'bg-brand' : 'border-2 border-line-input bg-transparent',
        ].join(' ')}
      >
        {checked && '✓'}
      </span>
      <span
        className={['text-[13px] font-semibold', checked ? 'text-brand-dark' : 'text-ink-700'].join(
          ' ',
        )}
      >
        {label}
      </span>
    </button>
  )
}
