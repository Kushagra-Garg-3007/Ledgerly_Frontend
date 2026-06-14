import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function AppLayout() {
  return (
    <div
      className="
        relative
        flex min-h-screen flex-col
        overflow-x-hidden
        bg-[#f5f1ea]
        text-[#1f1814]
      "
    >
      {/* Background Texture */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-[0.04]
          bg-[radial-gradient(circle_at_top_left,_#8b7355_0%,_transparent_28%),radial-gradient(circle_at_bottom_right,_#b39a82_0%,_transparent_30%)]
        "
      />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main
        className="
          relative z-10
          mx-auto w-full max-w-7xl
          flex-1
          px-4 pt-28 pb-6
          sm:px-6 lg:px-8
        "
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="
          relative z-10
          border-t border-[#e7ddd2]/70
          bg-[#f5f1ea]/78
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex flex-col sm:flex-row
            items-center justify-between gap-3
            px-4 py-5
            text-sm text-[#7b6d64]
            sm:px-6 lg:max-w-7xl lg:px-8
          "
        >
          <p>© 2026 Ledgerly. Personal finance simplified.</p>

          <div className="flex items-center gap-5">
            <button className="transition-colors hover:text-[#1f1814]">
              Privacy
            </button>

            <button className="transition-colors hover:text-[#1f1814]">
              Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppLayout
