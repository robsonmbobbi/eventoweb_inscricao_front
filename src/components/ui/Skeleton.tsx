export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-[6px] bg-line-card ${className}`} />
}

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-line-divider bg-white">
      <Skeleton className="aspect-[210/297] rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-[18px] w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-3/5" />
        <Skeleton className="h-12 rounded-control" />
      </div>
    </div>
  )
}
