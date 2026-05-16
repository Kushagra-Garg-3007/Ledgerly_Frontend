import { Link } from 'react-router-dom'
import Card from '../components/common/Card'

function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerTo,
}) {
  return (
    <main
      className="
        min-h-screen
        bg-[#f5f1ea]
        px-4
        py-6
        sm:px-6
        lg:px-8
      "
    >
      {/* Soft background texture */}
      <div
        className="
          pointer-events-none
          fixed inset-0
          opacity-[0.045]
          bg-[radial-gradient(circle_at_top_left,_#8b7355_0%,_transparent_28%),radial-gradient(circle_at_bottom_right,_#b39a82_0%,_transparent_30%)]
        "
      />

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[calc(100vh-3rem)]
          max-w-6xl
          items-center
          justify-center
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-14
            lg:grid-cols-[1fr_480px]
          "
        >
          {/* LEFT SIDE */}
          <section className="hidden lg:block">
            <div className="max-w-xl">
              <p
                className="
                  font-body
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#8a7463]
                "
              >
                Ledgerly Secure Access
              </p>

              <h1
                className="
                  mt-5
                  font-heading
                  text-[3.1rem]
                  font-semibold
                  leading-[1.02]
                  tracking-[-0.055em]
                  text-[#1d1713]
                "
              >
                Built for modern finance operations and secure workflows.
              </h1>

              <p
                className="
                  mt-6
                  max-w-lg
                  font-body
                  text-[15px]
                  leading-8
                  text-[#6f6258]
                "
              >
                Experience a calm and focused financial workspace designed
                for modern teams, faster operations, and clean transaction
                management.
              </p>

              {/* Features */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <div
                  className="
                    rounded-2xl
                    border border-[#e6ddd2]
                    bg-[#faf7f2]
                    p-5
                    shadow-[0_2px_10px_rgba(40,28,20,0.04)]
                  "
                >
                  <p className="font-body text-sm font-semibold text-[#241d18]">
                    Fast onboarding
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#6f6258]">
                    Create your workspace with refined validation and smooth UX.
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    border border-[#e6ddd2]
                    bg-[#faf7f2]
                    p-5
                    shadow-[0_2px_10px_rgba(40,28,20,0.04)]
                  "
                >
                  <p className="font-body text-sm font-semibold text-[#241d18]">
                    Secure by default
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#6f6258]">
                    Designed for protected routes, token flows, and scaling.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <div className="relative">
            <Card
              className="
                border border-[#e7ddd2]
                bg-[#fcfaf7]
                shadow-[0_8px_30px_rgba(40,28,20,0.06)]
              "
              title={title}
              subtitle={subtitle}
              align='center'
            >
              <div className="space-y-6">
                {children}

                <p className="text-center font-body text-sm text-[#6f6258]">
                  {footerText}{' '}
                  <Link
                    to={footerTo}
                    className="
                      font-semibold
                      text-[#4e3d34]
                      transition-colors
                      hover:text-[#2f241e]
                    "
                  >
                    {footerLinkText}
                  </Link>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AuthLayout