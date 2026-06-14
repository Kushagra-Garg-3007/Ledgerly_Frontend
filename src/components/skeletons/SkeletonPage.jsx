import Skeleton from './Skeleton'

function SkeletonSurface({ children, className = '' }) {
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

function SkeletonPage({ showHeader = true, cards = 3, rows = 5 }) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      {showHeader && (
        <div className="space-y-3">
          <Skeleton className="h-7 w-52 rounded-md" />

          <Skeleton className="h-4 w-80 max-w-full rounded-full" />
        </div>
      )}

      {/* Stats / Widget Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <SkeletonSurface key={index} className="p-5">
            <Skeleton className="h-3 w-20 rounded-full" />

            <Skeleton className="mt-4 h-8 w-28 rounded-md" />

            <Skeleton className="mt-4 h-3 w-16 rounded-full" />
          </SkeletonSurface>
        ))}
      </div>

      {/* Main Content */}
      <SkeletonSurface className="p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 rounded-md" />

            <Skeleton className="h-3 w-60 rounded-full" />
          </div>

          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        {/* Table/List */}
        <div className="mt-8 space-y-3">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="
                  flex items-center justify-between

                  rounded-xl

                  border border-[#ece3d8]

                  bg-[#faf7f3]

                  px-4 py-3
                "
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-44 rounded-full" />

                <Skeleton className="h-3 w-28 rounded-full" />
              </div>

              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </SkeletonSurface>
    </div>
  )
}

export default SkeletonPage
