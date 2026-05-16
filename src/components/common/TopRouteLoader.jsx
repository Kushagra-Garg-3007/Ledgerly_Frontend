import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

function TopRouteLoader() {
  const location = useLocation()

  const [visible, setVisible] =
    useState(false)

  useEffect(() => {
    setVisible(true)

    const timeout = setTimeout(() => {
      setVisible(false)
    }, 650)

    return () => clearTimeout(timeout)
  }, [
    location.pathname,
    location.search,
    location.hash,
  ])

  return (
    <div
      className={`
        pointer-events-none

        fixed left-0 top-0 z-[999]

        h-[3px]
        w-full

        overflow-hidden

        transition-opacity duration-300

        ${
          visible
            ? 'opacity-100'
            : 'opacity-0'
        }
      `}
      aria-hidden="true"
    >
      {/* Track */}
      <div
        className="
          absolute inset-0

          bg-[#eadfd2]/55
        "
      />

      {/* Animated bar */}
      <div
        className="
          absolute left-0 top-0

          h-full
          w-[32%]

          animate-top-loader

          rounded-full

          bg-gradient-to-r
          from-transparent
          via-[#6e5747]
          to-transparent

          shadow-[0_0_12px_rgba(110,87,71,0.35)]
        "
      />
    </div>
  )
}

export default TopRouteLoader