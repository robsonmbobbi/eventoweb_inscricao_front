interface EmptyStateProps {
  title: string
  description: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-9 py-16 text-center">
      <div className="flex h-[132px] w-[132px] flex-col overflow-hidden rounded-[24px] border border-brand-border bg-brand-tint">
        <div className="flex h-[30px] items-center justify-center gap-5 bg-brand">
          <span className="-mt-4 h-3 w-1.5 rounded-[3px] bg-white" />
          <span className="-mt-4 h-3 w-1.5 rounded-[3px] bg-white" />
        </div>
        <div className="grid flex-1 grid-cols-4 grid-rows-3 gap-2 p-3.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="rounded-[3px] bg-white" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-[20px] font-bold text-ink-900">{title}</h3>
        <p className="text-[15px] leading-relaxed text-ink-500">{description}</p>
      </div>
    </div>
  )
}
