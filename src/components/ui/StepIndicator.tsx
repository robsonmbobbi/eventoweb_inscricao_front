const STEPS = ['CPF', 'Nascimento', 'Dados'] as const

interface StepIndicatorProps {
  /** 1 = CPF, 2 = Nascimento, 3 = Dados */
  current: 1 | 2 | 3
}

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        {STEPS.map((_, index) => {
          const step = index + 1
          const done = step < current
          const active = step === current
          return (
            <div key={step} className="flex flex-1 items-center gap-1.5 last:flex-none">
              <div
                className={[
                  'flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full text-[12px] font-bold',
                  done || active
                    ? 'bg-brand text-white'
                    : 'border-2 border-line-card bg-white text-ink-400',
                ].join(' ')}
              >
                {done ? '✓' : step}
              </div>
              {step < STEPS.length && (
                <div className={`h-0.5 flex-1 ${done ? 'bg-brand' : 'bg-line-card'}`} />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[11px] font-semibold text-ink-400">
        {STEPS.map((label, index) => (
          <span key={label} className={index + 1 <= current ? 'text-brand' : ''}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
