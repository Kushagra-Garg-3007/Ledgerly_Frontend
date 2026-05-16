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

function SkeletonCard({
  title = true,
  subtitle = true,
  image = false,
  lines = 3,
  action = false,
  className = '',
}) {
  return (
    <SkeletonSurface
      className={`p-6 ${className}`}
    >
      {/* Header */}
      {title && (
        <Skeleton className="h-5 w-32 rounded-md" />
      )}

      {subtitle && (
        <Skeleton className="mt-3 h-3.5 w-2/3 rounded-full" />
      )}

      {/* Content */}
      <div className="mt-6 space-y-3">
        {Array.from({ length: lines }).map(
          (_, index) => (
            <Skeleton
              key={index}
              className={`
                h-4 rounded-full

                ${
                  index === lines - 1
                    ? 'w-[78%]'
                    : 'w-full'
                }
              `}
            />
          ),
        )}
      </div>

      {/* Optional media/chart block */}
      {image && (
        <Skeleton className="mt-6 h-32 w-full rounded-xl" />
      )}

      {/* Optional button */}
      {action && (
        <div className="mt-6 flex justify-end">
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      )}
    </SkeletonSurface>
  )
}

export default SkeletonCard