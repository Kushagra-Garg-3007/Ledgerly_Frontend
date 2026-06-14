import { useEffect, useRef, useState } from 'react'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'

function LedgerRowActions({ onViewDetails, onEditEntry }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!containerRef.current) return
      if (containerRef.current.contains(event.target)) return
      setOpen(false)
    }

    const onEscape = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onEscape)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onEscape)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative inline-flex justify-end">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          inline-flex h-8 w-8 items-center justify-center rounded-lg
          border border-[#e5d8c9] bg-white/80 text-[#6b5a4f]
          transition-colors hover:bg-[#faf5ee]
          focus:outline-none focus:ring-[3px] focus:ring-[#8b6e59]/25
        "
        aria-haspopup="menu"
        aria-expanded={open}
        title="Row actions"
      >
        <MoreHorizontal size={16} />
      </button>

      <div
        className={`
          absolute right-0 top-9 z-20 w-44 origin-top-right rounded-xl border border-[#e7ddd2]
          bg-white/90 shadow-[0_14px_35px_rgba(40,28,20,0.14)] backdrop-blur-xl
          transition-all duration-150 ease-out
          ${
            open
              ? 'pointer-events-auto scale-100 opacity-100'
              : 'pointer-events-none scale-[0.98] opacity-0'
          }
        `}
        role="menu"
        aria-hidden={!open}
      >
        <div className="py-1.5">
          <button
            type="button"
            onClick={() => {
              onViewDetails()
              setOpen(false)
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm font-medium text-[#2f241f] transition-colors hover:bg-[#f4eee6]"
            role="menuitem"
          >
            <Eye size={14} />
            View Details
          </button>

          <button
            type="button"
            onClick={() => {
              onEditEntry()
              setOpen(false)
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm font-medium text-[#2f241f] transition-colors hover:bg-[#f4eee6]"
            role="menuitem"
          >
            <Pencil size={14} />
            Edit Entry
          </button>
        </div>
      </div>
    </div>
  )
}

export default LedgerRowActions
