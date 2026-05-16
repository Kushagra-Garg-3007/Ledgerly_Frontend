import Skeleton from './Skeleton'

function SkeletonSurface({
  children,
  className = '',
}) {
  return (
    <div
      className={`
        rounded-2xl

        border border-[#e7dfd6]

        bg-[#f6f1ea]

        shadow-[0_1px_2px_rgba(40,28,20,0.04)]

        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default function SkeletonTable({
  rows = 5,
}) {
  return (
    <SkeletonSurface className="p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-4 gap-3 px-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="ml-auto h-3 w-10" />
        </div>

        {Array.from({ length: rows }).map(
          (_, index) => (
            <div
              key={index}
              className="
                rounded-xl

                border border-[#e4d9ce]/70

                bg-[#faf6f1]/75

                px-4 py-3.5

                shadow-[0_1px_3px_rgba(40,28,20,0.03)]
              "
            >
              <div className="grid grid-cols-4 gap-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="ml-auto h-4 w-10" />
              </div>
            </div>
          ),
        )}
      </div>
    </SkeletonSurface>
  )
}