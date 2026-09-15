export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 rounded animate-shimmer flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-10 rounded-lg animate-shimmer flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-brown-200/50 p-5 space-y-3">
          <div className="h-10 w-10 rounded-xl animate-shimmer" />
          <div className="h-3 w-20 rounded animate-shimmer" />
          <div className="h-7 w-32 rounded animate-shimmer" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-brown-200/50 p-5">
      <div className="h-4 w-32 rounded animate-shimmer mb-4" />
      <div className="h-48 rounded-lg animate-shimmer" />
    </div>
  );
}
