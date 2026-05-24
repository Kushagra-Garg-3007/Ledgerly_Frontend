import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, User } from 'lucide-react'
import { logout } from '../../api/authApi'
import { clearAuth } from '../../redux/authSlice'

function UserMenu() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  const displayName = useMemo(() => (
    user?.displayName ||
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email ||
    'Account'
  ), [user])

  const avatarUrl = useMemo(() => (
    user?.avatarUrl ||
    user?.avatar ||
    user?.profileImage ||
    user?.image ||
    null
  ), [user])

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

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      dispatch(clearAuth())
      setOpen(false)
      navigate('/', { replace: true })
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          inline-flex items-center gap-2
          rounded-xl
          px-2 py-1.5
          text-sm font-semibold
          text-[#2a221d]
          transition-colors duration-200
          hover:bg-[#efe7de]
          focus:outline-none
          focus:ring-[3px]
          focus:ring-[#8b6e59]/25
          focus:ring-offset-1
        "
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="h-8 w-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="
              inline-flex h-8 w-8
              items-center justify-center
              rounded-full
              border border-[#d9cfc3]
              bg-white/70
              text-[#6b5e57]
            "
            aria-hidden="true"
          >
            <User size={16} />
          </span>
        )}

        <span className="hidden max-w-[140px] truncate sm:inline">
          {displayName}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        className={`
          absolute right-0 mt-2 w-44
          origin-top-right
          rounded-xl
          border border-[#e7ddd2]
          bg-white/90
          shadow-[0_14px_35px_rgba(40,28,20,0.14)]
          backdrop-blur-xl
          transition-all duration-150 ease-out
          ${open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-[0.98] opacity-0'}
        `}
        role="menu"
        aria-hidden={!open}
      >
        <div className="py-1.5">
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="
              block px-3.5 py-2
              text-sm font-medium
              text-[#2f241f]
              transition-colors duration-150
              hover:bg-[#f4eee6]
              focus:bg-[#f4eee6]
              focus:outline-none
            "
            role="menuitem"
          >
            Profile
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="
              block w-full
              px-3.5 py-2
              text-left
              text-sm font-medium
              text-[#5b2f34]
              transition-colors duration-150
              hover:bg-rose-50
              focus:bg-rose-50
              focus:outline-none
            "
            role="menuitem"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserMenu
