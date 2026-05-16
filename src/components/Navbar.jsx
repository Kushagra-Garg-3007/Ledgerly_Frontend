import { Link, NavLink } from 'react-router-dom'
import { BookOpen, Receipt, User } from 'lucide-react'
import navItems from '../constants/navItems'
import Button from './common/Button'

function Navbar() {
  return (
    <header
      className="
        fixed inset-x-0 top-0 z-50
        w-full
        py-1

        bg-[#f5f1ea]/34
        supports-[backdrop-filter]:bg-[#f5f1ea]/28

        backdrop-blur-xl
        supports-[backdrop-filter]:backdrop-saturate-125

        transition-[background-color,backdrop-filter] duration-300 ease-out
        border-b border-[#d8cab9]/60
      "
    >
      <div
        className="
          mx-auto
          flex h-16 max-w-7xl items-center justify-between
          px-4 sm:px-6 lg:px-8
        "
      >
        <Link
          to="/ledger"
          className="
            flex items-center gap-3
            transition-opacity duration-200
            hover:opacity-90
          "
        >
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              border border-[#d8cab9]
              bg-[#352c28]
              shadow-[0_1px_2px_rgba(40,28,20,0.05)]
            "
          >
            <BookOpen size={18} className="text-[#f5f1ea]" />
          </div>

          <div>
            <p
              className="
                font-heading text-[1.02rem] font-bold
                tracking-[-0.04em] text-[#1f1814]
              "
            >
              Ledgerly
            </p>

            <p className="-mt-0.5 font-body text-[11px] text-[#8b7d75]">
              Smart Finance Workspace
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  group relative flex items-center gap-2 rounded-xl
                  px-3.5 py-2 font-body text-sm font-medium
                  transition-all duration-200 ease-out
                  ${isActive
                    ? `
                        bg-[#ece2d7]
                        text-[#1f1814]
                        shadow-[0_1px_2px_rgba(40,28,20,0.04)]
                      `
                    : `
                        text-[#6b5e57]
                        hover:bg-[#efe7de]
                        hover:text-[#2f241f]
                      `
                  }
                `}
              >
                <Icon size={16} className="transition-transform duration-200 group-hover:scale-[1.04]" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button
              variant="outline"
              size="md"
              className="hidden min-w-[84px] sm:inline-flex"
            >
              Sign in
            </Button>
          </Link>

          <Link to="/signup">
            <Button size="md" className="gap-2">
              <User size={15} />
              <span className="hidden sm:inline">Get Started</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
