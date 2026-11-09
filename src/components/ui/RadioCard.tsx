interface RadioCardProps {
  title: string
  subtitle?: string
  selected: boolean
  onSelect: () => void
}

export function RadioCard({ title, subtitle, selected, onSelect }: RadioCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={[
        'flex items-start gap-3 rounded-control border p-3.5 text-left transition-colors',
        selected ? 'border-[1.5px] border-brand bg-brand-tint' : 'border-line-input bg-white',
      ].join(' ')}
    >
      <span
        className={[
          'mt-0.5 h-5 w-5 flex-none rounded-full border-2',
          selected ? 'border-[6px] border-brand bg-white' : 'border-line-card',
        ].join(' ')}
      />
      <span className="flex flex-col gap-0.5">
        <span
          className={['text-[15px] font-bold', selected ? 'text-brand-dark' : 'text-ink-700'].join(
            ' ',
          )}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className={['text-[12px]', selected ? 'text-brand-dark/80' : 'text-ink-500'].join(' ')}
          >
            {subtitle}
          </span>
        )}
      </span>
    </button>
  )
}
